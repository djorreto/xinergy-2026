"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ChartZoom } from "@/components/admin/ChartZoom";
import { StudyDownload } from "@/components/admin/StudyDownload";
import { ExecutiveBriefPanel } from "@/components/admin/ExecutiveBrief";
import type { ZoomSheet } from "@/lib/surveys/chart-zoom";
import { EVAL_INCLUDED, EVAL_ISOLATED, type Evaluacion } from "@/lib/surveys/evaluacion";
import type { StoredBrief } from "@/lib/surveys/executive";
import { CAPABILITIES, INITIATIVE_COPY } from "@/lib/surveys/radar-b/instrument";
import { SCENARIOS } from "@/lib/surveys/radar-b/engine";
import { countryNames, dimensionName, industryName, initiativeName, percent, roleName, type Benchmark, type PersonReport } from "@/lib/surveys/radar-b/report";
import { capabilityZoom, peopleZoom, portfolioZoom, priorityZoom } from "@/lib/surveys/radar-b/zoom";

const MACROS = ["Eficiencia y valor financiero", "Riesgo, sostenibilidad y control", "Transformación y capacidades"];

const dateFormat = new Intl.DateTimeFormat("es-CL", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Santiago",
});

export function RadarDeskB({ people, benchmark, publicUrl, verified, brief }: { people: PersonReport[]; benchmark: Benchmark; publicUrl: string; verified: boolean; brief: StoredBrief | null }) {
  const router = useRouter();
  const [view, setView] = useState<"respuestas" | "analisis">("respuestas");
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState<ZoomSheet | null>(null);
  const closeZoom = useCallback(() => setZoom(null), []);
  const included = people.filter((person) => person.included);
  const listed = [...people].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  const person = listed.find((item) => item.id === selected) ?? null;

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
      <p className="mt-3 text-sm text-xinergy-slate">{sampleLine(people.length, included.length)} {benchmark.companies} empresas en el benchmark operacional.</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-secondary" onClick={() => { navigator.clipboard.writeText(publicUrl).then(() => setCopied(true)); }}>{copied ? "Enlace copiado" : "Copiar enlace de la encuesta"}</button>
      </div>
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      <div className="mt-6 flex gap-2">
        <Tab on={view === "respuestas"} onClick={() => { setView("respuestas"); setSelected(null); }}>Quién respondió</Tab>
        <Tab on={view === "analisis"} onClick={() => { setView("analisis"); setSelected(null); }}>Análisis al momento</Tab>
      </div>
      {view === "respuestas" ? (
        <div className="mt-6">
          <a className="btn-secondary" href="/api/admin/surveys/radar-compras-2027-b/export">Exportar Excel</a>
          {person ? (
            <PersonAnswer person={person} busy={busy === person.id} onBack={() => setSelected(null)} onEvaluate={setEvaluacion} />
          ) : (
            <ResponseTable responses={listed} busyId={busy} onOpen={setSelected} onEvaluate={setEvaluacion} />
          )}
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          <StudyDownload href="/api/admin/surveys/radar-compras-2027-b/informe" />
          <Analysis people={people} benchmark={benchmark} brief={brief} included={included} onZoom={setZoom} />
        </div>
      )}
      <ChartZoom sheet={zoom} onClose={closeZoom} />
    </div>
  );
}

function Tab({ on, onClick, children }: { on: boolean; onClick: () => void; children: string }) {
  return (
    <button type="button" onClick={onClick} className={`border px-4 py-2 text-sm font-semibold ${on ? "border-xinergy-charcoal bg-xinergy-charcoal text-white" : "border-xinergy-charcoal/15 text-xinergy-slate"}`}>
      {children}
    </button>
  );
}

function sampleLine(total: number, includedCount: number) {
  if (!total) return "Todavía no hay respuestas.";
  const received = total === 1 ? "Hay 1 respuesta." : `Hay ${total} respuestas.`;
  const aside = total - includedCount;
  if (!aside) return `${received} Todas entran al análisis.`;
  return `${received} ${aside === 1 ? "1 está aislada de la evaluación." : `${aside} están aisladas de la evaluación.`}`;
}

function ResponseTable({
  responses,
  busyId,
  onOpen,
  onEvaluate,
}: {
  responses: PersonReport[];
  busyId: string | null;
  onOpen: (id: string) => void;
  onEvaluate: (id: string, evaluacion: Evaluacion) => void;
}) {
  if (!responses.length) {
    return <p className="mt-8 text-xinergy-slate">Todavía no hay respuestas. Cuando alguien termine la encuesta, su nombre queda en esta lista y se abre el detalle de lo que contestó.</p>;
  }
  return (
    <div className="mt-6 overflow-x-auto border border-xinergy-charcoal/10 bg-white">
      <table className="w-full min-w-[40rem] text-sm">
        <thead className="text-left text-xs uppercase tracking-wide text-xinergy-slate">
          <tr>
            <th className="p-3 font-medium">Fecha</th>
            <th className="p-3 font-medium">Persona</th>
            <th className="p-3 font-medium">Empresa</th>
            <th className="p-3 font-medium">País</th>
            <th className="p-3 font-medium">Rol</th>
            <th className="p-3 font-medium">Evaluación</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((item) => (
            <tr key={item.id} className="border-t border-xinergy-charcoal/10">
              <td className="p-3 whitespace-nowrap">{dateFormat.format(new Date(item.createdAt))}</td>
              <td className="p-3">
                <button type="button" className="text-left font-semibold text-xinergy-charcoal underline decoration-xinergy-orange underline-offset-4" onClick={() => onOpen(item.id)}>
                  {item.nombre} {item.apellido}
                </button>
                <span className="mt-0.5 block text-xinergy-slate">{item.email}</span>
              </td>
              <td className="p-3">{item.empresa}</td>
              <td className="p-3">{countryNames(item.paises)}</td>
              <td className="p-3">{roleName(item.rol)}</td>
              <td className="p-3">
                <button
                  type="button"
                  className="text-left text-sm font-semibold text-xinergy-charcoal underline decoration-xinergy-orange underline-offset-4 disabled:opacity-60"
                  disabled={busyId === item.id}
                  onClick={() => onEvaluate(item.id, item.included ? EVAL_ISOLATED : EVAL_INCLUDED)}
                >
                  {busyId === item.id ? "Guardando…" : item.included ? "Aislar de la evaluación" : "Incluir en análisis"}
                </button>
                <span className="mt-1 block text-xs text-xinergy-slate">{item.included ? "Incluido en análisis" : "Aislado de la evaluación"}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PersonAnswer({
  person,
  busy,
  onBack,
  onEvaluate,
}: {
  person: PersonReport;
  busy: boolean;
  onBack: () => void;
  onEvaluate: (id: string, evaluacion: Evaluacion) => void;
}) {
  return (
    <div className="mt-6">
      <button type="button" className="text-sm text-xinergy-slate underline" onClick={onBack}>
        Volver al listado
      </button>
      <h2 className="mt-3 font-display text-2xl text-xinergy-charcoal">
        {person.nombre} {person.apellido}
      </h2>
      <p className="mt-1 text-sm text-xinergy-slate">
        {person.empresa} · {scopeLine(person)} · {dateFormat.format(new Date(person.createdAt))} · {countryNames(person.paises)} · {roleName(person.rol)} · {industryName(person.rubro)}
      </p>
      <p className="mt-1 text-sm text-xinergy-slate">{person.email}</p>
      <div className="mt-4">
        <button
          type="button"
          className="text-left text-sm font-semibold text-xinergy-charcoal underline decoration-xinergy-orange underline-offset-4 disabled:opacity-60"
          disabled={busy}
          onClick={() => onEvaluate(person.id, person.included ? EVAL_ISOLATED : EVAL_INCLUDED)}
        >
          {busy ? "Guardando…" : person.included ? "Aislar de la evaluación" : "Incluir en análisis"}
        </button>
        <span className="mt-1 block text-xs text-xinergy-slate">{person.included ? "Incluido en análisis" : "Aislado de la evaluación"}</span>
      </div>
      <PersonDetail person={person} />
    </div>
  );
}

function Analysis({ people, benchmark, brief, included, onZoom }: { people: PersonReport[]; benchmark: Benchmark; brief: StoredBrief | null; included: PersonReport[]; onZoom: (sheet: ZoomSheet) => void }) {
  const priority = people.filter((person) => benchmark.priorityIds.includes(person.id));
  const motor = people.filter((person) => benchmark.motorIds.includes(person.id));
  const principals = people.filter((person) => benchmark.principalIds.includes(person.id));
  return (
    <div className="mt-6 flex flex-col gap-8">
      <ExecutiveBriefPanel
        initial={brief}
        responses={included}
        onZoom={onZoom}
        endpoint="/api/admin/surveys/radar-compras-2027-b/brief"
        charts={<ExecutiveView benchmark={benchmark} priority={priority} principals={principals} motor={motor} included={included} onZoom={onZoom} />}
      />
      <h2 className="font-display text-2xl">Detalle del cálculo</h2>
      {benchmark.duplicates.length ? <p className="border border-xinergy-orange/40 bg-[#FFF1D6] px-4 py-3 text-sm">Hay más de un responsable de Compras en {benchmark.duplicates.join(", ")}. Esas empresas quedan fuera del benchmark hasta consolidarlas. No se elige la respuesta más conveniente.</p> : null}
      <section>
        <h2 className="font-display text-2xl">Prioridades del benchmark</h2>
        <p className="mt-1 text-sm text-xinergy-slate">Promedio de prioridades individuales de la respuesta principal de cada empresa, solo con consistencia hasta 0,10. Una empresa pesa una vez. Clic en una barra para ver quién la compone.</p>
        {benchmark.ahpMean ? (
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <MacroBar weights={benchmark.macroMean ?? []} onOpen={(index) => onZoom(peopleZoom(MACROS[index], "Peso del grupo en cada empresa del benchmark y el promedio que muestra la barra.", priority, (person) => percent(person.ahp?.macro.weights[index])))} />
            <Bars title="Ocho prioridades" rows={CAPABILITIES.map((item, index) => ({ name: item.short.es, value: benchmark.ahpMean?.[index] ?? 0 }))} onOpen={(name) => { const index = CAPABILITIES.findIndex((item) => item.short.es === name); onZoom(priorityZoom(name, index, priority, benchmark.ahpMean?.[index] ?? null)); }} />
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
                    <td className="py-2 pr-3">
                      <button type="button" className="text-left underline decoration-xinergy-charcoal/20" onClick={() => onZoom(capabilityZoom(index, principals))}>{item.short.es}</button>
                    </td>
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
              onOpen={(_, index) => onZoom(portfolioZoom(index, motor, scenario.id))}
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
        <button type="button" className="font-display text-2xl" onClick={() => onZoom(peopleZoom("Cambio para 2027", "Textos de las respuestas incluidas. Si hay más de una persona de la misma empresa, el nombre va junto a la empresa.", included.filter((person) => person.desafio.trim()), (person) => person.desafio))}>Cambio que piden para 2027</button>
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

function scopeLine(person: PersonReport) {
  if (person.alcance === "unidad") return person.unidad ? `Unidad: ${person.unidad}` : "Unidad de negocio";
  if (person.alcance === "empresa") return "Empresa completa";
  return "Alcance sin indicar";
}

function PersonDetail({ person }: { person: PersonReport }) {
  const consistency = person.ahp ? person.ahp.maxCr.toFixed(3).replace(".", ",") : "—";
  return (
    <div className="mt-6 border-t border-xinergy-charcoal/10 pt-4 text-sm">
      <p className="text-xinergy-slate">{person.motorReason}</p>
      {person.weights ? (
        <div className="mt-4">
          <Bars title={`Prioridades · consistencia ${consistency}`} rows={CAPABILITIES.map((item, index) => ({ name: dimensionName(item.id), value: person.weights?.[index] ?? 0 }))} />
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

function ExecutiveView({ benchmark, priority, principals, motor, included, onZoom }: { benchmark: Benchmark; priority: PersonReport[]; principals: PersonReport[]; motor: PersonReport[]; included: PersonReport[]; onZoom: (sheet: ZoomSheet) => void }) {
  const topIndex = benchmark.ahpMean ? benchmark.ahpMean.indexOf(Math.max(...benchmark.ahpMean)) : -1;
  const countries = new Set(included.flatMap((person) => person.paises)).size;
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Kpi label="respuestas incluidas" value={String(included.length)} onClick={() => onZoom(peopleZoom("Respuestas incluidas", "Estas respuestas entran al análisis. Las aisladas quedan guardadas y no se usan aquí.", included, (person) => roleName(person.rol)))} />
      <Kpi label="empresas en el benchmark" value={String(benchmark.companies)} onClick={() => onZoom(peopleZoom("Benchmark operacional", "Una respuesta de Compras por empresa. Si hay dos del mismo rol, la empresa no entra.", principals, (person) => roleName(person.rol)))} />
      <Kpi label="países en la muestra" value={String(countries)} onClick={() => onZoom(peopleZoom("Países", "Países donde opera el alcance. Una respuesta puede marcar más de uno.", included, (person) => countryNames(person.paises)))} />
      <Kpi label={topIndex >= 0 ? CAPABILITIES[topIndex].short.es : "prioridad principal"} value={topIndex >= 0 ? percent(benchmark.ahpMean?.[topIndex]) : "—"} onClick={() => { if (topIndex >= 0) onZoom(priorityZoom(CAPABILITIES[topIndex].short.es, topIndex, priority, benchmark.ahpMean?.[topIndex] ?? null)); }} />
      <div className="sm:col-span-2 lg:col-span-4">
        {benchmark.macroMean ? <MacroBar weights={benchmark.macroMean} onOpen={(index) => onZoom(peopleZoom(MACROS[index], "Peso del grupo en cada empresa y el promedio de la barra.", priority, (person) => percent(person.ahp?.macro.weights[index])))} /> : <p className="text-sm text-xinergy-slate">Los gráficos de prioridad aparecen cuando hay una respuesta de Compras consistente.</p>}
      </div>
      <div className="sm:col-span-2">
        <Bars title="Capacidad, mediana de 1 a 5" rows={CAPABILITIES.map((item, index) => ({ name: item.short.es, value: ((benchmark.capability[index]?.median ?? 0) as number) / 5 }))} format={(value) => (value ? String(Math.round(value * 50) / 10).replace(".", ",") : "—")} onOpen={(_, index) => onZoom(capabilityZoom(index, principals))} />
      </div>
      <div className="sm:col-span-2">
        <Bars title="Balanced · selección modelada" rows={INITIATIVE_COPY.map((item, index) => ({ name: item.name.es, value: benchmark.action.balanced[index]?.selected ?? 0 }))} onOpen={(_, index) => onZoom(portfolioZoom(index, motor, "balanced"))} />
      </div>
    </div>
  );
}

function Kpi({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <button type="button" className="border border-xinergy-charcoal/10 bg-xinergy-ivory p-4 text-left" onClick={onClick}>
      <p className="font-display text-3xl text-xinergy-charcoal">{value}</p>
      <p className="mt-1 text-sm text-xinergy-slate">{label}</p>
    </button>
  );
}

function MacroBar({ weights, onOpen }: { weights: number[]; onOpen: (index: number) => void }) {
  const colors = ["bg-xinergy-orange", "bg-xinergy-charcoal", "bg-xinergy-beige"];
  const text = ["text-xinergy-charcoal", "text-white", "text-xinergy-charcoal"];
  return (
    <div>
      <h3 className="mb-2 font-semibold">Grupos de prioridad</h3>
      <div className="flex h-10 overflow-hidden">
        {MACROS.map((name, index) => (
          <button key={name} type="button" aria-label={`${name} ${percent(weights[index])}`} className={`min-w-0 px-1 text-xs font-semibold ${colors[index]} ${text[index]}`} style={{ flex: `0 0 ${(weights[index] ?? 0) * 100}%` }} onClick={() => onOpen(index)}>
            {(weights[index] ?? 0) >= 0.16 ? percent(weights[index]) : ""}
          </button>
        ))}
      </div>
    </div>
  );
}

function Bars({ title, rows, onOpen, format = percent }: { title: string; rows: { name: string; value: number }[]; onOpen?: (name: string, index: number) => void; format?: (value: number) => string }) {
  return (
    <div>
      {title ? <h3 className="mb-2 font-semibold">{title}</h3> : null}
      <div className="flex flex-col gap-2">
        {rows.map((row, index) => {
          const body = (
            <>
              <div className="mb-1 flex justify-between gap-3 text-xs"><span>{row.name}</span><span>{format(row.value)}</span></div>
              <div className="h-2 bg-xinergy-charcoal/10"><div className="h-full bg-xinergy-orange" style={{ width: `${Math.max(0, Math.min(100, row.value * 100))}%` }} /></div>
            </>
          );
          return onOpen ? (
            <button key={row.name} type="button" className="text-left" onClick={() => onOpen(row.name, index)}>{body}</button>
          ) : (
            <div key={row.name}>{body}</div>
          );
        })}
      </div>
    </div>
  );
}
