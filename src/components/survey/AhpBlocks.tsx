"use client";

import { useState } from "react";
import { ahpClass } from "@/lib/surveys/radar-b/engine";
import {
  AHP_BLOCKS,
  blockCr,
  choiceFromToken,
  describeChoice,
  pairNames,
  reviewBlockIds,
  tokenFromChoice,
  triadExplanation,
  type AhpBlockId,
  type AhpIntensity,
  type AhpSide,
} from "@/lib/surveys/radar-c/ahp-blocks";
import { ui, type Lang } from "@/lib/surveys/radar-c/instrument";

const INTENSITIES: AhpIntensity[] = [3, 5, 7, 9];

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
  const names = pairNames(id, lang);
  const saved = choiceFromToken(token);
  const [pending, setPending] = useState<AhpSide | null>(null);
  const side = saved.side ?? (token ? null : pending);
  const intensity = saved.intensity;

  function chooseSide(next: AhpSide) {
    if (next === "equal") {
      setPending(null);
      onChange("1");
      return;
    }
    if (intensity) {
      setPending(null);
      onChange(tokenFromChoice(next, intensity));
      return;
    }
    setPending(next);
    if (token) onChange(null);
  }

  function chooseIntensity(value: AhpIntensity) {
    if (side !== "a" && side !== "b") return;
    setPending(null);
    onChange(tokenFromChoice(side, value));
  }

  return (
    <fieldset id={`q-${id}`} className={`border p-4 ${invalid ? "border-red-700" : "border-xinergy-charcoal/15"}`}>
      <legend className="px-1 font-semibold text-xinergy-charcoal">{copy.which}</legend>
      <div className="mt-3 grid gap-2" role="radiogroup" aria-label={copy.which}>
        {(["a", "equal", "b"] as const).map((option) => {
          const label = option === "a" ? names.a : option === "b" ? names.b : copy.equalChoice;
          const on = side === option;
          return (
            <button key={option} type="button" role="radio" aria-checked={on} className={`border px-3 py-3 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-xinergy-orange ${on ? "border-xinergy-orange bg-[#FFF1D6] font-semibold" : "border-xinergy-charcoal/15"}`} onClick={() => chooseSide(option)}>
              {label}
            </button>
          );
        })}
      </div>
      {side === "a" || side === "b" ? (
        <div className="mt-4">
          <p className="font-semibold text-xinergy-charcoal">{copy.intensityQ}</p>
          <p className="mt-1 text-sm text-xinergy-slate">{side === "a" ? names.a : names.b}</p>
          <div className="mt-2 grid gap-2" role="radiogroup" aria-label={copy.intensityQ}>
            {INTENSITIES.map((value, index) => {
              const on = intensity === value && saved.side === side;
              return (
                <button key={value} type="button" role="radio" aria-checked={on} className={`border px-3 py-3 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-xinergy-orange ${on ? "border-xinergy-orange bg-[#FFF1D6] font-semibold" : "border-xinergy-charcoal/15"}`} onClick={() => chooseIntensity(value)}>
                  {copy.intensities[index]}
                  <span className="mt-1 block text-xs font-normal text-xinergy-slate">{value}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      {token ? <p className="mt-3 text-sm text-xinergy-slate">{describeChoice(id, token, lang)}</p> : null}
    </fieldset>
  );
}

function omit(selected: Record<string, string>, id: string) {
  const next = { ...selected };
  delete next[id];
  return next;
}
