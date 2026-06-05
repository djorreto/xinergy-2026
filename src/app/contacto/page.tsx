import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/ui/Container";
import { brand, presenceLabel, officesLabel } from "@/lib/content";
import { getContactContext } from "@/lib/contact-context";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Agenda una conversación estratégica con Xinergy.",
};

type Props = {
  searchParams: Promise<{ from?: string }>;
};

export default async function ContactoPage({ searchParams }: Props) {
  const { from } = await searchParams;
  const context = getContactContext(from);

  return (
    <>
      <PageHero
        dark
        eyebrow={context.eyebrow}
        title={context.title}
        description={context.description}
      />
      <section className="py-12 sm:py-20">
        <Container>
          <div className="grid gap-10 sm:gap-16 lg:grid-cols-2">
            <div className="order-2 overflow-hidden rounded-2xl border border-xinergy-charcoal/10 bg-white shadow-lg shadow-xinergy-charcoal/10 lg:order-1">
              <iframe
                src={brand.mondayFormUrl}
                title="Formulario de contacto Xinergy"
                width="650"
                height="500"
                className="h-[22rem] w-full max-w-full border-0 sm:h-[28rem] lg:h-[500px]"
                loading="lazy"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-xl font-bold text-xinergy-charcoal">Oficina</h2>
              <p className="mt-4 text-sm text-xinergy-slate">{brand.address}</p>
              <a
                href={`mailto:${brand.email}`}
                className="mt-4 inline-block text-lg font-semibold text-xinergy-orange hover:underline"
              >
                {brand.email}
              </a>
              <div className="mt-12 rounded-2xl bg-xinergy-charcoal p-8 text-white">
                <p className="text-xs font-semibold uppercase tracking-widest text-xinergy-orange">
                  Modelo comercial
                </p>
                <p className="mt-4 text-sm text-white/75">
                  Compartimos riesgos con un modelo único.{" "}
                  <span className="font-semibold text-white">Cash neutral</span>
                  : el ahorro financia el proyecto.
                </p>
              </div>
              <p className="mt-8 text-sm text-xinergy-slate">
                Presencia: {presenceLabel}
                <br />
                Oficinas: {officesLabel}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
