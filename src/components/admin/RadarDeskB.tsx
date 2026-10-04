"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EVAL_INCLUDED, EVAL_ISOLATED, type Evaluacion } from "@/lib/surveys/evaluacion";
import { CAPABILITIES, INITIATIVE_COPY } from "@/lib/surveys/radar-b/instrument";
import { SCENARIOS } from "@/lib/surveys/radar-b/engine";
import { dimensionName, industryName, initiativeName, percent, roleName, type Benchmark, type PersonReport } from "@/lib/surveys/radar-b/report";

const MACROS = ["Eficiencia y valor financiero", "Riesgo, sostenibilidad y control", "Transformación y capacidades"];

export function RadarDeskB({ people, benchmark, publicUrl, verified }: { people: PersonReport[]; benchmark: Benchmark; publicUrl: string; verified: boolean }) {
  const router = useRouter();
  const [view, setView] = useState<"respuestas" | "analisis">("analisis");
  const [open, setOpen] = useState<string | null>(people[0]?.id ?? null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const isolated = people.filter((person) => !person.included).length;

  async function setEvaluacion(id: string, evaluacion: Evaluacion) {
    setBusy(id);
    setError("");
    const response = await fetch("/api/admin/surveys/radar-compras-2027-b/evaluacion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, evaluacion }),
    });
    setBusy(null);
    if (!response.ok) {
      setError("No se pudo actualizar la evaluación.");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <p className="label-editorial">Opción B</p>
      <h1 className="mt-2 font-display text-3xl text-xinergy-charcoal">Radar Compras 2027</h1>
      <p className="mt-3 max-w-3xl text-sm text-xinergy-slate">
        Prioridades por comparaciones, capacidad con anclajes, brecha hacia nivel 4 y portafolios enumerados. La matriz de impacto es de demostración: no es una calibración ni un ahorro estimado.
        {verified ? " El ejemplo numérico de la especificación cuadra con este motor." : ""}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-secondary" onClick={() => { navigator.clipboard.writeText(publicUrl).then(() => setCopied(true)); }}>{copied ? "Enlace copiado" : "Copiar enlace de la encuesta"}</button>
        <a className="btn-secondary" href="/api/admin/surveys/radar-compras-2027-b/export">Exportar Excel</a>
        <span className="text-sm text-xinergy-slate">{people.length} respuestas · {isolated} aisladas · {benchmark.companies} empresas en el benchmark operacional</span>
      </div>
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      <div className="mt-6 flex gap-2">
        {(["analisis", "respuestas"] as const).map((item) => (
          <button key={item} type="button" onClick={() => setView(item)} className={`border px-4 py-2 text-sm ${view === item ? "border-xinergy-charcoal bg-xinergy-charcoal text-white" : "border-xinergy-charcoal/15"}`}>
            {item === "analisis" ? "Análisis" : "Quién respondió"}
          </button>
        ))}
      </div>
      {view === "analisis" ? <Analysis benchmark={benchmark} /> : (
        <div className="mt-6 flex flex-col gap-4">
          {people.length === 0 ? <p className="text-xinergy-slate">Todavía no hay respuestas en esta opción.</p> : null}
          {people.map((person) => (
            <article key={person.id} className="border border-xinergy-charcoal/10 bg-white p-5">
              <button type="button" className="w-full text-left" onClick={() => setOpen(open === person.id ? null : person.id)}>
                <p className="font-display text-xl">{person.empresa}</p>
                <p className="mt-1 text-sm text-xinergy-slate">{person.nombre} {person.apellido} · {roleName(person.rol)} · {person.pais} · {industryName(person.rubro)}</p>
                <p className="mt-1 text-sm">{person.included ? "Incluido en análisis" : "Aislado de la evaluación"} · {person.ahpClass ?? "AHP incompleto"} · {person.motor === "no-disponible" ? "Sin portafolio" : person.motor === "exploratorio" ? "Portafolio exploratorio" : "Portafolio de demostración"}</p>
              </button>
              <div className="mt-3">
                {person.included ? (
                  <button type="button" className="text-sm underline" disabled={busy === person.id} onClick={() => setEvaluacion(person.id, EVAL_ISOLATED)}>Aislar de la evaluación</button>
                ) : (
                  <button type="button" className="text-sm underline" disabled={busy === person.id} onClick={() => setEvaluacion(person.id, EVAL_INCLUDED)}>Incluir en análisis</button>
                )}
              </div>
              {open === person.id ? <PersonDetail person={person} /> : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Analysis({ benchmark }: { benchmark: Benchmark }) {
  return (
    <div className="mt-6 flex flex-col gap-8">
      {benchmark.duplicates.length ? <p className="border border-xinergy-orange/40 bg-[#FFF1D6] px-4 py-3 text-sm">Hay más de un responsable de Compras en {benchmark.duplicates.join(", ")}. Esas empresas quedan fuera del benchmark hasta consolidarlas. No se elige la respuesta más conveniente.</p> : null}
      <section>
        <h2 className="font-display text-2xl">Prioridades del benchmark</h2>
        <p className="mt-1 text-sm text-xinergy-slate">Promedio de prioridades individuales de la respuesta principal de cada empresa, solo con consistencia hasta 0,10. Una empresa pesa una vez.</p>
        {benchmark.ahpMean ? (
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <Bars title="Grupos" rows={MACROS.map((name, index) => ({ name, value: benchmark.macroMean?.[index] ?? 0 }))} />
            <Bars title="Ocho prioridades" rows={CAPABILITIES.map((item, index) => ({ name: item.short.es, value: benchmark.ahpMean?.[index] ?? 0 }))} />
          </div>
        ) : <p className="mt-3 text-sm text-xinergy-slate">Aún no hay una respuesta principal de Compras con prioridades consistentes.</p>}
      </section>
      <section>
        <h2 className="font-display text-2xl">Capacidad y brecha de planificación</h2>
        <p className="mt-1 text-sm text-xinergy-slate">La meta visible es nivel 4. La brecha estratégica es peso por brecha, calculada en cada empresa y después promediada. {benchmark.g0Mean != null ? `Brecha total media ${percent(benchmark.g0Mean)}.` : ""}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b"><th className="py-2 pr-3">Capacidad</th><th className="py-2 pr-3">Mediana</th><th className="py-2 pr-3">Rango intercuartil</th><th className="py-2">Brecha estratégica media</th></tr></thead>
            <tbody>
              {CAPABILITIES.map((item, index) => {
                const stat = benchmark.capability[index];
                return (
                  <tr key={item.id} className="border-b border-xinergy-charcoal/10">
                    <td className="py-2 pr-3">{item.short.es}</td>
                    <td className="py-2 pr-3">{stat.median ?? "—"} <span className="text-xinergy-slate">n={stat.n}</span></td>
                    <td className="py-2 pr-3">{stat.q1 ?? "—"} – {stat.q3 ?? "—"}</td>
                    <td className="py-2">{percent(benchmark.gapMean?.[index])}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="font-display text-2xl">Agenda modelada y agenda aprobada</h2>
        <p className="mt-1 text-sm text-xinergy-slate">Entre empresas con motor de demostración. La diferencia es el opportunity gap: selección modelada menos aprobación nueva. No es demanda comercial.</p>
        {SCENARIOS.map((scenario) => (
          <div key={scenario.id} className="mt-4">
            <h3 className="font-semibold capitalize">{scenario.id} · costo {scenario.budget} · esfuerzo {scenario.effort} · hasta {scenario.maxCount}</h3>
            <Bars
              title=""
              rows={INITIATIVE_COPY.map((item, index) => {
                const cell = benchmark.action[scenario.id][index];
                return { name: `${item.name.es} · aprobado ${percent(cell.approved)}`, value: cell.selected };
              })}
            />
          </div>
        ))}
      </section>
      <section>
        <h2 className="font-display text-2xl">Finanzas y Compras en la misma empresa</h2>
        {benchmark.pairs.length === 0 ? <p className="mt-2 text-sm text-xinergy-slate">Todavía no hay un par CFO–CPO con prioridades consistentes.</p> : (
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {benchmark.pairs.map((pair) => (
              <li key={pair.empresa}>{pair.empresa}: distancia {percent(pair.distance)}. Diferencia de peso del grupo financiero, CFO menos Compras: {percent(pair.fin)}.</li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2 className="font-display text-2xl">Cambio que piden para 2027</h2>
        {benchmark.open.length === 0 ? <p className="mt-2 text-sm text-xinergy-slate">Sin respuestas abiertas en el corte incluido.</p> : (
          <ul className="mt-3 flex flex-col gap-3">
            {benchmark.open.map((item) => (
              <li key={`${item.who}-${item.text}`} className="border-l-2 border-xinergy-orange pl-3 text-sm"><span className="font-semibold">{item.who}. </span>{item.text}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function PersonDetail({ person }: { person: PersonReport }) {
  return (
    <div className="mt-4 border-t border-xinergy-charcoal/10 pt-4 text-sm">
      <p>{person.email}</p>
      <p className="mt-2 text-xinergy-slate">{person.motorReason}</p>
      {person.weights ? (
        <div className="mt-4">
          <Bars title={`Prioridades · consistencia máxima ${person.ahp ? (person.ahp.maxCr * 100).toFixed(1).replace(".", ",") : "—"}`} rows={CAPABILITIES.map((item, index) => ({ name: dimensionName(item.id), value: person.weights?.[index] ?? 0 }))} />
        </div>
      ) : null}
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {CAPABILITIES.map((item, index) => (
          <p key={item.id}>{item.short.es}: nivel {person.levels[index] ?? "no sé"} · brecha {percent(person.gaps[index])}</p>
        ))}
      </div>
      {person.g0 != null ? <p className="mt-3">Brecha de planificación {percent(person.g0)}, respecto de nivel 4.</p> : null}
      <div className="mt-4 flex flex-col gap-3">
        {person.scenarios.map((scenario) => (
          <div key={scenario.id}>
            <p className="font-semibold capitalize">{scenario.id}</p>
            {scenario.portfolio ? (
              <p>{scenario.portfolio.ids.map(initiativeName).join(", ") || "Portafolio vacío"} · costo {scenario.portfolio.cost} · esfuerzo {scenario.portfolio.effort} · cierre modelado {percent(scenario.portfolio.closure)} · brecha residual {scenario.portfolio.gap.toFixed(3).replace(".", ",")}. Similitud con lo aprobado {percent(scenario.similarity)}. {scenario.comparable ? `Alineación por contribución ${percent(scenario.eta)}.` : scenario.reason}</p>
            ) : <p>{scenario.reason}</p>}
          </div>
        ))}
      </div>
      <p className="mt-3">Contra los recursos de su agenda nueva aprobada: {person.ownReason || `alineación ${percent(person.ownEta)}`}.</p>
    </div>
  );
}

function Bars({ title, rows }: { title: string; rows: { name: string; value: number }[] }) {
  return (
    <div>
      {title ? <h3 className="mb-2 font-semibold">{title}</h3> : null}
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.name}>
            <div className="mb-1 flex justify-between gap-3 text-xs"><span>{row.name}</span><span>{percent(row.value)}</span></div>
            <div className="h-2 bg-xinergy-charcoal/10"><div className="h-full bg-xinergy-orange" style={{ width: `${Math.max(0, Math.min(100, row.value * 100))}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
