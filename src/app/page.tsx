import Link from "next/link";
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
import { brand, home, capabilities } from "@/lib/content";
import { ttForsDisplay } from "@/lib/fonts";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero hero-below-header hero-mobile relative overflow-hidden text-white lg:hero-offset lg:min-h-[100dvh]">
        <HeroMotion />
        <Container className="relative z-10 pb-10 pt-0 sm:pb-12 sm:pt-12 lg:flex lg:min-h-[100dvh] lg:flex-col lg:justify-between lg:pb-16 lg:pt-24 xl:pt-28">
          <div className="hero-mobile-content max-lg:flex max-lg:min-h-[calc(100svh-var(--site-header-height,3.5rem)-env(safe-area-inset-top,0px)-2rem)] max-lg:flex-col max-lg:justify-center">
            <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl">
              <p className="hero-mobile-eyebrow label-editorial-light max-lg:before:hidden">
                {brand.heroEyebrow}
              </p>
              <h1
                className={`${ttForsDisplay.className} brand-phrase mt-4 max-lg:mt-5 max-lg:text-[2.75rem] max-lg:leading-[1.04] sm:mt-5 sm:text-[2.5rem] sm:leading-[1.06] lg:mt-3 lg:text-[3.5rem] xl:text-[4rem]`}
              >
                {brand.claim}
              </h1>
              <p
                className={`${ttForsDisplay.className} hero-mobile-accent mt-3 max-lg:text-lg max-lg:leading-snug lg:hidden`}
              >
                {brand.tagline}
              </p>
              <p className="hero-mobile-body mt-4 max-w-md text-base leading-relaxed text-white/72 sm:mt-5 sm:text-base lg:mt-3 lg:max-w-lg lg:text-lg">
                {brand.promise}
              </p>
            </div>
            <div className="mobile-actions hero-mobile-actions mt-8 max-lg:mt-10 sm:mt-10">
              <Button href="/contacto" className="max-lg:w-full max-lg:rounded-full max-lg:py-4 max-lg:text-[0.6875rem] max-lg:tracking-[0.1em]">
                {brand.cta}
              </Button>
              <Button
                href="/diagnostico"
                variant="light"
                className="max-lg:w-full max-lg:rounded-full max-lg:py-4 max-lg:text-[0.6875rem] max-lg:tracking-[0.1em]"
              >
                Calcular eficiencias
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <HeroStatsGrid variant="hero" />
            <StrongPhraseBlock compact className="mt-6 xl:mt-7" />
          </div>
        </Container>
      </section>

      {/* Stats + frase — móvil */}
      <section className="border-t border-white/8 bg-[#2a2433] py-10 text-white max-lg:py-12 lg:hidden">
        <Container>
          <p className="label-editorial-light mb-4 !text-[0.625rem] !tracking-[0.18em]">
            Impacto medible
          </p>
          <HeroStatsGrid variant="band" />
          <StrongPhraseBlock className="mt-8" />
        </Container>
      </section>

      {/* Casos — prueba social */}
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
            className="mt-8 inline-block text-xs font-semibold uppercase tracking-wider text-xinergy-orange hover:underline"
          >
            Ver todos los casos →
          </Link>
        </Container>
      </section>

      <TrustLogosSection />

      {/* Lo que hacemos + marco Por qué / Qué / Cómo */}
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
                className="card-premium card-hover group block p-6"
              >
                <span
                  className={`${ttForsDisplay.className} brand-phrase text-2xl text-xinergy-orange lg:text-3xl`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-sm font-semibold leading-snug text-xinergy-charcoal group-hover:text-xinergy-orange">
                  {cap.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-xinergy-slate">
                  {cap.description}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Por qué / Qué / Cómo */}
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

      {/* Diagnóstico */}
      <section className="section-pad-lg bg-xinergy-charcoal text-white">
        <Container className="lg:mx-auto">
          <SectionHeader
            dark
            align="center"
            eyebrow="Diagnóstico gratuito"
            title="¿Cuánta eficiencia puede liberar su empresa?"
            intro="En unos minutos, con datos básicos de su gasto y operación."
          />
          <div className="mt-8 text-center">
            <Button href="/diagnostico">Calcular eficiencias</Button>
          </div>
        </Container>
      </section>

      {/* CTA — gráfico + cierre crema */}
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
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-xinergy-slate sm:text-base">
                {home.cta.intro}
              </p>
              <div className="mobile-actions cta-band-actions mt-8 justify-center sm:mt-10">
                <Button href="/contacto">{brand.cta}</Button>
                <Button href="/diagnostico" variant="secondary">
                  Calcular eficiencias
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </section>
    </>
  );
}
