"use client";

import { useState } from "react";
import { ahpLabel } from "@/lib/surveys/ahp";
import { allocationCopy, criteriaOf, evenSplit, rebalanceShares, type AllocationBlockId } from "@/lib/surveys/radar-c/ahp-allocation";
import type { Lang } from "@/lib/surveys/radar-c/instrument";

const SLICE_COLORS = ["#fca100", "#3f374b", "#8a7049"];

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
  const [points, setPoints] = useState<Record<string, number>>(() => (initial && ids.every((id) => Number.isInteger(initial[id])) ? Object.fromEntries(ids.map((id) => [id, initial[id]])) : evenSplit(ids)));
  const slices = ids.map((id, position) => ({
    id,
    name: ahpLabel(id, lang),
    points: points[id] ?? 0,
    color: SLICE_COLORS[position] ?? SLICE_COLORS[0],
  }));
  const sum = slices.reduce((totalPoints, slice) => totalPoints + slice.points, 0);

  function setShare(id: string, next: number) {
    setPoints((current) => rebalanceShares(current, id, next, ids));
  }

  return (
    <section aria-labelledby={`allocation-${blockId}`}>
      {total > 1 ? <p className="text-sm text-xinergy-beige">{copy.progress(index, total)}</p> : null}
      <p className="mt-2 max-w-2xl text-xinergy-charcoal">{copy.reason(slices.map((slice) => slice.name))}</p>
      <h2 id={`allocation-${blockId}`} className="mt-3 font-display text-2xl text-xinergy-charcoal">{copy.question}</h2>
      <p className="mt-3 max-w-2xl text-xinergy-slate">{copy.ties}</p>
      <p className="mt-2 max-w-2xl text-sm text-xinergy-slate">{copy.adjust}</p>
      <div className="mt-6 flex max-w-2xl flex-col gap-6">
        {slices.map((slice) => (
          <div key={slice.id}>
            <div className="flex items-baseline justify-between gap-3">
              <label className="font-semibold text-xinergy-charcoal" htmlFor={`share-${blockId}-${slice.id}`}>{slice.name}</label>
              <span className="text-lg font-semibold tabular-nums text-xinergy-charcoal">{slice.points}%</span>
            </div>
            <input
              id={`share-${blockId}-${slice.id}`}
              type="range"
              min={0}
              max={100}
              step={1}
              value={slice.points}
              aria-valuetext={`${slice.points}%`}
              className="mt-3 h-8 w-full cursor-pointer"
              style={{ accentColor: slice.color }}
              onChange={(event) => setShare(slice.id, Number(event.target.value))}
            />
          </div>
        ))}
      </div>
      <button type="button" className="btn-primary mt-6 min-h-12" disabled={sum !== 100} onClick={() => sum === 100 && onConfirm(points)}>
        {copy.confirm}
      </button>
    </section>
  );
}
