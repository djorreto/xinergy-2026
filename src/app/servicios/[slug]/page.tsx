import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/PageHero";
import { CTABand } from "@/components/shared/CTABand";
import { Container } from "@/components/ui/Container";
import { services } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Servicio" };
  return { title: service.title, description: service.intro };
}

export default async function ServicioPage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

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
              <h2 className="text-xl font-bold text-xinergy-charcoal">Outcomes</h2>
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
              <h2 className="text-xl font-bold text-xinergy-charcoal">Cómo lo hacemos</h2>
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
