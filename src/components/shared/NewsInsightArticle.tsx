import { CTABand } from "@/components/shared/CTABand";
import { InsightCoverLayout } from "@/components/shared/InsightCoverLayout";
import { Link } from "@/i18n/navigation";
import { contactHref } from "@/lib/contact-context";
import type { AvailabilityNote } from "@/lib/insights/languages";
import { paragraphs, type ImageSize } from "@/lib/insights/types";
import { getTranslations } from "next-intl/server";

type NewsInsight = {
  type: string;
  date: string;
  title: string;
  excerpt: string;
  body: string;
  tag: string;
  coverUrl: string | null;
  imageSize: ImageSize;
  availability: AvailabilityNote | null;
  galleryUrls: string[];
  sourceUrl: string | null;
};

export async function NewsInsightArticle({ item }: { item: NewsInsight }) {
  const t = await getTranslations("ui.insights");
  const blocks = paragraphs(item.body);

  return (
    <>
      <InsightCoverLayout
        eyebrow={[item.type, item.date].filter(Boolean).join(" · ")}
        title={item.title}
        description={item.excerpt}
        coverUrl={item.coverUrl}
        imageSize={item.imageSize}
        availability={item.availability}
      >
        {item.galleryUrls.length ? (
          <div className="mb-8 flex flex-wrap gap-4">
            {item.galleryUrls.map((url) => (
              <img key={url} src={url} alt="" className="h-16 w-auto rounded-lg bg-xinergy-cream object-contain" />
            ))}
          </div>
        ) : null}
        <div className="space-y-5">
          {blocks.map((paragraph) => (
            <p key={paragraph} className="whitespace-pre-line text-inherit leading-relaxed text-xinergy-slate">
              {paragraph}
            </p>
          ))}
        </div>
        {item.sourceUrl ? (
          <p className="mt-8 text-sm text-xinergy-slate">
            {t("publishedOriginally")}{" "}
            <a href={item.sourceUrl} className="font-semibold text-xinergy-orange hover:underline" target="_blank" rel="noopener noreferrer">
              xinergy.cl
            </a>
            .
          </p>
        ) : null}
        {item.tag ? (
          <p className="mt-6">
            <span className="inline-block rounded-full bg-xinergy-cream px-3 py-1 text-xs text-xinergy-slate">{item.tag}</span>
          </p>
        ) : null}
        <p className="mt-10 border-t border-xinergy-charcoal/10 pt-8 text-sm text-xinergy-slate">
          {t("deepenPrompt")}{" "}
          <Link href={contactHref("insights")} className="font-semibold text-xinergy-orange hover:underline">
            {t("writeUs")}
          </Link>
          .
        </p>
      </InsightCoverLayout>
      <CTABand />
    </>
  );
}
