"use client";

import { AllocationCard } from "@/components/survey/AllocationCard";
import type { AllocationBlockId } from "@/lib/surveys/radar-c/ahp-allocation";
import {
  AHP_BLOCKS,
  AHP_INSIDE_SECTION_TITLES,
  AHP_SCALE_C,
  choiceFromToken,
  describeChoice,
  pairMeta,
  sideDetail,
  type AhpIntensityStored,
} from "@/lib/surveys/radar-c/ahp-blocks";
import { ui, type Lang } from "@/lib/surveys/radar-c/instrument";

export function AhpBlocks({
  lang,
  selected,
  invalid,
  block,
  review,
  allocationBlock,
  allocationIndex,
  allocationTotal,
  onChange,
  onConfirmAllocation,
  allocationInitial,
  onEditAllocation,
}: {
  lang: Lang;
  selected: Record<string, string>;
  invalid: Record<string, string>;
  block: number;
  review: boolean;
  allocationBlock?: AllocationBlockId;
  allocationIndex: number;
  allocationTotal: number;
  onChange: (value: Record<string, string>) => void;
  onConfirmAllocation: (points: Record<string, number>) => void;
  allocationInitial?: Record<string, number> | null;
  onEditAllocation?: () => void;
}) {
  const copy = ui[lang];
  const source = AHP_BLOCKS[block];

  if (review) {
    return allocationBlock ? (
      <AllocationCard key={allocationBlock} lang={lang} blockId={allocationBlock} index={allocationIndex} total={allocationTotal} initial={allocationInitial} onConfirm={onConfirmAllocation} />
    ) : null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-xinergy-beige">{copy.blockOf(block + 1, AHP_BLOCKS.length)}</p>
        <h2 className="mt-2 font-display text-2xl text-xinergy-charcoal">{copy.blockTitles[block]}</h2>
        <p className="mt-3 max-w-2xl text-sm text-xinergy-slate">{block === 0 && copy.ahpIntro ? copy.ahpIntro : copy.ahpNote}</p>
        {block === 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {copy.macroDefs.map(([title, body]) => (
              <div key={title} className="border-t-2 border-xinergy-orange pt-2">
                <p className="font-semibold text-xinergy-charcoal">{title}</p>
                <p className="mt-1 text-sm text-xinergy-slate">{body}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {source ? (
        <section id={`ahp-block-${source.id}`}>
          {source.id === "inside" && source.sections ? (
            <div className="mt-4 flex flex-col gap-8">
              {source.sections.map((section) => (
                <div key={section.id}>
                  <h3 className="font-display text-lg text-xinergy-charcoal">{AHP_INSIDE_SECTION_TITLES[section.id][lang]}</h3>
                  <div className="mt-4 flex flex-col gap-4">
                    {section.pairIds.map((id) => (
                      <PairCard key={id} id={id} lang={lang} token={selected[id]} invalid={Boolean(invalid[id])} onChange={(token) => onChange(token ? { ...selected, [id]: token } : omit(selected, id))} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              {source.pairIds.map((id) => (
                <PairCard key={id} id={id} lang={lang} token={selected[id]} invalid={Boolean(invalid[id])} onChange={(token) => onChange(token ? { ...selected, [id]: token } : omit(selected, id))} />
              ))}
            </div>
          )}
          {onEditAllocation && block === AHP_BLOCKS.length - 1 ? (
            <button type="button" className="mt-4 text-sm font-semibold text-xinergy-charcoal underline decoration-xinergy-orange" onClick={onEditAllocation}>
              {lang === "en" ? "Edit the point distribution" : lang === "pt" ? "Editar a distribuição de pontos" : "Editar la distribución de puntos"}
            </button>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function PairCard({ id, lang, token, invalid, onChange }: { id: string; lang: Lang; token?: string; invalid: boolean; onChange: (token: string | null) => void }) {
  const copy = ui[lang];
  const meta = pairMeta(id);
  const left = sideDetail(meta?.a ?? "", lang);
  const right = sideDetail(meta?.b ?? "", lang);
  const grouped = left.items.length > 0 || right.items.length > 0;
  const saved = choiceFromToken(token);
  const question = grouped ? copy.whichGroup : copy.which;

  return (
    <fieldset id={`q-${id}`} className={`border p-3 sm:p-4 ${invalid ? "border-red-700" : "border-xinergy-charcoal/15"}`}>
      <legend className="px-1 font-semibold text-xinergy-charcoal">{question}</legend>
      <div className="mt-3 grid grid-cols-2 items-stretch gap-2 sm:gap-3">
        <SidePanel align="start" name={left.name} items={left.items} contains={copy.contains} wash={washOf("a", saved.side, saved.intensity)} />
        <SidePanel align="end" name={right.name} items={right.items} contains={copy.contains} wash={washOf("b", saved.side, saved.intensity)} />
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1" role="radiogroup" aria-label={question}>
        {AHP_SCALE_C.map((point) => {
          const on = token === point.token;
          return (
            <button
              key={point.token}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={`${point.n}. ${point[lang]}`}
              className={`min-h-11 min-w-0 border px-0.5 py-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-xinergy-orange ${on ? "border-xinergy-orange bg-[#FFF1D6] font-semibold" : "border-xinergy-charcoal/15"}`}
              onClick={() => onChange(point.token)}
            >
              <span className="block text-sm sm:text-base">{point.n}</span>
              <span className="mt-1 block text-[10px] font-normal leading-tight text-xinergy-slate sm:text-[11px]">{point[lang]}</span>
            </button>
          );
        })}
      </div>
      {token ? <p className="mt-3 text-sm text-xinergy-slate">{describeChoice(id, token, lang)}</p> : null}
    </fieldset>
  );
}

const MORE: Partial<Record<AhpIntensityStored, string>> = { 3: "#A0B8A3", 5: "#8FBA99", 7: "#7FBC8F", 9: "#6FBE86" };
const LESS: Partial<Record<AhpIntensityStored, string>> = { 3: "#C4A99D", 5: "#CEA18F", 7: "#D79981", 9: "#E09174" };

function washOf(place: "a" | "b", side: ReturnType<typeof choiceFromToken>["side"], intensity: AhpIntensityStored | null) {
  if (side === "equal") return { background: "#B7B5B0", light: false };
  if ((side !== "a" && side !== "b") || !intensity) return undefined;
  const more = MORE[intensity];
  const less = LESS[intensity];
  if (!more || !less) return undefined;
  return { background: side === place ? more : less, light: false };
}

const IDLE_WASH = { start: "#F3F6F4", end: "#F7F2EE" };

function SidePanel({ align, name, items, contains, wash }: { align: "start" | "end"; name: string; items: string[]; contains: string; wash?: { background: string; light: boolean } }) {
  const title = wash?.light ? "text-[#faf9f7]" : "text-xinergy-charcoal";
  const detail = wash?.light ? "text-[#faf9f7]" : "text-xinergy-charcoal";
  return (
    <div className={`px-2 py-3 text-xs sm:px-3 sm:text-sm ${align === "end" ? "text-right" : "text-left"}`} style={{ backgroundColor: wash?.background ?? IDLE_WASH[align] }}>
      <p className={`font-semibold ${title}`}>{name}</p>
      {items.length ? (
        <div className={`mt-2 text-[11px] font-normal leading-snug ${detail}`}>
          <p>{contains}</p>
          <ul className="mt-1">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function omit(selected: Record<string, string>, id: string) {
  const next = { ...selected };
  delete next[id];
  return next;
}