import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { CTABand } from "@/components/shared/CTABand";
import { CaseStudiesGrid } from "@/components/shared/CaseStudiesGrid";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Casos de éxito",
  description: "Eficiencias y resultados verificables para empresas líderes en LATAM.",
};

export default function CasosPage() {
  return (
    <>
      <PageHero
        dark
        eyebrow="Casos"
        title="Resultados que hablan"
        description="Desafío, enfoque y resultados — sin presentaciones vacías. Pídanos más detalle sobre cualquier caso."
      />
      <section className="section-pad bg-xinergy-ivory">
        <Container>
          <CaseStudiesGrid />
        </Container>
      </section>
      <CTABand />
    </>
  );
}
