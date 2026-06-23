import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { partnerLogos } from "@/lib/partners";

import type { WcsPillar, WcsDifferentiator } from "@/lib/content/wcs";

export type { WcsPillar, WcsDifferentiator };

type WorkingCapitalSectionsProps = {
  pillarsTitle: string;
  pillarsIntro: string;
  pillars: readonly WcsPillar[];
  differentiatorsTitle: string;
  differentiators: readonly WcsDifferentiator[];
  partnersTitle: string;
  partnerNames: readonly string[];
};

export function WorkingCapitalSections({
  pillarsTitle,
  pillarsIntro,
  pillars,
  differentiatorsTitle,
  differentiators,
  partnersTitle,
  partnerNames,
}: WorkingCapitalSectionsProps) {
  const partnerLogosList = partnerNames
    .map((name) => partnerLogos.find((p) => p.name.toLowerCase() === name.toLowerCase()))
    .filter(Boolean);

  return (
    <>
      <section className="py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-xinergy-charcoal sm:text-3xl">{pillarsTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-xinergy-slate">{pillarsIntro}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {pillars.map((pillar) => (
              <article
                key={pillar.num}
                className="flex flex-col border border-xinergy-charcoal/10 bg-white p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-3xl font-bold text-xinergy-orange/30">{pillar.num}</span>
                  {pillar.partner ? (
                    <span className="rounded bg-xinergy-cream px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-xinergy-charcoal">
                      {pillar.partner}
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-2 text-lg font-bold text-xinergy-charcoal">{pillar.title}</h3>
                <ul className="mt-4 flex-1 space-y-2">
                  {pillar.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-xinergy-slate">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-xinergy-orange" />
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-xinergy-charcoal py-20 text-white">
        <Container>
          <h2 className="text-2xl font-bold sm:text-3xl">{differentiatorsTitle}</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((d) => (
              <div key={d.title}>
                <h3 className="text-base font-bold text-xinergy-orange">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{d.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-xinergy-slate">
            {partnersTitle}
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-10 sm:gap-14">
            {partnerLogosList.map(
              (p) =>
                p && (
                  <div
                    key={p.name}
                    className="flex shrink-0 items-center justify-center opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                  >
                    <Image
                      src={p.src}
                      alt={p.name}
                      width={p.imageWidth ?? 128}
                      height={p.imageHeight ?? 40}
                      unoptimized
                      className={
                        p.imageClassName ??
                        "h-9 w-auto max-w-[8rem] object-contain object-center sm:h-10"
                      }
                    />
                  </div>
                ),
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
