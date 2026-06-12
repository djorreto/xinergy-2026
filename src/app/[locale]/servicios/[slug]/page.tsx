import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { CTABand } from "@/components/shared/CTABand";
import { Container } from "@/components/ui/Container";
import { getContent } from "@/lib/content";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const { services } = getContent(routing.defaultLocale);
  return routing.locales.flatMap((locale) =>
    services.map((s) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const { services } = getContent(locale);
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Servicio" };
  return { title: service.title, description: service.intro };
}

export default async function ServicioPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const { services } = getContent(locale);
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();
  const t = await getTranslations("ui.services");

  return (
    <>
      <PageHero
        dark
        eyebrow={service.pillar}
        title={service.headline}
        description={service.intro}
      />
      <section className="py-20">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-xinergy-charcoal">{t("outcomes")}</h2>
              <ul className="mt-4 space-y-3">
                {service.outcomes.map((o) => (
                  <li key={o} className="flex gap-3 text-sm text-xinergy-slate">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-xinergy-orange" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-xinergy-charcoal">{t("howWeDoIt")}</h2>
              <ol className="mt-4 space-y-4">
                {service.approach.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-xinergy-orange text-sm font-bold text-xinergy-charcoal">
                      {i + 1}
                    </span>
                    <span className="text-sm text-xinergy-slate pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>
      <CTABand />
    </>
  );
}
