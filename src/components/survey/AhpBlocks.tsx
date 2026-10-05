"use client";

import { ahpClass } from "@/lib/surveys/radar-b/engine";
import { AHP_SCALE } from "@/lib/surveys/radar-2027";
import {
  AHP_BLOCKS,
  blockCr,
  choiceFromToken,
  describeChoice,
  pairMeta,
  reviewBlockIds,
  sideDetail,
  triadExplanation,
  type AhpBlockId,
} from "@/lib/surveys/radar-c/ahp-blocks";
import { ui, type Lang } from "@/lib/surveys/radar-c/instrument";

export function AhpBlocks({
  lang,
  selected,
  invalid,
  block,
  review,
  reviewIndex,
  onChange,
}: {
  lang: Lang;
  selected: Record<string, string>;
  invalid: Record<string, string>;
  block: number;
  review: boolean;
  reviewIndex: number;
  onChange: (value: Record<string, string>) => void;
}) {
  const copy = ui[lang];
  const flagged = reviewBlockIds(selected);
  const shown = review ? flagged[Math.min(reviewIndex, Math.max(flagged.length - 1, 0))] : AHP_BLOCKS[block]?.id;
  const source = AHP_BLOCKS.find((item) => item.id === shown);
  const titleIndex = AHP_BLOCKS.findIndex((item) => item.id === shown);
  const maxCr = flagged.reduce((max, id) => Math.max(max, blockCr(selected, id) ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {review ? (
        <div>
          <h2 className="font-display text-2xl text-xinergy-charcoal">{copy.reviewTitle}</h2>
          <p className="mt-3 max-w-2xl text-xinergy-slate">{copy.reviewIntro}</p>
          {flagged.length > 1 ? <p className="mt-3 text-sm text-xinergy-beige">{copy.blockOf(reviewIndex + 1, flagged.length)}</p> : null}
        </div>
      ) : (
        <div>
          <p className="text-sm text-xinergy-beige">{copy.blockOf(block + 1, AHP_BLOCKS.length)}</p>
          <h2 className="mt-2 font-display text-2xl text-xinergy-charcoal">{copy.blockTitles[block]}</h2>
          {block === 0 ? (
            <>
              <p className="mt-3 max-w-2xl text-xinergy-slate">{copy.ahpIntro}</p>
              <p className="mt-3 max-w-2xl text-xinergy-slate">{copy.ahpExample}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {copy.macroDefs.map(([title, body]) => (
                  <div key={title} className="border-t-2 border-xinergy-orange pt-2">
                    <p className="font-semibold text-xinergy-charcoal">{title}</p>
                    <p className="mt-1 text-sm text-xinergy-slate">{body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 max-w-2xl text-sm text-xinergy-slate">{copy.ahpGroups}</p>
            </>
          ) : <p className="mt-3 max-w-2xl text-sm text-xinergy-slate">{copy.ahpInside}</p>}
        </div>
      )}
      {source ? (
        <section id={`ahp-block-${source.id}`} className={review ? "border-l-2 border-xinergy-orange pl-4" : ""}>
          {review ? <h3 className="font-display text-xl text-xinergy-charcoal">{copy.blockTitles[titleIndex]}</h3> : null}
          {review && source.pairIds.length === 3 ? <p className="mt-3 max-w-2xl text-xinergy-slate">{triadExplanation(source.id, selected, lang)}</p> : null}
          <div className="mt-4 flex flex-col gap-4">
            {source.pairIds.map((id) => (
              <PairCard key={id} id={id} lang={lang} token={selected[id]} invalid={Boolean(invalid[id])} onChange={(token) => onChange(token ? { ...selected, [id]: token } : omit(selected, id))} />
            ))}
          </div>
          {review ? (
            <button type="button" className="mt-4 text-sm font-semibold text-xinergy-charcoal underline decoration-xinergy-orange" onClick={() => document.getElementById(`q-${source.pairIds[0]}`)?.querySelector("button")?.focus()}>
              {copy.reviewEdit}
            </button>
          ) : null}
        </section>
      ) : null}
      {review && maxCr > 0.1 ? (
        <div className="max-w-2xl text-sm text-xinergy-slate">
          <p>{copy.reviewNote}</p>
          {ahpClass(maxCr) === "excluido" ? <p className="mt-2">{copy.reviewPortfolio}</p> : null}
        </div>
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
    <fieldset id={`q-${id}`} className={`border p-4 ${invalid ? "border-red-700" : "border-xinergy-charcoal/15"}`}>
      <legend className="px-1 font-semibold text-xinergy-charcoal">{question}</legend>
      <div className="mt-3 grid grid-cols-2 items-stretch gap-2">
        <SidePanel name={left.name} items={left.items} contains={copy.contains} pressed={saved.side === "a"} />
        <SidePanel name={right.name} items={right.items} contains={copy.contains} pressed={saved.side === "b"} align="right" />
      </div>
      <div className="mt-3 grid grid-cols-9 gap-1" role="radiogroup" aria-label={question}>
        {AHP_SCALE.map((point, index) => {
          const on = token === point.token;
          return (
            <button key={point.token} type="button" role="radio" aria-checked={on} aria-label={`${point.n}. ${point[lang]}`} className={`min-w-0 border px-0.5 py-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-xinergy-orange ${on ? "border-xinergy-orange bg-[#FFF1D6] font-semibold" : "border-xinergy-charcoal/15"}`} onClick={() => onChange(point.token)}>
              <span className="block text-sm sm:text-base">{point.n}</span>
              <span className="mt-1 hidden text-[10px] font-normal leading-tight text-xinergy-slate sm:block">{copy.scaleShort[index]}</span>
            </button>
          );
        })}
      </div>
      {token ? <p className="mt-3 text-sm text-xinergy-slate">{describeChoice(id, token, lang)}</p> : null}
    </fieldset>
  );
}

function SidePanel({ name, items, contains, pressed, align = "left" }: { name: string; items: string[]; contains: string; pressed: boolean; align?: "left" | "right" }) {
  return (
    <div className={`border px-3 py-3 text-sm ${align === "right" ? "text-right" : "text-left"} ${pressed ? "border-xinergy-orange bg-[#FFF1D6]" : "border-xinergy-charcoal/15"}`}>
      <p className="font-semibold text-xinergy-charcoal">{name}</p>
      {items.length ? (
        <div className="mt-2 text-[11px] font-normal leading-snug text-xinergy-slate">
          <p>{contains}</p>
          <ul className="mt-1">
            {items.map((item) => <li key={item}>{item}</li>)}
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
