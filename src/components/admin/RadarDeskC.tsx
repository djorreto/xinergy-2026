"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ChartZoom } from "@/components/admin/ChartZoom";
import { StudyDownload } from "@/components/admin/StudyDownload";
import type { ZoomSheet } from "@/lib/surveys/chart-zoom";
import { EVAL_INCLUDED, EVAL_ISOLATED, type Evaluacion } from "@/lib/surveys/evaluacion";
import { median, quartile, roleDistance, SCENARIOS, type InitiativeId } from "@/lib/surveys/radar-b/engine";
import { industryName, percent, roleName } from "@/lib/surveys/radar-b/report";
import {
  AI_STAGE,
  BARRIERS,
  BARRIER_EXCLUSIVE,
  BUDGET_DIRECTION,
  CAPABILITIES,
  DATA_READY,
  EFFORT_HOURS,
  EXPOSURE,
  INITIATIVE_COPY,
  PARTICIPATION,
  REALIZATION,
  SAVINGS,
  SAVINGS_EXPECTATION,
  SPEND_C,
  STATUSES,
  VALIDATE_FREQ,
  type Choice,
} from "@/lib/surveys/radar-c/instrument";
import { countryNames, type BenchmarkC, type PersonC } from "@/lib/surveys/radar-c/report";

const MACROS = ["Eficiencia y valor financiero", "Riesgo, sostenibilidad y control", "Transformación y capacidades"];

const dateFormat = new Intl.DateTimeFormat("es-CL", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Santiago",
});

export function RadarDeskC({ people, benchmark, publicUrl, verified }: { people: PersonC[]; benchmark: BenchmarkC; publicUrl: string; verified: boolean }) {
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
    const response = await fetch("/api/admin/surveys/radar-compras-2027-c/evaluacion", {
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
      <p className="label-editorial">Versión oficial</p>
      <h1 className="mt-2 font-display text-3xl text-xinergy-charcoal">Radar Compras 2027 · C (versión oficial)</h1>
      <p className="mt-3 max-w-3xl text-sm text-xinergy-slate">
        Prioridades, capacidades y agenda. El benchmark toma una respuesta de Compras por empresa. Finanzas y dirección quedan aparte.
        {verified ? " El motor de la versión C está verificado." : ""}
      </p>
      <p className="mt-3 text-sm text-xinergy-slate">{sampleLine(people.length, included.length)} {benchmark.companies} empresas en el benchmark.</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 border border-xinergy-charcoal/10 bg-white p-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wide text-xinergy-slate">Enlace para compartir</p>
          <a href={publicUrl} target="_blank" rel="noreferrer" className="mt-1 block break-all text-sm font-semibold text-xinergy-charcoal underline decoration-xinergy-orange underline-offset-4">{publicUrl}</a>
        </div>
        <a href={publicUrl} target="_blank" rel="noreferrer" className="btn-primary">Abrir encuesta</a>
        <button type="button" className="btn-secondary" onClick={() => { void navigator.clipboard.writeText(publicUrl).then(() => setCopied(true)); }}>{copied ? "Copiado" : "Copiar"}</button>
      </div>
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      <div className="mt-6 flex gap-2">
        <Tab on={view === "respuestas"} onClick={() => { setView("respuestas"); setSelected(null); }}>Quién respondió</Tab>
        <Tab on={view === "analisis"} onClick={() => { setView("analisis"); setSelected(null); }}>Análisis al momento</Tab>
      </div>
      {view === "respuestas" ? (
        <div className="mt-6">
          <a className="btn-secondary" href="/api/admin/surveys/radar-compras-2027-c/export">Exportar Excel</a>
          {person ? (
            <PersonAnswer person={person} busy={busy === person.id} onBack={() => setSelected(null)} onEvaluate={setEvaluacion} />
          ) : (
            <ResponseTable responses={listed} busyId={busy} onOpen={setSelected} onEvaluate={setEvaluacion} />
          )}
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          <StudyDownload href="/api/admin/surveys/radar-compras-2027-c/informe" label="Paper aplicado" busyLabel="Generando el paper…" />
          <a className="btn-secondary" href="/api/admin/surveys/radar-compras-2027-c/paper">Texto editable</a>
          <StudyDownload href="/api/admin/surveys/radar-compras-2027-c/sintesis" label="Síntesis breve" busyLabel="Generando la síntesis…" />
          <Analysis people={people} benchmark={benchmark} included={included} onZoom={setZoom} />
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
  responses: PersonC[];
  busyId: string | null;
  onOpen: (id: string) => void;
  onEvaluate: (id: string, evaluacion: Evaluacion) => void;
}) {
  if (!responses.length) {
    return <p className="mt-8 text-xinergy-slate">Todavía no hay respuestas. Cuando alguien termine la encuesta, queda en esta lista y se abre el detalle de lo que contestó.</p>;
  }
  return (
    <div className="mt-6 overflow-x-auto border border-xinergy-charcoal/10 bg-white">
      <table className="w-full min-w-[40rem] text-sm">
        <thead className="text-left text-xs uppercase tracking-wide text-xinergy-slate">
          <tr>
            <th className="p-3 font-medium">Fecha</th>
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
                  {item.empresa}
                </button>
                <span className="mt-0.5 block text-xinergy-slate">{item.email}</span>
              </td>
              <td className="p-3">{countryNames(item.paises)}</td>
              <td className="p-3">{roleName(item.rol)}{item.operational ? "" : " · ejecutiva"}</td>
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
  person: PersonC;
  busy: boolean;
  onBack: () => void;
  onEvaluate: (id: string, evaluacion: Evaluacion) => void;
}) {
  return (
    <div className="mt-6">
      <button type="button" className="text-sm text-xinergy-slate underline" onClick={onBack}>Volver al listado</button>
      <h2 className="mt-3 font-display text-2xl text-xinergy-charcoal">{person.empresa}</h2>
      <p className="mt-1 text-sm text-xinergy-slate">
        {scopeLine(person)} · {dateFormat.format(new Date(person.createdAt))} · {countryNames(person.paises)} · {roleName(person.rol)} · {industryName(person.rubro)}
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

function PersonDetail({ person }: { person: PersonC }) {
  const consistency = person.ahp ? person.ahp.maxCr.toFixed(3).replace(".", ",") : "—";
  return (
    <div className="mt-6 border-t border-xinergy-charcoal/10 pt-4 text-sm">
      <p className="text-xinergy-slate">{person.motorReason}</p>
      <p className="mt-2">Gasto declarado: {named(SPEND_C, person.spend)}</p>
      {person.weights ? (
        <div className="mt-4">
          <Bars title={`Prioridades · consistencia ${consistency} · ${className(person.ahpClass)}${person.priorityMode === "hibrido" ? " · asignación directa" : ""}`} rows={CAPABILITIES.map((item, index) => ({ name: item.short.es, value: person.weights?.[index] ?? 0 }))} />
        </div>
      ) : null}
      {person.operational ? (
        <>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {CAPABILITIES.map((item, index) => (
              <p key={item.id}>{item.short.es}: nivel {person.levels[index] ?? "no sé"} · brecha {percent(person.gaps[index])}</p>
            ))}
          </div>
          {person.g0 != null ? <p className="mt-3">Brecha de planificación {percent(person.g0)}, respecto de nivel 4.</p> : null}
          <div className="mt-4 grid gap-2">
            <p>Ahorro validado: {named(SAVINGS, person.context.e1)}</p>
            <p>Parte reconocida por Finanzas: {named(REALIZATION, person.context.e2)}</p>
            <p>Gasto sin alternativa viable: {named(EXPOSURE, person.context.e3)}</p>
            <p>Trabajo para validar el gasto: {named(EFFORT_HOURS, person.context.e4)}</p>
            <p>Etapa de IA: {named(AI_STAGE, person.context.e5)}</p>
            <p>Datos para IA: {named(DATA_READY, person.context.r1)}</p>
            <p>Barreras: {person.barriers.map((item) => named([...BARRIERS, ...BARRIER_EXCLUSIVE], item)).join(", ") || "—"}</p>
          </div>
          <div className="mt-4 grid gap-2">
            {INITIATIVE_COPY.map((item) => (
              <p key={item.id}>{item.name.es}: {named(STATUSES, person.agenda[item.id] ?? "")}</p>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {person.scenarios.map((scenario) => (
              <div key={scenario.id}>
                <p className="font-semibold capitalize">{scenario.id}</p>
                {scenario.closure != null ? (
                  <p>{scenario.ids.map((id) => initiativeName(id)).join(", ") || "Portafolio vacío"} · cierre modelado {percent(scenario.closure)}</p>
                ) : <p>{scenario.reason}</p>}
              </div>
            ))}
          </div>
          <p className="mt-3">Similitud con lo aprobado: {percent(person.similarity)}. {person.etaReason || `Alineación ${percent(person.eta)}.`}</p>
        </>
      ) : (
        <div className="mt-4 grid gap-2">
          {person.rol === "cfo" ? (
            <>
              <p>Ahorro que espera para 2027: {named(SAVINGS_EXPECTATION, person.context.f1)}</p>
              <p>Validación de Finanzas: {named(VALIDATE_FREQ, person.context.f2)}</p>
            </>
          ) : (
            <>
              <p>Presupuesto de eficiencia para 2027: {named(BUDGET_DIRECTION, person.context.g1)}</p>
              <p>Cuándo entra Compras a esas decisiones: {named(PARTICIPATION, person.context.g2)}</p>
            </>
          )}
        </div>
      )}
      {person.desafio.trim() ? <p className="mt-4 border-l-2 border-xinergy-orange pl-3">{person.desafio}</p> : null}
    </div>
  );
}

function Analysis({ people, benchmark, included, onZoom }: { people: PersonC[]; benchmark: BenchmarkC; included: PersonC[]; onZoom: (sheet: ZoomSheet) => void }) {
  const priority = people.filter((person) => benchmark.priorityIds.includes(person.id));
  const principals = people.filter((person) => benchmark.principalIds.includes(person.id));
  const motor = principals.filter((person) => person.scenarios.some((item) => item.id === "balanced" && item.closure != null));
  const capability = CAPABILITIES.map((_, index) => {
    const values = principals.map((person) => person.levels[index]).filter((level): level is number => level != null);
    return { median: median(values), q1: quartile(values, 0.25), q3: quartile(values, 0.75), n: values.length };
  });
  const gapped = priority.filter((person) => person.strategic && person.g0 != null);
  const gapMean = gapped.length ? gapped[0].strategic!.map((_, index) => gapped.reduce((sum, person) => sum + (person.strategic?.[index] ?? 0), 0) / gapped.length) : null;
  const open = included.filter((person) => person.desafio.trim());
  const pairs = rolePairs(included);
  const topIndex = benchmark.aip ? benchmark.aip.indexOf(Math.max(...benchmark.aip)) : -1;
  const countries = new Set(included.flatMap((person) => person.paises)).size;

  return (
    <div className="mt-6 flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="respuestas incluidas" value={String(included.length)} onClick={() => onZoom(peopleZoom("Respuestas incluidas", "Estas respuestas entran al análisis. Las aisladas quedan guardadas y no se usan aquí.", included, (person) => roleName(person.rol)))} />
        <Kpi label="empresas en el benchmark" value={String(benchmark.companies)} onClick={() => onZoom(peopleZoom("Benchmark", "Una respuesta de Compras por empresa. Si hay dos del mismo rol, la empresa no entra.", principals, (person) => roleName(person.rol)))} />
        <Kpi label="países en la muestra" value={String(countries)} onClick={() => onZoom(peopleZoom("Países", "Países del alcance. Una respuesta puede marcar más de uno.", included, (person) => countryNames(person.paises)))} />
        <Kpi label={topIndex >= 0 ? CAPABILITIES[topIndex].short.es : "prioridad principal"} value={topIndex >= 0 ? percent(benchmark.aip?.[topIndex]) : "—"} onClick={() => { if (topIndex >= 0) onZoom(peopleZoom(CAPABILITIES[topIndex].short.es, "Peso de esa prioridad en cada empresa del promedio.", priority, (person) => percent(person.weights?.[topIndex]))); }} />
      </div>
      {benchmark.duplicates.length ? <p className="border border-xinergy-orange/40 bg-[#FFF1D6] px-4 py-3 text-sm">Hay más de un responsable de Compras en {benchmark.duplicates.join(", ")}. Esas empresas quedan fuera del benchmark hasta consolidarlas.</p> : null}
      <section>
        <h2 className="font-display text-2xl">Prioridades del benchmark</h2>
        <p className="mt-1 text-sm text-xinergy-slate">Promedio aritmético de las prioridades de la respuesta principal de cada empresa, solo con consistencia hasta 0,10. Una empresa pesa una vez. Clic en una barra para ver quién la compone.</p>
        {benchmark.aip ? (
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <MacroBar weights={benchmark.macro ?? []} onOpen={(index) => onZoom(peopleZoom(MACROS[index], "Peso del grupo en cada empresa del promedio.", priority, (person) => percent(person.ahp?.macro.weights[index])))} />
            <Bars title="Ocho prioridades" rows={CAPABILITIES.map((item, index) => ({ name: item.short.es, value: benchmark.aip?.[index] ?? 0 }))} onOpen={(name, index) => onZoom(peopleZoom(name, "Peso individual y el promedio de la barra.", priority, (person) => percent(person.weights?.[index])))} />
          </div>
        ) : <p className="mt-3 text-sm text-xinergy-slate">Aún no hay una respuesta principal de Compras con prioridades consistentes.</p>}
      </section>
      <section>
        <h2 className="font-display text-2xl">Capacidad y brecha de planificación</h2>
        <p className="mt-1 text-sm text-xinergy-slate">La meta visible es nivel 4. La brecha estratégica es peso por brecha, calculada en cada empresa y después promediada.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b"><th className="py-2 pr-3">Capacidad</th><th className="py-2 pr-3">Mediana</th><th className="py-2 pr-3">Rango intercuartil</th><th className="py-2">Brecha estratégica media</th></tr></thead>
            <tbody>
              {CAPABILITIES.map((item, index) => {
                const stat = capability[index];
                return (
                  <tr key={item.id} className="border-b border-xinergy-charcoal/10">
                    <td className="py-2 pr-3">
                      <button type="button" className="text-left underline decoration-xinergy-charcoal/20" onClick={() => onZoom(peopleZoom(item.short.es, "Nivel declarado por cada empresa del benchmark. “No sé” no entra en la mediana.", principals.filter((person) => person.levels[index] != null), (person) => `Nivel ${person.levels[index]}`))}>{item.short.es}</button>
                    </td>
                    <td className="py-2 pr-3">{levelText(stat.median)} <span className="text-xinergy-slate">n={stat.n}</span></td>
                    <td className="py-2 pr-3">{levelText(stat.q1)} – {levelText(stat.q3)}</td>
                    <td className="py-2">{percent(gapMean?.[index])}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="font-display text-2xl">Agenda modelada y agenda aprobada</h2>
        <p className="mt-1 text-sm text-xinergy-slate">Entre empresas con portafolio. La barra es la selección modelada. El texto muestra también la aprobación nueva.</p>
        {SCENARIOS.map((scenario) => (
          <div key={scenario.id} className="mt-4">
            <h3 className="font-semibold capitalize">{scenario.id} · costo {scenario.budget} · esfuerzo {scenario.effort} · hasta {scenario.maxCount}</h3>
            <Bars
              title=""
              rows={INITIATIVE_COPY.map((item) => {
                const id = item.id as InitiativeId;
                const selected = share(motor, (person) => person.scenarios.find((entry) => entry.id === scenario.id)?.ids.includes(id) ?? false);
                const approved = share(motor, (person) => person.declared.includes(id));
                return { name: `${item.name.es} · aprobado ${percent(approved)}`, value: selected };
              })}
              onOpen={(_, index) => {
                const item = INITIATIVE_COPY[index];
                const id = item.id as InitiativeId;
                onZoom(peopleZoom(item.name.es, `Escenario ${scenario.id}. Quién la tiene en el portafolio y quién ya la aprobó.`, motor, (person) => {
                  const selected = person.scenarios.find((entry) => entry.id === scenario.id)?.ids.includes(id) ? "entra en el portafolio" : "no entra";
                  const approved = person.declared.includes(id) ? "aprobada" : "sin aprobación nueva";
                  return `${selected} · ${approved}`;
                }));
              }}
            />
          </div>
        ))}
      </section>
      <section>
        <h2 className="font-display text-2xl">Finanzas y Compras en la misma empresa</h2>
        {pairs.length === 0 ? <p className="mt-2 text-sm text-xinergy-slate">Todavía no hay un par CFO–CPO con prioridades consistentes.</p> : (
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {pairs.map((pair) => (
              <li key={pair.empresa}>{pair.empresa}: distancia {percent(pair.distance)}. Diferencia de peso del grupo financiero, CFO menos Compras: {percent(pair.fin)}.</li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <button type="button" className="font-display text-2xl" onClick={() => onZoom(peopleZoom("Cambio para 2027", "Textos de las respuestas incluidas.", open, (person) => person.desafio))}>Cambio que piden para 2027</button>
        {open.length === 0 ? <p className="mt-2 text-sm text-xinergy-slate">Sin respuestas abiertas en el corte incluido.</p> : (
          <ul className="mt-3 flex flex-col gap-3">
            {open.map((item) => (
              <li key={item.id} className="border-l-2 border-xinergy-orange pl-3 text-sm"><span className="font-semibold">{item.empresa}. </span>{item.desafio}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function rolePairs(people: PersonC[]) {
  const groups = new Map<string, PersonC[]>();
  for (const person of people) {
    if (person.ahpClass !== "principal" || !person.weights || !person.ahp) continue;
    const key = `${person.empresa.trim().toLocaleLowerCase("es")}|${person.alcance}|${person.unidad.trim().toLocaleLowerCase("es")}`;
    groups.set(key, [...(groups.get(key) ?? []), person]);
  }
  const pairs: { empresa: string; distance: number; fin: number }[] = [];
  for (const group of groups.values()) {
    const cfos = group.filter((person) => person.rol === "cfo");
    const cpos = group.filter((person) => person.rol === "cpo");
    if (cfos.length !== 1 || cpos.length !== 1 || !cfos[0].weights || !cpos[0].weights || !cfos[0].ahp || !cpos[0].ahp) continue;
    pairs.push({
      empresa: cpos[0].empresa,
      distance: roleDistance(cfos[0].weights, cpos[0].weights),
      fin: cfos[0].ahp.macro.weights[0] - cpos[0].ahp.macro.weights[0],
    });
  }
  return pairs;
}

function scopeLine(person: PersonC) {
  if (person.alcance === "unidad") return person.unidad ? `Unidad: ${person.unidad}` : "Unidad de negocio";
  if (person.alcance === "multipais") return "Corporativo multipaís";
  if (person.alcance === "pais") return "Un país";
  return "Alcance sin indicar";
}

function className(value: PersonC["ahpClass"]) {
  if (value === "principal") return "entra al promedio";
  if (value === "exploratorio") return "exploratorio";
  if (value === "excluido") return "fuera del promedio";
  return "sin consistencia";
}

function named(options: readonly Choice[], value: string) {
  if (!value) return "—";
  return options.find((item) => item.v === value)?.es ?? value;
}

function initiativeName(id: string) {
  return INITIATIVE_COPY.find((item) => item.id === id)?.name.es ?? id;
}

function levelText(value: number | null) {
  if (value == null) return "—";
  return String(value).replace(".", ",");
}

function share(people: PersonC[], test: (person: PersonC) => boolean) {
  if (!people.length) return 0;
  return people.filter(test).length / people.length;
}

function peopleZoom(title: string, note: string, people: PersonC[], line: (person: PersonC) => string): ZoomSheet {
  return {
    title,
    note,
    sections: [{
      heading: people.length === 1 ? "1 respuesta" : `${people.length} respuestas`,
      lines: people.length ? people.map((person) => ({ label: `${person.empresa} · ${roleName(person.rol)}`, value: line(person) })) : [{ label: "Nadie de este corte entra en este dato.", value: "" }],
    }],
  };
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
            <button key={`${row.name}-${index}`} type="button" className="text-left" onClick={() => onOpen(row.name, index)}>{body}</button>
          ) : (
            <div key={`${row.name}-${index}`}>{body}</div>
          );
        })}
      </div>
    </div>
  );
}
