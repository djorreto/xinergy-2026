import { analyzeAhp, type AhpAnalysis } from "@/lib/surveys/ahp";
import { resolvePriorities, type BlockWeight } from "@/lib/surveys/radar-c/ahp-allocation";
import { isIncluded, type Evaluacion } from "@/lib/surveys/evaluacion";
import { CAPABILITIES, COUNTRIES, INITIATIVE_COPY, STATUS_TO_ENGINE } from "@/lib/surveys/radar-c/instrument";
import {
  INITIATIVES,
  SCENARIOS,
  ahpClass,
  improvementOf,
  jaccard,
  maturityOf,
  optimizePortfolio,
  planGap,
  type InitiativeId,
  type ScenarioId,
} from "@/lib/surveys/radar-b/engine";
import { availabilityOf } from "@/lib/surveys/radar-b/report";

export type RadarCInput = {
  id: string;
  createdAt: string;
  email: string;
  nombre?: string;
  apellido?: string;
  telefono?: string | null;
  linkedin?: string | null;
  cargo?: string;
  empresa: string;
  pais: string;
  rol: string;
  rubro: string;
  evaluacion: Evaluacion;
  company: Record<string, unknown>;
  answers: Record<string, unknown>;
};

export type PersonC = {
  id: string;
  createdAt: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  linkedin: string;
  cargo: string;
  empresa: string;
  pais: string;
  paises: string[];
  rol: string;
  rubro: string;
  alcance: string;
  unidad: string;
  spend: string;
  included: boolean;
  operational: boolean;
  ahp: AhpAnalysis | null;
  ahpClass: ReturnType<typeof ahpClass> | null;
  priorityMode: "ahp" | "hibrido";
  clarificationComplete: boolean;
  ahpWeights: number[] | null;
  finalMacro: number[] | null;
  blockSources: BlockWeight[];
  weights: number[] | null;
  levels: (number | null)[];
  gaps: (number | null)[];
  strategic: number[] | null;
  g0: number | null;
  context: Record<string, string>;
  barriers: string[];
  agenda: Record<string, string>;
  declared: InitiativeId[];
  scenarios: { id: ScenarioId; ids: InitiativeId[]; closure: number | null; reason: string }[];
  similarity: number | null;
  eta: number | null;
  etaReason: string;
  desafio: string;
  motorReason: string;
};

export function countryNames(codes: string[]) {
  return codes.map((code) => COUNTRIES.find((item) => item.v === code)?.es ?? code).join(", ");
}

export function buildPersonC(row: RadarCInput): PersonC {
  const answers = row.answers ?? {};
  const company = row.company ?? {};
  const tokens = record(answers.prioridades_ahp);
  const resolved = resolvePriorities(tokens, answers.ahp_aclaracion);
  const ahp = resolved?.ahp ?? analyzeAhp(tokens);
  const klass = ahp ? ahpClass(ahp.maxCr) : null;
  const ahpWeights = ahp ? CAPABILITIES.map((item) => ahp.global[item.id] ?? 0) : null;
  const finalWeights = resolved ? CAPABILITIES.map((item) => resolved.global[item.id] ?? 0) : null;
  const weights = finalWeights ?? ahpWeights;
  const capacidades = record(answers.capacidades);
  const levels = CAPABILITIES.map((item) => {
    const value = capacidades[item.id];
    return value === "1" || value === "2" || value === "3" || value === "4" || value === "5" ? Number(value) : null;
  });
  const gaps = levels.map((level) => (level == null ? null : planGap(maturityOf(level))));
  const complete = gaps.every((gap) => gap != null);
  const strategic = weights && complete ? weights.map((weight, index) => weight * (gaps[index] as number)) : null;
  const g0 = strategic ? strategic.reduce((sum, value) => sum + value, 0) : null;
  const agendaRaw = record(answers.agenda);
  const agenda = Object.fromEntries(INITIATIVE_COPY.map((item) => [item.id, STATUS_TO_ENGINE[agendaRaw[item.id] ?? ""] ?? ""]));
  const datos = typeof answers.r1 === "string" ? answers.r1 : "";
  const operational = answers.ruta === "operativa";
  const availability = availabilityOf(agenda, datos === "UNKNOWN" ? "UNKNOWN" : datos);
  const gapVector = complete ? (gaps as number[]) : null;
  const clarified = Boolean(resolved?.clarificationComplete && resolved.mode === "hibrido");
  const canOptimize = Boolean(weights && gapVector && klass && (klass !== "excluido" || clarified) && !availability.statusUnknown && datos !== "");
  const motorReason = !operational
    ? "Ruta ejecutiva: no hay portafolio operacional."
    : !weights
      ? "Faltan comparaciones de prioridad."
      : klass === "excluido" && !clarified
        ? "La consistencia supera 0,20 y no hay una aclaración completa. No hay portafolio recomendado."
        : !gapVector
          ? "Falta el nivel de alguna capacidad."
          : availability.statusUnknown
            ? "Falta el estado de alguna iniciativa."
            : datos === ""
              ? "Falta la condición de datos."
              : datos === "UNKNOWN"
                ? "La condición de datos no está confirmada. La IA queda fuera de la recomendación."
                : klass === "exploratorio"
                  ? "Perfil exploratorio: el portafolio no entra al promedio principal."
                  : "Escenario de demostración.";
  const scenarios = SCENARIOS.map((scenario) => {
    if (!canOptimize || !weights || !gapVector) return { id: scenario.id, ids: [] as InitiativeId[], closure: null, reason: motorReason };
    const portfolio = optimizePortfolio(weights, gapVector, availability.available, availability.dataReady, scenario);
    return { id: scenario.id, ids: portfolio.ids, closure: portfolio.closure, reason: "" };
  });
  const declared = INITIATIVES.filter((id) => agenda[id] === "2");
  const balanced = scenarios.find((item) => item.id === "balanced");
  const comparison = compareAgenda(weights, gapVector, declared, availability, canOptimize);
  return {
    id: row.id,
    createdAt: row.createdAt,
    email: row.email,
    nombre: row.nombre ?? "",
    apellido: row.apellido ?? "",
    telefono: row.telefono ?? "",
    linkedin: row.linkedin ?? "",
    cargo: row.cargo ?? "",
    empresa: row.empresa,
    pais: row.pais,
    paises: countriesOf(row),
    rol: row.rol,
    rubro: row.rubro,
    alcance: typeof company.alcance === "string" ? company.alcance : "",
    unidad: typeof company.unidad === "string" ? company.unidad : "",
    spend: typeof company.spend === "string" ? company.spend : "",
    included: isIncluded(row.evaluacion),
    operational,
    ahp,
    ahpClass: klass,
    priorityMode: resolved?.mode ?? "ahp",
    clarificationComplete: resolved?.clarificationComplete ?? false,
    ahpWeights,
    finalMacro: resolved?.macro ?? null,
    blockSources: resolved?.blocks ?? [],
    weights,
    levels,
    gaps,
    strategic,
    g0,
    context: {
      e1: textOf(answers.e1),
      e2: textOf(answers.e2),
      e3: textOf(answers.e3),
      e4: textOf(answers.e4),
      e5: textOf(answers.e5),
      r1: datos,
      ia_activos: textOf(answers.ia_activos),
      ia_activos_n: textOf(answers.ia_activos_n),
      ia_compras_n: textOf(answers.ia_compras_n),
      ia_presupuesto: textOf(answers.ia_presupuesto),
      ia_presupuesto_compras: textOf(answers.ia_presupuesto_compras),
      ia_escala: textOf(answers.ia_escala),
      ia_modo: textOf(answers.ia_modo),
      f1: textOf(answers.f1),
      f2: textOf(answers.f2),
      g1: textOf(answers.g1),
      g2: textOf(answers.g2),
    },
    barriers: Array.isArray(answers.e6) ? answers.e6.filter((item): item is string => typeof item === "string") : [],
    agenda: agendaRaw,
    declared,
    scenarios,
    similarity: balanced ? jaccard(declared, balanced.ids) : null,
    eta: comparison.eta,
    etaReason: comparison.reason,
    desafio: textOf(answers.desafio),
    motorReason,
  };
}

export type BenchmarkC = {
  companies: number;
  duplicates: string[];
  principalIds: string[];
  priorityIds: string[];
  aip: number[] | null;
  macro: number[] | null;
  expandedIds: string[];
  expandedAip: number[] | null;
  expandedMacro: number[] | null;
};

export function buildBenchmarkC(people: PersonC[]): BenchmarkC {
  const included = people.filter((person) => person.included && person.operational);
  const groups = new Map<string, PersonC[]>();
  for (const person of included) {
    if (person.rol !== "cpo" && person.rol !== "scm") continue;
    const key = scopeKey(person);
    groups.set(key, [...(groups.get(key) ?? []), person]);
  }
  const principals: PersonC[] = [];
  const duplicates: string[] = [];
  for (const group of groups.values()) {
    const cpos = group.filter((person) => person.rol === "cpo");
    const scms = group.filter((person) => person.rol === "scm");
    if (cpos.length === 1) principals.push(cpos[0]);
    else if (cpos.length > 1) duplicates.push(cpos[0].empresa);
    else if (scms.length === 1) principals.push(scms[0]);
    else if (scms.length > 1) duplicates.push(scms[0].empresa);
  }
  const priority = principals.filter((person) => person.priorityMode === "ahp" && person.ahpClass === "principal" && person.weights);
  const expanded = principals.filter((person) => person.weights && (priority.some((item) => item.id === person.id) || (person.priorityMode === "hibrido" && person.clarificationComplete)));
  const aip = meanWeights(priority);
  const macro = priority.length
    ? [0, 1, 2].map((index) => priority.reduce((sum, person) => sum + (person.ahp?.macro.weights[index] ?? 0), 0) / priority.length)
    : null;
  return {
    companies: principals.length,
    duplicates,
    principalIds: principals.map((person) => person.id),
    priorityIds: priority.map((person) => person.id),
    aip,
    macro,
    expandedIds: expanded.map((person) => person.id),
    expandedAip: meanWeights(expanded),
    expandedMacro: expanded.length ? [0, 1, 2].map((index) => expanded.reduce((sum, person) => sum + (person.finalMacro?.[index] ?? 0), 0) / expanded.length) : null,
  };
}

function meanWeights(people: PersonC[]) {
  if (!people.length || !people[0].weights) return null;
  return people[0].weights.map((_, index) => people.reduce((sum, person) => sum + (person.weights?.[index] ?? 0), 0) / people.length);
}

function compareAgenda(
  weights: number[] | null,
  gaps: number[] | null,
  declared: InitiativeId[],
  availability: ReturnType<typeof availabilityOf>,
  ready: boolean,
) {
  if (!declared.length) return { eta: null as number | null, reason: "No hay agenda nueva aprobada. La contribución no se calcula como cero." };
  if (!ready || !weights || !gaps) return { eta: null, reason: "La agenda no se compara porque falta un insumo del escenario." };
  const spent = improvementOf(weights, gaps, declared, availability.dataReady);
  if (!spent) return { eta: null, reason: "La agenda de IA no es comparable sin la iniciativa de datos." };
  if (declared.some((id) => !availability.available[INITIATIVES.indexOf(id)])) return { eta: null, reason: "La agenda incluye una iniciativa que no está disponible para comparar." };
  const best = optimizePortfolio(weights, gaps, availability.available, availability.dataReady, { budget: Math.max(spent.cost, 0), effort: Math.max(spent.effort, 0), maxCount: Math.max(spent.count, 1) });
  if (best.improvement <= 0) return { eta: null, reason: "No hay mejora modelada que comparar." };
  return { eta: spent.improvement / best.improvement, reason: "" };
}

function countriesOf(row: RadarCInput) {
  const stored = row.company?.paises;
  if (Array.isArray(stored)) {
    const codes = stored.filter((item): item is string => typeof item === "string" && item.length > 0);
    if (codes.length) return codes;
  }
  return row.pais.split(",").map((item) => item.trim()).filter(Boolean);
}

function scopeKey(person: PersonC) {
  return `${person.empresa.trim().toLocaleLowerCase("es")}|${person.alcance}|${person.unidad.trim().toLocaleLowerCase("es")}`;
}

function record(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {} as Record<string, string>;
  const output: Record<string, string> = {};
  for (const [key, item] of Object.entries(value)) if (typeof item === "string") output[key] = item;
  return output;
}

function textOf(value: unknown) {
  return typeof value === "string" ? value : "";
}
