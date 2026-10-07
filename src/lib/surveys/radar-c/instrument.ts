import { AHP, AHP_SCALE, SURVEY_CONTACT } from "@/lib/surveys/radar-2027";
import { CAPABILITIES, COUNTRIES, INDUSTRIES, INITIATIVE_COPY, ROLES, type Choice, type Copy, type Lang } from "@/lib/surveys/radar-b/instrument";

export type { Choice, Copy, Lang };
export const text = (copy: Copy, lang: Lang) => copy[lang];
const L = (es: string, en: string, pt: string): Copy => ({ es, en, pt });
const o = (v: string, es: string, en: string, pt: string): Choice => ({ v, es, en, pt });

export { AHP, AHP_SCALE, CAPABILITIES, COUNTRIES, INDUSTRIES, INITIATIVE_COPY, ROLES };

export const SURVEY_SLUG_C = "radar-compras-2027-c";
export const SURVEY_VERSION_C = "radar-2027-c-v1";
export const MODEL_VERSION_C = "C-1.0-seed";

export const SCOPES: Choice[] = [
  o("pais", "Un país", "One country", "Um país"),
  o("multipais", "Corporativo multipaís", "Multi-country corporate", "Corporativo multipaís"),
  o("unidad", "Unidad de negocio", "Business unit", "Unidade de negócio"),
];

export const SCOPE_HELP: Record<string, Copy> = {
  pais: L("La respuesta vale para la operación de Compras en un solo país.", "The answer covers Procurement in one country.", "A resposta vale para Compras em um só país."),
  multipais: L("La respuesta vale para un mandato que cubre varios países a la vez. No son respuestas separadas por país.", "The answer covers one mandate across several countries. It is not a separate answer per country.", "A resposta vale para um mandato em vários países. Não são respostas separadas por país."),
  unidad: L("La respuesta vale solo para una división, filial o negocio. Después indica el nombre.", "The answer covers only one division, subsidiary or business. You will name it next.", "A resposta vale só para uma divisão, filial ou negócio. Depois indique o nome."),
};

export const SPEND_C: Choice[] = [
  o("<20", "Menos de 20 millones", "Under 20 million", "Menos de 20 milhões"),
  o("20-100", "20 a menos de 100 millones", "20 to under 100 million", "20 a menos de 100 milhões"),
  o("100-500", "100 a menos de 500 millones", "100 to under 500 million", "100 a menos de 500 milhões"),
  o("500-2000", "500 a 2.000 millones", "500 million to 2 billion", "500 milhões a 2 bilhões"),
  o(">2000", "Más de 2.000 millones", "Over 2 billion", "Mais de 2 bilhões"),
  o("ns", "No sé", "I don't know", "Não sei"),
  o("nr", "Prefiero no informar", "Prefer not to say", "Prefiro não informar"),
];

export const SAVINGS: Choice[] = [
  o("<2", "Menos de 2%", "Under 2%", "Menos de 2%"),
  o("2-5", "2 a menos de 5%", "2 to under 5%", "2 a menos de 5%"),
  o("5-8", "5 a menos de 8%", "5 to under 8%", "5 a menos de 8%"),
  o("8-12", "8 a 12%", "8 to 12%", "8 a 12%"),
  o(">12", "Más de 12%", "Over 12%", "Mais de 12%"),
  o("nm", "No medimos", "We do not measure it", "Não medimos"),
  o("ns", "No sé", "I don't know", "Não sei"),
];

export const SAVINGS_EXPECTATION: Choice[] = [...SAVINGS, o("sinmeta", "Sin meta definida", "No target defined", "Sem meta definida")];

export const REALIZATION: Choice[] = [
  o("<25", "Menos de 25%", "Under 25%", "Menos de 25%"),
  o("25-50", "25 a menos de 50%", "25 to under 50%", "25 a menos de 50%"),
  o("50-75", "50 a 75%", "50 to 75%", "50 a 75%"),
  o(">75", "Más de 75%", "Over 75%", "Mais de 75%"),
  o("nm", "No medimos", "We do not measure it", "Não medimos"),
  o("ns", "No sé", "I don't know", "Não sei"),
  o("none", "No hubo ahorro negociado que debiera materializarse", "There was no negotiated saving that should have landed", "Não houve economia negociada que devesse se materializar"),
];

export const EXPOSURE: Choice[] = [
  o("<10", "Menos de 10%", "Under 10%", "Menos de 10%"),
  o("10-25", "10 a menos de 25%", "10 to under 25%", "10 a menos de 25%"),
  o("25-50", "25 a 50%", "25 to 50%", "25 a 50%"),
  o(">50", "Más de 50%", "Over 50%", "Mais de 50%"),
  o("nm", "No medimos", "We do not measure it", "Não medimos"),
  o("ns", "No sé", "I don't know", "Não sei"),
];

export const EFFORT_HOURS: Choice[] = [
  o("<1h", "Menos de 1 hora", "Under 1 hour", "Menos de 1 hora"),
  o("1-8h", "1 a menos de 8 horas", "1 to under 8 hours", "1 a menos de 8 horas"),
  o("8-40h", "8 a menos de 40 horas", "8 to under 40 hours", "8 a menos de 40 horas"),
  o("40h+", "40 horas o más", "40 hours or more", "40 horas ou mais"),
  o("imposible", "No podemos obtenerlo con fiabilidad", "We cannot obtain it reliably", "Não conseguimos obter com confiabilidade"),
  o("ns", "No sé", "I don't know", "Não sei"),
];

export const AI_STAGE: Choice[] = [
  o("no", "No se usa", "Not used", "Não se usa"),
  o("individual", "Uso individual no gobernado", "Individual use, not governed", "Uso individual não governado"),
  o("piloto", "Pilotos con responsable", "Pilots with an owner", "Pilotos com responsável"),
  o("produccion", "Producción en parte de los procesos, con controles", "Live in part of the process, with controls", "Produção em parte dos processos, com controles"),
  o("extendido", "Uso extendido con gobierno y monitoreo", "Broad use with governance and monitoring", "Uso amplo com governança e monitoramento"),
  o("ns", "No sé", "I don't know", "Não sei"),
];

export const YES_NO: Choice[] = [
  o("si", "Sí", "Yes", "Sim"),
  o("no", "No", "No", "Não"),
];

export const AI_SCALE: Choice[] = [
  o("si", "Sí, pasaron a una operación más amplia", "Yes, they moved into broader operation", "Sim, passaram a uma operação mais ampla"),
  o("no", "No, siguen en piloto", "No, they are still pilots", "Não, continuam em piloto"),
  o("sin", "No hemos tenido pilotos", "We have not had pilots", "Não tivemos pilotos"),
];

export const AI_MODE: Choice[] = [
  o("solos", "Solos, con el equipo interno", "On our own, with the internal team", "Sozinhos, com a equipe interna"),
  o("partners", "Con partners", "With partners", "Com parceiros"),
  o("ambos", "Parte solos y parte con partners", "Partly on our own and partly with partners", "Parte sozinhos e parte com parceiros"),
];

export type AiAnswers = {
  ia_activos: string;
  ia_activos_n: string;
  ia_compras_n: string;
  ia_presupuesto: string;
  ia_presupuesto_compras: string;
  ia_escala: string;
  ia_modo: string;
};

/** Sí o no, cantidades y un porcentaje. No se convierten en pesos ni en brecha. */
export function aiProblems(draft: AiAnswers, mode: "required" | "optional") {
  const problems: Record<string, "required" | "count" | "over" | "share"> = {};
  const activos = draft.ia_activos;
  const presupuesto = draft.ia_presupuesto;
  const started = [activos, presupuesto, draft.ia_activos_n, draft.ia_compras_n, draft.ia_presupuesto_compras, draft.ia_escala, draft.ia_modo].some(Boolean);
  if (mode === "optional" && !started) return problems;
  if (activos !== "si" && activos !== "no") {
    if (mode === "required" || draft.ia_activos_n || draft.ia_compras_n || draft.ia_escala || draft.ia_modo) problems.ia_activos = "required";
  }
  if (activos === "si") {
    if (!wholeNumber(draft.ia_activos_n, 1, 999)) problems.ia_activos_n = "count";
    else if (!wholeNumber(draft.ia_compras_n, 0, 999)) problems.ia_compras_n = "count";
    else if (Number(draft.ia_compras_n) > Number(draft.ia_activos_n)) problems.ia_compras_n = "over";
    if (!AI_SCALE.some((item) => item.v === draft.ia_escala)) problems.ia_escala = "required";
    if (!AI_MODE.some((item) => item.v === draft.ia_modo)) problems.ia_modo = "required";
  }
  if (presupuesto !== "si" && presupuesto !== "no") {
    if (mode === "required" || draft.ia_presupuesto_compras) problems.ia_presupuesto = "required";
  }
  if (presupuesto === "si" && !wholeNumber(draft.ia_presupuesto_compras, 0, 100)) problems.ia_presupuesto_compras = "share";
  return problems;
}

function wholeNumber(value: string, min: number, max: number) {
  if (!/^(0|[1-9]\d*)$/.test(value)) return false;
  const number = Number(value);
  return number >= min && number <= max;
}

export const TEAM_NEXT: Choice[] = [
  o("mas", "Más grande", "Larger", "Maior"),
  o("igual", "Igual", "The same", "Igual"),
  o("menos", "Más chico", "Smaller", "Menor"),
];

/** Personas de hoy y la dirección del próximo año. No entra a la brecha. */
export function teamProblems(size: string, next: string) {
  const problems: Record<string, "required" | "count"> = {};
  if (!wholeNumber(size, 1, 99999)) problems.equipo_n = "count";
  if (!TEAM_NEXT.some((item) => item.v === next)) problems.equipo_proximo = "required";
  return problems;
}

export const DATA_READY: Choice[] = [
  o("READY", "Datos listos: identificados, disponibles, con responsables, acceso y control de calidad", "Data ready: identified, available, owned, authorized and quality-checked", "Dados prontos: identificados, disponíveis, com responsáveis, acesso e controle de qualidade"),
  o("PARTIAL", "Una parte cumple, pero faltan datos, calidad, integración o gobierno", "Part of it meets the conditions, but data, quality, integration or governance is missing", "Uma parte cumpre, mas faltam dados, qualidade, integração ou governança"),
  o("NOT_READY", "Todavía no existe esa base de datos y gobierno", "That data base and governance do not exist yet", "Ainda não existe essa base de dados e governança"),
  o("UNKNOWN", "No sé, o el alcance de IA no está definido", "I don't know, or the AI scope is not defined", "Não sei, ou o escopo de IA não está definido"),
];

export const BARRIERS: Choice[] = [
  o("roi", "ROI o caso de negocio poco claro", "Unclear ROI or business case", "ROI ou caso de negócio pouco claro"),
  o("sistemas", "Integración con sistemas", "Integration with systems", "Integração com sistemas"),
  o("datos", "Calidad o disponibilidad de datos", "Data quality or availability", "Qualidade ou disponibilidade de dados"),
  o("talento", "Talento o capacidades", "Talent or capabilities", "Talento ou capacidades"),
  o("cambio", "Resistencia o gestión del cambio", "Resistance or change management", "Resistência ou gestão da mudança"),
  o("seguridad", "Restricciones de acceso, seguridad o uso", "Access, security or use restrictions", "Restrições de acesso, segurança ou uso"),
  o("otra", "Otra", "Other", "Outra"),
];

export const BARRIER_EXCLUSIVE: Choice[] = [
  o("ninguna", "Ninguna barrera relevante identificada", "No material barrier identified", "Nenhuma barreira relevante identificada"),
  o("ns", "No se ha evaluado / no sé", "Not assessed / I don't know", "Não foi avaliado / não sei"),
];

export const VALIDATE_FREQ: Choice[] = [
  o("sistematica", "De forma sistemática", "Systematically", "De forma sistemática"),
  o("algunos", "Solo en algunos casos", "Only in some cases", "Só em alguns casos"),
  o("no", "Aún no existe ese proceso", "That process does not exist yet", "Ainda não existe esse processo"),
  o("ns", "No sé", "I don't know", "Não sei"),
];

export const BUDGET_DIRECTION: Choice[] = [
  o("sube", "Aumenta", "Increases", "Aumenta"),
  o("igual", "Se mantiene", "Stays the same", "Mantém-se"),
  o("baja", "Disminuye", "Decreases", "Diminui"),
  o("nd", "No está definido", "Not defined", "Não está definido"),
  o("ns", "No sé", "I don't know", "Não sei"),
];

export const PARTICIPATION: Choice[] = [
  o("definicion", "Desde la definición de la necesidad y las alternativas", "From defining the need and the alternatives", "Desde a definição da necessidade e das alternativas"),
  o("evaluacion", "Durante la evaluación y la negociación", "During evaluation and negotiation", "Durante a avaliação e a negociação"),
  o("ejecucion", "Principalmente al ejecutar la compra", "Mainly when the purchase is executed", "Principalmente ao executar a compra"),
  o("no", "No participa habitualmente", "Does not usually take part", "Não participa habitualmente"),
  o("ns", "No sé", "I don't know", "Não sei"),
];

export const STATUSES: Choice[] = [
  o("NOT_CONSIDERED", "No considerada", "Not considered", "Não considerada"),
  o("EVALUATING", "En evaluación", "Under evaluation", "Em avaliação"),
  o("APPROVED", "Aprobada para 12 a 18 meses", "Approved for 12 to 18 months", "Aprovada para 12 a 18 meses"),
  o("IN_PROGRESS", "En implementación", "Being implemented", "Em implementação"),
  o("IMPLEMENTED", "Implementada", "Implemented", "Implementada"),
  o("NOT_APPLICABLE", "No aplicable a este alcance", "Not applicable to this scope", "Não aplicável a este escopo"),
  o("UNKNOWN", "No sé", "I don't know", "Não sei"),
];

export const STATUS_TO_ENGINE: Record<string, string> = {
  NOT_CONSIDERED: "0",
  EVALUATING: "1",
  APPROVED: "2",
  IN_PROGRESS: "3",
  IMPLEMENTED: "4",
  NOT_APPLICABLE: "5",
  UNKNOWN: "ns",
};

export const CONSENTS: { id: string; req: boolean; label: Copy }[] = [
  { id: "c_datos", req: true, label: L("Acepto el tratamiento de mis datos según lo descrito.", "I accept the processing of my data as described.", "Aceito o tratamento dos meus dados conforme descrito.") },
  { id: "c_agregado", req: true, label: L("Autorizo el uso de mis respuestas en forma agregada y anónima.", "I authorize aggregate, anonymous use of my answers.", "Autorizo o uso das minhas respostas de forma agregada e anônima.") },
  { id: "c_informe", req: false, label: L("Quiero recibir el informe del corte.", "I want to receive the cut's report.", "Quero receber o relatório do corte.") },
];

export const CONSENT_DETAILS: Record<Lang, { title: string; body: string }[]> = {
  es: [
    { title: "Quién es responsable", body: "Xinergy SpA es responsable del tratamiento. El contacto es " + SURVEY_CONTACT + "." },
    { title: "Qué datos se piden", body: "Empresa, correo, rol, alcance y las respuestas del cuestionario. El correo no entra al análisis agregado. No pedimos teléfono ni redes." },
    { title: "Para qué", body: "Elaborar el estudio Radar Compras 2027, versión oficial, y publicarlo solo en forma agregada, sin identificar a una persona o a una empresa. El informe del corte se envía solo si marca esa opción." },
    { title: "Base y plazo", body: "La base es su consentimiento. Lo guardamos hasta 24 meses desde el cierre del estudio y después lo eliminamos o lo anonimizamos. Puede retirar el consentimiento cuando quiera, sin efecto retroactivo sobre un corte ya publicado en forma agregada." },
    { title: "Dónde se guarda", body: "En los sistemas de Xinergy y de su proveedor tecnológico, que puede estar fuera de Chile. Puede pedir ese detalle al contacto de arriba." },
    { title: "Sus derechos", body: "Puede pedir acceso, rectificación, eliminación, oposición y, cuando corresponda bajo la Ley 21.719, portabilidad o bloqueo, escribiendo al mismo correo. Hoy rige la Ley 19.628. La Ley 21.719 entra en vigor en diciembre de 2026." },
  ],
  en: [
    { title: "Who is responsible", body: "Xinergy SpA is the controller. Contact: " + SURVEY_CONTACT + "." },
    { title: "What we ask", body: "Company, email, role, scope and the survey answers. Email stays out of the aggregate analysis. We do not ask for a phone number or social profiles." },
    { title: "Purpose", body: "To prepare the official Procurement Radar 2027 study and publish it only in aggregate, without identifying a person or a company. The cut report is sent only if you tick that option." },
    { title: "Basis and retention", body: "The basis is your consent. We keep it for up to 24 months after the study closes, then delete or anonymize it. You can withdraw consent at any time. Withdrawal does not undo a cut already published in aggregate." },
    { title: "Where it is stored", body: "On Xinergy's systems and those of its technology provider, which may be outside Chile. You can ask for that detail at the contact above." },
    { title: "Your rights", body: "You can request access, correction, deletion, objection and, where Law 21.719 applies, portability or blocking, by writing to the same address. Law 19.628 applies today. Law 21.719 takes effect in December 2026." },
  ],
  pt: [
    { title: "Quem é responsável", body: "A Xinergy SpA é a controladora. O contato é " + SURVEY_CONTACT + "." },
    { title: "Quais dados", body: "Empresa, e-mail, papel, escopo e as respostas. O e-mail fica fora da análise agregada. Não pedimos telefone nem redes." },
    { title: "Para quê", body: "Elaborar o estudo oficial Radar de Compras 2027 e publicá-lo só de forma agregada, sem identificar pessoa ou empresa. O relatório do corte é enviado só se você marcar essa opção." },
    { title: "Base e prazo", body: "A base é o seu consentimento. Guardamos por até 24 meses após o encerramento e depois excluímos ou anonimizamos. Você pode retirar o consentimento quando quiser, sem desfazer um corte já publicado de forma agregada." },
    { title: "Onde fica", body: "Nos sistemas da Xinergy e do provedor de tecnologia, que pode estar fora do Chile. Pode pedir esse detalhe no contato acima." },
    { title: "Seus direitos", body: "Pode pedir acesso, correção, exclusão, oposição e, quando couber pela Lei 21.719, portabilidade ou bloqueio, no mesmo e-mail. Hoje vale a Lei 19.628. A Lei 21.719 entra em vigor em dezembro de 2026." },
  ],
};

export const OPERATIONAL_FIELDS = [
  "empresa", "email",
  "rol", "paises", "rubro", "alcance",
  ...AHP.pairs.map((pair) => pair.id),
  ...CAPABILITIES.map((item) => item.id),
  "e1", "e2", "e3", "e4", "e5", "r1", "e6",
  "ia_activos", "ia_activos_n", "ia_compras_n", "ia_presupuesto", "ia_presupuesto_compras", "ia_escala", "ia_modo",
  ...INITIATIVE_COPY.map((item) => item.id),
  "c_datos", "c_agregado",
] as const;

export const EXECUTIVE_FIELDS = [
  "empresa", "email",
  "rol", "paises", "rubro", "alcance",
  ...AHP.pairs.map((pair) => pair.id),
  "rol_a", "rol_b",
  "c_datos", "c_agregado",
] as const;

export const OPTIONAL_FIELDS = ["spend", "desafio", "unidad", "ruta_operativa"] as const;

export const ui = {
  es: {
    stepsOperational: ["Bienvenida", "Contacto", "Alcance", "Prioridades", "Capacidad", "Contexto", "Agenda", "Cierre"],
    stepsExecutive: ["Bienvenida", "Contacto", "Alcance", "Prioridades", "Su rol", "Cierre"],
    back: "Atrás",
    next: "Continuar",
    start: "Comenzar",
    stepOf: (current: number, total: number) => `Paso ${current} de ${total}`,
    benefits: [
      ["Su devolución", "Al terminar puede descargar el resultado de este alcance."],
      ["Informe del corte", "Se publica cuando hay una base agregada, sin nombres ni empresas."],
      ["Ruta según el rol", "Dirección y Finanzas ven las mismas preguntas de operación. Pueden dejarlas en blanco."],
    ] as [string, string][],
    meta: ["Ruta breve", "Confidencial", "Resultados agregados"],
    doneEyebrow: "Listo",
    submit: "Enviar respuestas",
    sending: "Enviando…",
    required: "Esta respuesta es obligatoria.",
    email: "Ingrese un correo válido.",
    fix: "Revise las preguntas marcadas.",
    sendErr: "No pudimos enviar sus respuestas. Revise su conexión e intente de nuevo.",
    saved: "Su avance se guarda en este navegador.",
    eyebrow: "Radar Compras 2027 · C (versión oficial)",
    welcomeTitle: "Agenda de Compras para 2027",
    purposeLabel: "Para qué",
    purpose: "Xinergy está reuniendo cómo Compras quiere ordenar 2027. El propósito es ver, en cada alcance, qué debería pesar más, qué ya sostiene la práctica y qué decisiones están tomadas. Esa lectura vuelve a quien responde. El corte agregado se publica después, sin nombres ni empresas.",
    welcomeLead: "Al terminar puede descargar la devolución de su alcance. Si no está en Compras, capacidad, contexto y agenda se pueden dejar en blanco.",
    welcomeNote: "Los escenarios usan una matriz de demostración. No son un ahorro prometido ni un pronóstico.",
    contactTitle: "Sus datos",
    contactNote: "El nombre y el correo quedan fuera del análisis agregado. Sirven para enviarle el informe si lo pide.",
    profileTitle: "Alcance que va a evaluar",
    profileNote: "Marque los países de ese alcance. Si son varios, elija corporativo multipaís: no cuenta como una respuesta por país.",
    optionalStep: "Si no conoce la operación de este alcance, puede continuar sin responder. No es obligatorio.",
    detailsShow: "Leer detalles del tratamiento de datos",
    detailsHide: "Ocultar detalles",
    ahpTitle: "Qué debería priorizar Compras en 2027",
    ahpIntro: "Cada comparación es entre dos grupos. El nombre está arriba y, debajo, lo que ese grupo contiene. El número hacia un grupo dice cuánto más debería pesar. El 1 del centro es igual importancia.",
    ahpExample: "Si el grupo de eficiencia es moderadamente más importante que el de riesgo, elige el 3 de ese lado. Si los dos grupos pesan lo mismo, elige el 1.",
    ahpGroups: "En este bloque se comparan los grupos completos. Después se comparan las prioridades dentro de cada grupo. No se pregunta el desempeño actual.",
    ahpInside: "Se comparan las prioridades dentro de este grupo. No se evalúa el desempeño actual ni cuán fácil sería mejorar.",
    blockOf: (current: number, total: number) => `Bloque ${current} de ${total}`,
    blockTitles: ["Prioridades generales", "Costos y caja", "Riesgo, control y sostenibilidad", "Tecnología, innovación y talento"],
    macroDefs: [
      ["Eficiencia y valor financiero", "Reducir costos y mejorar caja y capital de trabajo."],
      ["Riesgo, sostenibilidad y control", "Asegurar continuidad, cumplimiento y gestión responsable de proveedores."],
      ["Transformación y capacidades", "Desarrollar tecnología y datos, innovación con proveedores y capacidades del equipo."],
    ] as [string, string][],
    which: "¿Cuál debería tener mayor importancia?",
    whichGroup: "¿Cuál grupo debería tener mayor importancia?",
    contains: "Contiene",
    intensityQ: "¿Con qué intensidad?",
    equalChoice: "Igual importancia",
    intensities: ["Moderadamente más importante", "Fuertemente más importante", "Muy fuertemente más importante", "Extremadamente más importante"],
    scaleShort: ["Extrema", "Muy fuerte", "Fuerte", "Moderada", "Igual", "Moderada", "Fuerte", "Muy fuerte", "Extrema"],
    nextBlock: "Siguiente bloque",
    reviewNote: "Conservaremos tus respuestas. Estas comparaciones no se incluirán en el promedio principal de prioridades del estudio. Las demás respuestas válidas de tu encuesta seguirán utilizándose.",
    reviewPortfolio: "Tampoco se calculará un portafolio recomendado a partir de estas prioridades.",
    ahpNote: "Compare cada par. ¿Cuál debería pesar más en este alcance, y cuánto más?",
    left: "Más importante a la izquierda",
    right: "Más importante a la derecha",
    equal: "igual",
    crReview: "Conviene revisar",
    capTitle: "Capacidad actual",
    capNote: "Elija el nivel más alto que describa prácticas habituales. Si solo cumple una parte, elija el anterior. “No sé” no es el nivel más bajo.",
    contextTitle: "Resultados y condiciones",
    contextNote: "Son rangos y declaraciones. No se convierten en un promedio de ahorro ni corrigen la capacidad. Las de proyectos de IA piden sí o no, una cantidad o un porcentaje, y no entran al cálculo de la brecha.",
    countInvalid: "Ingrese un número entero.",
    countOver: "Los proyectos de Compras no pueden ser más que el total.",
    shareInvalid: "Ingrese un porcentaje entero de 0 a 100.",
    agendaTitle: "Estado de cada iniciativa",
    agendaNote: "Aprobada: hay decisión de ejecutarla en 12 a 18 meses. Implementada: ese alcance ya opera de forma estable.",
    roleTitle: "Dos preguntas de su rol",
    teamStep: "Equipo",
    teamTitle: "Su equipo",
    teamNote: "Es el equipo de Compras de este alcance, hoy. El número no entra al cálculo de la brecha.",
    closeTitle: "Un cambio para 2027",
    closeNote: "Opcional. No entra al cálculo.",
    challenge: "¿Qué cambio concreto haría la mayor diferencia para Compras durante 2027?",
    spend: "Gasto anual con proveedores, aproximado, en USD. Opcional.",
    unit: "Nombre de la unidad",
    industryDetail: "¿Cuál industria?",
    countryDetail: "Describa el otro país o el alcance regional",
    countries: "Países del alcance",
    oneCountry: "Para el alcance de un país, marque solo uno. Si son varios, cambie a corporativo multipaís.",
    manyCountries: "Corporativo multipaís necesita al menos dos países.",
    doneTitle: "Recibimos sus respuestas",
    doneLead: "Puede descargar ahora la devolución de su alcance. El informe del corte se publica cuando haya una base agregada.",
    doneDownload: "Descargar mi devolución",
    doneHome: "Volver a Xinergy",
  },
  en: {
    stepsOperational: ["Welcome", "Contact", "Scope", "Priorities", "Capability", "Context", "Agenda", "Close"],
    stepsExecutive: ["Welcome", "Contact", "Scope", "Priorities", "Your role", "Close"],
    back: "Back",
    next: "Continue",
    start: "Start",
    stepOf: (current: number, total: number) => `Step ${current} of ${total}`,
    benefits: [
      ["Your return", "At the end you can download the result for this scope."],
      ["Cut report", "It is published when there is an aggregate base, without names or companies."],
      ["Route by role", "Executives and Finance see the same operating questions. They can leave them blank."],
    ] as [string, string][],
    meta: ["Short route", "Confidential", "Aggregate results"],
    doneEyebrow: "Done",
    submit: "Submit answers",
    sending: "Sending…",
    required: "This answer is required.",
    email: "Enter a valid email.",
    fix: "Check the marked questions.",
    sendErr: "We could not send your answers. Check your connection and try again.",
    saved: "Your progress is saved in this browser.",
    eyebrow: "Procurement Radar 2027 · C (official version)",
    welcomeTitle: "Procurement agenda for 2027",
    purposeLabel: "Why",
    purpose: "Xinergy is gathering how Procurement wants to set 2027. The purpose is to see, for each scope, what should weigh more, what practice can already sustain, and which decisions are already made. That reading goes back to the person who answers. The aggregate cut is published later, without names or companies.",
    welcomeLead: "At the end you can download the return for your scope. If you are not in Procurement, capability, context and the agenda can be left blank.",
    welcomeNote: "Scenarios use a demonstration matrix. They are not a promised saving or a forecast.",
    contactTitle: "Your details",
    contactNote: "Your name and email stay out of the aggregate analysis. They are used to send the report if you ask for it.",
    profileTitle: "Scope you will assess",
    profileNote: "Mark the countries of that scope. If there are several, choose multi-country corporate: it does not count as one answer per country.",
    optionalStep: "If you do not know the operation of this scope, you can continue without answering. It is not required.",
    detailsShow: "Read the data processing details",
    detailsHide: "Hide details",
    ahpTitle: "What Procurement should prioritize in 2027",
    ahpIntro: "Each comparison is between two groups. The name is on top and, under it, what that group contains. The number toward a group says how much more it should weigh. The 1 in the center is equal importance.",
    ahpExample: "If the efficiency group is moderately more important than the risk group, choose the 3 on that side. If both groups weigh the same, choose 1.",
    ahpGroups: "This block compares the whole groups. Later blocks compare the priorities inside each group. This is not a question about current performance.",
    ahpInside: "These are the priorities inside this group. It does not ask about current performance or how easy an improvement would be.",
    blockOf: (current: number, total: number) => `Block ${current} of ${total}`,
    blockTitles: ["Overall priorities", "Cost and cash", "Risk, control and sustainability", "Technology, innovation and talent"],
    macroDefs: [
      ["Efficiency and financial value", "Reduce cost and improve cash and working capital."],
      ["Risk, sustainability and control", "Secure continuity, compliance and responsible supplier management."],
      ["Transformation and capabilities", "Develop technology and data, supplier innovation and team capabilities."],
    ] as [string, string][],
    which: "Which should matter more?",
    whichGroup: "Which group should matter more?",
    contains: "Contains",
    intensityQ: "By how much?",
    equalChoice: "Equal importance",
    intensities: ["Moderately more important", "Strongly more important", "Very strongly more important", "Extremely more important"],
    scaleShort: ["Extreme", "Very strong", "Strong", "Moderate", "Equal", "Moderate", "Strong", "Very strong", "Extreme"],
    nextBlock: "Next block",
    reviewNote: "We will keep your answers. These comparisons will not be included in the study's main priority average. Your other valid answers will still be used.",
    reviewPortfolio: "A recommended portfolio will not be calculated from these priorities.",
    ahpNote: "Compare each pair. Which should weigh more in this scope, and by how much?",
    left: "More important on the left",
    right: "More important on the right",
    equal: "equal",
    crReview: "Worth reviewing",
    capTitle: "Current capability",
    capNote: "Choose the highest level that describes habitual practice. If you only meet part of a level, choose the one below. “I don't know” is not the lowest level.",
    contextTitle: "Results and conditions",
    contextNote: "These are ranges and statements. They are not turned into an average saving and they do not overwrite capability. The AI project questions ask for yes or no, a count or a percentage, and they do not enter the gap calculation.",
    countInvalid: "Enter a whole number.",
    countOver: "Procurement projects cannot exceed the total.",
    shareInvalid: "Enter a whole percentage from 0 to 100.",
    agendaTitle: "Status of each initiative",
    agendaNote: "Approved: there is a decision to execute in 12 to 18 months. Implemented: that scope already runs in a stable way.",
    roleTitle: "Two questions for your role",
    teamStep: "Team",
    teamTitle: "Your team",
    teamNote: "This is the Procurement team of this scope, today. The number does not enter the gap calculation.",
    closeTitle: "One change for 2027",
    closeNote: "Optional. It is not part of the calculation.",
    challenge: "What concrete change would make the biggest difference for Procurement during 2027?",
    spend: "Annual supplier spend, approximate, in USD. Optional.",
    unit: "Business unit name",
    industryDetail: "Which industry?",
    countryDetail: "Describe the other country or the regional scope",
    countries: "Countries in the scope",
    oneCountry: "For a one-country scope, mark only one. If there are several, switch to multi-country corporate.",
    manyCountries: "Multi-country corporate needs at least two countries.",
    doneTitle: "We received your answers",
    doneLead: "You can download the return for your scope now. The cut report is published when there is an aggregate base.",
    doneDownload: "Download my return",
    doneHome: "Back to Xinergy",
  },
  pt: {
    stepsOperational: ["Boas-vindas", "Contato", "Escopo", "Prioridades", "Capacidade", "Contexto", "Agenda", "Fecho"],
    stepsExecutive: ["Boas-vindas", "Contato", "Escopo", "Prioridades", "Seu papel", "Fecho"],
    back: "Voltar",
    next: "Continuar",
    start: "Começar",
    stepOf: (current: number, total: number) => `Passo ${current} de ${total}`,
    benefits: [
      ["Sua devolutiva", "No final você pode baixar o resultado deste escopo."],
      ["Relatório do corte", "Sai quando houver uma base agregada, sem nomes nem empresas."],
      ["Rota segundo o papel", "Direção e Finanças veem as mesmas perguntas de operação. Podem deixá-las em branco."],
    ] as [string, string][],
    meta: ["Rota breve", "Confidencial", "Resultados agregados"],
    doneEyebrow: "Pronto",
    submit: "Enviar respostas",
    sending: "Enviando…",
    required: "Esta resposta é obrigatória.",
    email: "Informe um e-mail válido.",
    fix: "Revise as perguntas marcadas.",
    sendErr: "Não conseguimos enviar suas respostas. Verifique a conexão e tente de novo.",
    saved: "Seu avanço fica salvo neste navegador.",
    eyebrow: "Radar de Compras 2027 · C (versão oficial)",
    welcomeTitle: "Agenda de Compras para 2027",
    purposeLabel: "Para quê",
    purpose: "A Xinergy está reunindo como Compras quer ordenar 2027. O propósito é ver, em cada escopo, o que deveria pesar mais, o que a prática já sustenta e quais decisões estão tomadas. Essa leitura volta para quem responde. O corte agregado sai depois, sem nomes nem empresas.",
    welcomeLead: "No final você pode baixar a devolutiva do seu escopo. Se não está em Compras, capacidade, contexto e agenda podem ficar em branco.",
    welcomeNote: "Os cenários usam uma matriz de demonstração. Não são uma economia prometida nem uma previsão.",
    contactTitle: "Seus dados",
    contactNote: "O nome e o e-mail ficam fora da análise agregada. Servem para enviar o relatório se você pedir.",
    profileTitle: "Escopo que vai avaliar",
    profileNote: "Marque os países desse escopo. Se forem vários, escolha corporativo multipaís: não conta como uma resposta por país.",
    optionalStep: "Se não conhece a operação deste escopo, pode continuar sem responder. Não é obrigatório.",
    detailsShow: "Ler os detalhes do tratamento de dados",
    detailsHide: "Ocultar detalhes",
    ahpTitle: "O que Compras deveria priorizar em 2027",
    ahpIntro: "Cada comparação é entre dois grupos. O nome fica em cima e, abaixo, o que esse grupo contém. O número na direção de um grupo diz quanto mais ele deveria pesar. O 1 do centro é igual importância.",
    ahpExample: "Se o grupo de eficiência é moderadamente mais importante que o de risco, escolha o 3 desse lado. Se os dois grupos pesam o mesmo, escolha o 1.",
    ahpGroups: "Neste bloco comparam-se os grupos completos. Depois comparam-se as prioridades dentro de cada grupo. Não se pergunta o desempenho atual.",
    ahpInside: "Comparam-se as prioridades dentro deste grupo. Não se avalia o desempenho atual nem quão fácil seria melhorar.",
    blockOf: (current: number, total: number) => `Bloco ${current} de ${total}`,
    blockTitles: ["Prioridades gerais", "Custos e caixa", "Risco, controle e sustentabilidade", "Tecnologia, inovação e talento"],
    macroDefs: [
      ["Eficiência e valor financeiro", "Reduzir custos e melhorar caixa e capital de giro."],
      ["Risco, sustentabilidade e controle", "Assegurar continuidade, cumprimento e gestão responsável de fornecedores."],
      ["Transformação e capacidades", "Desenvolver tecnologia e dados, inovação com fornecedores e capacidades da equipe."],
    ] as [string, string][],
    which: "Qual deveria ter maior importância?",
    whichGroup: "Qual grupo deveria ter maior importância?",
    contains: "Contém",
    intensityQ: "Com que intensidade?",
    equalChoice: "Igual importância",
    intensities: ["Moderadamente mais importante", "Fortemente mais importante", "Muito fortemente mais importante", "Extremamente mais importante"],
    scaleShort: ["Extrema", "Muito forte", "Forte", "Moderada", "Igual", "Moderada", "Forte", "Muito forte", "Extrema"],
    nextBlock: "Bloco seguinte",
    reviewNote: "Vamos conservar suas respostas. Estas comparações não entram na média principal de prioridades do estudo. As outras respostas válidas da pesquisa continuam sendo usadas.",
    reviewPortfolio: "Também não será calculado um portfólio recomendado a partir destas prioridades.",
    ahpNote: "Compare cada par. Qual deveria pesar mais neste escopo, e quanto mais?",
    left: "Mais importante à esquerda",
    right: "Mais importante à direita",
    equal: "igual",
    crReview: "Vale revisar",
    capTitle: "Capacidade atual",
    capNote: "Escolha o nível mais alto que descreva práticas habituais. Se só cumpre uma parte, escolha o anterior. “Não sei” não é o nível mais baixo.",
    contextTitle: "Resultados e condições",
    contextNote: "São faixas e declarações. Não viram uma média de economia nem corrigem a capacidade. As de projetos de IA pedem sim ou não, uma quantidade ou um percentual, e não entram no cálculo da lacuna.",
    countInvalid: "Informe um número inteiro.",
    countOver: "Os projetos de Compras não podem passar do total.",
    shareInvalid: "Informe um percentual inteiro de 0 a 100.",
    agendaTitle: "Estado de cada iniciativa",
    agendaNote: "Aprovada: há decisão de executar em 12 a 18 meses. Implementada: esse escopo já opera de forma estável.",
    roleTitle: "Duas perguntas do seu papel",
    teamStep: "Equipe",
    teamTitle: "Sua equipe",
    teamNote: "É a equipe de Compras deste escopo, hoje. O número não entra no cálculo da lacuna.",
    closeTitle: "Uma mudança para 2027",
    closeNote: "Opcional. Não entra no cálculo.",
    challenge: "Que mudança concreta faria a maior diferença para Compras durante 2027?",
    spend: "Gasto anual com fornecedores, aproximado, em USD. Opcional.",
    unit: "Nome da unidade",
    industryDetail: "Qual indústria?",
    countryDetail: "Descreva o outro país ou o escopo regional",
    countries: "Países do escopo",
    oneCountry: "Para o escopo de um país, marque só um. Se forem vários, mude para corporativo multipaís.",
    manyCountries: "Corporativo multipaís precisa de pelo menos dois países.",
    doneTitle: "Recebemos suas respostas",
    doneLead: "Você pode baixar agora a devolutiva do seu escopo. O relatório do corte sai quando houver uma base agregada.",
    doneDownload: "Baixar minha devolutiva",
    doneHome: "Voltar à Xinergy",
  },
} as const;
