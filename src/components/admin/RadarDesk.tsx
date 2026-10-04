"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ExecutiveBriefPanel } from "@/components/admin/ExecutiveBrief";
import { AhpPanel } from "@/components/survey/AhpPanel";
import { aggregateAhp, analyzeAhp } from "@/lib/surveys/ahp";
import { formatQuestion, formatStored, openAnswerAuthor } from "@/lib/surveys/present";
import {
  CONSENTS,
  EMP,
  QUESTION_SECTIONS,
  REG,
  S4,
  S5,
  S6,
  S7,
  isVisible,
  tx,
  type Question,
} from "@/lib/surveys/radar-2027";
import type { StoredBrief } from "@/lib/surveys/executive";
import { EVAL_INCLUDED, EVAL_ISOLATED, isIncluded, type Evaluacion } from "@/lib/surveys/evaluacion";

export type RadarAnswer = {
  id: string;
  createdAt: string;
  language: "es" | "en" | "pt";
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  linkedin: string | null;
  cargo: string;
  empresa: string;
  pais: string;
  rol: string;
  rolGrupo: string;
  antiguedad: string;
  rubro: string;
  rubroGrupo: string | null;
  consents: Record<string, boolean>;
  company: Record<string, unknown>;
  answers: Record<string, unknown>;
  evaluacion: Evaluacion;
  evaluacionAt: string | null;
  evaluacionPor: string | null;
};

const dateFormat = new Intl.DateTimeFormat("es-CL", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Santiago",
});

export function RadarDesk({ responses, publicUrl, brief }: { responses: RadarAnswer[]; publicUrl: string; brief: StoredBrief | null }) {
  const router = useRouter();
  const [rows, setRows] = useState(responses);
  const [known, setKnown] = useState(responses);
  const [view, setView] = useState<"respuestas" | "analisis">("respuestas");
  const [selected, setSelected] = useState<string | null>(null);
  const [pais, setPais] = useState("todos");
  const [rol, setRol] = useState("todos");
  const [rubro, setRubro] = useState("todos");
  const [copied, setCopied] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [evalError, setEvalError] = useState("");
  if (responses !== known) {
    setKnown(responses);
    setRows(responses);
  }
  const person = rows.find((item) => item.id === selected) ?? null;
  const included = rows.filter((item) => isIncluded(item.evaluacion));
  const filtered = included.filter((item) => (pais === "todos" || item.pais === pais) && (rol === "todos" || item.rol === rol) && (rubro === "todos" || item.rubro === rubro));

  async function setEvaluacion(id: string, evaluacion: Evaluacion) {
    setBusyId(id);
    setEvalError("");
    try {
      const response = await fetch("/api/admin/surveys/radar-compras-2027/evaluacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, evaluacion }),
      });
      const payload = (await response.json()) as { ok?: boolean; evaluacion?: Evaluacion; evaluacionAt?: string | null; evaluacionPor?: string | null };
      if (!response.ok || !payload.ok || !payload.evaluacion) {
        setEvalError("No se pudo actualizar la evaluación. Intenta otra vez.");
        setBusyId(null);
        return;
      }
      setRows((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, evaluacion: payload.evaluacion ?? evaluacion, evaluacionAt: payload.evaluacionAt ?? item.evaluacionAt, evaluacionPor: payload.evaluacionPor ?? item.evaluacionPor }
            : item,
        ),
      );
      router.refresh();
    } catch {
      setEvalError("No se pudo actualizar la evaluación. Intenta otra vez.");
    }
    setBusyId(null);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <p className="label-editorial">Encuestas y formularios</p>
      <h1 className="mt-2 font-display text-3xl text-xinergy-charcoal">Radar de Compras LatAm 2027</h1>
      <div className="mt-4 flex flex-wrap items-center gap-3 border border-xinergy-charcoal/10 bg-white p-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wide text-xinergy-slate">Enlace para compartir</p>
          <a href={publicUrl} target="_blank" rel="noreferrer" className="mt-1 block break-all text-sm font-semibold text-xinergy-charcoal underline decoration-xinergy-orange underline-offset-4">
            {publicUrl}
          </a>
        </div>
        <a href={publicUrl} target="_blank" rel="noreferrer" className="btn-primary">
          Abrir encuesta
        </a>
        <button type="button" className="btn-secondary" onClick={copyLink}>
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <p className="mt-3 text-sm text-xinergy-slate">
        Este enlace no está en el menú del sitio ni en los buscadores. {sampleLine(rows.length, included.length)}
      </p>

      <div className="mt-6 flex gap-2">
        <Tab on={view === "respuestas"} onClick={() => { setView("respuestas"); setSelected(null); }}>
          Quién respondió
        </Tab>
        <Tab on={view === "analisis"} onClick={() => setView("analisis")}>
          Análisis al momento
        </Tab>
      </div>

      {view === "respuestas" ? (
        <div className="mt-6">
          <a className="btn-secondary" href="/api/admin/surveys/radar-compras-2027/export?tipo=respuestas">
            Exportar Excel
          </a>
          {evalError ? <p className="mt-3 text-sm font-medium text-red-700">{evalError}</p> : null}
          {person ? (
            <AnswerDetail person={person} busy={busyId === person.id} onBack={() => setSelected(null)} onEvaluate={setEvaluacion} />
          ) : (
            <ResponseTable responses={rows} busyId={busyId} onOpen={setSelected} onEvaluate={setEvaluacion} />
          )}
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-10">
          <div className="flex flex-wrap gap-3">
            <a className="btn-secondary" href="/api/admin/surveys/radar-compras-2027/export?tipo=analisis">
              Exportar Excel del análisis
            </a>
            <a className="btn-secondary" href="/api/admin/surveys/radar-compras-2027/export?tipo=pdf">
              Exportar PDF preliminar
            </a>
          </div>
          <ExecutiveBriefPanel initial={brief} responses={included} />
          {included.length ? (
            <div>
              <p className="label-editorial">Detalle del cálculo</p>
              <h2 className="mt-2 font-display text-2xl text-xinergy-charcoal">Pregunta por pregunta</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-xinergy-slate">
                Aquí queda el modelo completo: matrices, consistencia y cada pregunta. Los filtros solo mueven este detalle. La vista ejecutiva y este detalle usan las respuestas incluidas en el análisis.
              </p>
            </div>
          ) : null}
          <Analysis responses={filtered} all={included} received={rows.length} pais={pais} rol={rol} rubro={rubro} onPais={setPais} onRol={setRol} onRubro={setRubro} />
        </div>
      )}
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

function EvaluationControl({
  person,
  busy,
  onEvaluate,
}: {
  person: RadarAnswer;
  busy: boolean;
  onEvaluate: (id: string, evaluacion: Evaluacion) => void;
}) {
  const isolated = !isIncluded(person.evaluacion);
  return (
    <div className="flex max-w-xs flex-col items-start gap-2">
      <span className={isolated ? "border border-xinergy-charcoal bg-xinergy-ivory px-2 py-1 text-xs font-semibold text-xinergy-charcoal" : "text-xs text-xinergy-slate"}>{person.evaluacion}</span>
      {person.evaluacionAt ? (
        <span className="text-xs text-xinergy-slate">
          {dateFormat.format(new Date(person.evaluacionAt))}
          {person.evaluacionPor ? ` · ${person.evaluacionPor}` : ""}
        </span>
      ) : null}
      <button
        type="button"
        className="text-left text-sm font-semibold text-xinergy-charcoal underline decoration-xinergy-orange underline-offset-4 disabled:opacity-60"
        disabled={busy}
        onClick={() => onEvaluate(person.id, isolated ? EVAL_INCLUDED : EVAL_ISOLATED)}
      >
        {busy ? "Guardando…" : isolated ? "Incluir en análisis" : "Aislar de la evaluación"}
      </button>
    </div>
  );
}

function sampleLine(total: number, includedCount: number) {
  if (!total) return "Todavía no hay respuestas.";
  const received = total === 1 ? "Hay 1 respuesta." : `Hay ${total} respuestas.`;
  const isolated = total - includedCount;
  if (!isolated) return `${received} Todas entran al análisis.`;
  return `${received} ${isolated === 1 ? "1 está aislada de la evaluación." : `${isolated} están aisladas de la evaluación.`}`;
}

function ResponseTable({
  responses,
  busyId,
  onOpen,
  onEvaluate,
}: {
  responses: RadarAnswer[];
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
              <td className="p-3">{labelOf("pais", item.pais)}</td>
              <td className="p-3">{labelOf("rol", item.rol)}</td>
              <td className="p-3">
                <EvaluationControl person={item} busy={busyId === item.id} onEvaluate={onEvaluate} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AnswerDetail({
  person,
  busy,
  onBack,
  onEvaluate,
}: {
  person: RadarAnswer;
  busy: boolean;
  onBack: () => void;
  onEvaluate: (id: string, evaluacion: Evaluacion) => void;
}) {
  const ahp = analyzeAhp(recordOf(person.answers.prioridades_ahp));
  return (
    <div className="mt-6">
      <button type="button" className="text-sm text-xinergy-slate underline" onClick={onBack}>
        Volver al listado
      </button>
      <h2 className="mt-3 font-display text-2xl text-xinergy-charcoal">
        {person.nombre} {person.apellido}
      </h2>
      <p className="mt-1 text-sm text-xinergy-slate">
        {person.empresa} · {dateFormat.format(new Date(person.createdAt))} · {person.language === "pt" ? "Portugués" : person.language === "en" ? "Inglés" : "Español"}
      </p>
      <div className="mt-4">
        <EvaluationControl person={person} busy={busy} onEvaluate={onEvaluate} />
      </div>
      <Block title="Registro">
        {REG.map((question) => (
          <Line key={question.id} label={tx(question.label, "es")} value={registrationValue(person, question.id)} />
        ))}
      </Block>
      <Block title="Aprobaciones">
        {CONSENTS.map((item) => (
          <Line key={item.id} label={tx(item.label, "es")} value={person.consents[item.id] ? "Sí" : "No"} />
        ))}
      </Block>
      <Block title="Empresa">
        {EMP.map((question) => (
          <Line key={question.id} label={tx(question.label, "es")} value={formatQuestion(question, person.company[question.id])} />
        ))}
      </Block>
      {QUESTION_SECTIONS.map((section) => {
        const questions = section.questions.filter((question) => isVisible(question, person.rolGrupo, person.rubroGrupo) && question.type !== "ahp");
        if (!questions.length && section.id !== "s4") return null;
        return (
          <Block key={section.id} title={sectionTitle(section.id)}>
            {section.id === "s4" && ahp ? <AhpPanel analysis={ahp} title="Priorización de esta persona" /> : null}
            {questions.map((question) => (
              <Line
                key={question.id}
                label={tx(question.label, "es")}
                value={[formatQuestion(question, person.answers[question.id]), typeof person.answers[`${question.id}_otro`] === "string" ? String(person.answers[`${question.id}_otro`]) : ""]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ))}
          </Block>
        );
      })}
    </div>
  );
}

function Analysis({
  responses,
  all,
  received,
  pais,
  rol,
  rubro,
  onPais,
  onRol,
  onRubro,
}: {
  responses: RadarAnswer[];
  all: RadarAnswer[];
  received: number;
  pais: string;
  rol: string;
  rubro: string;
  onPais: (value: string) => void;
  onRol: (value: string) => void;
  onRubro: (value: string) => void;
}) {
  const ahp = useMemo(() => aggregateAhp(responses.map((item) => recordOf(item.answers.prioridades_ahp)).filter((item): item is Record<string, string> => item != null)), [responses]);
  if (!received) {
    return (
      <div className="mt-6 max-w-2xl text-sm leading-relaxed text-xinergy-slate">
        <p className="font-semibold text-xinergy-charcoal">El análisis está vacío porque todavía no hay respuestas.</p>
        <p className="mt-2">
          Con la primera respuesta aparecen la priorización AHP (pesos que suman 100%, ranking con barras y consistencia), los porcentajes de cada pregunta y los cortes por país, rol y rubro.
        </p>
      </div>
    );
  }
  if (!all.length) {
    return (
      <div className="mt-6 max-w-2xl text-sm leading-relaxed text-xinergy-slate">
        <p className="font-semibold text-xinergy-charcoal">El análisis no tiene respuestas incluidas.</p>
        <p className="mt-2">Las que llegaron están aisladas de la evaluación. Siguen en Quién respondió y se pueden volver a incluir.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-3 sm:grid-cols-3">
        <Filter label="País" value={pais} onChange={onPais} options={unique(all, "pais")} />
        <Filter label="Rol" value={rol} onChange={onRol} options={unique(all, "rol")} />
        <Filter label="Rubro" value={rubro} onChange={onRubro} options={unique(all, "rubro")} />
      </div>
      <p className="text-sm text-xinergy-slate">
        {responses.length === 1 ? "1 respuesta en este corte." : `${responses.length} respuestas en este corte.`} Para publicar cifras, el estudio usa grupos de al menos 5 respuestas. Aquí se ve el corte actual, aunque haya menos.
      </p>
      {!responses.length ? <p className="text-xinergy-slate">No hay respuestas con esos filtros.</p> : null}
      {ahp ? (
        <AhpPanel
          analysis={ahp}
          title="Priorización consolidada"
          note="Los pesos suman 100%. Cada comparación entre personas se agrega con la media geométrica y después se recalcula el ranking."
        />
      ) : null}
      <Breakdown title="País" rows={tally(responses, (item) => labelOf("pais", item.pais))} />
      <Breakdown title="Rol" rows={tally(responses, (item) => labelOf("rol", item.rol))} />
      <Breakdown title="Rubro" rows={tally(responses, (item) => labelOf("rubro", item.rubro))} />
      {[...S4, ...S5, ...S6, ...S7].filter((question) => question.type !== "ahp").map((question) => (
        <QuestionBreakdown key={question.id} question={question} responses={responses} />
      ))}
    </div>
  );
}

function QuestionBreakdown({ question, responses }: { question: Question; responses: RadarAnswer[] }) {
  const audience = responses.filter((item) => isVisible(question, item.rolGrupo, item.rubroGrupo));
  if (!audience.length) return null;
  if (question.type === "single" || question.type === "select") {
    return <Breakdown title={tx(question.label, "es")} rows={tally(audience, (item) => formatQuestion(question, item.answers[question.id]))} />;
  }
  if (question.type === "multi") {
    const rows = question.options.map((option) => {
      const count = audience.filter((item) => Array.isArray(item.answers[question.id]) && (item.answers[question.id] as string[]).includes(option.v)).length;
      return { label: tx(option, "es"), count };
    });
    return <Breakdown title={tx(question.label, "es")} rows={rows} total={audience.length} />;
  }
  if (question.type === "scale") {
    const scores = audience.map((item) => Number(item.answers[question.id])).filter((value) => value >= 1 && value <= 5);
    if (!scores.length) return null;
    const mean = scores.reduce((sum, value) => sum + value, 0) / scores.length;
    return (
      <section>
        <h3 className="font-display text-lg text-xinergy-charcoal">{tx(question.label, "es")}</h3>
        <p className="mt-1 text-sm text-xinergy-slate">Promedio {mean.toFixed(2).replace(".", ",")} de 5 · {scores.length} respuestas</p>
        <Breakdown title="" rows={[1, 2, 3, 4, 5].map((score) => ({ label: String(score), count: scores.filter((value) => value === score).length }))} />
      </section>
    );
  }
  if (question.type === "matrix") {
    return (
      <section>
        <h3 className="font-display text-lg text-xinergy-charcoal">{tx(question.label, "es")}</h3>
        <div className="mt-3 flex flex-col gap-3">
          {question.rows.map((row) => {
            const scores = audience.map((item) => Number(recordOf(item.answers[question.id])?.[row.v])).filter((value) => value >= 1 && value <= 5);
            const mean = scores.length ? scores.reduce((sum, value) => sum + value, 0) / scores.length : 0;
            return (
              <div key={row.v}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span>{tx(row, "es")}</span>
                  <span className="font-semibold">{scores.length ? mean.toFixed(2).replace(".", ",") : "—"}</span>
                </div>
                <span className="mt-1 block h-1.5 bg-xinergy-charcoal/10">
                  <span className="block h-full bg-xinergy-orange" style={{ width: `${(mean / 5) * 100}%` }} />
                </span>
              </div>
            );
          })}
        </div>
      </section>
    );
  }
  if (question.type === "textarea") {
    const notes = audience
      .map((item) => {
        const value = item.answers[question.id];
        return typeof value === "string" ? value.trim() : "";
      })
      .filter(Boolean);
    if (!notes.length) return null;
    return (
      <section>
        <h3 className="font-display text-lg text-xinergy-charcoal">{tx(question.label, "es")}</h3>
        <ul className="mt-3 space-y-2 text-sm text-xinergy-slate">
          {audience.map((item) => {
            const value = item.answers[question.id];
            const note = typeof value === "string" ? value.trim() : "";
            if (!note) return null;
            return (
              <li key={item.id} className="border border-xinergy-charcoal/10 bg-white p-3">
                <span className="font-semibold text-xinergy-charcoal">{openAnswerAuthor(responses, item)}</span>
                <p className="mt-1 whitespace-pre-wrap">{note}</p>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }
  return null;
}

function Breakdown({ title, rows, total }: { title: string; rows: { label: string; count: number }[]; total?: number }) {
  const visible = rows.filter((row) => row.label && row.label !== "—");
  if (!visible.length) return null;
  const base = total ?? visible.reduce((sum, row) => sum + row.count, 0);
  const top = Math.max(...visible.map((row) => row.count), 1);
  return (
    <section>
      {title ? <h3 className="font-display text-lg text-xinergy-charcoal">{title}</h3> : null}
      <div className="mt-3 flex flex-col gap-2">
        {visible.map((row) => (
          <div key={row.label}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span>{row.label}</span>
              <span className="text-xinergy-slate">
                {row.count} · {base ? `${Math.round((row.count / base) * 100)}%` : "0%"}
              </span>
            </div>
            <span className="mt-1 block h-1.5 bg-xinergy-charcoal/10">
              <span className="block h-full bg-xinergy-orange" style={{ width: `${(row.count / top) * 100}%` }} />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="text-sm">
      <span className="mb-1 block text-xinergy-slate">{label}</span>
      <select className="w-full border border-xinergy-charcoal/15 bg-white px-3 py-2" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="todos">Todos</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h3 className="font-display text-xl text-xinergy-charcoal">{title}</h3>
      <div className="mt-3 flex flex-col gap-3">{children}</div>
    </section>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-xinergy-charcoal/10 pb-3">
      <p className="text-sm font-semibold text-xinergy-charcoal">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm text-xinergy-slate">{value || "—"}</p>
    </div>
  );
}

function registrationValue(person: RadarAnswer, id: string) {
  const map: Record<string, string | null> = {
    nombre: person.nombre,
    apellido: person.apellido,
    rol: labelOf("rol", person.rol),
    cargo: person.cargo,
    empresa: person.empresa,
    pais: labelOf("pais", person.pais),
    antiguedad: labelOf("antiguedad", person.antiguedad),
    email: person.email,
    telefono: person.telefono,
    linkedin: person.linkedin,
  };
  return map[id] || "—";
}

function labelOf(id: string, value: string) {
  return formatStored(id, value);
}

function unique(responses: RadarAnswer[], key: "pais" | "rol" | "rubro") {
  const values = [...new Set(responses.map((item) => item[key]))];
  return values.map((value) => ({ value, label: labelOf(key, value) }));
}

function tally(responses: RadarAnswer[], label: (item: RadarAnswer) => string) {
  const counts = new Map<string, number>();
  for (const item of responses) {
    const name = label(item);
    if (!name || name === "—") continue;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts.entries()].map(([name, count]) => ({ label: name, count }));
}

function recordOf(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const entries = Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string");
  return Object.fromEntries(entries);
}

function sectionTitle(id: string) {
  if (id === "s4") return "Entorno y riesgo";
  if (id === "s5") return "Tecnología, datos e IA";
  if (id === "s6") return "Su rol";
  return "Proyectos y talento";
}
