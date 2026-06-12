import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { CTABand } from "@/components/shared/CTABand";
import { Container } from "@/components/ui/Container";
import { getContent } from "@/lib/content";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { industriesPage } = getContent(locale);
  return {
    title: industriesPage.metaTitle,
    description: industriesPage.metaDescription,
  };
}

export default async function IndustriasPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { industries, industriesPage } = getContent(locale);

  return (
    <>
      <PageHero
        dark
        eyebrow={industriesPage.eyebrow}
        title={industriesPage.title}
        description={industriesPage.description}
        titleClassName="text-balance max-sm:text-[1.5rem] sm:text-3xl lg:text-5xl"
      />
      <section className="py-12 sm:py-20 lg:py-20">
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
                  {industriesPage.explore}
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
