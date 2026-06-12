import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { CTABand } from "@/components/shared/CTABand";
import { Container } from "@/components/ui/Container";
import { getContent } from "@/lib/content";
import { contactHref } from "@/lib/contact-context";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const { insights } = getContent(routing.defaultLocale);
  return routing.locales.flatMap((locale) =>
    insights.map((i) => ({ locale, slug: i.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const { insights } = getContent(locale);
  const item = insights.find((i) => i.slug === slug);
  if (!item) return { title: "Insight" };
  return { title: item.title, description: item.excerpt };
}

export default async function InsightPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
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
