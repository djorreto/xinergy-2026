import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { CTABand } from "@/components/shared/CTABand";
import { Container } from "@/components/ui/Container";
import { insights } from "@/lib/content";
import { contactHref } from "@/lib/contact-context";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = insights.find((i) => i.slug === slug);
  if (!item) return { title: "Insight" };
  return { title: item.title, description: item.excerpt };
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  const item = insights.find((i) => i.slug === slug);
  if (!item) notFound();

  const externalUrl = "externalUrl" in item ? item.externalUrl : undefined;

  return (
    <>
      <PageHero
        eyebrow={`${item.type} · ${item.date}`}
        title={item.title}
        description={item.excerpt}
      />
      <section className="py-16">
        <Container className="max-w-3xl">
          <div className="space-y-5">
            {item.body.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-xinergy-slate">
                {paragraph}
              </p>
            ))}
          </div>
          {externalUrl ? (
            <p className="mt-8 text-sm text-xinergy-slate">
              Publicado originalmente en{" "}
              <a
                href={externalUrl}
                className="font-semibold text-xinergy-orange hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                xinergy.cl
              </a>
              .
            </p>
          ) : null}
          <p className="mt-6">
            <span className="inline-block rounded-full bg-xinergy-cream px-3 py-1 text-xs text-xinergy-slate">
              {item.tag}
            </span>
          </p>
          <p className="mt-10 border-t border-xinergy-charcoal/10 pt-8 text-sm text-xinergy-slate">
            ¿Quieres profundizar en eficiencias, ESG o tecnología para tu operación?{" "}
            <Link href={contactHref("insights")} className="font-semibold text-xinergy-orange hover:underline">
              Contáctenos
            </Link>
            .
          </p>
        </Container>
      </section>
      <CTABand />
    </>
  );
}
