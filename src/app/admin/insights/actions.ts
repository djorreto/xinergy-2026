"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { requireAdminUser } from "@/lib/auth/admin";
import { adminHref } from "@/lib/auth/admin-path";
import { reservedInsightSlugs, slugify } from "@/lib/insights/slug";
import type { ImageSize, InsightLocaleFields } from "@/lib/insights/types";
import { isAllowedEmail } from "@/lib/auth/domain";
import { intakeIsComplete } from "@/lib/insights/intake";
import { normalizeLanguages, normalizeMediaLinks, type MediaLinks } from "@/lib/insights/languages";
import { chileLocalToDate } from "@/lib/insights/schedule";
import { translateInsightFields, type TranslatedFields } from "@/lib/insights/translate";
import { isFreemailDomain } from "@/lib/insights/validate";
import { createAdminClient } from "@/lib/supabase/admin";

function refreshInsights(slug?: string, previousSlug?: string) {
  for (const locale of locales) {
    revalidatePath(`/${locale}/insights`);
    if (slug) revalidatePath(`/${locale}/insights/${slug}`);
    if (previousSlug && previousSlug !== slug) revalidatePath(`/${locale}/insights/${previousSlug}`);
  }
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const admin = await createAdminClient();
  const reserved = reservedInsightSlugs();
  let candidate = base || "insight";
  let suffix = 2;
  while (reserved.has(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  for (;;) {
    const { data } = await admin.from("web_insights").select("id").eq("slug", candidate).maybeSingle();
    if (!data || data.id === ignoreId) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

type SaveInput = {
  id: string;
  slug: string;
  intent: "save" | "publish" | "unpublish";
  availability: "now" | "schedule";
  availableAt: string;
  sourceUrl: string;
  imageSize: ImageSize;
  languages: Locale[];
  mediaLinks: MediaLinks;
  locales: Record<Locale, InsightLocaleFields>;
};

function resolveAvailableAt(input: SaveInput): { ok: true; availableAt: string | null } | { ok: false; error: string } {
  if (input.intent === "unpublish" || input.availability === "now") {
    return { ok: true, availableAt: input.intent === "publish" ? new Date().toISOString() : null };
  }
  const when = chileLocalToDate(input.availableAt);
  if (!when) return { ok: false, error: "Elige una fecha y hora válida de Chile." };
  if (input.intent === "publish" && when.getTime() <= Date.now()) {
    return { ok: false, error: "Esa hora de Chile ya pasó. Elige una hora futura o publica ahora." };
  }
  return { ok: true, availableAt: when.toISOString() };
}

export async function saveInsight(input: SaveInput): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdminUser();
  const admin = await createAdminClient();
  const { data: current, error } = await admin
    .from("web_insights")
    .select("id, slug, kind, status, available_at, published_at, cover_path, pdf_path, gallery_paths")
    .eq("id", input.id)
    .maybeSingle();
  if (error || !current) return { ok: false, error: "No encontré este insight." };

  const slug = await uniqueSlug(slugify(input.slug), input.id);
  if (!slug) return { ok: false, error: "El slug no es válido." };
  const kind = current.kind === "noticia" ? "noticia" : "documento";
  const mediaLinks = kind === "noticia" ? normalizeMediaLinks(input.mediaLinks) : {};
  const languages = kind === "noticia" ? normalizeLanguages(Object.keys(mediaLinks)) : normalizeLanguages(input.languages);
  if (kind === "documento" && !languages.length) return { ok: false, error: "Marca al menos un idioma del documento." };

  const filled = locales.flatMap((locale) => {
    const fields = input.locales[locale];
    if (!fields?.title.trim()) return [];
    return [{ locale, fields }];
  });

  const gallery = Array.isArray(current.gallery_paths) ? current.gallery_paths : [];
  if (input.intent === "publish") {
    if (kind === "noticia") {
      if (!current.cover_path && gallery.length === 0) return { ok: false, error: "Sube una imagen antes de publicar." };
    } else if (!current.cover_path) return { ok: false, error: "Sube una portada antes de publicar." };
    if (kind === "documento" && !current.pdf_path) return { ok: false, error: "Sube el PDF antes de publicar." };
    const ready = filled.filter(
      ({ fields }) => fields.title.trim().length >= 3 && fields.excerpt.trim().length >= 40 && fields.body.trim().length >= 80,
    );
    if (!ready.length) {
      return {
        ok: false,
        error: "Para publicar, completa título, un resumen de al menos 40 caracteres y un brief de al menos 80 en un idioma.",
      };
    }
  }

  const status = input.intent === "publish" ? "published" : input.intent === "unpublish" ? "draft" : current.status;
  let availableAt = current.available_at ?? null;
  if (input.intent !== "unpublish") {
    const availability = resolveAvailableAt(input);
    if (!availability.ok) return availability;
    availableAt = availability.availableAt;
  }
  const patch: {
    slug: string;
    status: "draft" | "published";
    available_at: string | null;
    source_url: string | null;
    image_size: ImageSize;
    languages: Locale[];
    media_links: MediaLinks;
    updated_at: string;
    published_at?: string;
  } = {
    slug,
    status,
    available_at: availableAt,
    source_url: input.sourceUrl.trim() || null,
    image_size: input.imageSize === "sm" || input.imageSize === "md" || input.imageSize === "lg" ? input.imageSize : "lg",
    languages,
    media_links: mediaLinks,
    updated_at: new Date().toISOString(),
  };
  if (status === "published" && input.availability === "now" && availableAt && !current.published_at) patch.published_at = availableAt;
  const { error: updateError } = await admin.from("web_insights").update(patch).eq("id", input.id);
  if (updateError) return { ok: false, error: "No se pudo guardar." };

  for (const locale of locales) {
    const fields = input.locales[locale];
    if (!fields?.title.trim()) {
      await admin.from("web_insight_locales").delete().eq("insight_id", input.id).eq("locale", locale);
      continue;
    }
    const { error: localeError } = await admin.from("web_insight_locales").upsert(
      {
        insight_id: input.id,
        locale,
        title: fields.title.trim(),
        excerpt: fields.excerpt.trim(),
        body: fields.body.trim(),
        type_label: fields.typeLabel.trim() || "Point of View",
        tag: fields.tag.trim(),
        author: fields.author.trim(),
        published_on: fields.publishedOn || null,
      },
      { onConflict: "insight_id,locale" },
    );
    if (localeError) return { ok: false, error: "No se pudo guardar el texto." };
  }

  const complete = intakeIsComplete(
    locales.map((locale) => {
      const fields = input.locales[locale];
      return {
        locale,
        title: fields?.title ?? "",
        excerpt: fields?.excerpt ?? "",
        body: fields?.body ?? "",
      };
    }),
    Boolean(current.pdf_path),
    kind,
  );
  await admin.from("web_insights").update({ intake_complete: complete }).eq("id", input.id);

  refreshInsights(slug, current.slug);
  return { ok: true };
}

export async function setInsightVisibility(input: {
  id: string;
  visibility: "draft" | "now" | "schedule";
  availableAt: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdminUser();
  const admin = await createAdminClient();
  const { data: current, error } = await admin
    .from("web_insights")
    .select("id, slug, kind, published_at, cover_path, pdf_path, gallery_paths, web_insight_locales(title, excerpt, body)")
    .eq("id", input.id)
    .maybeSingle();
  if (error || !current) return { ok: false, error: "No encontré este insight." };

  let status: "draft" | "published" = "draft";
  let availableAt: string | null = null;
  if (input.visibility === "now") {
    status = "published";
    availableAt = new Date().toISOString();
  } else if (input.visibility === "schedule") {
    const when = chileLocalToDate(input.availableAt);
    if (!when) return { ok: false, error: "Elige una fecha y hora válida de Chile." };
    if (when.getTime() <= Date.now()) return { ok: false, error: "Esa hora de Chile ya pasó." };
    status = "published";
    availableAt = when.toISOString();
  }

  const kind = current.kind === "noticia" ? "noticia" : "documento";
  const gallery = Array.isArray(current.gallery_paths) ? current.gallery_paths : [];
  if (status === "published") {
    if (kind === "noticia") {
      if (!current.cover_path && gallery.length === 0) return { ok: false, error: "Sube una imagen antes de publicar." };
    } else if (!current.cover_path) return { ok: false, error: "Sube una portada antes de publicar." };
    if (kind === "documento" && !current.pdf_path) return { ok: false, error: "Sube el PDF antes de publicar." };
    const ready = (current.web_insight_locales ?? []).some(
      (row: { title: string; excerpt: string; body: string }) =>
        row.title.trim().length >= 3 && row.excerpt.trim().length >= 40 && row.body.trim().length >= 80,
    );
    if (!ready) return { ok: false, error: "Falta título, resumen o brief en algún idioma." };
  }

  const patch: {
    status: "draft" | "published";
    available_at: string | null;
    updated_at: string;
    published_at?: string;
  } = {
    status,
    available_at: availableAt,
    updated_at: new Date().toISOString(),
  };
  if (input.visibility === "now" && availableAt && !current.published_at) patch.published_at = availableAt;
  const { error: updateError } = await admin.from("web_insights").update(patch).eq("id", input.id);
  if (updateError) return { ok: false, error: "No se pudo guardar." };
  refreshInsights(current.slug);
  return { ok: true };
}

export async function createNewsInsight() {
  const user = await requireAdminUser();
  const slug = await uniqueSlug("noticia");
  const admin = await createAdminClient();
  const { data, error } = await admin
    .from("web_insights")
    .insert({
      slug,
      status: "draft",
      kind: "noticia",
      image_size: "md",
      languages: [],
      media_links: {},
      created_by: user.email,
      intake_complete: false,
    })
    .select("id")
    .single();
  if (error || !data) redirect(adminHref("/insights/new?error=save"));
  redirect(adminHref(`/insights/${data.id}`));
}

export async function duplicateInsight(formData: FormData) {
  const user = await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  const admin = await createAdminClient();
  const { data: source } = await admin
    .from("web_insights")
    .select("slug, kind, cover_path, image_size, languages, media_links, pdf_path, source_url, gallery_paths, web_insight_locales(*)")
    .eq("id", id)
    .maybeSingle();
  if (!source) redirect(adminHref("/insights"));

  const slug = await uniqueSlug(`${source.slug}-copia`);
  const { data: created } = await admin
    .from("web_insights")
    .insert({
      slug,
      status: "draft",
      kind: source.kind === "noticia" ? "noticia" : "documento",
      image_size: source.image_size === "sm" || source.image_size === "md" || source.image_size === "lg" ? source.image_size : "lg",
      languages: normalizeLanguages(source.languages),
      media_links: normalizeMediaLinks(source.media_links),
      source_url: source.source_url,
      gallery_paths: source.gallery_paths ?? [],
      created_by: user.email,
      intake_complete: false,
    })
    .select("id")
    .single();
  if (!created) redirect(adminHref(`/insights/${id}?error=duplicate`));

  const coverPath = await copyFile("insight-covers", source.cover_path, created.id);
  const pdfPath = await copyFile("insight-pdfs", source.pdf_path, created.id);
  if (coverPath || pdfPath) {
    await admin.from("web_insights").update({ cover_path: coverPath, pdf_path: pdfPath }).eq("id", created.id);
  }

  const copies = (source.web_insight_locales ?? []).map((locale: Record<string, unknown>) => ({
    insight_id: created.id,
    locale: locale.locale,
    title: locale.title,
    excerpt: locale.excerpt,
    body: locale.body,
    type_label: locale.type_label,
    tag: locale.tag,
    author: locale.author,
    published_on: locale.published_on,
  }));
  if (copies.length) await admin.from("web_insight_locales").insert(copies);
  const complete = intakeIsComplete(
    copies.map((locale) => ({
      locale: String(locale.locale),
      title: String(locale.title ?? ""),
      excerpt: String(locale.excerpt ?? ""),
      body: String(locale.body ?? ""),
    })),
    Boolean(pdfPath),
    source.kind === "noticia" ? "noticia" : "documento",
  );
  await admin.from("web_insights").update({ intake_complete: complete }).eq("id", created.id);
  redirect(adminHref(`/insights/${created.id}`));
}

async function copyFile(bucket: "insight-covers" | "insight-pdfs", path: string | null, insightId: string) {
  if (!path) return null;
  const admin = await createAdminClient();
  const downloaded = await admin.storage.from(bucket).download(path);
  if (downloaded.error || !downloaded.data) return null;
  const extension = path.split(".").pop() || (bucket === "insight-pdfs" ? "pdf" : "jpg");
  const nextPath = `${insightId}/copia-${Date.now()}.${extension}`;
  const uploaded = await admin.storage.from(bucket).upload(nextPath, downloaded.data, { upsert: false });
  return uploaded.error ? null : nextPath;
}

export async function translateInsightLocales(input: {
  source: Locale;
  fields: InsightLocaleFields;
  filledLocales: Locale[];
}): Promise<{ ok: true; translations: Partial<Record<Locale, TranslatedFields>> } | { ok: false; error: string }> {
  await requireAdminUser();
  const targets = locales.filter((locale) => locale !== "es" && !input.filledLocales.includes(locale));
  if (!input.fields.title.trim()) return { ok: false, error: "Escribe el título en español antes de traducir." };
  if (!targets.length) {
    return { ok: false, error: "Los otros idiomas ya tienen título. Borra ese título si quieres volver a traducirlos." };
  }
  try {
    const translations = await translateInsightFields("es", input.fields, targets);
    return { ok: true, translations };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "missing_key") return { ok: false, error: "Falta la clave de Groq para traducir." };
    if (message === "empty_source") return { ok: false, error: "Escribe el título en español antes de traducir." };
    console.error("[insights] no se pudo traducir:", message);
    return { ok: false, error: "Groq no pudo traducir este texto. Inténtalo de nuevo." };
  }
}

export async function addCompetitorDomain(formData: FormData) {
  await requireAdminUser();
  const domain = String(formData.get("domain") ?? "")
    .trim()
    .toLowerCase()
    .replace(/^@/, "");
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) redirect(adminHref("/insights?error=domain"));
  if (isFreemailDomain(domain)) redirect(adminHref("/insights?error=freemail"));
  const admin = await createAdminClient();
  await admin.from("web_insight_competitor_domains").upsert({ domain });
  redirect(adminHref("/insights"));
}

export async function addInsightAdmin(formData: FormData) {
  await requireAdminUser();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!isAllowedEmail(email)) redirect(adminHref("/insights?error=admin_domain"));
  const admin = await createAdminClient();
  const { error } = await admin.from("web_insight_admins").upsert({ email, enabled: true });
  if (error) redirect(adminHref("/insights?error=admin_save"));
  redirect(adminHref("/insights"));
}

export async function removeInsightAdmin(formData: FormData) {
  const current = await requireAdminUser();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (email === current.email) redirect(adminHref("/insights?error=admin_self"));
  const admin = await createAdminClient();
  await admin.from("web_insight_admins").delete().eq("email", email);
  redirect(adminHref("/insights"));
}

export async function removeCompetitorDomain(formData: FormData) {
  await requireAdminUser();
  const domain = String(formData.get("domain") ?? "").trim().toLowerCase();
  const admin = await createAdminClient();
  await admin.from("web_insight_competitor_domains").delete().eq("domain", domain);
  redirect(adminHref("/insights"));
}
