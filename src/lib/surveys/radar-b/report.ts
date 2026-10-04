import { analyzeAhp, type AhpAnalysis } from "@/lib/surveys/ahp";
import { isIncluded, type Evaluacion } from "@/lib/surveys/evaluacion";
import {
  CAPABILITIES,
  DATA_READY,
  EVIDENCE,
  INDUSTRIES,
  INITIATIVE_COPY,
  ROLES,
  text,
  type Lang,
} from "@/lib/surveys/radar-b/instrument";
import {
  COST,
  DIMENSIONS,
  EFFORT,
  INITIATIVES,
  SCENARIOS,
  TARGET_LEVEL,
  ahpClass,
  dot,
  improvementOf,
  jaccard,
  maturityOf,
  median,
  optimizePortfolio,
  planGap,
  quartile,
  roleDistance,
  type AhpClass,
  type InitiativeId,
  type Portfolio,
  type ScenarioId,
} from "@/lib/surveys/radar-b/engine";

export type RadarBInput = {
  id: string;
  createdAt: string;
  nombre: string;
  apellido: string;
  email: string;
  empresa: string;
  pais: string;
  rol: string;
  rubro: string;
  evaluacion: Evaluacion;
  company: Record<string, unknown>;
  answers: Record<string, unknown>;
};

export type MotorState = "demostracion" | "exploratorio" | "no-disponible";

export type ScenarioView = {
  id: ScenarioId;
  portfolio: Portfolio | null;
  similarity: number | null;
  eta: number | null;
  comparable: boolean;
  reason: string;
};

export type PersonReport = {
  id: string;
  createdAt: string;
  nombre: string;
  apellido: string;
  email: string;
  empresa: string;
  pais: string;
  rol: string;
  rubro: string;
  alcance: string;
  unidad: string;
  included: boolean;
  conocimiento: string;
  ahp: AhpAnalysis | null;
  ahpClass: AhpClass | null;
  weights: number[] | null;
  levels: (number | null)[];
  gaps: (number | null)[];
  strategic: number[] | null;
  g0: number | null;
  desafio: string;
  datos: string;
  agenda: Record<string, string>;
  evidencia: Record<string, string>;
  declared: InitiativeId[];
  motor: MotorState;
  motorReason: string;
  scenarios: ScenarioView[];
  ownEta: number | null;
  ownReason: string;
};

const STATUS_OK = new Set(["0", "1", "2", "3", "4", "5", "ns"]);

export function labelOf(list: { v: string; es: string }[], value: string) {
  return list.find((item) => item.v === value)?.es ?? value;
}

export function buildPerson(row: RadarBInput): PersonReport {
  const answers = row.answers ?? {};
  const company = row.company ?? {};
  const tokens = record(answers.prioridades_ahp);
  const ahp = analyzeAhp(tokens);
  const klass = ahp ? ahpClass(ahp.maxCr) : null;
  const weights = ahp ? DIMENSIONS.map((id) => ahp.global[id] ?? 0) : null;
  const capacidades = record(answers.capacidades);
  const levels = CAPABILITIES.map((item) => {
    const value = capacidades[item.id];
    return value === "1" || value === "2" || value === "3" || value === "4" || value === "5" ? Number(value) : null;
  });
  const gaps = levels.map((level) => (level == null ? null : planGap(maturityOf(level))));
  const completeGaps = gaps.every((gap) => gap != null);
  const strategic = weights && completeGaps ? weights.map((weight, index) => weight * (gaps[index] as number)) : null;
  const g0 = strategic ? strategic.reduce((sum, value) => sum + value, 0) : null;
  const agenda = record(answers.agenda);
  const evidencia = record(answers.evidencia);
  const datos = typeof answers.datos_ia === "string" ? answers.datos_ia : "";
  const conocimiento = typeof answers.conocimiento === "string" ? answers.conocimiento : "";
  const declared = INITIATIVES.filter((id) => agenda[id] === "2");
  const availability = availableOf(agenda, datos);
  const motor = motorOf(conocimiento, klass, completeGaps, availability);
  const gapVector = completeGaps ? (gaps as number[]) : null;
  const scenarios = SCENARIOS.map((scenario) => scenarioView(scenario.id, weights, gapVector, availability, declared, motor, scenario));
  const own = ownComparison(weights, gapVector, availability, declared, motor);

  return {
    id: row.id,
    createdAt: row.createdAt,
    nombre: row.nombre,
    apellido: row.apellido,
    email: row.email,
    empresa: row.empresa,
    pais: row.pais,
    rol: row.rol,
    rubro: row.rubro,
    alcance: typeof company.alcance === "string" ? company.alcance : "",
    unidad: typeof company.unidad === "string" ? company.unidad : "",
    included: isIncluded(row.evaluacion),
    conocimiento,
    ahp,
    ahpClass: klass,
    weights,
    levels,
    gaps,
    strategic,
    g0,
    desafio: typeof answers.desafio === "string" ? answers.desafio : "",
    datos,
    agenda,
    evidencia,
    declared,
    motor: motor.state,
    motorReason: motor.reason,
    scenarios,
    ownEta: own.eta,
    ownReason: own.reason,
  };
}

function scenarioView(
  id: ScenarioId,
  weights: number[] | null,
  gaps: number[] | null,
  availability: ReturnType<typeof availableOf>,
  declared: InitiativeId[],
  motor: { state: MotorState; reason: string },
  scenario: (typeof SCENARIOS)[number],
): ScenarioView {
  if (!weights || !gaps || motor.state === "no-disponible") {
    return { id, portfolio: null, similarity: null, eta: null, comparable: false, reason: motor.reason };
  }
  const portfolio = optimizePortfolio(weights, gaps, availability.available, availability.dataReady, {
    budget: scenario.budget,
    effort: scenario.effort,
    maxCount: scenario.maxCount,
  });
  const fit = fits(declared, availability, { budget: scenario.budget, effort: scenario.effort, maxCount: scenario.maxCount });
  const declaredValue = fit.ok ? improvementOf(weights, gaps, declared, availability.dataReady) : null;
  const eta = fit.ok && declaredValue && portfolio.improvement > 0 ? declaredValue.improvement / portfolio.improvement : null;
  return {
    id,
    portfolio,
    similarity: jaccard(declared, portfolio.ids),
    eta,
    comparable: fit.ok,
    reason: fit.ok ? "" : fit.reason,
  };
}

function ownComparison(weights: number[] | null, gaps: number[] | null, availability: ReturnType<typeof availableOf>, declared: InitiativeId[], motor: { state: MotorState }) {
  if (!declared.length) return { eta: null as number | null, reason: "Sin agenda nueva aprobada." };
  if (!weights || !gaps || motor.state === "no-disponible") return { eta: null, reason: "La agenda no se compara porque falta un insumo del motor." };
  const spent = improvementOf(weights, gaps, declared, availability.dataReady);
  if (!spent) return { eta: null, reason: "La agenda de IA no es comparable sin la iniciativa de datos." };
  const fit = fits(declared, availability, { budget: spent.cost, effort: spent.effort, maxCount: spent.count });
  if (!fit.ok) return { eta: null, reason: fit.reason };
  const best = optimizePortfolio(weights, gaps, availability.available, availability.dataReady, {
    budget: spent.cost,
    effort: spent.effort,
    maxCount: Math.max(spent.count, 1),
  });
  if (best.improvement <= 0) return { eta: null, reason: "No hay mejora modelada que comparar." };
  return { eta: spent.improvement / best.improvement, reason: "" };
}

function fits(ids: InitiativeId[], availability: ReturnType<typeof availableOf>, limits: { budget: number; effort: number; maxCount: number }) {
  if (availability.statusUnknown) return { ok: false, reason: "Falta el estado de alguna iniciativa." };
  const selected = INITIATIVES.map((id) => ids.includes(id));
  if (selected.some((on, index) => on && !availability.available[index])) return { ok: false, reason: "La agenda incluye una iniciativa que no está disponible para comparar." };
  if (availability.dataReady === 0 && selected[5] && !selected[4]) return { ok: false, reason: "IA empresarial exige la iniciativa de datos cuando los datos no están listos." };
  const cost = selected.reduce((sum, on, index) => sum + (on ? COST[index] : 0), 0);
  const effort = selected.reduce((sum, on, index) => sum + (on ? EFFORT[index] : 0), 0);
  if (cost > limits.budget || effort > limits.effort || selected.filter(Boolean).length > limits.maxCount) {
    return { ok: false, reason: "La agenda no cabe en los recursos de este escenario." };
  }
  return { ok: true, reason: "" };
}

export function availabilityOf(agenda: Record<string, string>, datos: string) {
  return availableOf(agenda, datos);
}

function availableOf(agenda: Record<string, string>, datos: string) {
  const statuses = INITIATIVES.map((id) => agenda[id] ?? "");
  const statusUnknown = statuses.some((status) => !STATUS_OK.has(status) || status === "ns" || status === "");
  const available = statuses.map((status) => status === "0" || status === "1" || status === "2");
  const knownData = datos === "READY" || datos === "PARTIAL" || datos === "NOT_READY" || datos === "UNKNOWN";
  const dataReady: 0 | 1 | null = datos === "READY" ? 1 : datos === "PARTIAL" || datos === "NOT_READY" ? 0 : null;
  if (dataReady !== 1) available[5] = dataReady === 0 ? available[5] && available[4] : false;
  const ready: 0 | 1 = dataReady === 1 ? 1 : 0;
  return { available, dataReady: ready, iaPending: datos === "UNKNOWN", statusUnknown, datosMissing: !knownData };
}

function motorOf(conocimiento: string, klass: AhpClass | null, completeGaps: boolean, availability: ReturnType<typeof availableOf>) {
  if (conocimiento !== "si") return { state: "no-disponible" as const, reason: "El motor usa respuestas de quien conoce directamente la operación." };
  if (!klass) return { state: "no-disponible" as const, reason: "Faltan comparaciones de prioridad." };
  if (klass === "excluido") return { state: "no-disponible" as const, reason: "Alguna comparación supera 0,20 de consistencia. Las prioridades quedan fuera del motor." };
  if (!completeGaps) return { state: "no-disponible" as const, reason: "Falta el nivel de alguna capacidad, o se marcó “no sé”." };
  if (availability.statusUnknown) return { state: "no-disponible" as const, reason: "Falta el estado de alguna iniciativa." };
  if (availability.datosMissing) return { state: "no-disponible" as const, reason: "Falta la condición de datos para IA." };
  if (klass === "exploratorio") return { state: "exploratorio" as const, reason: "Hay una comparación entre 0,10 y 0,20. El portafolio es exploratorio." };
  const note = availability.iaPending ? " La IA queda fuera hasta verificar la condición de datos." : "";
  return { state: "demostracion" as const, reason: `Matriz de demostración, no calibrada con el panel.${note}` };
}

export type Benchmark = {
  companies: number;
  duplicates: string[];
  ahpMean: number[] | null;
  macroMean: number[] | null;
  capability: { median: number | null; q1: number | null; q3: number | null; n: number }[];
  gapMean: number[] | null;
  g0Mean: number | null;
  action: Record<ScenarioId, { selected: number; approved: number; n: number }[]>;
  pairs: { empresa: string; distance: number; fin: number }[];
  open: { who: string; text: string }[];
  priorityIds: string[];
  motorIds: string[];
  principalIds: string[];
};

export function buildBenchmark(people: PersonReport[]): Benchmark {
  const included = people.filter((person) => person.included);
  const { principals, duplicates } = principalsOf(included);
  const priority = principals.filter((person) => person.ahpClass === "principal" && person.weights);
  const ahpMean = priority.length ? average(priority.map((person) => person.weights as number[])) : null;
  const macroMean = priority.length
    ? average(priority.map((person) => [person.ahp?.macro.weights[0] ?? 0, person.ahp?.macro.weights[1] ?? 0, person.ahp?.macro.weights[2] ?? 0]))
    : null;
  const capability = CAPABILITIES.map((_, index) => {
    const values = principals.map((person) => person.levels[index]).filter((level): level is number => level != null);
    return { median: median(values), q1: quartile(values, 0.25), q3: quartile(values, 0.75), n: values.length };
  });
  const gapped = priority.filter((person) => person.strategic && person.g0 != null);
  const gapMean = gapped.length ? average(gapped.map((person) => person.strategic as number[])) : null;
  const g0Mean = gapped.length ? gapped.reduce((sum, person) => sum + (person.g0 ?? 0), 0) / gapped.length : null;
  const motorPeople = principals.filter((person) => person.motor === "demostracion");
  const action = Object.fromEntries(
    SCENARIOS.map((scenario) => [
      scenario.id,
      INITIATIVES.map((id, index) => ({
        selected: share(motorPeople, (person) => person.scenarios.find((item) => item.id === scenario.id)?.portfolio?.ids.includes(id) ?? false),
        approved: share(motorPeople, (person) => person.agenda[id] === "2"),
        n: motorPeople.length,
        index,
      })),
    ]),
  ) as unknown as Benchmark["action"];
  const pairs = rolePairs(included);
  const open = openAnswers(included);
  return {
    companies: principals.length,
    duplicates,
    ahpMean,
    macroMean,
    capability,
    gapMean,
    g0Mean,
    action,
    pairs,
    open,
    priorityIds: priority.map((person) => person.id),
    motorIds: motorPeople.map((person) => person.id),
    principalIds: principals.map((person) => person.id),
  };
}

function principalsOf(people: PersonReport[]) {
  const groups = new Map<string, PersonReport[]>();
  for (const person of people) {
    const key = `${person.empresa.trim().toLocaleLowerCase("es")}|${person.alcance}|${person.unidad.trim().toLocaleLowerCase("es")}`;
    groups.set(key, [...(groups.get(key) ?? []), person]);
  }
  const principals: PersonReport[] = [];
  const duplicates: string[] = [];
  for (const group of groups.values()) {
    const cpos = group.filter((person) => person.rol === "cpo" && person.conocimiento === "si");
    const scms = group.filter((person) => person.rol === "scm" && person.conocimiento === "si");
    if (cpos.length === 1) principals.push(cpos[0]);
    else if (cpos.length > 1) duplicates.push(cpos[0].empresa);
    else if (scms.length === 1) principals.push(scms[0]);
    else if (scms.length > 1) duplicates.push(scms[0].empresa);
  }
  return { principals, duplicates };
}

function rolePairs(people: PersonReport[]) {
  const groups = new Map<string, PersonReport[]>();
  for (const person of people) {
    if (person.ahpClass !== "principal" || !person.weights) continue;
    const key = `${person.empresa.trim().toLocaleLowerCase("es")}|${person.unidad.trim().toLocaleLowerCase("es")}`;
    groups.set(key, [...(groups.get(key) ?? []), person]);
  }
  const pairs: Benchmark["pairs"] = [];
  for (const group of groups.values()) {
    const cfo = uniqueRole(group, "cfo");
    const cpo = uniqueRole(group, "cpo");
    if (!cfo || !cpo || !cfo.weights || !cpo.weights || !cfo.ahp || !cpo.ahp) continue;
    pairs.push({
      empresa: cpo.empresa,
      distance: roleDistance(cfo.weights, cpo.weights),
      fin: cfo.ahp.macro.weights[0] - cpo.ahp.macro.weights[0],
    });
  }
  return pairs;
}

function uniqueRole(group: PersonReport[], rol: string) {
  const found = group.filter((person) => person.rol === rol);
  return found.length === 1 ? found[0] : null;
}

function openAnswers(people: PersonReport[]) {
  const counts = new Map<string, number>();
  for (const person of people) {
    if (!person.desafio.trim()) continue;
    const key = person.empresa.trim().toLocaleLowerCase("es");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return people
    .filter((person) => person.desafio.trim())
    .map((person) => ({
      who: (counts.get(person.empresa.trim().toLocaleLowerCase("es")) ?? 0) > 1 ? `${person.empresa} — ${person.nombre} ${person.apellido}` : person.empresa,
      text: person.desafio.trim(),
    }));
}

function average(rows: number[][]) {
  return rows[0].map((_, index) => rows.reduce((sum, row) => sum + row[index], 0) / rows.length);
}

function share(people: PersonReport[], test: (person: PersonReport) => boolean) {
  if (!people.length) return 0;
  return people.filter(test).length / people.length;
}

export function percent(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${(value * 100).toFixed(1).replace(".", ",")}%`;
}

export function weightVector(person: PersonReport) {
  return person.weights;
}

export function dimensionName(id: string, lang: Lang = "es") {
  return text(CAPABILITIES.find((item) => item.id === id)?.short ?? { es: id, en: id, pt: id }, lang);
}

export function initiativeName(id: string) {
  return INITIATIVE_COPY.find((item) => item.id === id)?.name.es ?? id;
}

export function roleName(id: string) {
  return labelOf(ROLES, id);
}

export function industryName(id: string) {
  return labelOf(INDUSTRIES, id);
}

export function dataName(id: string) {
  return labelOf(DATA_READY, id);
}

export function evidenceName(id: string) {
  return EVIDENCE.find((item) => item.id === id)?.label.es ?? id;
}

export const PLAN_TARGET = TARGET_LEVEL;

function record(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const output: Record<string, string> = {};
  for (const [key, item] of Object.entries(value)) {
    if (typeof item === "string") output[key] = item;
  }
  return output;
}

export function gapTotal(weights: number[], gaps: number[]) {
  return dot(weights, gaps);
}
