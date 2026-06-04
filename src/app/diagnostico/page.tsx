import type { Metadata } from "next";
import Link from "next/link";
import { EfficiencyCalculator } from "@/components/calculator/EfficiencyCalculator";
import { HeroMotion } from "@/components/shared/HeroMotion";
import { Container } from "@/components/ui/Container";
import { brand } from "@/lib/content";
import { contactHref } from "@/lib/contact-context";
import { ttForsDisplay } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Diagnóstico de eficiencia",
  description:
    "Fitness for business — calcula tu oportunidad de eficiencia. Sin costo. Modelo cash neutral.",
};

export default function DiagnosticoPage() {
  return (
    <>
      <section className="gradient-hero relative -mt-[4.25rem] min-h-[22rem] overflow-hidden pt-[4.25rem] text-white">
        <HeroMotion />
        <Container className="relative z-10 py-20 lg:py-28">
          <p className="label-editorial-light">Diagnóstico gratuito</p>
          <p className={`${ttForsDisplay.className} mt-4 text-lg text-xinergy-orange`}>
            {brand.claim}
          </p>
          <h1
            className={`${ttForsDisplay.className} mt-4 max-w-3xl text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.25rem]`}
          >
            ¿Cuánta eficiencia puede liberar su empresa?
          </h1>
          <p className={`${ttForsDisplay.className} mt-3 text-lg text-white/80`}>
            {brand.tagline}
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 lg:text-lg">
            Estimación en 2 minutos según industria, gasto con proveedores y madurez del
            área. Sin compromiso.
          </p>
        </Container>
      </section>

      <section className="relative -mt-8 pb-20 lg:-mt-12 lg:pb-28">
        <Container>
          <EfficiencyCalculator />
        </Container>
      </section>

      <section className="border-t border-xinergy-charcoal/8 bg-white section-pad">
        <Container>
          <div className="grid gap-16 lg:grid-cols-3">
            <article className="lg:col-span-1">
              <p className="label-editorial">Cash neutral</p>
              <h2 className="font-display mt-4 text-2xl text-xinergy-charcoal">
                Cómo funciona en la práctica
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-xinergy-slate">
                Xinergy no factura por horas. El fee se vincula a ahorros que finanzas
                valida en el P&L. El flujo de savings del programa cubre el costo del
                servicio — típicamente en pocos meses.
              </p>
            </article>
            <div className="grid gap-8 sm:grid-cols-2 lg:col-span-2">
              {[
                {
                  title: "Mes 0 — Sin costo",
                  body: "Diagnóstico y opportunity assessment con su equipo. Ustedes no desembolsan honorarios por adelantado.",
                },
                {
                  title: "Mes 1–3 — Quick wins",
                  body: "Primeras negociaciones y categorías de impacto. Los ahorros empiezan a materializarse.",
                },
                {
                  title: "Mes 3+ — Cash neutral",
                  body: "El acumulado de savings supera el fee variable. Desde ahí, el programa se autofinancia.",
                },
                {
                  title: "Después — Valor neto",
                  body: "Savings recurrentes en contratos y procesos. Su área queda más madura y digitalizada.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border-l-2 border-xinergy-orange pl-5"
                >
                  <h3 className="text-sm font-semibold text-xinergy-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-xinergy-slate">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-12 text-center text-sm text-xinergy-slate">
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
