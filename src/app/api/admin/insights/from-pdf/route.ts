import { NextResponse } from "next/server";
import { locales } from "@/i18n/routing";
import { getAdminUser } from "@/lib/auth/admin";
import { draftInsightFromPdf } from "@/lib/insights/from-pdf";
import { normalizeLanguages } from "@/lib/insights/languages";
import { intakeIsComplete } from "@/lib/insights/intake";
import { reservedInsightSlugs, slugify } from "@/lib/insights/slug";
import { createAdminClient } from "@/lib/supabase/admin";

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

function go(path: string) {
  return new NextResponse(null, { status: 303, headers: { Location: path } });
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return go("/admin/login");

  const formData = await request.formData();
  const languages = normalizeLanguages(formData.getAll("languages"));
  if (!languages.length) return go("/admin/insights/new?error=languages");
  const file = formData.get("pdf");
  if (!(file instanceof File) || file.size === 0) return go("/admin/insights/new?error=file");
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) return go("/admin/insights/new?error=file");
  if (file.size > 20 * 1024 * 1024) return go("/admin/insights/new?error=size");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const stored = bytes.slice();
  const fallbackTitle = file.name.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ").trim();
  const slug = await uniqueSlug(slugify(fallbackTitle) || "insight");
  const admin = await createAdminClient();
  const { data, error } = await admin
    .from("web_insights")
    .insert({ slug, status: "draft", intake_complete: false, created_by: user.email, languages })
    .select("id")
    .single();
  if (error || !data) {
    console.error("create insight", error?.message);
    return go("/admin/insights/new?error=save");
  }

  const path = `${data.id}/documento.pdf`;
  const uploaded = await admin.storage.from("insight-pdfs").upload(path, stored, {
    contentType: "application/pdf",
    upsert: true,
  });
  if (uploaded.error) {
    console.error("upload pdf", uploaded.error.message);
    await admin.from("web_insights").delete().eq("id", data.id);
    return go("/admin/insights/new?error=save");
  }
  await admin.from("web_insights").update({ pdf_path: path }).eq("id", data.id);

  let draft: Awaited<ReturnType<typeof draftInsightFromPdf>> | null = null;
  try {
    draft = await draftInsightFromPdf(bytes);
  } catch (draftError) {
    console.error("draftInsightFromPdf", draftError instanceof Error ? draftError.message : "failed");
  }

  if (!draft) return go(`/admin/insights/${data.id}?review=empty`);

  const today = new Date().toISOString().slice(0, 10);
  const rows = locales.map((locale) => {
    const fields = draft[locale];
    return {
      insight_id: data.id,
      locale,
      title: fields.title,
      excerpt: fields.excerpt,
      body: fields.body,
      type_label: fields.typeLabel || "Point of View",
      tag: fields.tag,
      author: fields.author,
      published_on: fields.publishedOn || null,
    };
  });
  const inserted = await admin.from("web_insight_locales").insert(
    rows.map((row) => ({ ...row, published_on: row.published_on || today })),
  );
  const complete =
    !inserted.error &&
    intakeIsComplete(
      rows.map((row) => ({ locale: row.locale, title: row.title, excerpt: row.excerpt, body: row.body })),
      true,
    );
  const nextSlug = draft.es.title ? await uniqueSlug(slugify(draft.es.title), data.id) : slug;
  await admin
    .from("web_insights")
    .update({ intake_complete: complete, slug: nextSlug })
    .eq("id", data.id);
  return go(`/admin/insights/${data.id}?review=${complete ? "1" : "empty"}`);
}
