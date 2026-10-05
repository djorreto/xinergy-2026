"use client";

import { useState } from "react";
import { ahpClass } from "@/lib/surveys/radar-b/engine";
import { AHP_SCALE } from "@/lib/surveys/radar-2027";
import { corroborationOf, type CorroborationCard } from "@/lib/surveys/radar-c/ahp-corroboration";
import {
  AHP_BLOCKS,
  blockCr,
  choiceFromToken,
  describeChoice,
  pairMeta,
  sideDetail,
  tokenFromChoice,
  type AhpBlockId,
  type AhpIntensity,
  type AhpSide,
} from "@/lib/surveys/radar-c/ahp-blocks";
import { ui, type Lang } from "@/lib/surveys/radar-c/instrument";

export function AhpBlocks({
  lang,
  selected,
  invalid,
  block,
  review,
  corroborationBlock,
  onChange,
  onKeep,
  onSave,
}: {
  lang: Lang;
  selected: Record<string, string>;
  invalid: Record<string, string>;
  block: number;
  review: boolean;
  corroborationBlock?: AhpBlockId;
  onChange: (value: Record<string, string>) => void;
  onKeep: () => void;
  onSave: (pairId: string, token: string) => void;
}) {
  const copy = ui[lang];
  const source = AHP_BLOCKS[block];
  const card = review && corroborationBlock ? corroborationOf(corroborationBlock, selected, lang) : null;
  const notedCr = card ? blockCr(selected, card.blockId) : null;

  if (review) {
    return (
      <div className="flex flex-col gap-6">
        {card ? <CorroborationCard key={`${card.blockId}:${card.pairId}:${selected[card.pairId]}`} card={card} onKeep={onKeep} onSave={onSave} /> : null}
        {notedCr != null && notedCr > 0.1 ? (
          <div className="max-w-2xl text-sm text-xinergy-slate">
            <p>{copy.reviewNote}</p>
            {ahpClass(notedCr) === "excluido" ? <p className="mt-2">{copy.reviewPortfolio}</p> : null}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
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
      {source ? (
        <section id={`ahp-block-${source.id}`}>
          <div className="mt-4 flex flex-col gap-4">
            {source.pairIds.map((id) => (
              <PairCard key={id} id={id} lang={lang} token={selected[id]} invalid={Boolean(invalid[id])} onChange={(token) => onChange(token ? { ...selected, [id]: token } : omit(selected, id))} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function CorroborationCard({ card, onKeep, onSave }: { card: CorroborationCard; onKeep: () => void; onSave: (pairId: string, token: string) => void }) {
  const [side, setSide] = useState<AhpSide | null>(null);
  const [intensity, setIntensity] = useState<AhpIntensity | null>(null);
  const token = side === "equal" ? "1" : side === "a" || side === "b" ? tokenFromChoice(side, intensity) : null;

  function chooseSide(next: AhpSide) {
    setSide(next);
    if (next === "equal") setIntensity(null);
  }

  return (
    <section className="max-w-3xl" aria-labelledby={`confirm-${card.pairId}`}>
      <h2 id={`confirm-${card.pairId}`} className="font-display text-2xl text-xinergy-charcoal">{card.title}</h2>
      <p className="mt-3 text-xinergy-slate">{card.context}</p>
      <fieldset className="mt-6">
        <legend className="font-semibold text-xinergy-charcoal">{card.question}</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label={card.question}>
          <ChoiceButton label={card.optionP} pressed={side === "a"} onClick={() => chooseSide("a")} />
          <ChoiceButton label={card.optionEqual} pressed={side === "equal"} onClick={() => chooseSide("equal")} />
          <ChoiceButton label={card.optionQ} pressed={side === "b"} onClick={() => chooseSide("b")} />
        </div>
      </fieldset>
      {side === "a" || side === "b" ? (
        <fieldset className="mt-5">
          <legend className="font-semibold text-xinergy-charcoal">{card.intensityQuestion}</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-4" role="radiogroup" aria-label={card.intensityQuestion}>
            {card.intensities.map((item) => (
              <ChoiceButton key={item.value} label={item.label} hint={String(item.value)} pressed={intensity === item.value} onClick={() => setIntensity(item.value)} />
            ))}
          </div>
        </fieldset>
      ) : null}
      <p className="mt-5 text-sm text-xinergy-slate">{card.current}</p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button type="button" className="btn-secondary min-h-12" onClick={onKeep}>{card.keep}</button>
        {token ? <button type="button" className="btn-primary min-h-12" onClick={() => onSave(card.pairId, token)}>{card.save}</button> : null}
      </div>
    </section>
  );
}

function ChoiceButton({ label, hint, pressed, onClick }: { label: string; hint?: string; pressed: boolean; onClick: () => void }) {
  return (
    <button type="button" role="radio" aria-checked={pressed} className={`border px-3 py-3 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-xinergy-orange ${pressed ? "border-xinergy-orange bg-[#FFF1D6] font-semibold" : "border-xinergy-charcoal/15"}`} onClick={onClick}>
      <span className="block">{label}</span>
      {hint ? <span className="mt-1 block text-[11px] font-normal text-xinergy-slate">{hint}</span> : null}
    </button>
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
      <div className="mt-3 grid grid-cols-2 items-stretch gap-3">
        <SidePanel name={left.name} items={left.items} contains={copy.contains} wash={washOf("a", saved.side, saved.intensity)} />
        <SidePanel name={right.name} items={right.items} contains={copy.contains} wash={washOf("b", saved.side, saved.intensity)} />
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

const MORE: Record<AhpIntensity, string> = { 3: "#EAF6EC", 5: "#CDECD4", 7: "#A6DCB4", 9: "#78C98C" };
const LESS: Record<AhpIntensity, string> = { 3: "#FBEDED", 5: "#F6D4D4", 7: "#EFB0B0", 9: "#E48484" };

function washOf(place: "a" | "b", side: ReturnType<typeof choiceFromToken>["side"], intensity: AhpIntensity | null) {
  if (side === "equal") return "#FFE8A3";
  if ((side !== "a" && side !== "b") || !intensity) return undefined;
  return side === place ? MORE[intensity] : LESS[intensity];
}

function SidePanel({ name, items, contains, wash }: { name: string; items: string[]; contains: string; wash?: string }) {
  return (
    <div className="px-3 py-3 text-left text-sm" style={wash ? { backgroundColor: wash } : undefined}>
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
