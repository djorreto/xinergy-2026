import { createHash } from "node:crypto";
import { CAPABILITIES, COUNTRIES, EVIDENCE, INDUSTRIES, INITIATIVE_COPY, ROLES } from "@/lib/surveys/radar-b/instrument";
import {
  IMPACT,
  IMPACT_MATRIX_VERSION,
  INITIATIVES,
  SCENARIOS,
  SURVEY_VERSION_B,
  median,
  optimizePortfolio,
  type InitiativeId,
  type ScenarioId,
} from "@/lib/surveys/radar-b/engine";
import { availabilityOf, buildBenchmark, labelOf, type PersonReport } from "@/lib/surveys/radar-b/report";

export const REPORT_VERSION = "b-informe-1.1";
const METHOD_VERSION = "3.0";
const PUBLIC_CELL = 20;

const MACRO_NAMES = ["Valor financiero", "Riesgo, sostenibilidad y control", "Transformación y capacidades"] as const;
const SCENARIO_NAME: Record<ScenarioId, string> = {
  lean: "Ajustado",
  balanced: "Intermedio",
  transformational: "Amplio",
};
const SHORT: Record<InitiativeId, string> = {
  i1: "Sourcing estratégico",
  i2: "Capital de trabajo",
  i3: "Riesgo de proveedores",
  i4: "Digitalización del proceso",
  i5: "Gobierno de datos",
  i6: "IA y automatización",
  i7: "BPO y gasto disperso",
  i8: "Modelo operativo y talento",
  i9: "Innovación con proveedores",
  i10: "ESG de proveedores",
  i11: "Inventario",
};
const LINKED_DIMENSION: Record<InitiativeId, number> = {
  i1: 0,
  i2: 1,
  i3: 2,
  i4: 3,
  i5: 5,
  i6: 5,
  i7: 0,
  i8: 7,
  i9: 6,
  i10: 4,
  i11: 1,
};
const STATUS_LABEL: Record<string, string> = {
  "0": "no considerada",
  "1": "en evaluación",
  "2": "aprobada",
  "3": "en implementación",
  "4": "implementada",
  "5": "no aplicable",
  ns: "no sé",
};

export type StudyBar = { label: string; ratio: number; trailing: string };
export type StudyAction = {
  title: string;
  signal: string;
  profile: string;
  step: string;
  counterpart: string;
  criterion: string;
};
export type StudyClaim = {
  id: string;
  chapter: "mandato" | "capacidad" | "tension" | "agenda";
  title: string;
  observation: string;
  tension: string;
  interpretation: string;
  implication: string;
  limit: string;
  metricIds: string[];
};
export type CapabilityRow = {
  id: string;
  name: string;
  median: number | null;
  below: number;
  low: number;
  counts: number[];
  n: number;
};
export type CrossRow = {
  id: InitiativeId;
  name: string;
  short: string;
  both: number;
  onlyApproved: number;
  onlySelected: number;
  neither: number;
  approved: number;
  selected: number;
  available: number;
  n: number;
  statuses: { label: string; n: number }[];
};
export type CountRow = { label: string; n: number };
export type ReadinessRow = { label: string; n: number; iaActive: number };

export type StudyCut = {
  version: string;
  methodVersion: string;
  surveyVersion: string;
  matrixVersion: string;
  snapshotId: string;
  oldestAt: string | null;
  newestAt: string | null;
  thesis: string;
  counts: {
    responses: number;
    companies: number;
    scopes: number;
    operational: number;
    operationalCpo: number;
    operationalScm: number;
    priority: number;
    motor: number;
    cfo: number;
    ceo: number;
    duplicates: number;
  };
  macros: { name: string; weight: number; text: string; leaders: number }[];
  macroTies: number;
  mandateBalanced: boolean;
  dimensions: { name: string; weight: number; text: string }[];
  operationalCapabilities: CapabilityRow[];
  jointCapabilities: CapabilityRow[];
  gaps: { name: string; mean: number; share: number | null; points: string; shareText: string }[];
  gapN: number;
  gapUniverseSameAsMotor: boolean;
  crosses: CrossRow[];
  highlighted: InitiativeId[];
  rateNote: string;
  rateId: InitiativeId | null;
  capacityLink: string;
  scenarios: { id: ScenarioId; name: string; median: number | null; text: string; n: number; cohort: number }[];
  deltaLeanBalanced: number | null;
  deltaBalancedTransformational: number | null;
  sameBalancedTransformational: number;
  jaccard: { n: number; missing: number; median: number | null };
  eta: { n: number; missing: number; median: number | null; reasons: CountRow[] };
  ownEta: { n: number; missing: number; median: number | null; reasons: CountRow[] };
  pairs: { n: number; financeHigher: number; medianPoints: number | null };
  ceoPairs: { n: number; financeHigher: number };
  evidence: { present: boolean; complete: number; cohort: number };
  evidenceRows: { id: string; label: string; rows: CountRow[] }[];
  dataRows: CountRow[];
  readiness: ReadinessRow[];
  aiStageRows: CountRow[];
  hypotheses: { id: string; title: string; status: string; text: string }[];
  sensitivity: {
    status: "ok" | "omitida";
    runs: number;
    seed: number;
    scenario: string;
    companies: number;
    stableCompanies: number;
    medianStability: number | null;
    note: string;
  };
  replayOk: boolean;
  replayReason: string;
  claims: StudyClaim[];
  actions: StudyAction[];
  openQuestions: string[];
  coverage: { countries: CountRow[]; industries: CountRow[]; roles: CountRow[] };
  publicSegments: boolean;
  exhibits: {
    macros: { title: string; note: string; bars: StudyBar[] };
    dimensions: { title: string; note: string; bars: StudyBar[] };
    capabilities: { title: string; note: string };
    gaps: { title: string; note: string; bars: StudyBar[] };
    coincidence: { title: string; note: string };
    scenarios: { title: string; note: string };
  };
};

export function formatLevel(value: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";
  const tenths = Math.round(value * 10) / 10;
  return Number.isInteger(tenths) ? String(tenths) : tenths.toFixed(1).replace(".", ",");
}

export function formatCount(numerator: number, denominator: number): string {
  if (!denominator) return "—";
  return `${numerator}/${denominator} (${((numerator / denominator) * 100).toFixed(1).replace(".", ",")}%)`;
}

export function formatPercent(value: number | null, digits = 1): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${(value * 100).toFixed(digits).replace(".", ",")}%`;
}

export function formatPoints(value: number | null, digits = 1): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value.toFixed(digits).replace(".", ",")} puntos`;
}

export function buildStudyCut(people: PersonReport[], options?: { sensitivity?: boolean }): StudyCut {
  const included = people.filter((person) => person.included);
  const benchmark = buildBenchmark(people);
  const byId = new Map(people.map((person) => [person.id, person]));
  const pick = (ids: string[]) => ids.map((id) => byId.get(id)).filter((person): person is PersonReport => Boolean(person));
  const operational = pick(benchmark.principalIds);
  const priority = pick(benchmark.priorityIds);
  const motor = pick(benchmark.motorIds);
  const scopes = new Set(included.map(scopeKey));
  const companies = new Set(included.map((person) => person.empresa.trim().toLocaleLowerCase("es")));
  const counts = {
    responses: included.length,
    companies: companies.size,
    scopes: scopes.size,
    operational: operational.length,
    operationalCpo: operational.filter((person) => person.rol === "cpo").length,
    operationalScm: operational.filter((person) => person.rol === "scm").length,
    priority: priority.length,
    motor: motor.length,
    cfo: included.filter((person) => person.rol === "cfo").length,
    ceo: included.filter((person) => person.rol === "ceo").length,
    duplicates: benchmark.duplicates.length,
  };

  const macroWeights = benchmark.macroMean ?? [];
  const macroDigits = shareDigits(macroWeights);
  const leaderCounts = [0, 0, 0];
  let macroTies = 0;
  for (const person of priority) {
    const weights = person.ahp?.macro.weights ?? [];
    const top = uniqueTop(weights);
    if (top == null) macroTies += 1;
    else leaderCounts[top] += 1;
  }
  const macros = MACRO_NAMES.map((name, index) => ({
    name,
    weight: macroWeights[index] ?? 0,
    text: macroWeights.length ? formatPercent(macroWeights[index] ?? 0, macroDigits) : "—",
    leaders: leaderCounts[index] ?? 0,
  }));
  const mandateBalanced = macros.length === 3 && Math.max(...macros.map((item) => item.weight)) - Math.min(...macros.map((item) => item.weight)) < 0.08;

  const dimensionWeights = benchmark.ahpMean ?? [];
  const dimensionDigits = shareDigits(dimensionWeights);
  const dimensions = CAPABILITIES.map((item, index) => ({
    name: item.short.es,
    weight: dimensionWeights[index] ?? 0,
    text: dimensionWeights.length ? formatPercent(dimensionWeights[index] ?? 0, dimensionDigits) : "—",
  }));

  const operationalCapabilities = capabilityTable(operational);
  const jointCapabilities = capabilityTable(motor);
  const gapped = priority.filter((person) => person.strategic && person.g0 != null && person.gaps.every((gap) => gap != null));
  const meanSg = CAPABILITIES.map((_, index) => mean(gapped.map((person) => (person.strategic as number[])[index])) ?? 0);
  const gapTotal = meanSg.reduce((sum, value) => sum + value, 0);
  const gaps = CAPABILITIES.map((item, index) => {
    const share = gapTotal > 0 ? meanSg[index] / gapTotal : null;
    return {
      name: item.short.es,
      mean: meanSg[index] ?? 0,
      share,
      points: formatPoints((meanSg[index] ?? 0) * 100),
      shareText: share == null ? "—" : formatPercent(share),
    };
  });
  const gapUniverseSameAsMotor = gapped.length === motor.length && gapped.every((person) => benchmark.motorIds.includes(person.id));

  const crosses = crossTable(motor);
  const disagreement = pickDisagreement(crosses);
  const alignment = pickAlignment(crosses, disagreement?.id);
  const highlighted = [disagreement?.id, alignment?.id].filter((id): id is InitiativeId => Boolean(id));
  const rate = rateSentence(crosses, highlighted);
  const capacityLink = disagreement ? capacitySentence(motor, disagreement) : "";

  const scenarios = SCENARIOS.map((scenario) => {
    const values = motor
      .map((person) => person.scenarios.find((item) => item.id === scenario.id)?.portfolio?.closure)
      .filter((value): value is number => value != null);
    const mid = median(values);
    return { id: scenario.id, name: SCENARIO_NAME[scenario.id], median: mid, text: formatPercent(mid), n: values.length, cohort: motor.length };
  });
  const deltas = pairedChanges(motor);
  const jaccard = similarityStats(motor, "balanced");
  const eta = contributionStats(motor, "balanced");
  const own = ownStats(motor);
  const pairs = roleDelta(included, "cfo", "cpo");
  const ceoPairs = roleDelta(included, "ceo", "cpo");
  const evidenceComplete = operational.filter((person) => EVIDENCE.every((item) => person.evidencia[item.id])).length;
  const evidencePresent = operational.some((person) => EVIDENCE.some((item) => person.evidencia[item.id]));
  const evidenceRows = EVIDENCE.map((item) => ({
    id: item.id,
    label: item.label.es,
    rows: countLabels(
      operational.map((person) => person.evidencia[item.id] ?? ""),
      item.options,
    ),
  }));
  const readiness = readinessOf(motor);
  const dataRows = countLabels(
    motor.map((person) => person.datos),
    [
      { v: "READY", es: "Datos listos" },
      { v: "PARTIAL", es: "Datos parciales" },
      { v: "NOT_READY", es: "Sin esa base" },
      { v: "UNKNOWN", es: "No lo sé o alcance de IA no definido" },
    ],
  );
  const aiStage = EVIDENCE.find((item) => item.id === "e5");
  const aiStageRows = aiStage
    ? countLabels(
        operational.map((person) => person.evidencia.e5 ?? ""),
        aiStage.options,
      )
    : [];
  const replay = replayOf(motor);
  const sensitivity = !replay.ok
    ? omittedSensitivity("No se corre la sensibilidad porque el portafolio recalculado no coincide con el del corte.")
    : options?.sensitivity === false
      ? omittedSensitivity("La sensibilidad queda fuera de esta ejecución.")
      : sensitivityOf(motor);

  const coverage = {
    countries: countLabels(operational.flatMap((person) => person.paises), COUNTRIES).sort((left, right) => right.n - left.n),
    industries: countLabels(operational.map((person) => person.rubro), INDUSTRIES).sort((left, right) => right.n - left.n),
    roles: countLabels(included.map((person) => person.rol), ROLES).sort((left, right) => right.n - left.n),
  };
  const publicSegments = [...coverage.countries, ...coverage.industries].some((row) => row.n >= PUBLIC_CELL);

  const draft: StudyCut = {
    version: REPORT_VERSION,
    methodVersion: METHOD_VERSION,
    surveyVersion: SURVEY_VERSION_B,
    matrixVersion: IMPACT_MATRIX_VERSION,
    snapshotId: snapshotOf(included),
    oldestAt: oldest(included),
    newestAt: newest(included),
    thesis: "",
    counts,
    macros,
    macroTies,
    mandateBalanced,
    dimensions,
    operationalCapabilities,
    jointCapabilities,
    gaps,
    gapN: gapped.length,
    gapUniverseSameAsMotor,
    crosses,
    highlighted,
    rateNote: rate.text,
    rateId: rate.id,
    capacityLink,
    scenarios,
    deltaLeanBalanced: deltas.leanBalanced,
    deltaBalancedTransformational: deltas.balancedTransformational,
    sameBalancedTransformational: deltas.same,
    jaccard,
    eta,
    ownEta: own,
    pairs: { n: pairs.n, financeHigher: pairs.higher, medianPoints: pairs.medianPoints },
    ceoPairs: { n: ceoPairs.n, financeHigher: ceoPairs.higher },
    evidence: { present: evidencePresent, complete: evidenceComplete, cohort: operational.length },
    evidenceRows,
    dataRows,
    readiness,
    aiStageRows,
    hypotheses: [],
    sensitivity,
    replayOk: replay.ok,
    replayReason: replay.reason,
    claims: [],
    actions: [],
    openQuestions: [],
    coverage,
    publicSegments,
    exhibits: emptyExhibits(),
  };
  draft.hypotheses = hypothesisBlock(draft);
  draft.claims = claimBlock(draft, disagreement, alignment);
  draft.actions = actionBlock(draft, disagreement);
  draft.thesis = thesisOf(draft);
  draft.openQuestions = questionBlock(draft);
  draft.exhibits = exhibitBlock(draft);
  return draft;
}

export function studySelfChecks(): string[] {
  const problems: string[] = [];
  if (formatLevel(2.5) !== "2,5") problems.push("Una mediana 2,5 no puede mostrarse como 3.");
  if (formatLevel(3) !== "3") problems.push("Una mediana entera debe verse sin decimal.");
  if (median([2, 3]) !== 2.5) problems.push("La mediana de dos niveles debe quedar en el punto medio.");
  const closed = optimizePortfolio([1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], Array.from({ length: 11 }, () => true), 1, {
    budget: 6,
    effort: 7,
    maxCount: 2,
  });
  if (closed.closure != null) problems.push("Una brecha inicial de cero no debe producir un cierre porcentual.");
  if (CAPABILITIES[6]?.id !== "innovacion" || INITIATIVES[8] !== "i9") problems.push("La capacidad de innovación y la iniciativa de innovación deben conservar IDs distintos.");
  return problems;
}

export function narrativeBlob(cut: StudyCut): string {
  return [
    cut.thesis,
    ...cut.claims.flatMap((claim) => [claim.title, claim.observation, claim.tension, claim.interpretation, claim.implication, claim.limit]),
    ...cut.actions.flatMap((action) => [action.title, action.signal, action.profile, action.step, action.counterpart, action.criterion]),
    ...cut.hypotheses.map((item) => item.text),
    ...cut.openQuestions,
    "2027",
    "90",
  ].join("\n");
}

function claimBlock(cut: StudyCut, disagreement: CrossRow | undefined, alignment: CrossRow | undefined): StudyClaim[] {
  const claims: StudyClaim[] = [];
  const mandate = mandateClaim(cut);
  if (mandate) claims.push(mandate);
  const capacity = capacityClaim(cut);
  if (capacity) claims.push(capacity);
  const digital = digitalClaim(cut);
  if (digital) claims.push(digital);
  const agenda = agendaClaim(cut, disagreement, alignment);
  if (agenda) claims.push(agenda);
  const scenario = scenarioClaim(cut);
  if (scenario) claims.push(scenario);
  return claims.slice(0, 5);
}

function mandateClaim(cut: StudyCut): StudyClaim | null {
  if (cut.macros.length < 3 || !cut.counts.priority) return null;
  const [fin, res, trans] = cut.macros;
  const top = [...cut.macros].sort((left, right) => right.weight - left.weight)[0];
  const second = [...cut.macros].sort((left, right) => right.weight - left.weight)[1];
  const gap = (top.weight - second.weight) * 100;
  const balance = cut.mandateBalanced
    ? "El mandato combina tres exigencias de peso similar. La ventaja del bloque mayor es moderada y no describe una agenda centrada en un solo objetivo."
    : `La diferencia entre ${top.name.toLowerCase()} y el bloque siguiente es de ${formatPoints(gap)}. Sigue habiendo más de una exigencia sobre la función.`;
  const ties = cut.macroTies ? ` ${cut.macroTies} empresas no tienen un único bloque en el primer lugar.` : "";
  return {
    id: "mandato",
    chapter: "mandato",
    title: cut.mandateBalanced ? "El mandato de 2027 equilibra valor, resiliencia y transformación" : `El mandato de 2027 se inclina hacia ${top.name.toLowerCase()}`,
    observation: `Entre las ${cut.counts.priority} empresas con prioridades consistentes, el valor financiero concentra ${fin.text} de la importancia relativa, frente a ${res.text} de riesgo, sostenibilidad y control y ${trans.text} de transformación y capacidades. ${balance} Ese promedio no es el perfil de cada empresa: el valor financiero es el bloque mayor en ${fin.leaders} de ${cut.counts.priority}, riesgo y control en ${res.leaders} y transformación en ${trans.leaders}.${ties}`,
    tension: "Un promedio parejo puede leerse como acuerdo. Empresa por empresa, el primer bloque no siempre es el mismo.",
    interpretation: "Una explicación posible es que 2027 le pide a Compras sostener valor, continuidad y cambio a la vez. Otra es que varias comparaciones quedan cerca del empate. Este corte no separa esas dos lecturas.",
    implication: "Antes de fijar una agenda única de ahorro, cada CPO puede mirar qué bloque pesa más en su propia empresa y qué capacidad lo vuelve ejecutable.",
    limit: "Estos pesos son importancia relativa declarada. No son un presupuesto, ni la proporción de empresas que eligió un tema, ni una predicción de 2027.",
    metricIds: ["priority.macro.fin", "priority.macro.res", "priority.macro.trans"],
  };
}

function capacityClaim(cut: StudyCut): StudyClaim | null {
  const cost = rowOf(cut.operationalCapabilities, "costos");
  const cash = rowOf(cut.operationalCapabilities, "caja");
  if (!cost || !cash || !cost.n) return null;
  const ranked = [...cut.operationalCapabilities].filter((item) => item.n).sort((left, right) => right.below / right.n - left.below / left.n);
  const financial = ranked[0]?.id === "costos" || ranked[0]?.id === "caja" || ranked[1]?.id === "costos" || ranked[1]?.id === "caja";
  const title = financial
    ? "La agenda financiera convive con capacidades todavía en desarrollo"
    : `La capacidad más abierta está en ${ranked[0] ? phrase(ranked[0].name) : "varias dimensiones"}`;
  const shifted = cut.operationalCapabilities.flatMap((item, index) => {
    const joint = cut.jointCapabilities[index];
    if (!joint || joint.median == null || item.median == null || joint.median === item.median) return [];
    return [`${phrase(item.name)} es ${formatLevel(joint.median)}`];
  });
  const jointSentence = shifted.length
    ? ` En el subconjunto de ${cut.counts.motor} empresas que además entran al escenario, la mediana de ${shifted.join(" y la de ")}. Una mediana con decimal es el punto medio entre dos niveles respondidos, no un nivel que alguien haya marcado.`
    : "";
  const gapSentence = cut.gapN
    ? ` En ese conjunto comparable de ${cut.gapN} empresas, la brecha se calcula por empresa: el peso de la prioridad multiplicado por la distancia hasta el nivel 4. Las dos brechas medias más altas están en ${topGaps(cut)}.`
    : "";
  return {
    id: "capacidad",
    chapter: "capacidad",
    title,
    observation: `Entre las ${cut.counts.operational} empresas con respuesta de Compras u Operaciones, ${formatCount(cost.below, cost.n)} están por debajo del nivel 4 en costos y captura de valor, y ${formatCount(cash.below, cash.n)} en caja y capital de trabajo. En costos, ${formatCount(cost.low, cost.n)} permanecen en niveles 1 o 2. La mediana de costos es ${formatLevel(cost.median)} y la de caja es ${formatLevel(cash.median)}.${jointSentence}${gapSentence}`,
    tension: "El mandato sale de las empresas con prioridades consistentes. La capacidad descriptiva usa las respuestas de Compras u Operaciones, aunque su prioridad haya quedado fuera del promedio. Son lecturas distintas y el informe las mantiene separadas.",
    interpretation: "Esto sugiere que parte de la conversación de 2027 pasa por cómo se gestiona y se verifica el valor, no solo por declararlo prioritario. La encuesta recoge la capacidad que cada empresa se atribuye. No mide cuánta realización de ahorro se pierde.",
    implication: "La revisión útil, para quien está en niveles 1 a 3, es de cobertura de categorías, línea base y validación con Finanzas. No es una instrucción igual para quien ya opera en el nivel 4 o 5.",
    limit: "Un nivel alto no demuestra el resultado, y un nivel bajo no demuestra la pérdida. Los “no sé” no entran como cero.",
    metricIds: ["operational.cost.below", "operational.cash.below", "joint.cost.median", "gap.mean"],
  };
}

function digitalClaim(cut: StudyCut): StudyClaim | null {
  const digital = rowOf(cut.operationalCapabilities, "digital");
  if (!digital || digital.n < 5) return null;
  const mid = digital.counts[3] ?? 0;
  const high = (digital.counts[4] ?? 0) + (digital.counts[5] ?? 0);
  const low = (digital.counts[1] ?? 0) + (digital.counts[2] ?? 0);
  if (mid < 3 || high < 3) return null;
  const lowSentence = low ? `${formatCount(low, digital.n)} están en niveles 1 o 2.` : "Ninguna declara nivel 1 o 2.";
  const dataBits = cut.readiness.map((row) => `${row.n} con ${row.label.toLowerCase()}`);
  const dataSentence = dataBits.length ? ` La condición de datos no es ese nivel: en las ${cut.counts.motor} empresas del escenario hay ${dataBits.join(" y ")}.` : "";
  return {
    id: "digital",
    chapter: "tension",
    title: "La capacidad digital declarada no es uniforme",
    observation: `La mediana digital es ${formatLevel(digital.median)} en ${digital.n} empresas operacionales. ${formatCount(mid, digital.n)} reportan nivel 3 y ${formatCount(high, digital.n)} reportan nivel 4 o 5. ${lowSentence}${dataSentence}`,
    tension: "Una mediana de 4 puede leerse como una capacidad ya instalada. La distribución muestra un grupo en la referencia y otro todavía por debajo.",
    interpretation: "Las empresas en nivel 3 pueden necesitar ordenar gobierno, integración y seguimiento antes de ampliar usos. Un nivel 4 o 5 tampoco muestra, por sí solo, que los datos alcancen para escalar IA. La hipótesis que vincula datos listos con más IA aprobada sigue pendiente: aquí solo se publican los conteos.",
    implication: "Conviene contrastar el nivel declarado con la condición de datos y con los casos de uso antes de tratar la transformación digital como un frente único.",
    limit: "El nivel digital y la condición de datos son preguntas distintas. Este corte no convierte esa diferencia en una causa.",
    metricIds: ["operational.digital.distribution", "motor.data.ready"],
  };
}

function agendaClaim(cut: StudyCut, disagreement: CrossRow | undefined, alignment: CrossRow | undefined): StudyClaim | null {
  if (!cut.counts.motor || (!disagreement && !alignment)) return null;
  const parts: string[] = [];
  if (disagreement) {
    parts.push(
      `En el escenario intermedio, ${disagreement.short} queda seleccionado en ${formatCount(disagreement.selected, disagreement.n)} empresas. Hay ${formatCount(disagreement.approved, disagreement.n)} con esa iniciativa aprobada. Esas tasas parecidas no son la misma agenda: ${disagreement.both} empresas están en ambos grupos, ${disagreement.onlyApproved} tienen aprobación sin selección y ${disagreement.onlySelected} tienen selección sin aprobación. ${disagreement.neither} no están en ninguno.`,
    );
  }
  if (alignment) {
    parts.push(
      `En ${alignment.short} ocurre otra cosa: las ${alignment.selected} selecciones están dentro de las ${alignment.approved} aprobaciones. ${alignment.onlyApproved} empresas la tienen aprobada y el escenario no la vuelve a elegir. No aparece seleccionada fuera de lo ya aprobado.`,
    );
  }
  if (cut.rateNote) parts.push(cut.rateNote);
  if (cut.capacityLink) parts.push(cut.capacityLink);
  const compare = cut.eta.n
    ? `La agenda aprobada se puede contrastar con este escenario en ${cut.eta.n} de ${cut.counts.motor} empresas. En las otras ${cut.eta.missing} no hay comparación, sobre todo porque ${(cut.eta.reasons[0]?.label ?? "falta un insumo").replace(/\.$/, "").toLowerCase()}. Esas empresas no reciben una nota de desalineación.`
    : `En este corte la agenda aprobada no queda comparada dentro de los límites del escenario (${cut.eta.missing} empresas sin comparación). No se les asigna una mala nota por ese vacío.`;
  return {
    id: "agenda",
    chapter: "agenda",
    title: disagreement ? "Una misma tasa de aprobación y de selección puede esconder agendas distintas" : "La selección del escenario cae dentro de decisiones ya tomadas",
    observation: parts.join(" "),
    tension: "La igualdad de dos porcentajes agregados no dice que las mismas empresas estén en ambos lados. Tampoco dice que una iniciativa ya aprobada deba repetirse.",
    interpretation: compare,
    implication: "El paso siguiente es revisar el caso donde aprobación y selección no coinciden, y el alcance donde la decisión ya está tomada. No es subir las dos agendas por defecto.",
    limit: "El escenario usa una matriz de demostración. No demuestra que una iniciativa aprobada esté equivocada ni que la seleccionada vaya a rendir.",
    metricIds: ["motor.coincidence", "motor.eta"],
  };
}

function scenarioClaim(cut: StudyCut): StudyClaim | null {
  if (!cut.counts.motor || cut.scenarios.every((item) => item.median == null)) return null;
  const [lean, balanced, transformational] = cut.scenarios;
  const secondStepSmall = (cut.deltaBalancedTransformational ?? 100) < 5;
  const title = secondStepSmall
    ? "Más recursos no cambian la solución en una parte relevante de las empresas"
    : "Ampliar el escenario sigue moviendo el cierre modelado";
  const sensitivity = cut.sensitivity.status === "ok" ? ` ${cut.sensitivity.note}` : "";
  return {
    id: "escenarios",
    chapter: "agenda",
    title,
    observation: `Bajo los supuestos de demostración, la mediana de cierre de la brecha hacia el nivel 4 es ${lean.text} en el escenario ajustado, ${balanced.text} en el intermedio y ${transformational.text} en el amplio. Entran ${lean.n}, ${balanced.n} y ${transformational.n} empresas con brecha inicial positiva, de ${cut.counts.motor}. El cambio mediano por empresa es de ${formatPoints(cut.deltaLeanBalanced)} al pasar del ajustado al intermedio, y de ${formatPoints(cut.deltaBalancedTransformational)} al pasar al amplio. ${cut.sameBalancedTransformational} empresas conservan el mismo conjunto de iniciativas entre esos dos últimos.${sensitivity}`,
    tension: "Un presupuesto más amplio no implica una solución distinta. A veces el conjunto queda igual porque la iniciativa que faltaba no está disponible, porque exige datos, o porque su aporte se solapa con otra ya elegida.",
    interpretation: "La lectura útil es dónde el primer tramo de recursos encuentra alternativas y dónde el tramo siguiente ya no cambia la decisión. El cierre es un resultado del modelo hacia la meta de nivel 4. No es una mejora observada.",
    implication: "Si al ampliar recursos el conjunto no cambia, el CPO gana más identificando la restricción que preparando un caso de más iniciativas.",
    limit: "Los límites de costo, esfuerzo y número de iniciativas son puntos relativos de demostración. No son dólares, personas ni meses.",
    metricIds: ["motor.closure.median", "motor.portfolio.same"],
  };
}

function actionBlock(cut: StudyCut, disagreement: CrossRow | undefined): StudyAction[] {
  const actions: StudyAction[] = [];
  const cost = rowOf(cut.operationalCapabilities, "costos");
  const talent = rowOf(cut.operationalCapabilities, "talento");
  if (cost && cost.n && cost.below / cost.n >= 0.4) {
    actions.push({
      title: "Revisar con Finanzas dónde se verifica el valor",
      signal: `En costos, ${formatCount(cost.below, cost.n)} de las empresas operacionales están bajo el nivel 4 y ${formatCount(cost.low, cost.n)} en niveles 1 o 2.`,
      profile: "Empresas en niveles 1 a 3 de costos y captura de valor.",
      step: "Elegir una muestra de iniciativas del último ejercicio y seguir cada una desde la línea base hasta lo que Finanzas reconoció.",
      counterpart: "CPO y CFO.",
      criterion: "Si la línea base o la realización no se pueden reconstruir, el siguiente paso es ese seguimiento. No hace falta ampliar el pipeline para saberlo. El informe no mide cuánto valor se pierde.",
    });
  }
  if (disagreement) {
    actions.push({
      title: `Revisar ${phrase(disagreement.short)} caso por caso`,
      signal: `${disagreement.both} empresas lo tienen aprobado y seleccionado, ${disagreement.onlyApproved} solo aprobado y ${disagreement.onlySelected} solo seleccionado, sobre ${disagreement.n}.`,
      profile: `Empresas del escenario intermedio donde la aprobación de ${phrase(disagreement.short)} y la selección del escenario no coinciden.`,
      step: "Anotar si la diferencia viene de la brecha, de que la iniciativa no esté disponible, del límite de recursos o de un supuesto de la matriz.",
      counterpart: "CPO, con Finanzas si toca caja o costo, y con quien lidera datos si toca información.",
      criterion: "Se mantiene la iniciativa aprobada si el caso propio se sostiene. Se reabre si el alcance ya está cubierto. El escenario no prueba que la aprobación esté equivocada.",
    });
  }
  if (cut.readiness.some((row) => row.n > 0)) {
    const ready = cut.readiness.find((row) => row.label === "Datos listos");
    const partial = cut.readiness.find((row) => row.label === "Datos parciales");
    const signal = ready && partial
      ? `${ready.n} empresas declaran datos listos y ${ready.iaActive} de ellas tienen IA aprobada o en implementación. Entre las ${partial.n} con datos parciales, son ${partial.iaActive}.`
      : "La condición de datos y el estado de IA están respondidos, y no dicen lo mismo que el nivel digital.";
    actions.push({
      title: "Separar nivel digital y condición de datos antes de escalar IA",
      signal,
      profile: "Empresas con digital en nivel 3, o con datos parciales, insuficientes o desconocidos.",
      step: "Registrar si los datos del alcance tienen dueño, acceso y control de calidad, y si hay un caso de uso con responsable. No usar el nivel digital como sustituto.",
      counterpart: "CPO y el responsable de datos del alcance.",
      criterion: "Sin esa condición, IA queda fuera de una recomendación de ejecución. Tener los datos listos tampoco demuestra que el caso ya funcione.",
    });
  }
  if (cut.sameBalancedTransformational > 0) {
    actions.push({
      title: "Preguntar qué cambia si el plan se amplía",
      signal: `${cut.sameBalancedTransformational} de ${cut.counts.motor} empresas conservan el mismo conjunto al pasar del escenario intermedio al amplio. El cambio mediano de cierre es de ${formatPoints(cut.deltaBalancedTransformational)}.`,
      profile: "Empresas cuyo conjunto no cambia al ampliar recursos.",
      step: "Comparar los dos conjuntos. Si son iguales, identificar la restricción: iniciativa no disponible, datos, tope de esfuerzo o aportes que se solapan.",
      counterpart: "CPO y el responsable de la iniciativa que quedó fuera.",
      criterion: "Solo vale preparar un caso de más recursos si el conjunto cambia y la iniciativa nueva ataca una brecha que la empresa reconoce. El cierre modelado no es un ahorro.",
    });
  }
  if (talent && talent.n && talent.median != null && talent.median >= 4 && talent.below > 0 && actions.length < 5) {
    actions.push({
      title: "No subir la vara de talento a todas por la mediana",
      signal: `La mediana de talento es ${formatLevel(talent.median)}. Aun así, ${formatCount(talent.below, talent.n)} están bajo el nivel 4 y ${formatCount(talent.low, talent.n)} en niveles 1 o 2.`,
      profile: "Empresas bajo el nivel 4 en talento, y solo si la agenda ya aprobada exige roles, adopción o capacidad de ejecución adicional.",
      step: "Listar las iniciativas aprobadas que dependen de gente o de adopción, y ver si el nivel actual las sostiene.",
      counterpart: "CPO y el líder del equipo de Compras.",
      criterion: "Si la agenda aprobada cabe en la capacidad actual, no se abre un programa de talento por la mediana del grupo.",
    });
  }
  return actions.slice(0, 5);
}

function hypothesisBlock(cut: StudyCut): StudyCut["hypotheses"] {
  const h1 =
    cut.pairs.n === 0
      ? "No hay pares de la misma empresa y alcance con prioridades consistentes en Finanzas y Compras. La hipótesis queda pendiente."
      : `Hay ${cut.pairs.n} pares comparables. En ${cut.pairs.financeHigher} de ellos Finanzas asigna más peso al valor financiero que Compras. ${cut.pairs.n < 5 ? "Con menos de cinco pares no se describe una divergencia general. El cálculo queda en el apéndice." : "El contraste describe este corte, no una regla de los cargos."}`;
  const digital = rowOf(cut.operationalCapabilities, "digital");
  const e4 = cut.evidenceRows.find((item) => item.id === "e4");
  const h2 = !cut.evidence.present || !e4 || !digital
    ? "Esta ola no tiene, a la vez, el nivel digital y el rango de esfuerzo para validar gasto. La hipótesis queda abierta y no se reemplaza por una conclusión genérica."
    : `Hay ${cut.evidence.cohort} respuestas operacionales y la pregunta de esfuerzo está respondida. La hipótesis de que más capacidad digital coincide con menos trabajo para validar el gasto no se declara confirmada. Los rangos siguen como categorías. El apéndice muestra los conteos y no los convierte en horas.`;
  const h3 = !cut.readiness.length
    ? "No está la condición de datos para IA. La hipótesis queda abierta."
    : `${cut.readiness.map((row) => `${row.label}: ${row.n} empresas del escenario, ${row.iaActive} con IA aprobada o en implementación`).join(". ")}. ${readinessReading(cut)} Una aprobación no es adopción ni éxito.`;
  return [
    { id: "H1", title: "Finanzas y Compras frente al valor financiero", status: cut.pairs.n >= 5 ? "descriptiva" : "pendiente", text: h1 },
    { id: "H2", title: "Capacidad digital y esfuerzo para validar el gasto", status: "pendiente", text: h2 },
    { id: "H3", title: "Datos listos e IA en la agenda", status: "pendiente", text: h3 },
  ];
}

function questionBlock(cut: StudyCut): string[] {
  const questions = [
    "Qué bloque pesa más en la propia empresa, y no solo en el promedio del corte.",
    "Dónde la capacidad declarada todavía no llega al nivel 4, y si Finanzas puede seguir una iniciativa desde la línea base hasta la realización.",
    "En qué iniciativas la aprobación y el escenario no hablan de las mismas empresas.",
    "Qué restricción deja el conjunto igual cuando se amplían los recursos.",
  ];
  if (!cut.publicSegments) questions.push("Qué diferencias por país o industria merecen esperar: ninguna celda de este corte llega a 20 empresas.");
  if (cut.ceoPairs.n) questions.push(`Hay ${cut.ceoPairs.n} pares de dirección general y Compras con prioridades consistentes. No se usa esa respuesta para describir la capacidad operacional.`);
  else if (cut.counts.ceo) questions.push("La dirección general respondió, pero no hay pares consistentes para contrastar su mandato con el de Compras. No se infiere la capacidad desde esa respuesta.");
  return questions;
}

function thesisOf(cut: StudyCut): string {
  const weak = [...cut.operationalCapabilities].filter((item) => item.n).sort((left, right) => right.below / right.n - left.below / left.n)[0];
  const financial = weak?.id === "costos" || weak?.id === "caja";
  if (cut.mandateBalanced && financial) return "Un mandato equilibrado enfrenta capacidades financieras menos consolidadas.";
  if (cut.mandateBalanced && weak) return `Un mandato equilibrado enfrenta una capacidad desigual en ${phrase(weak.name)}.`;
  const top = [...cut.macros].sort((left, right) => right.weight - left.weight)[0];
  if (top && weak) return `El mandato se inclina hacia ${phrase(top.name)}, con trabajo pendiente en ${phrase(weak.name)}.`;
  return cut.claims[0]?.title ?? "Este corte todavía no sostiene una tesis.";
}

function exhibitBlock(cut: StudyCut): StudyCut["exhibits"] {
  const priorityNote = `Importancia relativa. ${cut.counts.priority} empresas con prioridades consistentes. No es un presupuesto.`;
  const below = cut.operationalCapabilities.filter((item) => item.n && item.median != null && item.median < 4).map((item) => CAPABILITY_SHORT[item.id] ?? item.name);
  return {
    macros: {
      title: cut.mandateBalanced ? "Tres exigencias de peso parecido" : "El peso del mandato no se reparte por igual",
      note: priorityNote,
      bars: cut.macros.map((item) => ({ label: item.name, ratio: item.weight, trailing: item.text })),
    },
    dimensions: {
      title: "Las prioridades específicas, dentro del mismo promedio",
      note: `${priorityNote} El peso ya combina el bloque y la prioridad dentro del bloque.`,
      bars: [...cut.dimensions]
        .sort((left, right) => right.weight - left.weight)
        .map((item) => ({ label: item.name, ratio: item.weight, trailing: item.text })),
    },
    capabilities: {
      title: below.length ? `${below.slice(0, 2).join(" y ")} quedan bajo el nivel 4` : "Las capacidades declaradas llegan al nivel 4",
      note: `Niveles declarados de 1 a 5. ${cut.counts.operational} empresas de Compras u Operaciones. La referencia de planificación es el nivel 4. Los “no sé” no se dibujan como cero.`,
    },
    gaps: {
      title: "Dónde pesa más la distancia hasta el nivel 4",
      note: `Brecha media por empresa, en puntos del índice. ${cut.gapN} empresas con prioridad consistente y capacidades completas. ${cut.gapUniverseSameAsMotor ? "Es el mismo conjunto del escenario." : "No es el mismo conjunto que el escenario."} No es ahorro.`,
      bars: cut.gaps.map((item) => ({
        label: item.name,
        ratio: item.share ?? 0,
        trailing: `${item.points.replace(" puntos", " pts")} · ${item.shareText}`,
      })),
    },
    coincidence: {
      title: "Aprobación y selección no siempre caen en las mismas empresas",
      note: `Escenario intermedio. ${cut.counts.motor} empresas. Aprobada significa una decisión para los próximos 12 a 18 meses, no una iniciativa ya implementada.`,
    },
    scenarios: {
      title: cut.claims.find((claim) => claim.id === "escenarios")?.title ?? "Qué cambia al ampliar recursos",
      note: `Mediana del cierre modelado de la brecha hacia el nivel 4. ${cut.counts.motor} empresas con escenario de demostración. No es un ahorro observado.`,
    },
  };
}

function emptyExhibits(): StudyCut["exhibits"] {
  const blank = { title: "", note: "", bars: [] };
  return { macros: blank, dimensions: blank, capabilities: { title: "", note: "" }, gaps: blank, coincidence: { title: "", note: "" }, scenarios: { title: "", note: "" } };
}

function topGaps(cut: StudyCut): string {
  const ranked = [...cut.gaps].sort((left, right) => right.mean - left.mean);
  return `${ranked[0] ? phrase(ranked[0].name) : "—"} (${ranked[0]?.points ?? "—"}) y ${ranked[1] ? phrase(ranked[1].name) : "—"} (${ranked[1]?.points ?? "—"})`;
}

function capabilityTable(people: PersonReport[]): CapabilityRow[] {
  return CAPABILITIES.map((item, index) => {
    const values = people.map((person) => person.levels[index]).filter((level): level is number => level != null);
    const counts = [0, 0, 0, 0, 0, 0];
    for (const level of values) counts[level] += 1;
    return {
      id: item.id,
      name: item.short.es,
      median: median(values),
      below: values.filter((level) => level < 4).length,
      low: values.filter((level) => level <= 2).length,
      counts,
      n: values.length,
    };
  });
}

function crossTable(people: PersonReport[]): CrossRow[] {
  return INITIATIVES.map((id) => {
    let both = 0;
    let onlyApproved = 0;
    let onlySelected = 0;
    let neither = 0;
    let available = 0;
    const statuses = new Map<string, number>();
    for (const person of people) {
      const status = person.agenda[id] ?? "";
      statuses.set(status, (statuses.get(status) ?? 0) + 1);
      const approved = status === "2";
      const selected = person.scenarios.find((item) => item.id === "balanced")?.portfolio?.ids.includes(id) ?? false;
      if (status === "0" || status === "1" || status === "2") available += 1;
      if (approved && selected) both += 1;
      else if (approved) onlyApproved += 1;
      else if (selected) onlySelected += 1;
      else neither += 1;
    }
    return {
      id,
      name: INITIATIVE_COPY.find((item) => item.id === id)?.name.es ?? id,
      short: SHORT[id],
      both,
      onlyApproved,
      onlySelected,
      neither,
      approved: both + onlyApproved,
      selected: both + onlySelected,
      available,
      n: people.length,
      statuses: [...statuses.entries()]
        .filter(([, n]) => n > 0)
        .map(([status, n]) => ({ label: STATUS_LABEL[status] ?? (status || "sin dato"), n })),
    };
  });
}

function pickDisagreement(rows: CrossRow[]): CrossRow | undefined {
  const eligible = rows.filter((row) => row.approved >= 3 && row.selected >= 3 && row.onlyApproved + row.onlySelected > row.both);
  const hidden = eligible.filter((row) => Math.abs(row.approved - row.selected) <= 1);
  const pool = hidden.length ? hidden : eligible;
  return [...pool].sort((left, right) => right.onlyApproved + right.onlySelected - (left.onlyApproved + left.onlySelected))[0];
}

function pickAlignment(rows: CrossRow[], skip: InitiativeId | undefined): CrossRow | undefined {
  return rows
    .filter((row) => row.id !== skip && row.onlySelected === 0 && row.selected >= 3 && row.onlyApproved >= 2)
    .sort((left, right) => right.approved - left.approved)[0];
}

function rateSentence(rows: CrossRow[], skip: InitiativeId[]): { text: string; id: InitiativeId | null } {
  const main = rows
    .filter((row) => !skip.includes(row.id) && row.available >= 5 && row.available < row.n && row.selected > 0)
    .map((row) => ({ row, gap: Math.abs(row.selected / row.n - row.selected / row.available) }))
    .sort((left, right) => right.row.selected * right.gap - left.row.selected * left.gap)[0];
  const tiny = rows.find((row) => row.available > 0 && row.available <= 3 && row.selected === row.available && row.id !== main?.row.id);
  const parts: string[] = [];
  if (main && main.gap >= 0.15) {
    const { row } = main;
    parts.push(`En la iniciativa de ${phrase(row.short)}, la selección es ${formatCount(row.selected, row.n)} de las empresas del escenario y ${formatCount(row.selected, row.available)} de aquellas donde está disponible para una decisión nueva. Son dos preguntas distintas.`);
  }
  if (tiny) parts.push(`En la iniciativa de ${phrase(tiny.short)} la selección es ${formatCount(tiny.selected, tiny.available)}. Esa base de ${tiny.available} empresas no encabeza una conclusión.`);
  return { text: parts.join(" "), id: main && main.gap >= 0.15 ? main.row.id : null };
}

function capacitySentence(people: PersonReport[], row: CrossRow): string {
  const index = LINKED_DIMENSION[row.id];
  const low = people.filter((person) => person.levels[index] != null && (person.levels[index] as number) < 4);
  if (low.length < 3) return "";
  const acting = low.filter((person) => person.agenda[row.id] === "2" || person.agenda[row.id] === "3").length;
  return `De las ${low.length} empresas del escenario con ${phrase(CAPABILITIES[index].short.es)} bajo el nivel 4, ${acting} tienen la iniciativa de ${phrase(row.short)} aprobada o en implementación.`;
}

function pairedChanges(people: PersonReport[]) {
  const leanBalanced: number[] = [];
  const balancedTransformational: number[] = [];
  let same = 0;
  for (const person of people) {
    const lean = closureOf(person, "lean");
    const balanced = closureOf(person, "balanced");
    const transformational = closureOf(person, "transformational");
    if (lean != null && balanced != null) leanBalanced.push((balanced - lean) * 100);
    if (balanced != null && transformational != null) {
      balancedTransformational.push((transformational - balanced) * 100);
      const left = idsOf(person, "balanced");
      const right = idsOf(person, "transformational");
      if (left && right && left.join() === right.join()) same += 1;
    }
  }
  return { leanBalanced: median(leanBalanced), balancedTransformational: median(balancedTransformational), same };
}

function closureOf(person: PersonReport, id: ScenarioId): number | null {
  const value = person.scenarios.find((item) => item.id === id)?.portfolio?.closure;
  return value == null ? null : value;
}

function idsOf(person: PersonReport, id: ScenarioId): string[] | null {
  const portfolio = person.scenarios.find((item) => item.id === id)?.portfolio;
  if (!portfolio) return null;
  return [...portfolio.ids].sort();
}

function similarityStats(people: PersonReport[], id: ScenarioId) {
  const values = people
    .map((person) => person.scenarios.find((item) => item.id === id)?.similarity)
    .filter((value): value is number => value != null);
  return { n: values.length, missing: people.length - values.length, median: median(values) };
}

function contributionStats(people: PersonReport[], id: ScenarioId) {
  const views = people.map((person) => person.scenarios.find((item) => item.id === id));
  const values = views.map((view) => view?.eta).filter((value): value is number => value != null);
  const reasons = new Map<string, number>();
  for (const view of views) {
    if (!view || view.eta != null) continue;
    const reason = view.reason || "Sin comparación";
    reasons.set(reason, (reasons.get(reason) ?? 0) + 1);
  }
  return {
    n: values.length,
    missing: people.length - values.length,
    median: median(values),
    reasons: [...reasons.entries()].sort((left, right) => right[1] - left[1]).map(([label, n]) => ({ label, n })),
  };
}

function ownStats(people: PersonReport[]) {
  const values = people.map((person) => person.ownEta).filter((value): value is number => value != null);
  const reasons = new Map<string, number>();
  for (const person of people) {
    if (person.ownEta != null) continue;
    const reason = person.ownReason || "Sin comparación";
    reasons.set(reason, (reasons.get(reason) ?? 0) + 1);
  }
  return {
    n: values.length,
    missing: people.length - values.length,
    median: median(values),
    reasons: [...reasons.entries()].sort((left, right) => right[1] - left[1]).map(([label, n]) => ({ label, n })),
  };
}

function roleDelta(people: PersonReport[], leftRole: string, rightRole: string) {
  const groups = new Map<string, PersonReport[]>();
  for (const person of people) {
    if (!person.included || person.ahpClass !== "principal" || !person.weights || !person.ahp) continue;
    const key = scopeKey(person);
    groups.set(key, [...(groups.get(key) ?? []), person]);
  }
  const deltas: number[] = [];
  for (const group of groups.values()) {
    const left = uniqueRole(group, leftRole);
    const right = uniqueRole(group, rightRole);
    if (!left?.ahp || !right?.ahp) continue;
    deltas.push(left.ahp.macro.weights[0] - right.ahp.macro.weights[0]);
  }
  const points = deltas.map((value) => value * 100);
  return { n: deltas.length, higher: deltas.filter((value) => value > 0).length, medianPoints: median(points) };
}

function uniqueRole(group: PersonReport[], rol: string) {
  const found = group.filter((person) => person.rol === rol);
  return found.length === 1 ? found[0] : null;
}

function replayOf(people: PersonReport[]): { ok: boolean; reason: string } {
  if (!people.length) return { ok: true, reason: "No hay empresas con escenario de demostración." };
  for (const person of people) {
    if (!person.weights || person.gaps.some((gap) => gap == null)) return { ok: false, reason: "Falta un insumo del escenario en una empresa elegible." };
    const availability = availabilityOf(person.agenda, person.datos);
    for (const scenario of SCENARIOS) {
      const stored = person.scenarios.find((item) => item.id === scenario.id)?.portfolio;
      if (!stored) return { ok: false, reason: "Una empresa elegible no tiene portafolio calculado." };
      const again = optimizePortfolio(person.weights, person.gaps as number[], availability.available, availability.dataReady, scenario);
      if (again.mask !== stored.mask) return { ok: false, reason: "El portafolio recalculado no coincide con el del corte." };
    }
  }
  return { ok: true, reason: "" };
}

function sensitivityOf(people: PersonReport[]): StudyCut["sensitivity"] {
  if (!people.length) return omittedSensitivity("No hay empresas con escenario de demostración.");
  const runs = Math.min(500, Math.max(20, Math.floor(8000 / people.length)));
  const ordered = [...people].sort((left, right) => left.id.localeCompare(right.id));
  const random = mulberry32(2027);
  const stability: number[] = [];
  for (const person of ordered) {
    const base = person.scenarios.find((item) => item.id === "balanced")?.portfolio?.mask;
    if (!person.weights || person.gaps.some((gap) => gap == null) || base == null) continue;
    const availability = availabilityOf(person.agenda, person.datos);
    let same = 0;
    for (let run = 0; run < runs; run += 1) {
      const impact = IMPACT.map((row) => row.map((value) => (value === 0 ? 0 : Math.min(0.95, value * (0.8 + random() * 0.4)))));
      const again = optimizePortfolio(person.weights, person.gaps as number[], availability.available, availability.dataReady, SCENARIOS[1], impact);
      if (again.mask === base) same += 1;
    }
    stability.push(same / runs);
  }
  const stableCompanies = stability.filter((value) => value >= 0.8).length;
  const cap = runs < 500 ? ` Se corrieron ${runs} por empresa, no 500, para mantener el cálculo dentro del tiempo de generación.` : "";
  return {
    status: "ok",
    runs,
    seed: 2027,
    scenario: "Intermedio",
    companies: stability.length,
    stableCompanies,
    medianStability: median(stability),
    note: `Al mover las contribuciones +/-20% en ${runs} corridas por empresa, con semilla 2027, ${stableCompanies} de ${stability.length} empresas conservan el mismo portafolio intermedio en al menos ocho de cada diez corridas.${cap}`,
  };
}

function omittedSensitivity(note: string): StudyCut["sensitivity"] {
  return { status: "omitida", runs: 0, seed: 2027, scenario: "Intermedio", companies: 0, stableCompanies: 0, medianStability: null, note };
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

function readinessReading(cut: StudyCut) {
  const ready = cut.readiness.find((row) => row.label === "Datos listos");
  const rest = cut.readiness.filter((row) => row.label === "Datos parciales" || row.label === "Sin esa base");
  const restN = rest.reduce((sum, row) => sum + row.n, 0);
  const restActive = rest.reduce((sum, row) => sum + row.iaActive, 0);
  if (!ready || !restN) return "La hipótesis no se declara confirmada.";
  const higher = ready.iaActive / ready.n > restActive / restN;
  return higher
    ? "En los conteos, la prevalencia es mayor entre quienes declaran datos listos. Con esta base la hipótesis no se declara confirmada."
    : "En este corte la prevalencia no es mayor entre quienes declaran datos listos. La hipótesis no se declara confirmada.";
}

function readinessOf(people: PersonReport[]): ReadinessRow[] {
  const groups = [
    { key: "READY", label: "Datos listos" },
    { key: "PARTIAL", label: "Datos parciales" },
    { key: "NOT_READY", label: "Sin esa base" },
    { key: "UNKNOWN", label: "No lo sé o alcance de IA no definido" },
  ];
  return groups
    .map((group) => {
      const rows = people.filter((person) => person.datos === group.key);
      return { label: group.label, n: rows.length, iaActive: rows.filter((person) => person.agenda.i6 === "2" || person.agenda.i6 === "3").length };
    })
    .filter((row) => row.n > 0);
}

function countLabels(values: string[], options: { v: string; es: string }[]): CountRow[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].map(([value, n]) => ({ label: options.find((option) => option.v === value)?.es ?? value, n }));
}

function rowOf(rows: CapabilityRow[], id: string) {
  return rows.find((row) => row.id === id);
}

function shareDigits(weights: number[]) {
  if (!weights.length) return 1;
  const one = weights.map((weight) => Number((weight * 100).toFixed(1))).reduce((sum, value) => sum + value, 0);
  return Math.abs(one - 100) < 0.001 ? 1 : 2;
}

function uniqueTop(weights: number[]) {
  if (!weights.length) return null;
  const max = Math.max(...weights);
  const indexes = weights.flatMap((weight, index) => (weight === max ? [index] : []));
  return indexes.length === 1 ? indexes[0] : null;
}

const CAPABILITY_SHORT: Record<string, string> = {
  costos: "Costos",
  caja: "Caja",
  riesgo: "Riesgo",
  control: "Control",
  esg: "ESG",
  digital: "Digital",
  innovacion: "Innovación",
  talento: "Talento",
};

function phrase(name: string) {
  return name.toLowerCase().replaceAll(" ia", " IA").replace(/^ia\b/, "IA").replaceAll("bpo", "BPO");
}

function mean(values: number[]) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function scopeKey(person: PersonReport) {
  return `${person.empresa.trim().toLocaleLowerCase("es")}|${person.alcance}|${person.unidad.trim().toLocaleLowerCase("es")}`;
}

function snapshotOf(people: PersonReport[]) {
  const body = people
    .map((person) => `${person.id}:${person.createdAt}`)
    .sort()
    .join("|");
  return createHash("sha256").update(body).digest("hex").slice(0, 12);
}

function oldest(people: PersonReport[]) {
  return people.map((person) => person.createdAt).sort()[0] ?? null;
}

function newest(people: PersonReport[]) {
  return people.map((person) => person.createdAt).sort().at(-1) ?? null;
}
