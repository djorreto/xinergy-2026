import { Container } from "@/components/ui/Container";
import type {
  BpoOperationModel,
  BpoPillar,
  BpoSpendSegment,
} from "@/lib/content/bpo";

type BpoSectionsProps = {
  vision: {
    eyebrow: string;
    title: string;
    intro: string;
    pillars: readonly BpoPillar[];
    valueEnablersTitle: string;
    valueEnablers: readonly string[];
    automationEnablersTitle: string;
    automationEnablers: readonly string[];
  };
  operatingModel: {
    title: string;
    intro: string;
    layers: readonly { title: string; items: readonly string[] }[];
    technologyNote: string;
  };
  spendSegments: {
    title: string;
    intro: string;
    segments: readonly BpoSpendSegment[];
  };
  operationModels: {
    title: string;
    intro: string;
    models: readonly BpoOperationModel[];
  };
  measurement: {
    title: string;
    intro: string;
    bullets: readonly string[];
  };
  platform: {
    title: string;
    intro: string;
    capabilities: readonly string[];
    flexibilityNote: string;
  };
};

export function BpoSections({
  vision,
  operatingModel,
  spendSegments,
  operationModels,
  measurement,
  platform,
}: BpoSectionsProps) {
  return (
    <>
      <section className="border-t border-xinergy-charcoal/8 bg-xinergy-ivory py-16 sm:py-20">
        <Container>
          <p className="label-editorial">{vision.eyebrow}</p>
          <h2 className="mt-3 max-w-2xl font-display text-[length:var(--type-section)] text-xinergy-charcoal">
            {vision.title}
          </h2>
          <p className="type-body mt-4 max-w-3xl text-xinergy-slate">{vision.intro}</p>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vision.pillars.map((pillar) => (
              <li
                key={pillar.num}
                className="rounded-2xl border border-xinergy-charcoal/10 bg-white p-6"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-xinergy-orange text-sm font-bold text-xinergy-charcoal">
                  {pillar.num}
                </span>
                <h3 className="mt-3 text-base font-bold text-xinergy-charcoal">{pillar.title}</h3>
                <p className="type-body-sm mt-2 text-xinergy-slate">{pillar.description}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-xinergy-charcoal/10 bg-white p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-xinergy-orange">
                {vision.valueEnablersTitle}
              </h3>
              <ul className="mt-4 space-y-2">
                {vision.valueEnablers.map((item) => (
                  <li key={item} className="type-body-sm flex gap-2 text-xinergy-slate">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-xinergy-orange" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border border-xinergy-charcoal/10 bg-white p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-xinergy-orange">
                {vision.automationEnablersTitle}
              </h3>
              <ul className="mt-4 space-y-2">
                {vision.automationEnablers.map((item) => (
                  <li key={item} className="type-body-sm flex gap-2 text-xinergy-slate">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-xinergy-orange" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-xinergy-charcoal sm:text-3xl">
              {operatingModel.title}
            </h2>
            <p className="type-body mt-3 text-xinergy-slate">{operatingModel.intro}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {operatingModel.layers.map((layer) => (
              <article
                key={layer.title}
                className="rounded-2xl border border-xinergy-charcoal/10 bg-xinergy-cream/40 p-6"
              >
                <h3 className="text-lg font-bold text-xinergy-charcoal">{layer.title}</h3>
                <ul className="mt-4 space-y-2">
                  {layer.items.map((item) => (
                    <li key={item} className="type-body-sm flex gap-2 text-xinergy-slate">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-xinergy-orange" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="type-body-sm mt-8 max-w-3xl rounded-xl border border-xinergy-orange/20 bg-xinergy-orange/5 p-5 text-xinergy-slate">
            {operatingModel.technologyNote}
          </p>
        </Container>
      </section>

      <section className="bg-xinergy-charcoal py-16 text-white sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold sm:text-3xl">{spendSegments.title}</h2>
          <p className="type-body mt-3 max-w-3xl text-white/75">{spendSegments.intro}</p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {spendSegments.segments.map((segment) => (
              <article
                key={segment.id}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-xl font-bold">{segment.name}</h3>
                <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-white/60">
                  <span>{segment.spendShare}</span>
                  <span className="text-xinergy-orange">{segment.txShare}</span>
                </div>
                <p className="mt-3 text-sm text-white/70">{segment.focus}</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {segment.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-white/75">
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

      <section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-xinergy-charcoal sm:text-3xl">
              {operationModels.title}
            </h2>
            <p className="type-body mt-3 text-xinergy-slate">{operationModels.intro}</p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {operationModels.models.map((model) => (
              <article
                key={model.id}
                className="rounded-2xl border border-xinergy-charcoal/10 bg-white p-6 sm:p-7"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-xinergy-orange">
                  {model.tagline}
                </p>
                <h3 className="mt-2 text-xl font-bold text-xinergy-charcoal">{model.name}</h3>
                <ul className="mt-4 space-y-2">
                  {model.bullets.map((b) => (
                    <li key={b} className="type-body-sm flex gap-2 text-xinergy-slate">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-xinergy-orange" />
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="type-body-sm mt-5 border-t border-xinergy-charcoal/10 pt-4 font-medium text-xinergy-charcoal">
                  {model.economics}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-xinergy-charcoal/8 bg-xinergy-ivory py-16 sm:py-20">
        <Container>
          <h2 className="max-w-xl text-2xl font-bold text-xinergy-charcoal sm:text-3xl">
            {measurement.title}
          </h2>
          <p className="type-body mt-3 max-w-3xl text-xinergy-slate">{measurement.intro}</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {measurement.bullets.map((b) => (
              <li
                key={b}
                className="type-body-sm rounded-xl border border-xinergy-charcoal/10 bg-white p-4 text-xinergy-slate"
              >
                {b}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-xinergy-charcoal sm:text-3xl">{platform.title}</h2>
            <p className="type-body mt-3 text-xinergy-slate">{platform.intro}</p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {platform.capabilities.map((cap) => (
              <li
                key={cap}
                className="type-body-sm flex gap-3 rounded-xl border border-xinergy-charcoal/10 bg-xinergy-cream/40 p-4 text-xinergy-slate"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-xinergy-orange" />
                {cap}
              </li>
            ))}
          </ul>
          <p className="type-body-sm mt-8 max-w-3xl text-xinergy-slate">{platform.flexibilityNote}</p>
        </Container>
      </section>
    </>
  );
}
