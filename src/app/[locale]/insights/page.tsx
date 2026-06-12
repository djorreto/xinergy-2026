import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { CTABand } from "@/components/shared/CTABand";
import { InsightsPaginatedList } from "@/components/shared/InsightsPaginatedList";
import { Container } from "@/components/ui/Container";
import { getContent } from "@/lib/content";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { insightsPage } = getContent(locale);
  return {
    title: insightsPage.metaTitle,
    description: insightsPage.metaDescription,
  };
}

export default async function InsightsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { insightsPage } = getContent(locale);

  return (
    <>
      <PageHero
        dark
        eyebrow={insightsPage.eyebrow}
        title={insightsPage.title}
        description={insightsPage.description}
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
