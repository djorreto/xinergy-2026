import { createHash } from "node:crypto";
import { aggregateAhp, analyzeAhp, formatPercent, type AhpAnalysis } from "@/lib/surveys/ahp";
import { AHP, industryGroup, isVisible, questionById, roleGroup, SURVEY_VERSION, type Question } from "@/lib/surveys/radar-2027";

export const REPORT_VERSION_A = "a-informe-1.0";
const METHOD_VERSION = "a-ahp-1.0";
const CR_LIMIT = 0.1;

const CRITERIA = AHP.macros.flatMap((group) => group.children);
const THEMES: { id: string; label: string; pattern: RegExp }[] = [
  { id: "ahorro", label: "Captura de ahorro o costo", pattern: /ahorro|valor|resultado|p&l|costo/ },
  { id: "caja", label: "Caja o plazos", pattern: /caja|capital|pago|plazo/ },
  { id: "datos", label: "Datos o visibilidad", pattern: /dato|informaci|visibilidad/ },
  { id: "continuidad", label: "Continuidad o proveedores", pattern: /continuidad|proveedor|riesgo|abastec/ },
  { id: "integracion", label: "Integración o sistemas", pattern: /integr|sistema|plataforma|tecnolog/ },
  { id: "talento", label: "Talento o equipo", pattern: /talento|equipo|gente|capacidad/ },
];

export type StudyBar = { label: string; ratio: number; trailing: string };
export type CountRow = { label: string; n: number };
export type StudyAction = { title: string; signal: string; profile: string; step: string; counterpart: string; criterion: string };
export type StudyClaim = {
  id: string;
  title: string;
  observation: string;
  tension: string;
  interpretation: string;
  implication: string;
  limit: string;
};

export type AAnswer = {
  id: string;
  createdAt: string;
  empresa: string;
  pais: string;
  rol: string;
  rolGrupo: string;
  rubro: string;
  rubroGrupo: string | null;
  company: Record<string, unknown>;
  answers: Record<string, unknown>;
  included: boolean;
};

export type StudyCutA = {
  version: string;
  methodVersion: string;
  surveyVersion: string;
  snapshotId: string;
  newestAt: string | null;
  thesis: string;
  counts: { responses: number; companies: number; roles: CountRow[]; consistent: number; complete: number };
  excludedCr: number[];
  principal: WeightSet | null;
  reference: WeightSet | null;
  financialLeaders: number;
  otherLeaders: number;
  leaveOneOut: { companies: number; rankChanges: number; maxCostPoints: number | null };
  realization: { eligible: number; valid: number; rows: CountRow[] };
  validation: { valid: number; agree: number; neutral: number; disagree: number };
  realizationCross: { n: number; agree: number; neutral: number; disagree: number; disagreeOutside: number };
  continuity: { renegotiated: number; alternatives: number; monitoring: number; valid: number };
  exposure: { high: number; unknown: number; valid: number; highRenegotiated: number; highAlternatives: number; highMonitoring: number };
  incidents: { serious: number; valid: number };
  aiStage: { production: number; pilot: number; individual: number; valid: number };
  spendMention: { n: number; valid: number };
  barriers: { roi: number; integration: number; talent: number; valid: number };
  productiveBarriers: { n: number; roi: number; integration: number };
  responseTime: { slow: number; valid: number };
  satisfaction: { high: number; valid: number };
  skills: { data: number; valid: number };
  coverage: { id: string; label: string; eligible: number; valid: number }[];
  reporting: { eligible: number; valid: number; toFinance: number };
  pairs: { n: number; financeHigher: number };
  themes: CountRow[];
  openAnswers: { valid: number; placeholder: number };
  countries: CountRow[];
  claims: StudyClaim[];
  actions: StudyAction[];
  hypotheses: { title: string; status: string; text: string }[];
  openQuestions: string[];
};

type WeightSet = {
  n: number;
  maxCr: number;
  financial: number;
  financialText: string;
  criteria: { id: string; name: string; weight: number; text: string }[];
  macros: { name: string; weight: number; text: string }[];
  riskDigitalGap: number;
};

export function formatCount(numerator: number, denominator: number) {
  if (!denominator) return "—";
  return `${numerator}/${denominator} (${((numerator / denominator) * 100).toFixed(1).replace(".", ",")}%)`;
}

export function formatPoints(value: number | null) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value.toFixed(1).replace(".", ",")} puntos`;
}

export function buildStudyCutA(rows: AAnswer[]): StudyCutA {
  const included = rows.filter((row) => row.included);
  const profiles = included.map((row) => ({ row, ahp: analyzeAhp(tokensOf(row)) }));
  const complete = profiles.filter((item): item is { row: AAnswer; ahp: AhpAnalysis } => Boolean(item.ahp));
  const consistent = complete.filter((item) => item.ahp.maxCr <= CR_LIMIT);
  const reference = weightSet(complete.map((item) => tokensOf(item.row)));
  const principal = weightSet(consistent.map((item) => tokensOf(item.row)));
  const financialLeaders = consistent.filter((item) => item.ahp.macro.weights[0] >= Math.max(item.ahp.macro.weights[1], item.ahp.macro.weights[2])).length;
  const leaveOneOut = leaveCompany(consistent, principal);
  const realizationRows = bandRows(included, "p_fuga", ["<25", "25-50", "50-75", ">75", "ns"]);
  const validation = agreement(included, "p_acuerdo", "valida");
  const band = included.filter((row) => answer(row, "p_fuga") === "50-75");
  const realizationCross = {
    n: band.length,
    agree: band.filter((row) => score(row, "p_acuerdo", "valida") >= 4).length,
    neutral: band.filter((row) => score(row, "p_acuerdo", "valida") === 3).length,
    disagree: band.filter((row) => score(row, "p_acuerdo", "valida") > 0 && score(row, "p_acuerdo", "valida") <= 2).length,
    disagreeOutside: included.filter((row) => answer(row, "p_fuga") && answer(row, "p_fuga") !== "50-75" && score(row, "p_acuerdo", "valida") > 0 && score(row, "p_acuerdo", "valida") <= 2).length,
  };
  const chainValid = valid(included, "cadena");
  const exposed = included.filter((row) => answer(row, "r_single") === "25-50" || answer(row, "r_single") === ">50");
  const productive = included.filter((row) => Number(answer(row, "ia_nivel")) >= 4);
  const stageValid = valid(included, "ia_nivel");
  const reportingRows = valid(included, "e_reporte");
  const themes = themeCounts(included);
  const countries = tally(included.map((row) => labelOf("pais", String(row.pais ?? ""))));

  const draft: StudyCutA = {
    version: REPORT_VERSION_A,
    methodVersion: METHOD_VERSION,
    surveyVersion: SURVEY_VERSION,
    snapshotId: createHash("sha256")
      .update(included.map((row) => `${row.id}:${row.createdAt}`).sort().join("|"))
      .digest("hex")
      .slice(0, 12),
    newestAt: included.map((row) => row.createdAt).sort().at(-1) ?? null,
    thesis: "",
    counts: {
      responses: included.length,
      companies: new Set(included.map((row) => companyKey(row.empresa)).filter(Boolean)).size,
      roles: tally(included.map((row) => labelOf("rol", row.rol))),
      consistent: consistent.length,
      complete: complete.length,
    },
    excludedCr: complete.filter((item) => item.ahp.maxCr > CR_LIMIT).map((item) => item.ahp.maxCr).sort((left, right) => right - left),
    principal,
    reference,
    financialLeaders,
    otherLeaders: consistent.length - financialLeaders,
    leaveOneOut,
    realization: { eligible: eligible(included, "p_fuga").length, valid: realizationRows.reduce((sum, row) => sum + row.n, 0), rows: realizationRows.filter((row) => row.n > 0) },
    validation,
    realizationCross,
    continuity: {
      renegotiated: selected(chainValid, "cadena", "contratos"),
      alternatives: selected(chainValid, "cadena", "dual"),
      monitoring: selected(chainValid, "cadena", "riesgo"),
      valid: chainValid.length,
    },
    exposure: {
      high: exposed.length,
      unknown: included.filter((row) => answer(row, "r_single") === "ns").length,
      valid: valid(included, "r_single").length,
      highRenegotiated: exposed.filter((row) => hasOption(row, "cadena", "contratos")).length,
      highAlternatives: exposed.filter((row) => hasOption(row, "cadena", "dual")).length,
      highMonitoring: exposed.filter((row) => hasOption(row, "cadena", "riesgo")).length,
    },
    incidents: { serious: selected(valid(included, "r_incidente"), "r_incidente", "incumplimiento"), valid: valid(included, "r_incidente").length },
    aiStage: {
      production: stageValid.filter((row) => Number(answer(row, "ia_nivel")) >= 4).length,
      pilot: stageValid.filter((row) => Number(answer(row, "ia_nivel")) === 3).length,
      individual: stageValid.filter((row) => Number(answer(row, "ia_nivel")) === 2).length,
      valid: stageValid.length,
    },
    spendMention: { n: selected(valid(included, "ia_usos"), "ia_usos", "spend"), valid: valid(included, "ia_usos").length },
    barriers: {
      roi: selected(valid(included, "ia_barreras"), "ia_barreras", "roi"),
      integration: selected(valid(included, "ia_barreras"), "ia_barreras", "sistemas"),
      talent: selected(valid(included, "ia_barreras"), "ia_barreras", "talento"),
      valid: valid(included, "ia_barreras").length,
    },
    productiveBarriers: {
      n: productive.length,
      roi: productive.filter((row) => hasOption(row, "ia_barreras", "roi")).length,
      integration: productive.filter((row) => hasOption(row, "ia_barreras", "sistemas")).length,
    },
    responseTime: {
      slow: valid(included, "datos_confianza").filter((row) => answer(row, "datos_confianza") === "semana" || answer(row, "datos_confianza") === "mas").length,
      valid: valid(included, "datos_confianza").length,
    },
    satisfaction: {
      high: valid(included, "tec_satisf").filter((row) => Number(answer(row, "tec_satisf")) >= 4).length,
      valid: valid(included, "tec_satisf").length,
    },
    skills: { data: selected(valid(included, "habilidades"), "habilidades", "datos"), valid: valid(included, "habilidades").length },
    coverage: [
      ["proyectos", "Proyectos planificados"],
      ["tercerizar", "Actividades que tercerizaría"],
      ["t_acuerdo", "Presupuesto y equipo"],
      ["i_ind1", "MRO, solo quienes están en industria"],
      ["e_reporte", "A quién reporta compras, solo dirección"],
      ["p_fuga", "Realización del ahorro en el resultado"],
    ].map(([id, label]) => ({
      id,
      label,
      eligible: eligible(included, id).length,
      valid: valid(included, id).length,
    })),
    reporting: {
      eligible: eligible(included, "e_reporte").length,
      valid: reportingRows.length,
      toFinance: reportingRows.filter((row) => answer(row, "e_reporte") === "cfo").length,
    },
    pairs: rolePairs(consistent),
    themes: themes.rows,
    openAnswers: { valid: themes.valid, placeholder: themes.placeholder },
    countries,
    claims: [],
    actions: [],
    hypotheses: [],
    openQuestions: [],
  };
  draft.claims = claimsOf(draft);
  draft.actions = actionsOf(draft);
  draft.thesis = thesisOf(draft);
  draft.hypotheses = hypothesesOf(draft);
  draft.openQuestions = questionsOf(draft);
  return draft;
}

export function narrativeBlobA(cut: StudyCutA) {
  return [cut.thesis, ...cut.claims.flatMap((claim) => [claim.title, claim.observation, claim.implication, claim.limit]), ...cut.actions.flatMap((action) => Object.values(action)), ...cut.hypotheses.map((item) => item.text), "2027", "90"].join("\n");
}

function claimsOf(cut: StudyCutA): StudyClaim[] {
  const claims: StudyClaim[] = [];
  const priority = priorityClaim(cut);
  const value = valueClaim(cut);
  const continuity = continuityClaim(cut);
  const digital = digitalClaim(cut);
  const talent = talentClaim(cut);
  for (const claim of [priority, value, continuity, digital, talent]) if (claim) claims.push(claim);
  return claims.slice(0, 5);
}

function priorityClaim(cut: StudyCutA): StudyClaim | null {
  if (!cut.principal || !cut.reference) return null;
  const excluded = cut.excludedCr.length
    ? ` ${cut.excludedCr.length} perfiles quedan fuera de ese promedio porque su consistencia individual supera 0,10: ${cut.excludedCr.map((value) => formatCr(value)).join(" y ")}. El perfil agregado de los ${cut.counts.complete} tiene un CR de ${formatCr(cut.reference.maxCr)}; eso no dice que cada persona haya sido consistente.`
    : "";
  const tie = Math.abs(cut.principal.riskDigitalGap) < 0.001
    ? " Riesgo y digitalización quedan a menos de una décima de punto. Ese orden no sostiene una conclusión de negocio."
    : "";
  return {
    id: "prioridades",
    title: "Costos y caja concentran la prioridad, y no son la agenda de cada persona",
    observation: `En los ${cut.principal.n} perfiles con comparaciones individuales dentro de 0,10, costos y caja concentran ${cut.principal.financialText} de la importancia relativa. En los ${cut.reference.n} perfiles completos, sin ese filtro, la suma es ${cut.reference.financialText}.${excluded} El bloque financiero es el de mayor peso en ${cut.financialLeaders} de ${cut.principal.n}. En ${cut.otherLeaders} pesa más otro bloque.${tie}`,
    tension: "Un perfil agregado ordenado puede convivir con preferencias individuales distintas. Cada ejecutivo cuenta una vez: no es el promedio de una empresa.",
    interpretation: `Al retirar una empresa por vez, el criterio de mayor peso ${cut.leaveOneOut.rankChanges === 0 ? "no cambia" : `cambia en ${cut.leaveOneOut.rankChanges} empresas`}. El movimiento máximo de reducir costos es de ${formatPoints(cut.leaveOneOut.maxCostPoints)}. Eso describe estabilidad dentro de este corte, no un consenso ni una muestra representativa.`,
    implication: "Antes de fijar una agenda única de ahorro, conviene mirar qué bloque pesa más en la propia comparación. Un peso bajo de control, ESG o innovación no los vuelve irrelevantes: pueden ser condiciones de la operación aunque no lideren la preferencia.",
    limit: "Los pesos son importancia relativa declarada para 2027. No son un presupuesto ni la proporción de personas que eligió un tema. La suma de los porcentajes redondeados puede no dar 100.",
  };
}

function valueClaim(cut: StudyCutA): StudyClaim | null {
  const band = cut.realization.rows.find((row) => row.label.startsWith("50"));
  if (!band || !cut.realization.valid) return null;
  const samePeople = cut.realizationCross.disagree === 0 && cut.validation.disagree > 0
    ? ` Esas dos cifras no son las mismas personas: dentro del rango 50–75% hay ${cut.realizationCross.agree} de acuerdo y ${cut.realizationCross.neutral} neutrales. Las ${cut.realizationCross.disagreeOutside} respuestas en desacuerdo están en los otros rangos.`
    : ` Dentro del rango 50–75%, ${cut.realizationCross.agree} están de acuerdo con esa validación, ${cut.realizationCross.neutral} neutrales y ${cut.realizationCross.disagree} en desacuerdo.`;
  return {
    id: "valor",
    title: "La prioridad financiera convive con una trazabilidad del ahorro todavía desigual",
    observation: `En el módulo de resultados, ${formatCount(band.n, cut.realization.valid)} ubican la realización del ahorro en el estado de resultados entre 50% y 75%. ${formatCount(cut.validation.agree, cut.validation.valid)} están de acuerdo con que Finanzas valide los ahorros contra una línea base, ${cut.validation.neutral} se mantienen neutrales y ${formatCount(cut.validation.disagree, cut.validation.valid)} están en desacuerdo o muy en desacuerdo.${samePeople}`,
    tension: "El rango más frecuente no es el porcentaje de ahorro que llegó al resultado. Es la proporción de personas que eligió ese tramo.",
    interpretation: "Una explicación posible es que la negociación y el reconocimiento contable no recorren el mismo camino en todos los casos. Otra es que la neutralidad esconde falta de información, no un rechazo. Este corte no separa esas lecturas ni mide una pérdida en dinero.",
    implication: "La revisión útil es seguir una muestra de iniciativas desde la línea base hasta lo que Finanzas reconoció, con el CPO y el CFO. Si ese camino no se puede reconstruir, el siguiente paso es la trazabilidad, no una meta de ahorro más alta.",
    limit: "Son declaraciones y rangos del último año, en quienes respondieron el módulo operativo. No se comparan con la expectativa de ahorro de Finanzas para 2027: son horizontes distintos.",
  };
}

function continuityClaim(cut: StudyCutA): StudyClaim | null {
  if (!cut.continuity.valid) return null;
  return {
    id: "continuidad",
    title: "Renegociar fue más frecuente que diversificar o monitorear en el último año",
    observation: `${formatCount(cut.continuity.renegotiated, cut.continuity.valid)} renegociaron contratos por inflación o tipo de cambio. ${formatCount(cut.continuity.alternatives, cut.continuity.valid)} agregaron proveedores alternativos y ${formatCount(cut.continuity.monitoring, cut.continuity.valid)} implementaron monitoreo de riesgo. ${formatCount(cut.exposure.high, cut.exposure.valid)} ubican en 25% o más el gasto que depende de un proveedor único. ${cut.exposure.unknown ? `${cut.exposure.unknown} dicen que no lo saben.` : ""} Entre esos ${cut.exposure.high} casos más expuestos, ${cut.exposure.highRenegotiated} renegociaron, ${cut.exposure.highAlternatives} agregaron alternativas y ${cut.exposure.highMonitoring} implementaron monitoreo.`,
    tension: "Una persona puede marcar varias acciones. La suma no es 100% y renegociar no equivale a haber resuelto la continuidad.",
    interpretation: "La respuesta del último año está más cargada a precio y tipo de cambio que a alternativas o monitoreo. Eso no demuestra que antes no existiera gestión de riesgo, ni que renegociar haya aumentado la exposición.",
    implication: "En los casos con más dependencia de un proveedor único, la pregunta para 2027 es si el plan de costos incluye alternativa, contingencia y seguimiento, o solo la renegociación.",
    limit: `${formatCount(cut.incidents.serious, cut.incidents.valid)} declaran un incumplimiento grave de entrega en el último año. El conteo no dice que haya ocurrido en las mismas personas con mayor dependencia.`,
  };
}

function digitalClaim(cut: StudyCutA): StudyClaim | null {
  if (!cut.aiStage.valid) return null;
  const same = cut.productiveBarriers.n > 0 && cut.productiveBarriers.roi === cut.productiveBarriers.n && cut.productiveBarriers.integration === cut.productiveBarriers.n
    ? ` Las ${cut.productiveBarriers.n} que están en producción o escaladas también marcan integración y ROI poco claro entre sus barreras.`
    : "";
  return {
    id: "digital",
    title: "La IA ya entra en procesos productivos, y las barreras declaradas siguen siendo integración y retorno",
    observation: `${formatCount(cut.aiStage.production, cut.aiStage.valid)} declaran IA en producción o escalada, ${cut.aiStage.pilot} en pilotos y ${cut.aiStage.individual} en uso individual. ${formatCount(cut.barriers.integration, cut.barriers.valid)} marcan la integración con los sistemas y ${formatCount(cut.barriers.roi, cut.barriers.valid)} un ROI poco claro entre sus dos barreras principales.${same} ${formatCount(cut.spendMention.n, cut.spendMention.valid)} mencionan análisis de gasto como uso actual o previsto para 12 meses. Esa mención no dice cuántos ya lo ejecutan.`,
    tension: "La etapa actual y la lista de usos previstos responden preguntas distintas. Tener una plataforma, o estar satisfecho con ella, tampoco mide cobertura ni retorno.",
    interpretation: `La satisfacción con la tecnología es alta o muy alta en ${formatCount(cut.satisfaction.high, cut.satisfaction.valid)}. ${formatCount(cut.responseTime.slow, cut.responseTime.valid)} necesitan una semana o más para responder cuánto gastaron con sus 20 principales proveedores. Son señales de ejecución, no una prueba de que los proyectos carezcan de retorno.`,
    implication: "Antes de ampliar un caso de uso, conviene separar la etapa en que está, si tiene responsable, si los datos permiten responder, y qué barrera se declaró. El ROI poco claro es una percepción, no un retorno calculado.",
    limit: "Cada persona elige hasta dos barreras. Que muchas coincidan en las mismas no ordena al resto por importancia.",
  };
}

function talentClaim(cut: StudyCutA): StudyClaim | null {
  const projects = cut.coverage.find((item) => item.id === "proyectos");
  const budget = cut.coverage.find((item) => item.id === "t_acuerdo");
  if (!cut.skills.valid || !projects || !budget) return null;
  return {
    id: "talento",
    title: "Encontrar análisis de datos no es lo mismo que declararlo como barrera de IA",
    observation: `${formatCount(cut.skills.data, cut.skills.valid)} mencionan análisis de datos entre las capacidades difíciles de encontrar. ${formatCount(cut.barriers.talent, cut.barriers.valid)} eligen falta de talento entre las dos barreras de IA. La pregunta de proyectos planificados tiene ${projects.valid} respuesta de ${projects.eligible} a quienes se les mostró. La de presupuesto y equipo tiene ${budget.valid}. El resto está en blanco.`,
    tension: "Un blanco no significa que no haya proyectos, presupuesto ni interés. Las dos preguntas de talento tienen propósitos distintos y no miden la misma vacante.",
    interpretation: "Puede haber dificultad para contratar análisis de datos y, a la vez, otra barrera delante de la IA. Este corte no demuestra contradicción ni que falte un equipo completo.",
    implication: "No se puede concluir, con una sola respuesta, qué parte de la agenda de 2027 tiene presupuesto. Esa pregunta queda abierta hasta que el módulo tenga cobertura.",
    limit: cut.reporting.valid
      ? `A quién reporta el líder de compras lo responden ${cut.reporting.valid} personas de dirección general${cut.reporting.toFinance === cut.reporting.valid ? ", y en esas respuestas reporta a Finanzas" : ""}. No describe a los líderes de compras.`
      : "No hay respuestas sobre a quién reporta el líder de compras.",
  };
}

function actionsOf(cut: StudyCutA): StudyAction[] {
  const actions: StudyAction[] = [];
  if (cut.validation.valid && cut.validation.disagree > 0) {
    actions.push({
      title: "Seguir el ahorro hasta lo que Finanzas reconoce",
      signal: `${formatCount(cut.validation.disagree, cut.validation.valid)} del módulo operativo están en desacuerdo con que Finanzas valide el ahorro contra una línea base.`,
      profile: "Áreas que no acuerdan esa validación, o que ubican la realización en un rango bajo.",
      step: "Elegir iniciativas del último año y recorrerlas desde la línea base hasta la línea del resultado.",
      counterpart: "CPO y CFO.",
      criterion: "Si el camino no se puede reconstruir, el paso siguiente es esa trazabilidad. El rango declarado no es una pérdida medida.",
    });
  }
  if (cut.exposure.high > 0) {
    actions.push({
      title: "Revisar si la renegociación incluyó continuidad",
      signal: `De ${cut.exposure.high} casos con 25% o más del gasto en un proveedor único, ${cut.exposure.highAlternatives} agregaron alternativas y ${cut.exposure.highMonitoring} implementaron monitoreo.`,
      profile: "Operaciones con alta dependencia de un proveedor único.",
      step: "Para esos proveedores, anotar si hay alternativa, plan de contingencia y seguimiento, además del contrato renegociado.",
      counterpart: "CPO, con operaciones.",
      criterion: "Si la respuesta del año fue solo de precio, la continuidad queda como decisión pendiente. No prueba que el riesgo no se gestione.",
    });
  }
  if (cut.aiStage.production > 0) {
    actions.push({
      title: "Separar la etapa de IA del uso que todavía es un plan",
      signal: `${formatCount(cut.aiStage.production, cut.aiStage.valid)} declaran producción o escalamiento. ${formatCount(cut.spendMention.n, cut.spendMention.valid)} mencionan análisis de gasto como uso actual o previsto.`,
      profile: "Áreas que ya tienen IA en algún proceso y, por separado, las que solo la tienen en la lista de planes.",
      step: "Registrar la etapa, el responsable, el tiempo para obtener el gasto y la barrera declarada de cada caso.",
      counterpart: "CPO y quien lleva datos o procesos.",
      criterion: "Sin esa separación no se decide ampliar el caso. ROI poco claro no es un retorno medido, y una mención a 12 meses no es adopción.",
    });
  }
  return actions.slice(0, 4);
}

function hypothesesOf(cut: StudyCutA): StudyCutA["hypotheses"] {
  return [
    {
      title: "Prioridad financiera y trazabilidad",
      status: "indicio",
      text: "La prioridad de costos y caja puede convivir con dificultad para validar el ahorro. El cruce de este corte separa a quienes eligen el rango 50–75% de quienes están en desacuerdo con la validación. Sigue siendo una asociación declarada, no una pérdida medida.",
    },
    {
      title: "Exposición y continuidad",
      status: "indicio",
      text: `Entre los ${cut.exposure.high} casos más expuestos a un proveedor único, las acciones de alternativa y de monitoreo son menos frecuentes que la renegociación. No prueba ausencia de programas anteriores ni causalidad.`,
    },
    {
      title: "Ejecución de IA",
      status: "indicio",
      text: "Integración y claridad del retorno aparecen también entre quienes ya declaran IA en producción. La barrera es percibida. No equivale a un ROI medido ni a la mención de un uso futuro.",
    },
    {
      title: "Roles en la misma empresa",
      status: cut.pairs.n >= 5 ? "descriptiva" : "pendiente",
      text: cut.pairs.n
        ? `Hay ${cut.pairs.n} pares de Compras y Finanzas con la misma empresa, escrita igual, y comparaciones dentro de 0,10. En ${cut.pairs.financeHigher} Finanzas asigna más peso al bloque financiero. ${cut.pairs.n < 5 ? "No alcanza para hablar de una desalineación general." : "Describe este corte."}`
        : "No hay pares confirmados de Compras y Finanzas. La comparación entre roles queda pendiente.",
    },
    {
      title: "Agenda con recursos",
      status: "sin cobertura",
      text: "La pregunta de si los planes tienen presupuesto no se puede responder en conjunto: proyectos y afirmaciones de presupuesto tienen una respuesta. Un blanco no se lee como ausencia de planes.",
    },
  ];
}

function questionsOf(cut: StudyCutA) {
  return [
    "Qué bloque pesa más en la propia comparación, además del perfil agregado.",
    "Dónde se corta el camino entre el ahorro negociado y lo que Finanzas reconoce.",
    "En los proveedores únicos, qué quedó cubierto por alternativa o monitoreo y qué solo se renegoció.",
    "Qué casos de IA están en producción y cuáles siguen en la lista de los próximos 12 meses.",
    cut.pairs.n < 5 ? "Cómo se comparan, en la misma empresa, las prioridades de Compras, Finanzas y dirección cuando haya más pares." : "Qué diferencia de prioridad se sostiene entre Compras y Finanzas en este corte.",
    "Qué parte de la agenda de 2027 tiene presupuesto, cuando el módulo de proyectos tenga más respuestas.",
  ];
}

function thesisOf(cut: StudyCutA) {
  if (cut.principal && cut.validation.disagree > 0) return "La agenda financiera de 2027 pide una trazabilidad del ahorro que hoy no está pareja.";
  return cut.claims[0]?.title ?? "Este corte todavía no sostiene una tesis.";
}

function weightSet(tokenSets: Record<string, string>[]): WeightSet | null {
  const ahp = aggregateAhp(tokenSets);
  if (!ahp) return null;
  const criteria = CRITERIA.map((id) => ({ id, name: criterionName(id), weight: ahp.global[id] ?? 0, text: formatPercent(ahp.global[id] ?? 0) }));
  const financial = (ahp.global.costos ?? 0) + (ahp.global.caja ?? 0);
  return {
    n: tokenSets.length,
    maxCr: ahp.maxCr,
    financial,
    financialText: formatPercent(financial),
    criteria,
    macros: AHP.macros.map((group, index) => ({ name: group.label.es, weight: ahp.macro.weights[index] ?? 0, text: formatPercent(ahp.macro.weights[index] ?? 0) })),
    riskDigitalGap: (ahp.global.riesgo ?? 0) - (ahp.global.digital ?? 0),
  };
}

function leaveCompany(consistent: { row: AAnswer; ahp: AhpAnalysis }[], principal: WeightSet | null) {
  if (!principal) return { companies: 0, rankChanges: 0, maxCostPoints: null };
  const baseTop = [...principal.criteria].sort((left, right) => right.weight - left.weight)[0]?.id;
  const keys = [...new Set(consistent.map((item) => companyKey(item.row.empresa)).filter(Boolean))];
  let rankChanges = 0;
  let maxCost = 0;
  for (const key of keys) {
    const kept = consistent.filter((item) => companyKey(item.row.empresa) !== key);
    const again = aggregateAhp(kept.map((item) => tokensOf(item.row)));
    if (!again) continue;
    maxCost = Math.max(maxCost, Math.abs((again.global.costos ?? 0) - (principal.criteria.find((item) => item.id === "costos")?.weight ?? 0)));
    const top = Object.entries(again.global).sort((left, right) => right[1] - left[1])[0]?.[0];
    if (top !== baseTop) rankChanges += 1;
  }
  return { companies: keys.length, rankChanges, maxCostPoints: maxCost * 100 };
}

function rolePairs(consistent: { row: AAnswer; ahp: AhpAnalysis }[]) {
  const groups = new Map<string, { row: AAnswer; ahp: AhpAnalysis }[]>();
  for (const item of consistent) {
    const key = companyKey(item.row.empresa);
    if (!key) continue;
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  let n = 0;
  let financeHigher = 0;
  for (const group of groups.values()) {
    const cpo = group.filter((item) => item.row.rol === "cpo");
    const cfo = group.filter((item) => item.row.rol === "cfo");
    if (cpo.length !== 1 || cfo.length !== 1) continue;
    n += 1;
    if (cfo[0].ahp.macro.weights[0] > cpo[0].ahp.macro.weights[0]) financeHigher += 1;
  }
  return { n, financeHigher };
}

function themeCounts(rows: AAnswer[]) {
  const counts = new Map(THEMES.map((theme) => [theme.id, 0]));
  let valid = 0;
  let placeholder = 0;
  for (const row of rows) {
    const text = String(answer(row, "desafio") ?? "").trim().toLocaleLowerCase("es");
    if (!text) continue;
    valid += 1;
    if (text === "prueba" || text === "test" || text === "n/a") {
      placeholder += 1;
      continue;
    }
    for (const theme of THEMES) if (theme.pattern.test(text)) counts.set(theme.id, (counts.get(theme.id) ?? 0) + 1);
  }
  return { valid, placeholder, rows: THEMES.map((theme) => ({ label: theme.label, n: counts.get(theme.id) ?? 0 })).filter((row) => row.n > 0) };
}

function bandRows(rows: AAnswer[], id: string, order: string[]) {
  const pool = valid(rows, id);
  return order.map((option) => ({ label: labelOf(id, option), n: pool.filter((row) => answer(row, id) === option).length }));
}

function agreement(rows: AAnswer[], id: string, field: string) {
  const scores = valid(rows, id).map((row) => score(row, id, field)).filter((value) => value >= 1 && value <= 5);
  return {
    valid: scores.length,
    agree: scores.filter((value) => value >= 4).length,
    neutral: scores.filter((value) => value === 3).length,
    disagree: scores.filter((value) => value <= 2).length,
  };
}

function eligible(rows: AAnswer[], id: string) {
  const question = questionById(id);
  if (!question) return [];
  return rows.filter((row) => isVisible(question, row.rolGrupo || roleGroup(row.rol), row.rubroGrupo || industryGroup(row.rubro)));
}

function valid(rows: AAnswer[], id: string) {
  return eligible(rows, id).filter((row) => answered(row, id));
}

function answered(row: AAnswer, id: string) {
  const value = sourceOf(row, id)[id];
  if (value == null || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.values(value as Record<string, unknown>).some((item) => item != null && item !== "");
  return true;
}

function selected(rows: AAnswer[], id: string, option: string) {
  return rows.filter((row) => hasOption(row, id, option)).length;
}

function hasOption(row: AAnswer, id: string, option: string) {
  const value = answer(row, id);
  return Array.isArray(value) && value.includes(option);
}

function score(row: AAnswer, id: string, field: string) {
  const value = answer(row, id);
  if (!value || typeof value !== "object" || Array.isArray(value)) return 0;
  return Number((value as Record<string, unknown>)[field]);
}

function answer(row: AAnswer, id: string) {
  return sourceOf(row, id)[id];
}

function sourceOf(row: AAnswer, id: string) {
  const question = questionById(id);
  const inCompany = question ? companyQuestion(question) : false;
  return (inCompany ? row.company : row.answers) ?? {};
}

function companyQuestion(question: Question) {
  return ["rubro", "propiedad", "ventas", "spend", "empleados", "proveedores", "gestionado", "estructura", "equipo", "paises"].includes(question.id);
}

function tokensOf(row: AAnswer) {
  const value = row.answers.prioridades_ahp;
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, string>) : {};
}

function companyKey(value: string) {
  return value.trim().toLocaleLowerCase("es");
}

function criterionName(id: string) {
  return AHP.criteria[id]?.es ?? id;
}

function labelOf(id: string, value: string) {
  const question = questionById(id);
  if (question && "options" in question) return question.options.find((option) => option.v === value)?.es ?? value;
  return value;
}

function tally(labels: string[]): CountRow[] {
  const counts = new Map<string, number>();
  for (const label of labels) {
    if (!label) continue;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()].sort((left, right) => right[1] - left[1]).map(([label, n]) => ({ label, n }));
}

function formatCr(value: number) {
  const digits = value >= 0.01 ? 2 : 4;
  return value.toFixed(digits).replace(".", ",");
}
