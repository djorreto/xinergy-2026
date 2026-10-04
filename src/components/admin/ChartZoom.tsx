"use client";

import { useEffect } from "react";
import type { ZoomSheet } from "@/lib/surveys/chart-zoom";

export function ChartZoom({ sheet, onClose }: { sheet: ZoomSheet | null; onClose: () => void }) {
  useEffect(() => {
    if (!sheet) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet, onClose]);

  if (!sheet) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-xinergy-charcoal/50 px-4 py-6 sm:py-10" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={sheet.title} className="w-full max-w-3xl bg-white p-5 shadow-xl sm:p-8" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label-editorial">Composición del gráfico</p>
            <h2 className="mt-2 font-display text-2xl text-xinergy-charcoal sm:text-3xl">{sheet.title}</h2>
          </div>
          <button type="button" className="btn-secondary shrink-0" onClick={onClose}>
            Cerrar
          </button>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-xinergy-slate">{sheet.note}</p>
        <div className="mt-6 flex flex-col gap-6">
          {sheet.sections.map((section) => (
            <section key={section.heading}>
              <h3 className="font-display text-lg text-xinergy-charcoal">{section.heading}</h3>
              <ul className="mt-2 border border-xinergy-charcoal/10">
                {section.lines.map((line, index) => (
                  <li key={`${section.heading}-${line.label}-${index}`} className="border-t border-xinergy-charcoal/10 px-3 py-3 first:border-t-0">
                    <p className="text-sm font-semibold text-xinergy-charcoal">{line.label}</p>
                    {line.value ? <p className="mt-1 text-sm leading-relaxed text-xinergy-slate">{line.value}</p> : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
