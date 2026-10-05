"use client";

import { ahpClass } from "@/lib/surveys/radar-b/engine";
import { AHP_SCALE } from "@/lib/surveys/radar-2027";
import {
  AHP_BLOCKS,
  blockCr,
  choiceFromToken,
  contradictionOf,
  describeChoice,
  pairMeta,
  reviewBlockIds,
  sideDetail,
  type AhpBlockId,
  type AhpIntensity,
  type ContrastSide,
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
        <section id={`ahp-block-${source.id}`}>
          {review ? <h3 className="font-display text-xl text-xinergy-charcoal">{copy.blockTitles[titleIndex]}</h3> : null}
          {review && source.pairIds.length === 3 ? <ContradictionCard lang={lang} blockId={source.id} selected={selected} followsLabel={copy.clashFollows} markedLabel={copy.clashMarked} /> : null}
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

function ContradictionCard({ lang, blockId, selected, followsLabel, markedLabel }: { lang: Lang; blockId: AhpBlockId; selected: Record<string, string>; followsLabel: string; markedLabel: string }) {
  const clash = contradictionOf(blockId, selected, lang);
  if (!clash) return null;
  return (
    <div className="mt-4 bg-[#FDECEC] px-4 py-4">
      <ol className="flex flex-col gap-2">
        {clash.steps.map((step, index) => (
          <li key={`${step.from}-${step.to}`} className={`text-sm text-xinergy-charcoal ${clash.kind === "cycle" && index === clash.steps.length - 1 ? "bg-[#F6D4D4] px-3 py-2 font-semibold" : ""}`}>
            {step.sentence}
          </li>
        ))}
      </ol>
      {clash.kind === "cycle" ? <p className="mt-3 text-sm font-semibold text-xinergy-charcoal">{clash.closing}</p> : null}
      {clash.follows && clash.marked ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ContrastBox label={followsLabel} side={clash.follows} />
          <ContrastBox label={markedLabel} side={clash.marked} />
        </div>
      ) : null}
    </div>
  );
}

function ContrastBox({ label, side }: { label: string; side: ContrastSide }) {
  const fromWash = side.fromWins === null ? "#FFE8A3" : side.fromWins ? MORE[side.intensity ?? 3] : LESS[side.intensity ?? 3];
  const toWash = side.fromWins === null ? "#FFE8A3" : side.fromWins ? LESS[side.intensity ?? 3] : MORE[side.intensity ?? 3];
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-xinergy-charcoal">{label}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <p className="px-3 py-3 text-sm font-semibold text-xinergy-charcoal" style={{ backgroundColor: fromWash }}>{side.from}</p>
        <p className="px-3 py-3 text-sm font-semibold text-xinergy-charcoal" style={{ backgroundColor: toWash }}>{side.to}</p>
      </div>
      <p className="mt-2 text-sm text-xinergy-charcoal">{side.sentence}</p>
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
