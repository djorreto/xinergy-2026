import { AHP, AHP_SCALE } from "@/lib/surveys/radar-2027";
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

export const OPERATIONAL_FIELDS = [
  "empresa", "email",
  "rol", "paises", "rubro", "alcance",
  ...AHP.pairs.map((pair) => pair.id),
  ...CAPABILITIES.map((item) => item.id),
  "e1", "e2", "e3", "e4", "e5", "r1", "e6",
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
    stepsOperational: ["Inicio", "Contacto", "Alcance", "Prioridades", "Capacidad", "Contexto", "Agenda", "Cierre"],
    stepsExecutive: ["Inicio", "Contacto", "Alcance", "Prioridades", "Su rol", "Cierre"],
    back: "Atrás",
    next: "Continuar",
    start: "Comenzar",
    submit: "Enviar respuestas",
    sending: "Enviando…",
    required: "Esta respuesta es obligatoria.",
    email: "Ingrese un correo válido.",
    fix: "Revise las preguntas marcadas.",
    sendErr: "No pudimos enviar sus respuestas. Revise su conexión e intente de nuevo.",
    saved: "Su avance se guarda en este navegador.",
    eyebrow: "Radar Compras 2027 · versión C",
    welcomeTitle: "Agenda de Compras para 2027",
    welcomeLead: "La encuesta conecta lo que importa, la capacidad actual y las decisiones previstas. Al terminar puede descargar una devolución de su alcance. La ruta de Compras está pensada para cerca de 10 a 12 minutos. La de dirección general y Finanzas es más corta.",
    welcomeNote: "Los escenarios usan una matriz de demostración. No son un ahorro prometido ni un pronóstico.",
    contactTitle: "Empresa y correo",
    contactNote: "El correo queda aparte del análisis agregado. Sirve para enviarle el informe si lo pide.",
    profileTitle: "Alcance que va a evaluar",
    profileNote: "Marque los países de ese alcance. Si son varios, elija corporativo multipaís: no cuenta como una respuesta por país.",
    expand: "Conozco la operación de Compras de este alcance y quiero completar capacidades y agenda.",
    expandNote: "Si no la marca, solo responde prioridades y dos preguntas de su rol.",
    ahpTitle: "Qué debería priorizar Compras en 2027",
    ahpExample: "Ejemplo: si reducir costos es moderadamente más importante que liberar caja, marque “moderada” del lado de costos. Igual significa que ambas pesan lo mismo. Nada viene marcado.",
    ahpNote: "Compare cada par. ¿Cuál debería pesar más en este alcance, y cuánto más?",
    left: "Más importante a la izquierda",
    right: "Más importante a la derecha",
    equal: "igual",
    crWarn: "Estas comparaciones se tensionan entre sí. Puede revisar los pares sugeridos o continuar. Si continúa, el perfil queda como exploratorio y no entra al promedio principal.",
    crReview: "Conviene revisar",
    capTitle: "Capacidad actual",
    capNote: "Elija el nivel más alto que describa prácticas habituales. Si solo cumple una parte, elija el anterior. “No sé” no es el nivel más bajo.",
    contextTitle: "Resultados y condiciones",
    contextNote: "Son rangos y declaraciones. No se convierten en un promedio de ahorro ni corrigen la capacidad.",
    agendaTitle: "Estado de cada iniciativa",
    agendaNote: "Aprobada: hay decisión de ejecutarla en 12 a 18 meses. Implementada: ese alcance ya opera de forma estable.",
    roleTitle: "Dos preguntas de su rol",
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
    stepsOperational: ["Start", "Contact", "Scope", "Priorities", "Capability", "Context", "Agenda", "Close"],
    stepsExecutive: ["Start", "Contact", "Scope", "Priorities", "Your role", "Close"],
    back: "Back",
    next: "Continue",
    start: "Start",
    submit: "Submit answers",
    sending: "Sending…",
    required: "This answer is required.",
    email: "Enter a valid email.",
    fix: "Check the marked questions.",
    sendErr: "We could not send your answers. Check your connection and try again.",
    saved: "Your progress is saved in this browser.",
    eyebrow: "Procurement Radar 2027 · version C",
    welcomeTitle: "Procurement agenda for 2027",
    welcomeLead: "The survey connects what matters, current capability and planned decisions. At the end you can download a return for your scope. The Procurement route is designed for about 10 to 12 minutes. The executive route is shorter.",
    welcomeNote: "Scenarios use a demonstration matrix. They are not a promised saving or a forecast.",
    contactTitle: "Company and email",
    contactNote: "Email is stored apart from the aggregate analysis. It is used to send the report if you ask for it.",
    profileTitle: "Scope you will assess",
    profileNote: "Mark the countries of that scope. If there are several, choose multi-country corporate: it does not count as one answer per country.",
    expand: "I know Procurement in this scope and want to complete capabilities and the agenda.",
    expandNote: "If you leave this unmarked, you only answer priorities and two role questions.",
    ahpTitle: "What Procurement should prioritize in 2027",
    ahpExample: "Example: if reducing cost is moderately more important than releasing cash, mark “moderate” on the cost side. Equal means both weigh the same. Nothing is preselected.",
    ahpNote: "Compare each pair. Which should weigh more in this scope, and by how much?",
    left: "More important on the left",
    right: "More important on the right",
    equal: "equal",
    crWarn: "These comparisons pull against each other. You can review the suggested pairs or continue. If you continue, the profile stays exploratory and stays out of the main average.",
    crReview: "Worth reviewing",
    capTitle: "Current capability",
    capNote: "Choose the highest level that describes habitual practice. If you only meet part of a level, choose the one below. “I don't know” is not the lowest level.",
    contextTitle: "Results and conditions",
    contextNote: "These are ranges and statements. They are not turned into an average saving and they do not overwrite capability.",
    agendaTitle: "Status of each initiative",
    agendaNote: "Approved: there is a decision to execute in 12 to 18 months. Implemented: that scope already runs in a stable way.",
    roleTitle: "Two questions for your role",
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
    stepsOperational: ["Início", "Contato", "Escopo", "Prioridades", "Capacidade", "Contexto", "Agenda", "Fecho"],
    stepsExecutive: ["Início", "Contato", "Escopo", "Prioridades", "Seu papel", "Fecho"],
    back: "Voltar",
    next: "Continuar",
    start: "Começar",
    submit: "Enviar respostas",
    sending: "Enviando…",
    required: "Esta resposta é obrigatória.",
    email: "Informe um e-mail válido.",
    fix: "Revise as perguntas marcadas.",
    sendErr: "Não conseguimos enviar suas respostas. Verifique a conexão e tente de novo.",
    saved: "Seu avanço fica salvo neste navegador.",
    eyebrow: "Radar de Compras 2027 · versão C",
    welcomeTitle: "Agenda de Compras para 2027",
    welcomeLead: "A pesquisa conecta o que importa, a capacidade atual e as decisões previstas. No final você pode baixar uma devolutiva do seu escopo. A rota de Compras foi pensada para cerca de 10 a 12 minutos. A de direção e Finanças é mais curta.",
    welcomeNote: "Os cenários usam uma matriz de demonstração. Não são uma economia prometida nem uma previsão.",
    contactTitle: "Empresa e e-mail",
    contactNote: "O e-mail fica separado da análise agregada. Serve para enviar o relatório se você pedir.",
    profileTitle: "Escopo que vai avaliar",
    profileNote: "Marque os países desse escopo. Se forem vários, escolha corporativo multipaís: não conta como uma resposta por país.",
    expand: "Conheço a operação de Compras deste escopo e quero completar capacidades e agenda.",
    expandNote: "Se não marcar, responde só prioridades e duas perguntas do seu papel.",
    ahpTitle: "O que Compras deveria priorizar em 2027",
    ahpExample: "Exemplo: se reduzir custos é moderadamente mais importante do que liberar caixa, marque “moderada” do lado de custos. Igual significa que as duas pesam o mesmo. Nada vem marcado.",
    ahpNote: "Compare cada par. Qual deveria pesar mais neste escopo, e quanto mais?",
    left: "Mais importante à esquerda",
    right: "Mais importante à direita",
    equal: "igual",
    crWarn: "Estas comparações se tensionam. Você pode revisar os pares sugeridos ou continuar. Se continuar, o perfil fica exploratório e fora da média principal.",
    crReview: "Vale revisar",
    capTitle: "Capacidade atual",
    capNote: "Escolha o nível mais alto que descreva práticas habituais. Se só cumpre uma parte, escolha o anterior. “Não sei” não é o nível mais baixo.",
    contextTitle: "Resultados e condições",
    contextNote: "São faixas e declarações. Não viram uma média de economia nem corrigem a capacidade.",
    agendaTitle: "Estado de cada iniciativa",
    agendaNote: "Aprovada: há decisão de executar em 12 a 18 meses. Implementada: esse escopo já opera de forma estável.",
    roleTitle: "Duas perguntas do seu papel",
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
