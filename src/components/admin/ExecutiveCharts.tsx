"use client";

import { aggregateAhp, ahpLabel, formatPercent } from "@/lib/surveys/ahp";
import { ahpZoom, distributionZoom, questionZoom, zoomWho, type ZoomPerson, type ZoomSheet } from "@/lib/surveys/chart-zoom";
import { formatStored } from "@/lib/surveys/present";
import { AHP, SETS, questionById, tx } from "@/lib/surveys/radar-2027";

type Person = ZoomPerson;

const MACRO_COLOR = ["bg-xinergy-orange", "bg-xinergy-charcoal", "bg-xinergy-beige"];
const MACRO_TEXT = ["text-xinergy-charcoal", "text-white", "text-xinergy-charcoal"];

function recordOf(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, string>;
}

function optionsOf(id: string) {
  const question = questionById(id);
  return question && "options" in question ? question.options : [];
}

function counts(people: Person[], id: "pais" | "rol" | "rubro") {
  const map = new Map<string, number>();
  for (const person of people) {
    const label = formatStored(id, person[id]);
    if (!label || label === "—") continue;
    map.set(label, (map.get(label) ?? 0) + 1);
  }
  return [...map.entries()].sort((left, right) => right[1] - left[1]).map(([label, count]) => ({ label, count }));
}

function scaleReading(id: string, people: Person[]) {
  const question = questionById(id);
  if (!question || question.type !== "scale") return null;
  const scores = people.map((person) => Number(person.answers[id])).filter((value) => value >= 1 && value <= 5);
  if (!scores.length) return null;
  const mean = scores.reduce((sum, value) => sum + value, 0) / scores.length;
  const anchors = question.anchors ?? (question.set ? SETS[question.set] : []);
  const phrase = anchors[Math.round(mean) - 1];
  return { mean, phrase: phrase ? tx(phrase, "es") : "", n: scores.length };
}

function choiceReading(id: string, people: Person[], source: "company" | "answers") {
  const options = optionsOf(id);
  if (!options.length) return null;
  const values = people.map((person) => (source === "company" ? person.company[id] : person.answers[id])).filter((value): value is string => typeof value === "string" && value.length > 0);
  if (!values.length) return null;
  const rows = options
    .map((option) => ({ label: tx(option, "es"), count: values.filter((value) => value === option.v).length }))
    .filter((row) => row.count > 0)
    .sort((left, right) => right.count - left.count);
  return { winner: rows[0], rows, n: values.length };
}

function matrixReading(id: string, rowId: string, people: Person[]) {
  const question = questionById(id);
  if (!question || question.type !== "matrix") return null;
  const row = question.rows.find((item) => item.v === rowId);
  const scores = people.map((person) => Number(recordOf(person.answers[id])?.[rowId])).filter((value) => value >= 1 && value <= 5);
  if (!row || !scores.length) return null;
  const mean = scores.reduce((sum, value) => sum + value, 0) / scores.length;
  const phrase = SETS[question.set][Math.round(mean) - 1];
  return { title: tx(row, "es"), mean, phrase: phrase ? tx(phrase, "es") : "", n: scores.length };
}

export function ExecutiveCharts({ people, onZoom }: { people: Person[]; onZoom: (sheet: ZoomSheet) => void }) {
  if (!people.length) return null;
  const ahp = aggregateAhp(people.map((person) => recordOf(person.answers.prioridades_ahp)).filter((item): item is Record<string, string> => Boolean(item)));
  const ranking = ahp ? Object.entries(ahp.global).sort((left, right) => right[1] - left[1]) : [];
  const countries = optionsOf("pais");
  const roles = optionsOf("rol");
  const countryCounts = new Map(people.map((person) => [person.pais, 0]));
  for (const person of people) countryCounts.set(person.pais, (countryCounts.get(person.pais) ?? 0) + 1);
  const roleCounts = new Map<string, number>();
  for (const person of people) roleCounts.set(person.rol, (roleCounts.get(person.rol) ?? 0) + 1);
  const industries = counts(people, "rubro");
  const top = ranking[0];
  const ready = people.length >= 5;
  function openQuestion(questionId: string, focus?: string | null) {
    const question = questionById(questionId);
    if (question) onZoom(questionZoom(question, people, focus));
  }
  const signals = [
    { caption: "Gasto que gestiona compras", questionId: "gestionado", ...spread(choiceReading("gestionado", people, "company")) },
    { caption: "Modelo de compras", questionId: "estructura", ...spread(choiceReading("estructura", people, "company")) },
    { caption: "Tecnología de compras", questionId: "tec_satisf", ...spread(scaleReading("tec_satisf", people)) },
    { caption: "Uso de IA en compras", questionId: "ia_nivel", ...spread(scaleReading("ia_nivel", people)) },
    { caption: "Demora en cifras confiables", questionId: "datos_confianza", ...spread(choiceReading("datos_confianza", people, "answers")) },
    { caption: "Proveedores críticos", questionId: "r_madurez", focus: matrixReading("r_madurez", "criticos", people)?.title, ...spread(matrixReading("r_madurez", "criticos", people)) },
  ].filter((item) => item.ready);

  return (
    <div className="mt-8 flex flex-col gap-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          value={String(people.length)}
          label={people.length === 1 ? "respuesta" : "respuestas"}
          onClick={() =>
            onZoom({
              title: "Respuestas incluidas",
              note: "Estas respuestas entran a los gráficos de la vista ejecutiva.",
              sections: [{ heading: people.length === 1 ? "1 respuesta" : `${people.length} respuestas`, lines: people.map((person) => ({ label: zoomWho(person), value: formatStored("pais", person.pais) })) }],
            })
          }
        />
        <Kpi value={`${[...countryCounts.keys()].length} de ${countries.length || 7}`} label="países del radar" onClick={() => onZoom(distributionZoom("País", "Cada país del radar y quién de este corte lo eligió.", people, (person) => formatStored("pais", person.pais)))} />
        <Kpi value={ready ? "Sí" : `Faltan ${5 - people.length}`} label={ready ? "corte publicable" : "para publicar un corte"} onClick={() => onZoom({ title: "Corte publicable", note: "Un corte se publica con al menos 5 respuestas incluidas. Aquí están las que entran hoy.", sections: [{ heading: `${people.length} de 5`, lines: people.map((person) => ({ label: zoomWho(person), value: "" })) }] })} />
        <Kpi value={top ? formatPercent(top[1]) : "—"} label={top ? ahpLabel(top[0]) : "prioridad principal"} onClick={() => onZoom(ahpZoom(people, top?.[0]))} />
      </div>

      {ahp ? (
        <section>
          <h3 className="font-display text-xl text-xinergy-charcoal">Dónde está puesta la atención</h3>
          <p className="mt-1 text-sm text-xinergy-slate">Cómo se reparte el 100% de la prioridad. Clic en una barra para ver el cálculo.</p>
          <div className="mt-4 flex h-14 w-full overflow-hidden">
            {AHP.macros.map((macro, index) => {
              const weight = ahp.macro.weights[index] ?? 0;
              return (
                <button key={macro.id} type="button" aria-label={`${tx(macro.label, "es")} ${formatPercent(weight)}`} className={`flex min-w-0 items-center justify-center px-1 text-center text-sm font-semibold ${MACRO_COLOR[index]} ${MACRO_TEXT[index]}`} style={{ flex: `0 0 ${weight * 100}%` }} onClick={() => onZoom(ahpZoom(people, macro.id))}>
                  {weight >= 0.16 ? formatPercent(weight) : ""}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {AHP.macros.map((macro, index) => (
              <span key={macro.id} className="inline-flex items-center gap-2 text-xinergy-slate">
                <span className={`h-3 w-3 ${MACRO_COLOR[index]}`} />
                {tx(macro.label, "es")} · {formatPercent(ahp.macro.weights[index] ?? 0)}
              </span>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3">
            {ranking.map(([id, weight], index) => (
              <button key={id} type="button" className="grid w-full cursor-pointer grid-cols-[1.5rem_minmax(0,1fr)_4.5rem] items-center gap-3 text-left hover:bg-xinergy-ivory" onClick={() => onZoom(ahpZoom(people, id))}>
                <span className="text-sm text-xinergy-beige">{index + 1}</span>
                <div>
                  <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                    <span className={index === 0 ? "font-semibold text-xinergy-charcoal" : "text-xinergy-charcoal"}>{ahpLabel(id)}</span>
                  </div>
                  <span className="block h-3 bg-xinergy-charcoal/10">
                    <span className="block h-full bg-xinergy-orange" style={{ width: `${Math.max(weight * 100, 2)}%` }} />
                  </span>
                </div>
                <span className="text-right text-sm font-semibold text-xinergy-charcoal">{formatPercent(weight)}</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-xinergy-slate">
            {ahp.maxCr <= 0.1 ? "Consistencia adecuada." : "Conviene revisar la consistencia."} CR {ahp.maxCr.toFixed(3).replace(".", ",")}.
          </p>
        </section>
      ) : null}

      <section>
        <h3 className="font-display text-xl text-xinergy-charcoal">Quién está en la muestra</h3>
          <p className="mt-1 text-sm text-xinergy-slate">Clic en un recuadro o una barra para ver quién está ahí. Los vacíos todavía no tienen respuesta.</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-xinergy-slate">País</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {countries.map((option) => {
                const count = countryCounts.get(option.v) ?? 0;
                return (
                  <button key={option.v} type="button" className={`border px-3 py-2 text-left text-sm ${count ? "border-xinergy-orange bg-[#FFF1D6] font-semibold text-xinergy-charcoal" : "border-dashed border-xinergy-charcoal/20 text-xinergy-slate"}`} onClick={() => onZoom(distributionZoom("País", "Quién de este corte eligió este país.", people, (person) => formatStored("pais", person.pais), tx(option, "es")))}>
                    {tx(option, "es")} · {count}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-xinergy-slate">Rol</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {roles.map((option) => {
                const count = roleCounts.get(option.v) ?? 0;
                return (
                  <button key={option.v} type="button" className={`border px-3 py-2 text-left text-sm ${count ? "border-xinergy-orange bg-[#FFF1D6] font-semibold text-xinergy-charcoal" : "border-dashed border-xinergy-charcoal/20 text-xinergy-slate"}`} onClick={() => onZoom(distributionZoom("Rol", "Quién de este corte tiene este rol.", people, (person) => formatStored("rol", person.rol), tx(option, "es")))}>
                    {tx(option, "es")} · {count}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wide text-xinergy-slate">Rubro</p>
          <Bars rows={industries} total={people.length} onOpen={(label) => onZoom(distributionZoom("Rubro", "Quién de este corte está en cada rubro.", people, (person) => formatStored("rubro", person.rubro), label))} />
        </div>
      </section>

      {signals.length ? (
        <section>
          <h3 className="font-display text-xl text-xinergy-charcoal">Señales para explicar la operación</h3>
          <p className="mt-1 text-sm text-xinergy-slate">Clic en una tarjeta para ver la respuesta de cada persona.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {signals.map((signal) =>
              signal.kind === "choice" ? (
                <button key={signal.caption} type="button" className="border border-xinergy-charcoal/10 bg-xinergy-ivory p-4 text-left hover:border-xinergy-orange" onClick={() => openQuestion(signal.questionId, "focus" in signal ? signal.focus : null)}>
                  <p className="text-xs uppercase tracking-wide text-xinergy-slate">{signal.caption}</p>
                  <p className="mt-2 font-display text-lg leading-snug text-xinergy-charcoal">{signal.winner.label}</p>
                  <p className="mt-1 text-sm text-xinergy-slate">{signal.n === 1 ? "La única respuesta" : `${signal.winner.count} de ${signal.n}`}</p>
                  {signal.rows.length > 1 ? <Bars rows={signal.rows} total={signal.n} /> : null}
                </button>
              ) : (
                <button key={signal.caption} type="button" className="border border-xinergy-charcoal/10 bg-xinergy-ivory p-4 text-left hover:border-xinergy-orange" onClick={() => openQuestion(signal.questionId, "focus" in signal ? signal.focus : null)}>
                  <p className="text-xs uppercase tracking-wide text-xinergy-slate">{signal.caption}</p>
                  <p className="mt-2 font-display text-3xl text-xinergy-charcoal">{signal.mean.toFixed(1).replace(".", ",")}</p>
                  <p className="text-xs text-xinergy-slate">de 5 · {signal.n === 1 ? "1 respuesta" : `${signal.n} respuestas`}</p>
                  <div className="mt-3 flex gap-1">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <span key={step} className={`h-2 flex-1 ${step <= Math.round(signal.mean) ? "bg-xinergy-orange" : "bg-xinergy-charcoal/10"}`} />
                    ))}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-xinergy-charcoal">{signal.phrase}</p>
                </button>
              ),
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function spread(value: ReturnType<typeof choiceReading> | ReturnType<typeof scaleReading> | ReturnType<typeof matrixReading>) {
  if (!value) return { ready: false as const };
  if ("winner" in value) return { ready: true as const, kind: "choice" as const, ...value };
  return { ready: true as const, kind: "meter" as const, ...value };
}

function Kpi({ value, label, onClick }: { value: string; label: string; onClick: () => void }) {
  return (
    <button type="button" className="border border-xinergy-charcoal/10 bg-xinergy-ivory px-4 py-3 text-left hover:border-xinergy-orange" onClick={onClick}>
      <p className="font-display text-3xl leading-none text-xinergy-charcoal">{value}</p>
      <p className="mt-2 text-sm text-xinergy-slate">{label}</p>
    </button>
  );
}

function Bars({ rows, total, onOpen }: { rows: { label: string; count: number }[]; total: number; onOpen?: (label: string) => void }) {
  const top = Math.max(...rows.map((row) => row.count), 1);
  if (!rows.length) return null;
  return (
    <div className="mt-3 flex flex-col gap-2">
      {rows.map((row) => {
        const body = (
          <>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-xinergy-charcoal">{row.label}</span>
            <span className="text-xinergy-slate">
              {row.count} · {total ? `${Math.round((row.count / total) * 100)}%` : "0%"}
            </span>
          </div>
          <span className="mt-1 block h-2.5 bg-xinergy-charcoal/10">
            <span className="block h-full bg-xinergy-orange" style={{ width: `${(row.count / top) * 100}%` }} />
          </span>
          </>
        );
        return onOpen ? (
          <button key={row.label} type="button" className="w-full text-left" onClick={() => onOpen(row.label)}>
            {body}
          </button>
        ) : (
          <div key={row.label}>{body}</div>
        );
      })}
    </div>
  );
}
