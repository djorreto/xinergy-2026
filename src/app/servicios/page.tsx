import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { CTABand } from "@/components/shared/CTABand";
import { Container } from "@/components/ui/Container";
import { pillars, services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Seis líneas de ejecución: eficiencias, transformación, sourcing, BPO, digitalización e implementación con VRO.",
};

export default function ServiciosPage() {
  return (
    <>
      <PageHero
        dark
        eyebrow="Servicios"
        title="Ejecutamos eficiencias"
        description="Seis líneas de ejecución. Impacto medible en P&L, EBITDA y caja."
      />
      <section className="py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl border border-xinergy-charcoal/10 p-8"
              >
                <span className="text-xs font-bold uppercase text-xinergy-orange">
                  {p.title}
                </span>
                <h2 className="mt-2 text-xl font-bold">{p.subtitle}</h2>
                <p className="mt-3 text-sm text-xinergy-slate">{p.description}</p>
                <Link href={p.href} className="mt-4 inline-block text-sm font-semibold text-xinergy-orange hover:underline">
                  Ver servicio principal →
                </Link>
              </article>
            ))}
          </div>
          <h2 className="mt-20 text-2xl font-bold text-xinergy-charcoal">
            Todas las líneas de servicio
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/servicios/${s.slug}`}
                  className="card-hover block rounded-xl border border-xinergy-charcoal/10 bg-xinergy-cream p-5"
                >
                  <span className="text-xs text-xinergy-beige">{s.pillar}</span>
                  <p className="mt-1 font-semibold text-xinergy-charcoal">{s.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CTABand />
    </>
  );
}
