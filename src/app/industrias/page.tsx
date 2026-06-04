import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { CTABand } from "@/components/shared/CTABand";
import { Container } from "@/components/ui/Container";
import { industries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Industrias",
  description: "Eficiencias por industria en Latinoamérica — retail, seguros, automotriz, energía y más.",
};

export default function IndustriasPage() {
  return (
    <>
      <PageHero
        dark
        eyebrow="Industrias"
        title="Cada industria tiene sus propias palancas de eficiencia"
        description="Hablamos el idioma de su sector — con casos, métricas y equipos que conocen sus categorías críticas."
      />
      <section className="py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            {industries.map((ind) => (
              <Link
                key={ind.slug}
                href={`/industrias/${ind.slug}`}
                className="card-hover rounded-2xl border border-xinergy-charcoal/10 bg-white p-8 shadow-sm"
              >
                <h2 className="text-xl font-bold text-xinergy-charcoal">{ind.title}</h2>
                <p className="mt-3 text-sm text-xinergy-slate">{ind.headline}</p>
                <p className="mt-4 text-xs font-semibold text-xinergy-orange">
                  {ind.metric}
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-xinergy-orange">
                  Explorar →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
      <CTABand />
    </>
  );
}
