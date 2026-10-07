import { CTABand } from "@/components/shared/CTABand";
import { InsightCoverLayout } from "@/components/shared/InsightCoverLayout";
import { PovDownloadForm } from "@/components/shared/PovDownloadForm";
import { Link } from "@/i18n/navigation";
import { contactHref } from "@/lib/contact-context";
import { paragraphs, type PovInsight } from "@/lib/insights/types";
import { getTranslations } from "next-intl/server";

export async function PovInsightArticle({ item, preview = false }: { item: PovInsight; preview?: boolean }) {
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
        after={item.hasPdf ? <PovDownloadForm slug={item.slug} preview={preview} /> : null}
      >
        <div className="space-y-5">
          {blocks.map((paragraph) => (
            <p key={paragraph} className="whitespace-pre-line text-inherit leading-relaxed text-xinergy-slate">
              {paragraph}
            </p>
          ))}
        </div>
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
