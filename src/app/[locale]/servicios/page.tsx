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
  const { servicesPage } = getContent(locale);
  return {
    title: servicesPage.metaTitle,
    description: servicesPage.metaDescription,
  };
}

export default async function ServiciosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { pillars, services, servicesPage } = getContent(locale);

  return (
    <>
      <PageHero
        dark
        eyebrow={servicesPage.eyebrow}
        title={servicesPage.title}
        description={servicesPage.description}
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
                <p className="type-body mt-3 text-xinergy-slate">{p.description}</p>
                <Link href={p.href} className="type-body-sm mt-4 inline-block font-semibold text-xinergy-orange hover:underline">
                  {servicesPage.viewPrimary}
                </Link>
              </article>
            ))}
          </div>
          <h2 className="mt-20 text-2xl font-bold text-xinergy-charcoal">
            {servicesPage.allLinesTitle}
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
