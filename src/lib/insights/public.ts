import { getContent } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { createAdminClient, supabaseConfigured } from "@/lib/supabase/admin";
import { isLiveInsight } from "@/lib/insights/schedule";
import { availabilityLine, availabilityNote, normalizeLanguages, normalizeMediaLinks } from "@/lib/insights/languages";
import {
  coverPublicUrl,
  formatInsightDate,
  type InsightCardItem,
  type InsightRecord,
  type PovInsight,
} from "@/lib/insights/types";

function isLocale(value: string): value is Locale {
  return value === "es" || value === "en" || value === "pt";
}

export async function getPublishedPovRecords(): Promise<InsightRecord[]> {
  if (!supabaseConfigured()) return [];
  const admin = await createAdminClient();
  const { data, error } = await admin
    .from("web_insights")
    .select("id, slug, kind, status, available_at, cover_path, image_size, languages, media_links, pdf_path, source_url, gallery_paths, created_at, updated_at, web_insight_locales(*)")
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("[insights] no se pudo leer el contenido publicado:", error.message);
    return [];
  }
  return (data ?? []) as InsightRecord[];
}

function toCard(record: InsightRecord, locale: Locale): InsightCardItem | null {
  const copy = record.web_insight_locales.find((item) => item.locale === locale && item.title.trim());
  if (!copy) return null;
  return {
    slug: record.slug,
    type: copy.type_label || "Point of View",
    title: copy.title,
    excerpt: copy.excerpt,
    tag: copy.tag,
    coverUrl: coverPublicUrl(record.cover_path),
    icon: record.cover_path ? undefined : "document",
    availability: availabilityLine(
      record.kind === "noticia"
        ? normalizeLanguages(Object.keys(normalizeMediaLinks(record.media_links)))
        : normalizeLanguages(record.languages),
      locale,
    ),
  };
}

function toPov(record: InsightRecord, locale: Locale): PovInsight | null {
  const card = toCard(record, locale);
  const copy = record.web_insight_locales.find((item) => item.locale === locale && item.title.trim());
  if (!card || !copy) return null;
  return {
    slug: record.slug,
    title: copy.title,
    excerpt: copy.excerpt,
    body: copy.body,
    type: copy.type_label || "Point of View",
    tag: copy.tag,
    date: formatInsightDate(copy.published_on, locale),
    author: copy.author,
    coverUrl: card.coverUrl ?? null,
    imageSize: record.image_size === "sm" || record.image_size === "md" || record.image_size === "lg" ? record.image_size : "lg",
    hasPdf: Boolean(record.pdf_path) && record.kind !== "noticia",
    availability: record.kind === "noticia" ? null : availabilityNote(normalizeLanguages(record.languages), locale),
  };
}

export async function getInsightCards(locale: string): Promise<InsightCardItem[]> {
  const safeLocale: Locale = isLocale(locale) ? locale : "es";
  const records = await getPublishedPovRecords();
  const taken = new Set(records.map((record) => record.slug));
  const povCards = records
    .filter((record) => isLiveInsight(record.status, record.available_at))
    .map((record) => toCard(record, safeLocale))
    .filter((item): item is InsightCardItem => Boolean(item));
  const staticCards = getContent(safeLocale).insights.filter((item) => !taken.has(item.slug)).map((item) => ({
    slug: item.slug,
    type: item.type,
    title: item.title,
    excerpt: item.excerpt,
    tag: item.tag,
    coverUrl: item.cover,
    icon: item.icon,
  }));
  return [...povCards, ...staticCards];
}

export async function getPublishedPov(locale: string, slug: string): Promise<PovInsight | null> {
  if (!isLocale(locale) || !supabaseConfigured()) return null;
  const admin = await createAdminClient();
  const { data, error } = await admin
    .from("web_insights")
    .select("id, slug, kind, status, available_at, cover_path, image_size, languages, media_links, pdf_path, source_url, gallery_paths, created_at, updated_at, web_insight_locales(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  const record = data as InsightRecord;
  if (!isLiveInsight(record.status, record.available_at)) return null;
  return toPov(record, locale);
}

export async function getInsightRecord(slug: string): Promise<InsightRecord | null> {
  if (!supabaseConfigured()) return null;
  const admin = await createAdminClient();
  const { data, error } = await admin
    .from("web_insights")
    .select("id, slug, kind, status, available_at, cover_path, image_size, languages, media_links, pdf_path, source_url, gallery_paths, created_at, updated_at, web_insight_locales(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return data as InsightRecord;
}

export function toPublishedShape(record: InsightRecord, locale: Locale): PovInsight | null {
  return toPov(record, locale);
}
