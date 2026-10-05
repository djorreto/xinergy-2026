import { IMPACT, IMPACT_MATRIX_VERSION, INITIATIVES, SCENARIOS, median, optimizePortfolio, roleDistance, type InitiativeId, type ScenarioId } from "@/lib/surveys/radar-b/engine";
import { availabilityOf } from "@/lib/surveys/radar-b/report";
import { CAPABILITIES, INITIATIVE_COPY, MODEL_VERSION_C, STATUS_TO_ENGINE } from "@/lib/surveys/radar-c/instrument";
import { buildBenchmarkC, type PersonC } from "@/lib/surveys/radar-c/report";

export const PAPER_VERSION = "C-Paper-1.0";

export type HypothesisState = "patron compatible" | "patron contrario" | "resultado del modelo" | "no evaluable";

export type PaperCut = {
  version: string;
  model: string;
  impact: string;
  participants: number;
  included: number;
  isolated: number;
  operational: number;
  executive: number;
  companies: number;
  duplicates: string[];
  roles: { id: string; n: number }[];
  countries: { responses: number; mentions: number };
  ahp: { principal: number; exploratory: number; excluded: number; maxExcludedCr: number | null };
  aip: number[] | null;
  macro: number[] | null;
  expanded: { n: number; aip: number[] | null; macro: number[] | null; order: number[] };
  dispersion: { index: number; min: number; max: number; sd: number }[];
  leaveOneOut: { companies: number; rankChanges: number; maxMove: number };
  capability: { index: number; n: number; median: number | null; below4: number; low: number; gapMean: number | null; gapShare: number | null }[];
  priorityOrder: number[];
  gapOrder: number[];
  savings: Record<string, number>;
  realization: Record<string, number>;
  realizationMeasured: number;
  costBelow4: number;
  lowRealizationAndCostBelow4: number;
  lowRealization: number;
  exposureHigh: number;
  exposureHighRiskBelow4: number;
  exposureLow: number;
  exposureLowRiskReady: number;
  resilienceApprovedInHigh: number;
  ai: Record<string, number>;
  productive: number;
  productiveReadyDigital: number;
  pilot: number;
  pilotPartialDigital3: number;
  pilotDataAndAiApproved: number;
  barriers: Record<string, number>;
  barrierBase: number;
  closures: { id: ScenarioId; median: number | null; n: number }[];
  deltaLeanBalanced: number | null;
  deltaBalancedTransformational: number | null;
  sameBalancedTransformational: number;
  selection: { scenario: ScenarioId; index: number; selected: number; approved: number; of: number }[];
  jaccardMedian: number | null;
  jaccardN: number;
  etaMedian: number | null;
  etaN: number;
  etaMissing: number;
  motor: number;
  emptyGap: number;
  sensitivity: {
    status: "ok" | "omitida";
    runs: number;
    seed: number;
    companies: number;
    stableCompanies: number;
    medianStability: number | null;
    keep: { index: number; base: number; rate: number | null }[];
    note: string;
  };
  pairs: { n: number; financeHigher: number; medianFin: number | null; medianDistance: number | null };
  themes: { label: string; n: number; of: number }[];
  openN: number;
  hypotheses: { id: string; state: HypothesisState; text: string }[];
};

const THEMES: { label: string; pattern: RegExp }[] = [
  { label: "ahorro o costo", pattern: /ahorro|costo/i },
  { label: "caja", pattern: /caja|capital/i },
  { label: "continuidad o riesgo", pattern: /continuidad|riesgo|proveedor/i },
  { label: "datos o tecnología", pattern: /dato|tecnolog|digital|inteligencia/i },
  { label: "talento", pattern: /talento|equipo|capacidad/i },
];

export function buildPaperCut(people: PersonC[], options?: { sensitivity?: boolean }): PaperCut {
  const included = people.filter((person) => person.included);
  const operational = included.filter((person) => person.operational && (person.rol === "cpo" || person.rol === "scm"));
  const executive = included.filter((person) => !person.operational);
  const benchmark = buildBenchmarkC(included);
  const priority = operational.filter((person) => benchmark.priorityIds.includes(person.id));
  const principals = operational.filter((person) => benchmark.principalIds.includes(person.id));
  const motor = operational.filter((person) => person.scenarios.some((item) => item.id === "balanced" && item.reason === ""));
  const aip = benchmark.aip;
  const gapRows = capabilityRows(principals.length ? principals : operational, priority);
  const priorityOrder = orderOf(aip);
  const gapOrder = orderOf(gapRows.map((row) => row.gapMean));
  const realization = tally(operational, (person) => person.context.e2);
  const realizationMeasured = operational.filter((person) => measuredRealization(person.context.e2)).length;
  const lowRealizationPeople = operational.filter((person) => person.context.e2 === "<25" || person.context.e2 === "25-50");
  const costBelow4 = operational.filter((person) => (person.levels[0] ?? 99) < 4).length;
  const exposureHighPeople = operational.filter((person) => person.context.e3 === "25-50" || person.context.e3 === ">50");
  const exposureLowPeople = operational.filter((person) => person.context.e3 === "<10" || person.context.e3 === "10-25");
  const productivePeople = operational.filter((person) => person.context.e5 === "produccion" || person.context.e5 === "extendido");
  const pilotPeople = operational.filter((person) => person.context.e5 === "piloto");
  const closures = SCENARIOS.map((scenario) => {
    const values = motor.map((person) => person.scenarios.find((item) => item.id === scenario.id)?.closure).filter((value): value is number => value != null);
    return { id: scenario.id, median: median(values), n: values.length };
  });
  const deltas = companyDeltas(motor);
  const selection = SCENARIOS.flatMap((scenario) =>
    INITIATIVES.map((id, index) => ({
      scenario: scenario.id,
      index,
      selected: motor.filter((person) => person.scenarios.find((item) => item.id === scenario.id)?.ids.includes(id)).length,
      approved: motor.filter((person) => person.declared.includes(id)).length,
      of: motor.length,
    })),
  );
  const jaccardValues = motor.map((person) => person.similarity).filter((value): value is number => value != null);
  const etaValues = motor.map((person) => person.eta).filter((value): value is number => value != null);
  const sensitivity = options?.sensitivity === false || !motor.length ? omittedSensitivity(motor.length ? "La sensibilidad no se pidió en esta ejecución." : "No hay empresas con portafolio calculado.") : sensitivityOf(motor);
  const pairs = rolePairs(included);
  const open = included.filter((person) => person.desafio.trim());
  const excluded = operational.filter((person) => person.ahpClass === "excluido");
  const cut: PaperCut = {
    version: PAPER_VERSION,
    model: MODEL_VERSION_C,
    impact: IMPACT_MATRIX_VERSION,
    participants: people.length,
    included: included.length,
    isolated: people.length - included.length,
    operational: operational.length,
    executive: executive.length,
    companies: benchmark.companies,
    duplicates: benchmark.duplicates,
    roles: ["cpo", "scm", "cfo", "ceo", "otro"].map((id) => ({ id, n: included.filter((person) => person.rol === id).length })).filter((row) => row.n),
    countries: {
      responses: operational.length,
      mentions: operational.reduce((sum, person) => sum + person.paises.length, 0),
    },
    ahp: {
      principal: operational.filter((person) => person.ahpClass === "principal").length,
      exploratory: operational.filter((person) => person.ahpClass === "exploratorio").length,
      excluded: excluded.length,
      maxExcludedCr: excluded.reduce<number | null>((max, person) => (person.ahp?.maxCr != null && (max == null || person.ahp.maxCr > max) ? person.ahp.maxCr : max), null),
    },
    aip,
    macro: benchmark.macro,
    expanded: {
      n: benchmark.expandedIds.length,
      aip: benchmark.expandedAip,
      macro: benchmark.expandedMacro,
      order: orderOf(benchmark.expandedAip),
    },
    dispersion: dispersionOf(priority),
    leaveOneOut: leaveOneOut(priority),
    capability: gapRows,
    priorityOrder,
    gapOrder,
    savings: tally(operational, (person) => person.context.e1),
    realization,
    realizationMeasured,
    costBelow4,
    lowRealization: lowRealizationPeople.length,
    lowRealizationAndCostBelow4: lowRealizationPeople.filter((person) => (person.levels[0] ?? 99) < 4).length,
    exposureHigh: exposureHighPeople.length,
    exposureHighRiskBelow4: exposureHighPeople.filter((person) => (person.levels[2] ?? 99) < 4).length,
    exposureLow: exposureLowPeople.length,
    exposureLowRiskReady: exposureLowPeople.filter((person) => (person.levels[2] ?? 0) >= 4).length,
    resilienceApprovedInHigh: exposureHighPeople.filter((person) => person.declared.includes("i3")).length,
    ai: tally(operational, (person) => person.context.e5),
    productive: productivePeople.length,
    productiveReadyDigital: productivePeople.filter((person) => person.context.r1 === "READY" && (person.levels[5] ?? 0) >= 4).length,
    pilot: pilotPeople.length,
    pilotPartialDigital3: pilotPeople.filter((person) => person.context.r1 === "PARTIAL" && person.levels[5] === 3).length,
    pilotDataAndAiApproved: pilotPeople.filter((person) => person.declared.includes("i5") && person.declared.includes("i6")).length,
    barriers: tallyBarriers(operational),
    barrierBase: operational.length,
    closures,
    deltaLeanBalanced: deltas.leanBalanced,
    deltaBalancedTransformational: deltas.balancedTransformational,
    sameBalancedTransformational: deltas.same,
    selection,
    jaccardMedian: median(jaccardValues),
    jaccardN: jaccardValues.length,
    etaMedian: median(etaValues),
    etaN: etaValues.length,
    etaMissing: motor.length - etaValues.length,
    motor: motor.length,
    emptyGap: motor.filter((person) => person.g0 === 0).length,
    sensitivity,
    pairs,
    themes: THEMES.map((theme) => ({ label: theme.label, n: open.filter((person) => theme.pattern.test(person.desafio)).length, of: open.length })),
    openN: open.length,
    hypotheses: [],
  };
  cut.hypotheses = hypothesesOf(cut);
  return cut;
}

function capabilityRows(base: PersonC[], priority: PersonC[]) {
  const gapMeans = CAPABILITIES.map((_, index) => {
    const values = priority.map((person) => person.strategic?.[index]).filter((value): value is number => value != null);
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  });
  const total = gapMeans.reduce<number>((sum, value) => sum + (value ?? 0), 0);
  return CAPABILITIES.map((_, index) => {
    const levels = base.map((person) => person.levels[index]).filter((level): level is number => level != null);
    return {
      index,
      n: levels.length,
      median: median(levels),
      below4: levels.filter((level) => level < 4).length,
      low: levels.filter((level) => level <= 2).length,
      gapMean: gapMeans[index],
      gapShare: gapMeans[index] != null && total > 0 ? gapMeans[index] / total : null,
    };
  });
}

function dispersionOf(people: PersonC[]) {
  return CAPABILITIES.map((_, index) => {
    const values = people.map((person) => person.weights?.[index]).filter((value): value is number => value != null);
    const mean = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
    const variance = values.length > 1 ? values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1) : 0;
    return { index, min: values.length ? Math.min(...values) : 0, max: values.length ? Math.max(...values) : 0, sd: Math.sqrt(variance) };
  });
}

function leaveOneOut(people: PersonC[]) {
  if (people.length < 2 || people.some((person) => !person.weights)) return { companies: people.length, rankChanges: 0, maxMove: 0 };
  const base = average(people.map((person) => person.weights as number[]));
  const top = argmax(base);
  let rankChanges = 0;
  let maxMove = 0;
  people.forEach((_, leftOut) => {
    const next = average(people.filter((__, index) => index !== leftOut).map((person) => person.weights as number[]));
    if (argmax(next) !== top) rankChanges += 1;
    next.forEach((value, index) => {
      maxMove = Math.max(maxMove, Math.abs(value - base[index]));
    });
  });
  return { companies: people.length, rankChanges, maxMove };
}

function companyDeltas(people: PersonC[]) {
  const leanBalanced: number[] = [];
  const balancedTransformational: number[] = [];
  let same = 0;
  for (const person of people) {
    const lean = person.scenarios.find((item) => item.id === "lean");
    const balanced = person.scenarios.find((item) => item.id === "balanced");
    const transformational = person.scenarios.find((item) => item.id === "transformational");
    if (lean?.closure != null && balanced?.closure != null) leanBalanced.push((balanced.closure - lean.closure) * 100);
    if (balanced?.closure != null && transformational?.closure != null) balancedTransformational.push((transformational.closure - balanced.closure) * 100);
    if (balanced && transformational && sameSet(balanced.ids, transformational.ids)) same += 1;
  }
  return { leanBalanced: median(leanBalanced), balancedTransformational: median(balancedTransformational), same };
}

function sensitivityOf(people: PersonC[]): PaperCut["sensitivity"] {
  const runs = 500;
  const ordered = [...people].sort((left, right) => left.id.localeCompare(right.id));
  const random = mulberry32(2027);
  const stability: number[] = [];
  const keep = INITIATIVES.map(() => ({ base: 0, sum: 0 }));
  for (const person of ordered) {
    if (!person.weights || person.gaps.some((gap) => gap == null)) continue;
    const agenda = Object.fromEntries(INITIATIVES.map((id) => [id, STATUS_TO_ENGINE[person.agenda[id] ?? ""] ?? ""]));
    const availability = availabilityOf(agenda, person.context.r1);
    const base = optimizePortfolio(person.weights, person.gaps as number[], availability.available, availability.dataReady, SCENARIOS[1]);
    const selected = INITIATIVES.map((id) => base.ids.includes(id));
    const still = Array(INITIATIVES.length).fill(0);
    let same = 0;
    for (let run = 0; run < runs; run += 1) {
      const impact = IMPACT.map((row) => row.map((value) => (value === 0 ? 0 : Math.min(0.95, value * (0.8 + random() * 0.4)))));
      const again = optimizePortfolio(person.weights, person.gaps as number[], availability.available, availability.dataReady, SCENARIOS[1], impact);
      if (again.mask === base.mask) same += 1;
      selected.forEach((on, index) => {
        if (on && again.ids.includes(INITIATIVES[index])) still[index] += 1;
      });
    }
    stability.push(same / runs);
    selected.forEach((on, index) => {
      if (!on) return;
      keep[index].base += 1;
      keep[index].sum += still[index] / runs;
    });
  }
  const stableCompanies = stability.filter((value) => value >= 0.8).length;
  return {
    status: "ok",
    runs,
    seed: 2027,
    companies: stability.length,
    stableCompanies,
    medianStability: median(stability),
    keep: keep.map((item, index) => ({ index, base: item.base, rate: item.base ? item.sum / item.base : null })),
    note: `En ${runs} corridas por empresa, semilla 2027, cada aporte distinto de cero se multiplica por un factor entre 0,80 y 1,20, con tope 0,95. Los ceros estructurales no se mueven. ${stableCompanies} de ${stability.length} empresas conservan el portafolio intermedio en al menos ocho de cada diez corridas.`,
  };
}

function omittedSensitivity(note: string): PaperCut["sensitivity"] {
  return { status: "omitida", runs: 0, seed: 2027, companies: 0, stableCompanies: 0, medianStability: null, keep: [], note };
}

function rolePairs(people: PersonC[]) {
  const groups = new Map<string, PersonC[]>();
  for (const person of people) {
    if (person.ahpClass !== "principal" || !person.weights || !person.ahp) continue;
    const key = `${person.empresa.trim().toLocaleLowerCase("es")}|${person.alcance}|${person.unidad.trim().toLocaleLowerCase("es")}`;
    groups.set(key, [...(groups.get(key) ?? []), person]);
  }
  const fins: number[] = [];
  const distances: number[] = [];
  let financeHigher = 0;
  for (const group of groups.values()) {
    const cfos = group.filter((person) => person.rol === "cfo");
    const cpos = group.filter((person) => person.rol === "cpo");
    if (cfos.length !== 1 || cpos.length !== 1 || !cfos[0].weights || !cpos[0].weights || !cfos[0].ahp || !cpos[0].ahp) continue;
    const fin = cfos[0].ahp.macro.weights[0] - cpos[0].ahp.macro.weights[0];
    fins.push(fin);
    distances.push(roleDistance(cfos[0].weights, cpos[0].weights));
    if (fin > 0) financeHigher += 1;
  }
  return { n: fins.length, financeHigher, medianFin: median(fins.map((value) => Math.abs(value))), medianDistance: median(distances) };
}

function hypothesesOf(cut: PaperCut): PaperCut["hypotheses"] {
  const sameOrder = cut.priorityOrder.join(",") === cut.gapOrder.join(",") && cut.priorityOrder.length > 0;
  const h1: PaperCut["hypotheses"][number] = !cut.aip
    ? { id: "H1", state: "no evaluable", text: "Falta un promedio de prioridades o de brechas ponderadas." }
    : sameOrder
      ? { id: "H1", state: "patron contrario", text: "En este corte el orden de las prioridades medias coincide con el orden de las brechas ponderadas medias. La hipótesis de que esos órdenes difieren no encuentra apoyo descriptivo." }
      : { id: "H1", state: "patron compatible", text: "El orden de las prioridades medias no coincide con el orden de las brechas ponderadas medias. Es un patrón descriptivo, no una prueba de que la prioridad sea irrelevante." };
  const h2: PaperCut["hypotheses"][number] = !cut.exposureHigh
    ? { id: "H2", state: "no evaluable", text: "No hay respuestas en los rangos altos de exposición." }
    : cut.exposureHighRiskBelow4 === cut.exposureHigh
      ? { id: "H2", state: "patron compatible", text: "Todas las respuestas con exposición alta declaran continuidad bajo el nivel 4. La coincidencia es descriptiva y no identifica la causa." }
      : cut.exposureHighRiskBelow4 === 0
        ? { id: "H2", state: "patron contrario", text: "Ninguna respuesta con exposición alta queda bajo el nivel 4 de continuidad." }
        : { id: "H2", state: "patron compatible", text: "La exposición alta y la continuidad bajo el nivel 4 coinciden en una parte de las respuestas, no en todas." };
  const h3: PaperCut["hypotheses"][number] = !cut.operational
    ? { id: "H3", state: "no evaluable", text: "No hay ruta operativa para cruzar etapa y preparación de datos." }
    : cut.productive > 0 && cut.productiveReadyDigital === cut.productive && cut.pilot > 0 && cut.pilotPartialDigital3 === cut.pilot
      ? { id: "H3", state: "patron compatible", text: "En este corte, la etapa más avanzada coincide con datos declarados listos y la etapa de piloto con preparación parcial. No es una asociación estimada ni un efecto causal." }
      : { id: "H3", state: "patron compatible", text: "Etapa de IA y preparación de datos se cruzan en la misma base. La dirección de la asociación debe leerse en la tabla, sin convertirla en un efecto." };
  const h4: PaperCut["hypotheses"][number] = cut.jaccardMedian == null || cut.etaMedian == null
    ? { id: "H4", state: "no evaluable", text: "Falta similitud o contribución de la agenda aprobada en una base suficiente." }
    : Math.abs(cut.jaccardMedian - cut.etaMedian) >= 0.15
      ? { id: "H4", state: "resultado del modelo", text: "La similitud mediana y la contribución mediana no cuentan la misma historia. Una agenda puede parecerse poco al portafolio y aun así aportar bajo su propio recurso, o al revés." }
      : { id: "H4", state: "resultado del modelo", text: "Similitud y contribución se leen juntas. En este corte no se alejan lo suficiente para tratarlas como diagnósticos opuestos, y tampoco son el mismo indicador." };
  const varied = cut.sensitivity.keep.some((item) => item.rate != null && item.rate >= 0.8) && cut.sensitivity.keep.some((item) => item.rate != null && item.rate < 0.8);
  const h5: PaperCut["hypotheses"][number] = cut.sensitivity.status !== "ok"
    ? { id: "H5", state: "no evaluable", text: cut.sensitivity.note }
    : varied
      ? { id: "H5", state: "resultado del modelo", text: "Algunas iniciativas se mantienen al mover los aportes y otras cambian con más frecuencia. Esa frecuencia no es una probabilidad de éxito." }
      : { id: "H5", state: "resultado del modelo", text: "El movimiento de aportes no separa con claridad un grupo estable de otro inestable. La lectura queda en la figura de sensibilidad." };
  return [h1, h2, h3, h4, h5];
}

function measuredRealization(value: string) {
  return value === "<25" || value === "25-50" || value === "50-75" || value === ">75";
}

function tally(people: PersonC[], valueOf: (person: PersonC) => string) {
  const output: Record<string, number> = {};
  for (const person of people) {
    const value = valueOf(person) || "sin dato";
    output[value] = (output[value] ?? 0) + 1;
  }
  return output;
}

function tallyBarriers(people: PersonC[]) {
  const output: Record<string, number> = {};
  for (const person of people) {
    for (const code of person.barriers) output[code] = (output[code] ?? 0) + 1;
  }
  return output;
}

function orderOf(values: (number | null)[] | null) {
  if (!values) return [];
  return values.map((value, index) => ({ index, value: value ?? -1 })).sort((left, right) => right.value - left.value).map((item) => item.index);
}

function average(rows: number[][]) {
  return rows[0].map((_, index) => rows.reduce((sum, row) => sum + row[index], 0) / rows.length);
}

function argmax(values: number[]) {
  return values.reduce((best, value, index) => (value > values[best] ? index : best), 0);
}

function sameSet(left: readonly InitiativeId[], right: readonly InitiativeId[]) {
  return left.length === right.length && left.every((id) => right.includes(id));
}

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function capabilityName(index: number) {
  return CAPABILITIES[index]?.short.es ?? `C${index + 1}`;
}

export function initiativeName(index: number) {
  return INITIATIVE_COPY[index]?.name.es ?? `I${index + 1}`;
}
