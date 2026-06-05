import Link from "next/link";
import { CaseStudiesCarousel } from "@/components/shared/CaseStudiesCarousel";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { TrustLogosSection } from "@/components/shared/TrustLogosSection";
import { HeroMotion } from "@/components/shared/HeroMotion";
import { HeroChartCaption } from "@/components/shared/HeroChartCaption";
import { HeroStatsGrid } from "@/components/shared/HeroStatsGrid";
import { MessagingFramework } from "@/components/shared/MessagingFramework";
import { brand, home, capabilities } from "@/lib/content";
import { ttForsDisplay } from "@/lib/fonts";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero hero-below-header relative overflow-hidden text-white lg:hero-offset lg:min-h-[36rem]">
        <HeroMotion />
        <Container className="relative z-10 pb-12 pt-0 sm:pb-16 sm:pt-12 lg:py-32">
          <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl">
            <p className="label-editorial-light max-lg:text-[0.6875rem] max-lg:leading-relaxed max-lg:tracking-[0.1em] max-lg:text-white/75">
              {brand.heroEyebrow}
            </p>
            <h1
              className={`${ttForsDisplay.className} brand-phrase mt-3 text-[2rem] leading-[1.08] sm:mt-5 sm:text-[2.5rem] sm:leading-[1.06] lg:text-[3.5rem] xl:text-[4rem]`}
            >
              {brand.claim}
            </h1>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-white/72 sm:mt-5 sm:text-base lg:text-lg">
              {brand.promise}
            </p>
          </div>
          <div className="mobile-actions mt-5 sm:mt-10">
            <Button href="/contacto">{brand.cta}</Button>
            <Button href="/diagnostico" variant="light">
              Calcular eficiencias
            </Button>
          </div>
          <HeroStatsGrid variant="hero" />
        </Container>
      </section>

      {/* Stats en banda sólida — móvil (sin gráfico detrás) */}
      <section className="border-t border-white/8 bg-[#2a2433] py-8 lg:hidden">
        <Container>
          <p className="label-editorial-light mb-4 !text-[0.625rem] !tracking-[0.18em]">
            Impacto medible
          </p>
          <HeroStatsGrid variant="band" />
        </Container>
      </section>

      {/* Frase fuerte */}
      <section className="section-pad bg-xinergy-charcoal text-white">
        <Container>
          <blockquote className="max-w-3xl border-l-2 border-dotted border-xinergy-orange pl-4 sm:pl-8">
            <p
              className={`${ttForsDisplay.className} brand-phrase text-lg leading-snug break-words sm:text-3xl lg:text-[2.125rem] lg:leading-snug`}
            >
              <span className="font-bold">{brand.strongPhrase.lead}</span>
              <br />
              <span className="text-xinergy-orange">{brand.strongPhrase.highlight}</span>
              <br />
              <span className="font-normal text-white/90">{brand.strongPhrase.body}</span>
            </p>
          </blockquote>
        </Container>
      </section>

      {/* Casos — prueba social */}
      <section className="section-pad bg-xinergy-ivory">
        <Container>
          <p className="label-editorial">{home.cases.label}</p>
          <h2 className="font-display mt-3 max-w-lg text-3xl text-xinergy-charcoal lg:text-4xl">
            {home.cases.title}
          </h2>
          <p
            className={`${ttForsDisplay.className} brand-phrase mt-2 text-lg text-xinergy-orange sm:text-xl`}
          >
            {home.cases.subtitle}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-xinergy-slate sm:text-base">
            {home.cases.intro}
          </p>
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
          <div className="max-w-2xl">
            <p className="label-editorial">{home.capabilities.title}</p>
            <h2 className="font-display mt-3 text-3xl text-xinergy-charcoal lg:text-4xl">
              {home.capabilities.headline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-xinergy-slate">
              {home.capabilities.intro}
            </p>
          </div>
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
      <section className="section-pad bg-xinergy-charcoal text-white">
        <Container>
          <p className="label-editorial-light">{home.framework.title}</p>
          <p className="mt-2 max-w-xl text-sm text-white/60">{home.framework.intro}</p>
          <MessagingFramework className="mt-10" variant="dark" />
        </Container>
      </section>

      {/* Diagnóstico */}
      <section className="section-pad-lg border-t border-xinergy-charcoal/8 bg-white text-xinergy-charcoal">
        <Container className="max-w-2xl text-center lg:mx-auto">
          <p className="label-editorial">Diagnóstico gratuito</p>
          <h2 className="font-display mt-4 text-3xl lg:text-4xl">
            ¿Cuánta eficiencia puede liberar su empresa?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-xinergy-slate lg:text-base">
            En unos minutos, con datos básicos de su gasto y operación.
          </p>
          <div className="mt-8">
            <Button href="/diagnostico">Calcular eficiencias</Button>
          </div>
        </Container>
      </section>

      {/* CTA — gráfico difuminado + cierre crema */}
      <section className="overflow-hidden">
        <div className="hero-chart-band relative h-44 text-white sm:h-52 lg:h-80">
          <HeroMotion variant="band" />
          <HeroChartCaption />
        </div>
        <div className="bg-xinergy-cream section-pad-lg text-xinergy-charcoal">
          <Container className="text-center">
            <h2 className="font-display mx-auto max-w-xl text-2xl sm:text-3xl lg:text-5xl">
              {home.cta.title}
            </h2>
            <p
              className={`${ttForsDisplay.className} brand-phrase mx-auto mt-4 text-lg text-xinergy-orange sm:mt-5 sm:text-xl lg:text-2xl`}
            >
              {brand.claim}
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm text-xinergy-slate sm:mt-5">
              {home.cta.intro}
            </p>
            <div className="mobile-actions mt-8 justify-center sm:mt-10">
              <Button href="/contacto">{brand.cta}</Button>
              <Button href="/diagnostico" variant="secondary">
                Calcular eficiencias
              </Button>
            </div>
          </Container>
        </div>
      </section>
    </>
  );
}
