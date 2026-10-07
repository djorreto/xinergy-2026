"use client";

import { useState } from "react";
import { ahpLabel } from "@/lib/surveys/ahp";
import { allocationCopy, allocationStatus, criteriaOf, type AllocationBlockId } from "@/lib/surveys/radar-c/ahp-allocation";
import type { Lang } from "@/lib/surveys/radar-c/instrument";

const SLICE_COLORS = ["#fca100", "#3f374b", "#8a7049"];
const REST_COLOR = "#e4ddd2";

export function AllocationCard({
  lang,
  blockId,
  index,
  total,
  onConfirm,
  initial,
}: {
  lang: Lang;
  blockId: AllocationBlockId;
  index: number;
  total: number;
  onConfirm: (points: Record<string, number>) => void;
  initial?: Record<string, number> | null;
}) {
  const copy = allocationCopy(lang);
  const ids = criteriaOf(blockId);
  const [entries, setEntries] = useState<Record<string, string>>(() => Object.fromEntries(ids.map((id) => [id, initial?.[id] == null ? "" : String(initial[id])])));
  const status = allocationStatus(entries, ids);
  const gap = 100 - status.assigned;
  const slices = ids.map((id, position) => ({
    id,
    name: ahpLabel(id, lang),
    points: chartPoints(entries[id] ?? ""),
    color: SLICE_COLORS[position] ?? SLICE_COLORS[0],
  }));

  function setPoints(id: string, next: string) {
    if (next !== "" && !/^\d{1,3}$/.test(next)) return;
    if (next !== "" && Number(next) > 100) return;
    setEntries((current) => ({ ...current, [id]: next }));
  }

  function step(id: string, delta: number) {
    const current = entries[id] ?? "";
    const base = current === "" ? 0 : Number(current);
    setPoints(id, String(Math.min(100, Math.max(0, base + delta))));
  }

  return (
    <section aria-labelledby={`allocation-${blockId}`}>
      {total > 1 ? <p className="text-sm text-xinergy-beige">{copy.progress(index, total)}</p> : null}
      <h2 id={`allocation-${blockId}`} className="mt-2 font-display text-2xl text-xinergy-charcoal">{copy.question}</h2>
      <p className="mt-3 max-w-2xl text-xinergy-slate">{copy.ties}</p>
      <div className="mt-6 grid items-center gap-8 md:grid-cols-[minmax(0,40rem)_16.5rem]">
        <div className="flex flex-col gap-4">
          {slices.map((slice) => (
            <div key={slice.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border border-xinergy-charcoal/15 border-l-4 px-3 py-3" style={{ borderLeftColor: slice.color }}>
              <label className="font-semibold text-xinergy-charcoal" htmlFor={`points-${blockId}-${slice.id}`}>{slice.name}</label>
              <div className="flex items-center gap-2">
                <button type="button" className="grid h-11 w-11 place-items-center border border-xinergy-charcoal/15 text-lg" aria-label={`${copy.decrease} ${slice.name}`} onClick={() => step(slice.id, -1)}>−</button>
                <input
                  id={`points-${blockId}-${slice.id}`}
                  inputMode="numeric"
                  className="h-11 w-20 border border-xinergy-charcoal/15 bg-white text-center text-base outline-none focus:border-xinergy-orange"
                  aria-describedby={`allocation-sum-${blockId}`}
                  value={entries[slice.id] ?? ""}
                  onChange={(event) => setPoints(slice.id, event.target.value)}
                />
                <span className="text-sm text-xinergy-slate">{copy.points}</span>
                <button type="button" className="grid h-11 w-11 place-items-center border border-xinergy-charcoal/15 text-lg" aria-label={`${copy.increase} ${slice.name}`} onClick={() => step(slice.id, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
        <AllocationPie slices={slices} unassigned={copy.unassigned} />
      </div>
      <p id={`allocation-sum-${blockId}`} className="mt-4 font-semibold text-xinergy-charcoal" aria-live="polite">
        {copy.assigned(status.assigned)}
        <span className="mt-1 block text-sm font-normal text-xinergy-slate">{gap > 0 ? copy.missing(gap) : gap < 0 ? copy.extra(-gap) : copy.exact}</span>
      </p>
      <button type="button" className="btn-primary mt-5 min-h-12" disabled={!status.ready} onClick={() => status.values && onConfirm(status.values)}>
        {copy.confirm}
      </button>
    </section>
  );
}

function chartPoints(raw: string) {
  if (!/^(0|[1-9]\d*)$/.test(raw)) return 0;
  const value = Number(raw);
  return value >= 0 && value <= 100 ? value : 0;
}

function AllocationPie({ slices, unassigned }: { slices: { id: string; name: string; points: number; color: string }[]; unassigned: string }) {
  const assigned = slices.reduce((sum, slice) => sum + slice.points, 0);
  const over = assigned > 100;
  const remainder = over ? 0 : 100 - assigned;
  const total = over ? assigned : 100;
  const drawn = [
    ...slices.filter((slice) => slice.points > 0).map((slice) => ({ key: slice.id, points: slice.points, color: slice.color, ink: slice.color === "#fca100" ? "#3f374b" : "#ffffff" })),
    ...(remainder > 0 ? [{ key: "rest", points: remainder, color: REST_COLOR, ink: "#3f374b" }] : []),
  ];
  const label = [
    ...slices.map((slice) => `${slice.name}: ${slice.points}`),
    ...(remainder > 0 ? [`${unassigned}: ${remainder}`] : []),
  ].join(". ");
  let angle = -Math.PI / 2;

  return (
    <figure className="mx-auto flex w-full max-w-xs flex-col items-center gap-4" aria-label={label}>
      <svg viewBox="0 0 160 160" className="h-52 w-52" aria-hidden="true">
        {total <= 0 || drawn.length === 0 ? <circle cx="80" cy="80" r="74" fill={REST_COLOR} /> : null}
        {total > 0 && drawn.length === 1 ? <circle cx="80" cy="80" r="74" fill={drawn[0].color} /> : null}
        {total > 0 && drawn.length > 1
          ? drawn.map((slice) => {
              const sweep = (slice.points / total) * Math.PI * 2;
              const start = angle;
              angle += sweep;
              return <path key={slice.key} d={wedge(start, angle)} fill={slice.color} stroke="#faf9f7" strokeWidth="1.5" />;
            })
          : null}
        <PieNumbers drawn={drawn} total={total} />
      </svg>
      <ul className="w-full space-y-2 text-sm text-xinergy-charcoal">
        {slices.map((slice) => (
          <li key={slice.id} className="flex items-start gap-2">
            <span className="mt-1 h-3 w-3 shrink-0" style={{ background: slice.color }} aria-hidden />
            <span className="min-w-0 flex-1 leading-snug">{slice.name}</span>
            <span className="font-semibold tabular-nums">{slice.points}</span>
          </li>
        ))}
        {remainder > 0 ? (
          <li className="flex items-start gap-2 text-xinergy-slate">
            <span className="mt-1 h-3 w-3 shrink-0 border border-xinergy-charcoal/15" style={{ background: REST_COLOR }} aria-hidden />
            <span className="min-w-0 flex-1 leading-snug">{unassigned}</span>
            <span className="font-semibold tabular-nums">{remainder}</span>
          </li>
        ) : null}
      </ul>
    </figure>
  );
}

function PieNumbers({ drawn, total }: { drawn: { key: string; points: number; ink: string }[]; total: number }) {
  if (total <= 0) return null;
  let angle = -Math.PI / 2;
  return drawn.map((slice) => {
    const sweep = (slice.points / total) * Math.PI * 2;
    const mid = angle + sweep / 2;
    angle += sweep;
    if (slice.key === "rest" && slice.points >= 100) return null;
    if (sweep < Math.PI * 0.34) return null;
    const radius = drawn.length === 1 ? 0 : 46;
    const x = 80 + radius * Math.cos(mid);
    const y = 80 + radius * Math.sin(mid);
    return (
      <text key={slice.key} x={x} y={y} textAnchor="middle" dominantBaseline="central" fill={slice.ink} fontSize="12" fontWeight="600">
        {slice.points}
      </text>
    );
  });
}

function wedge(start: number, end: number) {
  const radius = 74;
  const large = end - start > Math.PI ? 1 : 0;
  const x1 = (80 + radius * Math.cos(start)).toFixed(2);
  const y1 = (80 + radius * Math.sin(start)).toFixed(2);
  const x2 = (80 + radius * Math.cos(end)).toFixed(2);
  const y2 = (80 + radius * Math.sin(end)).toFixed(2);
  return `M 80 80 L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
}
