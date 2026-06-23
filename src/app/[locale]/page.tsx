import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { CaseStudiesCarousel } from "@/components/shared/CaseStudiesCarousel";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { TrustLogosSection } from "@/components/shared/TrustLogosSection";
import { HeroMotion } from "@/components/shared/HeroMotion";
import { HeroChartCaption } from "@/components/shared/HeroChartCaption";
import { HeroStatsGrid } from "@/components/shared/HeroStatsGrid";
import { StrongPhraseBlock } from "@/components/shared/StrongPhraseBlock";
import { MessagingFramework } from "@/components/shared/MessagingFramework";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { getContent } from "@/lib/content";
import { ttForsDisplay } from "@/lib/fonts";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { brand, home, capabilities } = getContent(locale);
  const t = await getTranslations("ui.home");
  const tHeader = await getTranslations("ui.header");

  return (
    <>
      <section className="gradient-hero hero-below-header hero-mobile relative overflow-hidden text-white lg:hero-offset lg:min-h-[100dvh]">
        <HeroMotion />
        <Container className="relative z-10 pb-10 pt-0 sm:pb-12 sm:pt-12 lg:flex lg:min-h-[100dvh] lg:flex-col lg:justify-between lg:pb-16 lg:pt-24 xl:pt-28">
          <div className="hero-mobile-content max-lg:flex max-lg:min-h-[calc(100svh-var(--site-header-height,3.5rem)-env(safe-area-inset-top,0px)-2rem)] max-lg:flex-col max-lg:justify-center">
            <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl">
              <h1
                className={`${ttForsDisplay.className} brand-phrase text-[length:var(--type-hero)] leading-[1.06] max-lg:leading-[1.04]`}
              >
                {brand.claim}
              </h1>
              <p
                className={`${ttForsDisplay.className} hero-mobile-accent type-lead mt-3 max-lg:leading-snug lg:hidden`}
              >
                {brand.tagline}
              </p>
              <p className="hero-mobile-body type-lead mt-4 max-w-md sm:mt-5 lg:mt-3 lg:max-w-lg">
                {brand.promise}
              </p>
            </div>
            <div className="mobile-actions hero-mobile-actions mt-8 max-lg:mt-10 sm:mt-10">
              <Button href="/diagnostico" className="max-lg:w-full max-lg:rounded-full max-lg:py-4">
                {tHeader("calculateEfficiencies")}
              </Button>
              <Button
                href="/contacto"
                variant="light"
                className="max-lg:w-full max-lg:rounded-full max-lg:py-4"
              >
                {brand.cta}
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <HeroStatsGrid variant="hero" />
            <StrongPhraseBlock compact className="mt-6 xl:mt-7" />
          </div>
        </Container>
      </section>

      <section className="border-t border-white/8 bg-[#2a2433] py-10 text-white max-lg:py-12 lg:hidden">
        <Container>
          <p className="label-editorial-light mb-4">
            {t("measurableImpact")}
          </p>
          <HeroStatsGrid variant="band" />
          <StrongPhraseBlock className="mt-8" />
        </Container>
      </section>

      <section className="section-pad bg-xinergy-ivory">
        <Container>
          <SectionHeader
            eyebrow={home.cases.label}
            title={home.cases.title}
            intro={home.cases.intro}
            titleClassName="max-w-lg"
          />
          <div className="mt-10">
            <CaseStudiesCarousel />
          </div>
          <Link
            href="/casos"
            className="type-body-sm mt-8 inline-block font-semibold uppercase tracking-wider text-xinergy-orange hover:underline"
          >
            {t("viewAllCases")}
          </Link>
        </Container>
      </section>

      <TrustLogosSection />

      <section id="expertise" className="section-pad bg-white scroll-mt-24">
        <Container>
          <SectionHeader
            eyebrow={home.capabilities.title}
            title={home.capabilities.headline}
            intro={home.capabilities.intro}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap, i) => (
              <Link
                key={cap.title}
                href={cap.href}
                className="card-premium card-hover group block p-6 sm:p-7"
              >
                <span
                  className={`${ttForsDisplay.className} brand-phrase text-2xl text-xinergy-orange lg:text-3xl`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-base font-semibold leading-snug text-xinergy-charcoal group-hover:text-xinergy-orange sm:text-lg">
                  {cap.title}
                </h3>
                <p className="type-body mt-3 text-xinergy-slate">
                  {cap.description}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-pad border-t border-xinergy-charcoal/8 bg-xinergy-ivory">
        <Container>
          <SectionHeader
            eyebrow={home.framework.title}
            title={home.framework.headline}
            intro={home.framework.intro}
          />
          <MessagingFramework className="mt-10" />
        </Container>
      </section>

      <section className="section-pad-lg bg-xinergy-charcoal text-white">
        <Container className="lg:mx-auto">
          <SectionHeader
            dark
            align="center"
            eyebrow={t("efficiencyDiagnostic")}
            title={t("efficiencyQuestion")}
            intro={t("efficiencyIntro")}
          />
          <div className="mt-8 text-center">
            <Button href="/diagnostico">{tHeader("calculateEfficiencies")}</Button>
          </div>
        </Container>
      </section>

      <section className="overflow-hidden">
        <div className="hero-chart-block relative overflow-hidden text-white">
          <div className="hero-chart-band relative">
            <HeroMotion variant="band" />
            <div className="relative z-10 flex flex-col">
              <Container className="hidden pt-8 lg:block lg:pt-10">
                <h3 className="font-display max-w-2xl text-lg leading-snug sm:text-xl lg:text-2xl">
                  {home.chartBand.title}
                </h3>
              </Container>
              <div
                className="h-48 sm:h-48 lg:h-52 xl:h-56"
                aria-hidden
              />
              <Container className="pb-8 lg:pb-10">
                <HeroChartCaption dark />
              </Container>
            </div>
          </div>
        </div>
        <div className="bg-xinergy-cream section-pad-lg text-xinergy-charcoal">
          <Container>
            <div className="mx-auto max-w-xl text-center">
              <SectionHeader
                align="center"
                eyebrow={home.cta.eyebrow}
                title={home.cta.title}
                titleClassName="text-2xl sm:text-3xl lg:text-5xl"
              />
              <p
                className={`${ttForsDisplay.className} brand-phrase mt-2 text-lg text-xinergy-orange sm:text-xl lg:text-2xl`}
              >
                {brand.claim}
              </p>
              <p className="type-body mx-auto mt-3 max-w-md text-xinergy-slate">
                {home.cta.intro}
              </p>
              <div className="mobile-actions cta-band-actions mt-8 justify-center sm:mt-10">
                <Button href="/diagnostico">{tHeader("calculateEfficiencies")}</Button>
                <Button href="/contacto" variant="secondary">
                  {brand.cta}
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </section>
    </>
  );
}
