import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { CTABand } from "@/components/shared/CTABand";
import { InsightsPaginatedList } from "@/components/shared/InsightsPaginatedList";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Insights",
  description: "Investigación, alianzas y perspectivas sobre eficiencia y abastecimiento en LATAM.",
};

export default function InsightsPage() {
  return (
    <>
      <PageHero
        dark
        eyebrow="Insights"
        title="Perspectivas que abren puertas"
        description="Informes, alianzas y análisis que posicionan a Xinergy como referente regional — no como un blog más."
      />
      <section className="section-pad bg-xinergy-ivory">
        <Container>
          <InsightsPaginatedList />
        </Container>
      </section>
      <CTABand />
    </>
  );
}
