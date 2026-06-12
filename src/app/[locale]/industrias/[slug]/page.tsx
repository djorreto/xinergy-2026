import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { CTABand } from "@/components/shared/CTABand";
import { Container } from "@/components/ui/Container";
import { getContent } from "@/lib/content";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const { industries } = getContent(routing.defaultLocale);
  return routing.locales.flatMap((locale) =>
    industries.map((i) => ({ locale, slug: i.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const { industries } = getContent(locale);
  const ind = industries.find((i) => i.slug === slug);
  if (!ind) return { title: "Industria" };
  return { title: ind.title, description: ind.headline };
}

export default async function IndustriaPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const { industries, industriesPage } = getContent(locale);
  const ind = industries.find((i) => i.slug === slug);
  if (!ind) notFound();
  const t = await getTranslations("ui.industries");

  return (
    <>
      <PageHero
        dark
        eyebrow={industriesPage.sectorLabel}
        title={ind.title}
        description={ind.headline}
      />
      <section className="py-20">
        <Container>
          <h2 className="text-xl font-bold text-xinergy-charcoal">{industriesPage.challengesTitle}</h2>
          <ol className="mt-6 space-y-4">
            {ind.challenges.map((c, i) => (
              <li key={c} className="flex gap-4 rounded-xl bg-xinergy-cream p-5">
                <span className="text-2xl font-bold text-xinergy-orange/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-xinergy-slate pt-1">{c}</span>
              </li>
            ))}
          </ol>
          <h2 className="mt-16 text-xl font-bold text-xinergy-charcoal">{industriesPage.howWeHelpTitle}</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {ind.howWeHelp.map((h) => (
              <li
                key={h}
                className="rounded-xl border border-xinergy-charcoal/10 p-5 text-sm text-xinergy-slate"
              >
                {h}
              </li>
            ))}
          </ul>
          <p className="mt-12 rounded-xl bg-xinergy-charcoal p-6 text-sm text-white/80">
            <strong className="text-xinergy-orange">{t("experience")}</strong> {ind.metric}
          </p>
        </Container>
      </section>
      <CTABand />
    </>
  );
}
