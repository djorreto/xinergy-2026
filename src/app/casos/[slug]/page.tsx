import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/PageHero";
import { CTABand } from "@/components/shared/CTABand";
import { Container } from "@/components/ui/Container";
import { cases } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = cases.find((x) => x.slug === slug);
  if (!c) return { title: "Caso" };
  return { title: c.title, description: c.challenge };
}

export default async function CasoPage({ params }: Props) {
  const { slug } = await params;
  const c = cases.find((x) => x.slug === slug);
  if (!c) notFound();

  const sections = [
    { label: "Desafío", body: c.challenge },
    { label: "Enfoque", body: c.approach },
  ];

  return (
    <>
      <PageHero
        dark
        eyebrow={`${c.industry} · ${c.service}`}
        title={c.title}
        description={c.highlightLabel}
      />
      <section className="py-20">
        <Container className="max-w-3xl">
          {sections.map((s) => (
            <article key={s.label} className="mb-12">
              <h2 className="text-xs font-bold uppercase tracking-widest text-xinergy-orange">
                {s.label}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-xinergy-slate">{s.body}</p>
            </article>
          ))}
          <article>
            <h2 className="text-xs font-bold uppercase tracking-widest text-xinergy-orange">
              Resultados
            </h2>
            <ul className="mt-4 space-y-3">
              {c.results.map((r) => (
                <li key={r} className="flex gap-3 text-lg text-xinergy-charcoal">
                  <span className="text-xinergy-orange">✓</span>
                  {r}
                </li>
              ))}
            </ul>
          </article>
          <div className="mt-12 rounded-2xl bg-xinergy-cream p-8 text-center">
            <p className="text-4xl font-bold text-xinergy-orange">{c.highlight}</p>
            <p className="mt-1 text-sm text-xinergy-slate">{c.highlightLabel}</p>
          </div>
        </Container>
      </section>
      <CTABand />
    </>
  );
}
