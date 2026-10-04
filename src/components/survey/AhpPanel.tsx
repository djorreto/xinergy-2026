import { AHP, tx } from "@/lib/surveys/radar-2027";
import { ahpLabel, formatPercent, formatRatio, type AhpAnalysis, type AhpGroup } from "@/lib/surveys/ahp";

export function AhpPanel({ analysis, title, note }: { analysis: AhpAnalysis; title: string; note?: string }) {
  const ranking = Object.entries(analysis.global).sort((left, right) => right[1] - left[1]);
  const top = ranking[0]?.[1] ?? 1;
  const consistent = analysis.maxCr <= 0.1;

  return (
    <section className="border-t-2 border-xinergy-orange pt-5">
      <h3 className="font-display text-2xl text-xinergy-charcoal">{title}</h3>
      {note ? <p className="mt-2 max-w-2xl text-sm text-xinergy-slate">{note}</p> : null}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {AHP.macros.map((macro, index) => (
          <div key={macro.id} className="border border-xinergy-charcoal/10 bg-white p-4">
            <p className="font-display text-2xl text-xinergy-charcoal">{formatPercent(analysis.macro.weights[index] ?? 0)}</p>
            <p className="mt-1 text-sm text-xinergy-slate">{tx(macro.label, "es")}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[28rem] text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-xinergy-slate">
            <tr>
              <th className="py-2 pr-3 font-medium">#</th>
              <th className="py-2 pr-3 font-medium">Prioridad</th>
              <th className="py-2 text-right font-medium">Peso</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map(([id, weight], index) => (
              <tr key={id} className="border-t border-xinergy-charcoal/10">
                <td className="py-2 pr-3">{index + 1}</td>
                <td className="py-2 pr-3">
                  {ahpLabel(id)}
                  <span className="mt-1 block h-1.5 bg-xinergy-charcoal/10">
                    <span className="block h-full bg-xinergy-orange" style={{ width: `${Math.max(4, (weight / top) * 100)}%` }} />
                  </span>
                </td>
                <td className="py-2 text-right font-semibold">{formatPercent(weight)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-xinergy-slate">
        <span className="font-semibold text-xinergy-charcoal">{consistent ? "Consistencia adecuada." : "Revisar consistencia."}</span> Mayor CR observado: {analysis.maxCr.toFixed(3).replace(".", ",")}. Un CR de hasta 0,10 es la referencia en matrices de 3×3.
      </p>
      <details className="mt-4 text-sm text-xinergy-slate">
        <summary className="cursor-pointer font-semibold text-xinergy-charcoal">Matrices y método</summary>
        <div className="mt-4 flex flex-col gap-5">
          <Matrix title="Matriz macro" group={analysis.macro} />
          {AHP.macros.map((macro) => (
            <Matrix key={macro.id} title={tx(macro.label, "es")} group={analysis.groups[macro.id]} />
          ))}
          <ol className="list-decimal space-y-1 pl-5">
            <li>Cada comparación usa la escala de Saaty 1–9. Si la preferencia apunta a la derecha, se guarda el recíproco (1/3, 1/5, 1/7 o 1/9).</li>
            <li>En el corte de varias personas, cada par se agrega con la media geométrica y después se recalculan los pesos.</li>
            <li>El peso global es el peso de la macroprioridad por el peso local dentro de esa macroprioridad.</li>
            <li>La consistencia es CR = CI/RI. Las matrices de 2×2 son consistentes por construcción.</li>
          </ol>
        </div>
      </details>
    </section>
  );
}

function Matrix({ title, group }: { title: string; group: AhpGroup }) {
  return (
    <div>
      <p className="font-semibold text-xinergy-charcoal">
        {title} · CR {group.cr.toFixed(3).replace(".", ",")} {group.ids.length <= 2 || group.cr <= 0.1 ? "✓" : "⚠"}
      </p>
      <div className="mt-2 overflow-x-auto border border-xinergy-charcoal/10">
        <table className="w-full min-w-[24rem] text-xs">
          <thead className="bg-xinergy-cream/60">
            <tr>
              <th className="p-2 text-left font-medium" />
              {group.ids.map((id) => (
                <th key={id} className="p-2 text-center font-medium">
                  {ahpLabel(id)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.ids.map((id, row) => (
              <tr key={id} className="border-t border-xinergy-charcoal/10">
                <th className="p-2 text-left font-medium">{ahpLabel(id)}</th>
                {group.matrix[row].map((value, column) => (
                  <td key={`${id}-${group.ids[column]}`} className="p-2 text-center">
                    {formatRatio(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
