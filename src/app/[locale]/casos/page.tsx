import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { CTABand } from "@/components/shared/CTABand";
import { CaseStudiesGrid } from "@/components/shared/CaseStudiesGrid";
import { Container } from "@/components/ui/Container";
import { getContent } from "@/lib/content";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { casesPage } = getContent(locale);
  return {
    title: casesPage.metaTitle,
    description: casesPage.metaDescription,
  };
}

export default async function CasosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { casesPage } = getContent(locale);

  return (
    <>
      <PageHero
        dark
        eyebrow={casesPage.eyebrow}
        title={casesPage.title}
        description={casesPage.description}
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
