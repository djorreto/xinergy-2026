import type { Metadata } from "next";
import Link from "next/link";
import { EfficiencyCalculator } from "@/components/calculator/EfficiencyCalculator";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Container } from "@/components/ui/Container";
import { brand } from "@/lib/content";
import { contactHref } from "@/lib/contact-context";
import { ttForsDisplay } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Diagnóstico de eficiencia",
  description:
    "#Fitness for business — calcula cuántas eficiencias puedes conseguir. Sin costo. Modelo cash neutral.",
};

export default function DiagnosticoPage() {
  return (
    <>
      <section className="gradient-hero hero-below-header hero-mobile relative overflow-hidden text-white lg:hero-offset">
        <div className="hero-motion hero-motion--static" aria-hidden />
        <Container className="relative z-10 py-10 sm:py-16 lg:py-24">
          <p className="hero-mobile-eyebrow label-editorial-light max-lg:before:hidden">Diagnóstico gratuito</p>
          <p className={`${ttForsDisplay.className} hero-mobile-accent mt-3 text-sm sm:mt-4 sm:text-lg lg:mt-4 lg:text-lg`}>
            {brand.claim}
          </p>
          <h1
            className={`${ttForsDisplay.className} mt-2 max-w-3xl text-[2rem] leading-[1.08] max-lg:mt-3 max-lg:text-[2.25rem] max-lg:leading-[1.06] sm:mt-4 sm:text-4xl sm:leading-[1.1] lg:text-[3.25rem]`}
          >
            ¿Cuánta eficiencia puede liberar su empresa?
          </h1>
          <p className={`${ttForsDisplay.className} mt-2 hidden text-base text-white/80 sm:mt-3 sm:text-lg lg:block`}>
            {brand.tagline}
          </p>
          <p className="hero-mobile-body mt-4 max-w-xl text-[0.9375rem] sm:mt-6 sm:text-base lg:text-lg">
            Estimación en 2 minutos según industria, gasto con proveedores y madurez del
            área. Sin compromiso.
          </p>
        </Container>
      </section>

      <section className="relative z-20 -mt-6 pb-20 sm:-mt-8 lg:-mt-12 lg:pb-28">
        <Container>
          <EfficiencyCalculator />
        </Container>
      </section>

      <section className="border-t border-xinergy-charcoal/8 bg-white section-pad">
        <Container>
          <SectionHeader
            align="center"
            eyebrow="Cash neutral"
            title="Alineados a resultados, no a horas"
            intro="Sin costo para empezar. Si avanzamos, nuestros honorarios se vinculan a eficiencias reales e impacto verificable en el P&L — ganamos cuando ustedes capturan valor."
            titleClassName="text-2xl sm:text-3xl"
          />
          <p className="mt-10 text-center text-sm text-xinergy-slate">
            ¿Prefiere hablar con nosotros?{" "}
            <Link href={contactHref("diagnostico")} className="font-semibold text-xinergy-orange hover:underline">
              Agendar conversación estratégica →
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
