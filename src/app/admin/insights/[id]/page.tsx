import Link from "next/link";
import { notFound } from "next/navigation";
import { duplicateInsight } from "@/app/admin/insights/actions";
import { InsightEditor } from "@/components/admin/InsightEditor";
import { locales, type Locale } from "@/i18n/routing";
import { normalizeLanguages, normalizeMediaLinks } from "@/lib/insights/languages";
import { coverPublicUrl, normalizeImageSize, type InsightLocaleFields, type InsightLocaleRow } from "@/lib/insights/types";
import { adminHref } from "@/lib/auth/admin-path";
import { createAdminClient } from "@/lib/supabase/admin";

type DownloadRow = {
  email: string;
  validated_at: string | null;
  created_at: string;
  is_competitor: boolean;
};

export default async function EditInsightPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ review?: string }>;
}) {
  const { id } = await params;
  const { review } = await searchParams;
  const admin = await createAdminClient();
  const { data } = await admin
    .from("web_insights")
    .select("id, slug, kind, status, intake_complete, created_by, available_at, cover_path, image_size, languages, media_links, pdf_path, source_url, gallery_paths, web_insight_locales(*)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  const { data: downloads } = await admin
    .from("web_insight_downloads")
    .select("email, validated_at, created_at, is_competitor")
    .eq("insight_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  const stored = (data.web_insight_locales ?? []) as InsightLocaleRow[];
  const localeFields = Object.fromEntries(
    locales.map((locale) => {
      const row = stored.find((item) => item.locale === locale);
      const fields: InsightLocaleFields = {
        title: row?.title ?? "",
        excerpt: row?.excerpt ?? "",
        body: row?.body ?? "",
        typeLabel: row?.type_label || (data.kind === "noticia" ? "Noticia" : "Point of View"),
        tag: row?.tag ?? "",
        author: row?.author ?? "",
        publishedOn: row?.published_on ?? "",
      };
      return [locale, fields];
    }),
  ) as Record<Locale, InsightLocaleFields>;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href={adminHref("/insights")} className="text-sm text-xinergy-slate hover:text-xinergy-charcoal">
          ← Insights
        </Link>
        <form action={duplicateInsight}>
          <input type="hidden" name="id" value={data.id} />
          <button type="submit" className="text-sm text-xinergy-slate hover:text-xinergy-charcoal">
            Duplicar
          </button>
        </form>
      </div>
      {!data.intake_complete ? (
        <p className="mb-6 border border-xinergy-charcoal/15 bg-white px-4 py-3 text-sm text-xinergy-charcoal">
          Quedó como borrador incompleto
          {data.created_by ? ` · cargado por ${data.created_by}` : ""}. El avance está guardado. Completa los textos
          que faltan y guarda.
        </p>
      ) : review === "1" ? (
        <p className="mb-6 border border-xinergy-orange/40 bg-xinergy-orange/10 px-4 py-3 text-sm text-xinergy-charcoal">
          Groq completó los textos desde el PDF. Revísalos y cámbialos si quieres. La portada se sube aquí
          mismo.
        </p>
      ) : null}
      <InsightEditor
        id={data.id}
        slug={data.slug}
        kind={data.kind === "noticia" ? "noticia" : "documento"}
        status={data.status}
        availableAt={data.available_at}
        coverUrl={coverPublicUrl(data.cover_path)}
        imageSize={normalizeImageSize(data.image_size, data.kind === "noticia" ? "noticia" : "documento")}
        languages={normalizeLanguages(data.languages)}
        mediaLinks={normalizeMediaLinks(data.media_links)}
        galleryUrls={(data.gallery_paths ?? []).map((path: string) => coverPublicUrl(path)).filter((url: string | null): url is string => Boolean(url))}
        sourceUrl={data.source_url ?? ""}
        hasPdf={Boolean(data.pdf_path)}
        locales={localeFields}
        downloads={(downloads as DownloadRow[] | null)?.map((row) => ({
          email: row.email,
          validatedAt: row.validated_at,
          createdAt: row.created_at,
          competitor: row.is_competitor,
        })) ?? []}
      />
    </div>
  );
}
