import { Container } from "@/components/ui/Container";
import type {
  SsAssessmentPhase,
  SsCaptureTrack,
  SsMethodologyStep,
  SsModelStep,
  SsPillar,
  SsToolCategory,
} from "@/lib/content/ss";

const laneTone = {
  demand: "border-xinergy-orange/30 bg-xinergy-orange/5 text-xinergy-orange",
  offer: "border-xinergy-charcoal/15 bg-xinergy-cream text-xinergy-charcoal",
  savings: "border-xinergy-charcoal/20 bg-white text-xinergy-charcoal",
} as const;

type StrategicSourcingSectionsProps = {
  assessment: {
    eyebrow: string;
    title: string;
    intro: string;
    phases: readonly SsAssessmentPhase[];
  };
  model: {
    title: string;
    intro: string;
    laneLabels: { demand: string; offer: string; savings: string };
    steps: readonly SsModelStep[];
    benefits: readonly string[];
  };
  capture: {
    title: string;
    intro: string;
    tracks: readonly SsCaptureTrack[];
  };
  methodology: {
    title: string;
    intro: string;
    steps: readonly SsMethodologyStep[];
  };
  successPillars: {
    title: string;
    pillars: readonly SsPillar[];
  };
  tools: {
    title: string;
    intro: string;
    categories: readonly SsToolCategory[];
  };
};

export function StrategicSourcingSections({
  assessment,
  model,
  capture,
  methodology,
  successPillars,
  tools,
}: StrategicSourcingSectionsProps) {
  return (
    <>
      <section className="border-t border-xinergy-charcoal/8 bg-xinergy-ivory py-16 sm:py-20">
        <Container>
          <p className="label-editorial">{assessment.eyebrow}</p>
          <h2 className="mt-3 max-w-2xl font-display text-[length:var(--type-section)] text-xinergy-charcoal">
            {assessment.title}
          </h2>
          <p className="type-body mt-4 max-w-3xl text-xinergy-slate">{assessment.intro}</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {assessment.phases.map((phase) => (
              <article
                key={phase.title}
                className="rounded-2xl border border-xinergy-charcoal/10 bg-white p-6 sm:p-7"
              >
                <h3 className="text-lg font-bold text-xinergy-charcoal">{phase.title}</h3>
                <ul className="mt-4 space-y-2">
                  {phase.bullets.map((b) => (
                    <li key={b} className="type-body-sm flex gap-2 text-xinergy-slate">
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
            <h2 className="text-2xl font-bold text-xinergy-charcoal sm:text-3xl">{model.title}</h2>
            <p className="type-body mt-3 text-xinergy-slate">{model.intro}</p>
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {(["demand", "offer", "savings"] as const).map((lane) => (
              <span
                key={lane}
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${laneTone[lane]}`}
              >
                {model.laneLabels[lane]}
              </span>
            ))}
          </div>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {model.steps.map((step) => (
              <li
                key={step.num}
                className={`rounded-xl border p-4 ${laneTone[step.lane]}`}
              >
                <span className="text-xs font-bold opacity-70">{step.num}</span>
                <p className="mt-1 text-sm font-semibold leading-snug">{step.title}</p>
              </li>
            ))}
          </ol>
          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {model.benefits.map((b) => (
              <li
                key={b}
                className="type-body-sm rounded-xl border border-xinergy-charcoal/10 bg-xinergy-cream/60 p-4 text-xinergy-slate"
              >
                {b}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-xinergy-charcoal py-16 text-white sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold sm:text-3xl">{capture.title}</h2>
          <p className="type-body mt-3 max-w-3xl text-white/75">{capture.intro}</p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {capture.tracks.map((track) => (
              <article
                key={track.id}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-xinergy-orange">
                  {track.tagline}
                </p>
                <h3 className="mt-2 text-xl font-bold">{track.name}</h3>
                <p className="mt-2 text-sm text-white/70">{track.focus}</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {track.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-white/75">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-xinergy-orange" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-4 text-xs font-semibold uppercase tracking-wide text-white/60">
                  <span>{track.duration}</span>
                  <span className="text-xinergy-orange">{track.savings}</span>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-xinergy-charcoal sm:text-3xl">
              {methodology.title}
            </h2>
            <p className="type-body mt-3 text-xinergy-slate">{methodology.intro}</p>
          </div>
          <ol className="mt-12 space-y-6">
            {methodology.steps.map((step) => (
              <li
                key={step.num}
                className="grid gap-4 border-b border-xinergy-charcoal/10 pb-6 last:border-0 lg:grid-cols-[3rem_1fr]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-xinergy-orange text-sm font-bold text-xinergy-charcoal">
                  {step.num}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-xinergy-charcoal">{step.title}</h3>
                  <p className="type-body-sm mt-2 text-xinergy-slate">{step.description}</p>
                  {step.deliverables.length > 0 ? (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {step.deliverables.map((d) => (
                        <li
                          key={d}
                          className="rounded bg-xinergy-cream px-2.5 py-1 text-xs font-medium text-xinergy-charcoal"
                        >
                          {d}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-y border-xinergy-charcoal/8 bg-xinergy-ivory py-16 sm:py-20">
        <Container>
          <h2 className="max-w-xl text-2xl font-bold text-xinergy-charcoal sm:text-3xl">
            {successPillars.title}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {successPillars.pillars.map((p) => (
              <article
                key={p.title}
                className="rounded-2xl border border-xinergy-charcoal/10 bg-white p-6"
              >
                <h3 className="text-base font-bold text-xinergy-orange">{p.title}</h3>
                <p className="type-body-sm mt-3 text-xinergy-slate">{p.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-xinergy-charcoal sm:text-3xl">{tools.title}</h2>
            <p className="type-body mt-3 text-xinergy-slate">{tools.intro}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {tools.categories.map((cat) => (
              <article
                key={cat.title}
                className="border border-xinergy-charcoal/10 bg-white p-6"
              >
                <h3 className="text-lg font-bold text-xinergy-charcoal">{cat.title}</h3>
                <ul className="mt-4 space-y-2">
                  {cat.bullets.map((b) => (
                    <li key={b} className="type-body-sm flex gap-2 text-xinergy-slate">
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
    </>
  );
}
