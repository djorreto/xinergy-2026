import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { CTABand } from "@/components/shared/CTABand";
import { PovInsightArticle } from "@/components/shared/PovInsightArticle";
import { Container } from "@/components/ui/Container";
import { getAdminUser } from "@/lib/auth/admin";
import { getContent } from "@/lib/content";
import { contactHref } from "@/lib/contact-context";
import { getInsightRecord, toPublishedShape } from "@/lib/insights/public";
import { isLiveInsight } from "@/lib/insights/schedule";
import { availabilityNote, normalizeLanguages, normalizeMediaLinks } from "@/lib/insights/languages";
import { coverPublicUrl, formatInsightDate, normalizeImageSize } from "@/lib/insights/types";
import { NewsInsightArticle } from "@/components/shared/NewsInsightArticle";
import { routing, type Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string; slug: string }>; searchParams: Promise<{ preview?: string }> };

function isLocale(value: string): value is Locale {
  return value === "es" || value === "en" || value === "pt";
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const { insights } = getContent(routing.defaultLocale);
  return routing.locales.flatMap((locale) =>
    insights.map((i) => ({ locale, slug: i.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const record = await getInsightRecord(slug);
  const safeLocale: Locale = isLocale(locale) ? locale : "es";
  const copy = record?.web_insight_locales.find((item) => item.locale === safeLocale && item.title.trim());
  if (copy) return { title: copy.title, description: copy.excerpt };
  const { insights } = getContent(locale);
  const item = insights.find((i) => i.slug === slug);
  if (!item) return { title: "Insight" };
  return { title: item.title, description: item.excerpt };
}

export default async function InsightPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const { preview } = await searchParams;
  setRequestLocale(locale);
  const safeLocale: Locale = isLocale(locale) ? locale : "es";
  const record = await getInsightRecord(slug);
  const admin = preview === "1" ? await getAdminUser() : null;
  if (record && (isLiveInsight(record.status, record.available_at) || admin)) {
    const copy = record.web_insight_locales.find((item) => item.locale === safeLocale && item.title.trim())
      ?? record.web_insight_locales.find((item) => item.title.trim());
    if (record.kind === "noticia" && copy) {
      return (
        <NewsInsightArticle
          item={{
            type: copy.type_label || "Noticia",
            date: formatInsightDate(copy.published_on, safeLocale),
            title: copy.title,
            excerpt: copy.excerpt,
            body: copy.body,
            tag: copy.tag,
            coverUrl: coverPublicUrl(record.cover_path),
            imageSize: normalizeImageSize(record.image_size, "noticia"),
            availability: availabilityNote(
              normalizeLanguages(Object.keys(normalizeMediaLinks(record.media_links))),
              safeLocale,
              normalizeMediaLinks(record.media_links),
            ),
            galleryUrls: (record.gallery_paths ?? []).map((path) => coverPublicUrl(path)).filter((url): url is string => Boolean(url)),
            sourceUrl: record.source_url,
          }}
        />
      );
    }
    const pov = toPublishedShape(record, safeLocale);
    if (pov) return <PovInsightArticle item={pov} />;
  }

  const { insights } = getContent(locale);
  const item = insights.find((i) => i.slug === slug);
  if (!item) notFound();
  const t = await getTranslations("ui.insights");

  const externalUrl = "externalUrl" in item ? item.externalUrl : undefined;

  return (
    <>
      <PageHero
        eyebrow={`${item.type} · ${item.date}`}
        title={item.title}
        description={item.excerpt}
      />
      <section className="py-16">
        <Container className="max-w-3xl">
          {item.cover ? (
            <img src={item.cover} alt="" className="mb-8 w-full rounded-2xl" />
          ) : null}
          <div className="space-y-5">
            {item.body.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-xinergy-slate">
                {paragraph}
              </p>
            ))}
          </div>
          {externalUrl ? (
            <p className="mt-8 text-sm text-xinergy-slate">
              {t("publishedOriginally")}{" "}
              <a
                href={externalUrl}
                className="font-semibold text-xinergy-orange hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                xinergy.cl
              </a>
              .
            </p>
          ) : null}
          <p className="mt-6">
            <span className="inline-block rounded-full bg-xinergy-cream px-3 py-1 text-xs text-xinergy-slate">
              {item.tag}
            </span>
          </p>
          <p className="mt-10 border-t border-xinergy-charcoal/10 pt-8 text-sm text-xinergy-slate">
            {t("deepenPrompt")}{" "}
            <Link href={contactHref("insights")} className="font-semibold text-xinergy-orange hover:underline">
              {t("writeUs")}
            </Link>
            .
          </p>
        </Container>
      </section>
      <CTABand />
    </>
  );
}
