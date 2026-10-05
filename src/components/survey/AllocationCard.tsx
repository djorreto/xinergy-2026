"use client";

import { useState } from "react";
import { ahpLabel } from "@/lib/surveys/ahp";
import { allocationCopy, allocationStatus, criteriaOf, type AllocationBlockId } from "@/lib/surveys/radar-c/ahp-allocation";
import type { Lang } from "@/lib/surveys/radar-c/instrument";

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
    <section className="max-w-3xl" aria-labelledby={`allocation-${blockId}`}>
      {total > 1 ? <p className="text-sm text-xinergy-beige">{copy.progress(index, total)}</p> : null}
      <h2 id={`allocation-${blockId}`} className="mt-2 font-display text-2xl text-xinergy-charcoal">{copy.question}</h2>
      <p className="mt-3 text-xinergy-slate">{copy.ties}</p>
      <div className="mt-6 flex flex-col gap-4">
        {ids.map((id) => {
          const name = ahpLabel(id, lang);
          return (
            <div key={id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border border-xinergy-charcoal/15 px-3 py-3">
              <label className="font-semibold text-xinergy-charcoal" htmlFor={`points-${blockId}-${id}`}>{name}</label>
              <div className="flex items-center gap-2">
                <button type="button" className="grid h-11 w-11 place-items-center border border-xinergy-charcoal/15 text-lg" aria-label={`${copy.decrease} ${name}`} onClick={() => step(id, -1)}>−</button>
                <input
                  id={`points-${blockId}-${id}`}
                  inputMode="numeric"
                  className="h-11 w-20 border border-xinergy-charcoal/15 bg-white text-center text-base outline-none focus:border-xinergy-orange"
                  aria-describedby={`allocation-sum-${blockId}`}
                  value={entries[id] ?? ""}
                  onChange={(event) => setPoints(id, event.target.value)}
                />
                <span className="text-sm text-xinergy-slate">{copy.points}</span>
                <button type="button" className="grid h-11 w-11 place-items-center border border-xinergy-charcoal/15 text-lg" aria-label={`${copy.increase} ${name}`} onClick={() => step(id, 1)}>+</button>
              </div>
            </div>
          );
        })}
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
