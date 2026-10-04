"use client";

import type { ReactNode } from "react";
import { ExecutiveCharts } from "@/components/admin/ExecutiveCharts";
import type { ZoomPerson, ZoomSheet } from "@/lib/surveys/chart-zoom";

export function ExecutiveBriefPanel({
  responses,
  onZoom,
  charts,
}: {
  responses: { createdAt: string }[];
  onZoom: (sheet: ZoomSheet) => void;
  charts?: ReactNode;
}) {
  return (
    <section className="border border-xinergy-charcoal/10 bg-white p-5 sm:p-7">
      <p className="label-editorial">Vista del corte</p>
      <h2 className="mt-2 font-display text-2xl text-xinergy-charcoal">Lo que muestra este corte</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-xinergy-slate">
        Los gráficos usan las respuestas incluidas. La lectura larga está en el informe calculado, no en un texto generado aparte.
      </p>
      {charts ?? <ExecutiveCharts people={responses as unknown as ZoomPerson[]} onZoom={onZoom} />}
    </section>
  );
}
