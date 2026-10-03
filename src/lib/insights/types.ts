import type { InsightIconKey } from "@/components/shared/InsightIcon";
import { locales, type Locale } from "@/i18n/routing";
import type { AvailabilityNote } from "@/lib/insights/languages";

export type InsightCardItem = {
  slug: string;
  type: string;
  title: string;
  excerpt: string;
  tag: string;
  icon?: InsightIconKey;
  coverUrl?: string | null;
  availability?: string;
};

export type PovInsight = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  type: string;
  tag: string;
  date: string;
  author: string;
  coverUrl: string | null;
  imageSize: ImageSize;
  hasPdf: boolean;
  availability: AvailabilityNote | null;
};

export type InsightLocaleFields = {
  title: string;
  excerpt: string;
  body: string;
  typeLabel: string;
  tag: string;
  author: string;
  publishedOn: string;
};

export type InsightLocaleRow = {
  locale: Locale;
  title: string;
  excerpt: string;
  body: string;
  type_label: string;
  tag: string;
  author: string;
  published_on: string | null;
};

export type InsightKind = "noticia" | "documento";
export type ImageSize = "sm" | "md" | "lg";

export type InsightRecord = {
  id: string;
  slug: string;
  kind: InsightKind;
  status: "draft" | "published";
  available_at: string | null;
  cover_path: string | null;
  image_size: ImageSize | null;
  languages: string[] | null;
  media_links: Record<string, string> | null;
  pdf_path: string | null;
  source_url: string | null;
  gallery_paths: string[] | null;
  created_at: string;
  updated_at: string;
  web_insight_locales: InsightLocaleRow[];
};

export const INSIGHT_LOCALES = locales;

export function normalizeImageSize(value: string | null | undefined, kind: InsightKind): ImageSize {
  if (value === "sm" || value === "md" || value === "lg") return value;
  return kind === "noticia" ? "md" : "lg";
}

export function coverPublicUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("/")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  return `${base}/storage/v1/object/public/insight-covers/${path}`;
}

export function formatInsightDate(value: string | null, locale: string): string {
  if (!value) return "";
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function paragraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
