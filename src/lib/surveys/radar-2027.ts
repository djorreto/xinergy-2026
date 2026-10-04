import { surveyEnglish } from "@/lib/surveys/radar-2027-en";

export const SURVEY_SLUG = "radar-compras-2027";
export const SURVEY_TITLE = "Radar de Compras LatAm 2027";
export const SURVEY_CONTACT = "roberto.uauy@xinergy.cl";
export const SURVEY_VERSION = "radar-2027-v4-ahp";

export type Lang = "es" | "en" | "pt";
export type Copy = { es: string; en: string; pt: string };
export type Choice = { v: string; es: string; en: string; pt: string };

export const tx = (copy: Copy | string, lang: Lang) => (typeof copy === "string" ? copy : copy[lang] || copy.es);

const english = (es: string) => surveyEnglish[es] ?? es;
const L = (es: string, pt: string): Copy => ({ es, en: english(es), pt });
const o = (v: string, es: string, pt = es): Choice => ({ v, es, en: english(es), pt });

export const ui = {
  es: {
    steps: ["Bienvenida", "Registro", "Confidencialidad", "Su empresa", "Entorno y riesgo", "Tecnología, datos e IA", "Su rol", "Proyectos y talento"],
    back: "Atrás",
    next: "Continuar",
    start: "Comenzar",
    submit: "Enviar respuestas",
    sending: "Enviando…",
    stepOf: (a: number, b: number) => `Paso ${a} de ${b}`,
    required: "Esta respuesta es obligatoria.",
    email: "Ingrese un correo válido.",
    pickMax: (n: number) => `Elija hasta ${n}`,
    chosen: (a: number, b: number) => `${a} de ${b}`,
    optional: "(opcional)",
    otherPh: "Especifique",
    fixErrors: "Revise las preguntas marcadas.",
    invalidUrl: "Ingrese un enlace válido.",
    sendErr: "No pudimos enviar sus respuestas. Revise su conexión e intente de nuevo.",
    saved: "Su avance se guarda en este navegador.",
    welcomeEyebrow: "Radar de Compras LatAm 2027",
    welcomeTitle: "¿Hacia dónde van las compras en América Latina?",
    welcomeLead:
      "Un pulso a CEOs, CFOs y líderes de compras sobre costos, riesgo, tecnología y talento. Toma cerca de 15 minutos y sus respuestas se publican solo de forma agregada.",
    benefits: [
      ["Informe anticipado", "Recibe los resultados antes de su publicación."],
      ["Su benchmark", "Compare su empresa con el promedio de su industria y país."],
      ["Presentación de resultados", "Invitación al encuentro con líderes de compras, enero 2027."],
    ],
    meta: ["15 minutos", "Confidencial", "Resultados agregados"],
    regEyebrow: "Registro",
    regTitle: "Cuéntenos quién es",
    regNote: "Usamos estos datos para enviarle el informe y adaptar las preguntas a su cargo.",
    conEyebrow: "Confidencialidad",
    conTitle: "Cómo cuidamos sus datos",
    empEyebrow: "Su empresa",
    empTitle: "Perfil de la empresa",
    empNote: "Rangos aproximados son suficientes. Sirven para comparar su empresa con otras similares.",
    s4Eyebrow: "Entorno y riesgo",
    s4Title: "Prioridades, contexto y riesgo de proveedores",
    s5Eyebrow: "Tecnología, datos e IA",
    s5Title: "Tecnología, datos e inteligencia artificial",
    s6Eyebrow: "Su rol",
    s6Title: {
      cpo: "Desempeño del área de compras",
      cfo: "La mirada de Finanzas",
      ceo: "La mirada de la dirección",
      otro: "Su industria",
    },
    s6Note: {
      cpo: "Preguntas para líderes de compras, abastecimiento y supply chain.",
      cfo: "Preguntas para CFOs y gerentes de finanzas.",
      ceo: "Preguntas para CEOs y gerentes generales.",
      otro: "Algunas preguntas según el rubro de su empresa.",
    },
    s6Empty: "Para su cargo y rubro no hay preguntas adicionales en este paso. Puede continuar.",
    s7Eyebrow: "Proyectos y talento",
    s7Title: "Proyectos, equipo y temas de interés",
    doneEyebrow: "Listo",
    doneTitle: "Gracias por participar",
    doneLead: "Recibimos sus respuestas. Esto es lo que sigue:",
    doneList: [
      "Cerramos el levantamiento en noviembre de 2026.",
      "Le enviaremos el informe y su benchmark antes de la publicación.",
      "Si lo autorizó, le invitaremos a la presentación de resultados en enero de 2027.",
    ],
    talkEyebrow: "Eficiencias",
    talkTitle: "¿Conversamos sobre cómo mejorar costos, caja y compras?",
    talkLead: "Si quiere revisar oportunidades en su empresa, puede escribirnos o seguir a Xinergy.",
    contact: "Escribirnos",
    whatsapp: "WhatsApp",
    linkedin: "Seguir en LinkedIn",
    website: "Conocer Xinergy",
    leftMore: "izquierda más importante",
    rightMore: "derecha más importante",
    equal: "igual",
    ahpA: "A. Prioridades generales",
    ahpB: "B. Eficiencia y valor financiero",
    ahpC: "C. Riesgo, sostenibilidad y control",
    ahpD: "D. Transformación y capacidades",
    langLabel: "Idioma",
  },
  pt: {
    steps: ["Boas-vindas", "Cadastro", "Confidencialidade", "Sua empresa", "Contexto e risco", "Tecnologia, dados e IA", "Seu papel", "Projetos e talentos"],
    back: "Voltar",
    next: "Continuar",
    start: "Começar",
    submit: "Enviar respostas",
    sending: "Enviando…",
    stepOf: (a: number, b: number) => `Etapa ${a} de ${b}`,
    required: "Esta resposta é obrigatória.",
    email: "Informe um e-mail válido.",
    pickMax: (n: number) => `Escolha até ${n}`,
    chosen: (a: number, b: number) => `${a} de ${b}`,
    optional: "(opcional)",
    otherPh: "Especifique",
    fixErrors: "Revise as perguntas marcadas.",
    invalidUrl: "Informe um link válido.",
    sendErr: "Não conseguimos enviar suas respostas. Verifique sua conexão e tente novamente.",
    saved: "Seu progresso fica salvo neste navegador.",
    welcomeEyebrow: "Radar de Compras LatAm 2027",
    welcomeTitle: "Para onde vão as compras na América Latina?",
    welcomeLead:
      "Uma pesquisa com CEOs, CFOs e líderes de compras sobre custos, risco, tecnologia e talentos. Leva cerca de 15 minutos e as respostas são publicadas apenas de forma agregada.",
    benefits: [
      ["Relatório antecipado", "Receba os resultados antes da publicação."],
      ["Seu benchmark", "Compare sua empresa com a média do seu setor e país."],
      ["Apresentação dos resultados", "Convite para o encontro com líderes de compras, janeiro de 2027."],
    ],
    meta: ["15 minutos", "Confidencial", "Resultados agregados"],
    regEyebrow: "Cadastro",
    regTitle: "Conte-nos quem é você",
    regNote: "Usamos estes dados para enviar o relatório e adaptar as perguntas ao seu cargo.",
    conEyebrow: "Confidencialidade",
    conTitle: "Como cuidamos dos seus dados",
    empEyebrow: "Sua empresa",
    empTitle: "Perfil da empresa",
    empNote: "Faixas aproximadas são suficientes. Servem para comparar sua empresa com outras semelhantes.",
    s4Eyebrow: "Contexto e risco",
    s4Title: "Prioridades, contexto e risco de fornecedores",
    s5Eyebrow: "Tecnologia, dados e IA",
    s5Title: "Tecnologia, dados e inteligência artificial",
    s6Eyebrow: "Seu papel",
    s6Title: {
      cpo: "Desempenho da área de compras",
      cfo: "A visão de Finanças",
      ceo: "A visão da alta direção",
      outro: "Seu setor",
    },
    s6Note: {
      cpo: "Perguntas para líderes de compras, suprimentos e supply chain.",
      cfo: "Perguntas para CFOs e diretores financeiros.",
      ceo: "Perguntas para CEOs e diretores-gerais.",
      otro: "Algumas perguntas conforme o setor da sua empresa.",
    },
    s6Empty: "Para o seu cargo e setor não há perguntas adicionais nesta etapa. Pode continuar.",
    s7Eyebrow: "Projetos e talentos",
    s7Title: "Projetos, equipe e temas de interesse",
    doneEyebrow: "Pronto",
    doneTitle: "Obrigado por participar",
    doneLead: "Recebemos suas respostas. Próximos passos:",
    doneList: [
      "Encerramos a coleta em novembro de 2026.",
      "Enviaremos o relatório e seu benchmark antes da publicação.",
      "Se autorizado, convidaremos você para a apresentação dos resultados em janeiro de 2027.",
    ],
    talkEyebrow: "Eficiências",
    talkTitle: "Conversamos sobre como melhorar custos, caixa e compras?",
    talkLead: "Se quiser revisar oportunidades na sua empresa, escreva para nós ou siga a Xinergy.",
    contact: "Escrever para nós",
    whatsapp: "WhatsApp",
    linkedin: "Seguir no LinkedIn",
    website: "Conhecer a Xinergy",
    leftMore: "esquerda mais importante",
    rightMore: "direita mais importante",
    equal: "igual",
    ahpA: "A. Prioridades gerais",
    ahpB: "B. Eficiência e valor financeiro",
    ahpC: "C. Risco, sustentabilidade e controle",
    ahpD: "D. Transformação e capacidades",
    langLabel: "Idioma",
  },
  en: {
    steps: ["Welcome", "Registration", "Confidentiality", "Your company", "Context and risk", "Technology, data and AI", "Your role", "Projects and talent"],
    back: "Back",
    next: "Continue",
    start: "Start",
    submit: "Submit answers",
    sending: "Sending…",
    stepOf: (a: number, b: number) => `Step ${a} of ${b}`,
    required: "This answer is required.",
    email: "Enter a valid email.",
    pickMax: (n: number) => `Choose up to ${n}`,
    chosen: (a: number, b: number) => `${a} of ${b}`,
    optional: "(optional)",
    otherPh: "Please specify",
    fixErrors: "Please review the marked questions.",
    invalidUrl: "Enter a valid link.",
    sendErr: "We couldn't send your answers. Check your connection and try again.",
    saved: "Your progress is saved in this browser.",
    welcomeEyebrow: "LatAm Procurement Radar 2027",
    welcomeTitle: "Where is procurement heading in Latin America?",
    welcomeLead:
      "A pulse check with CEOs, CFOs and procurement leaders on cost, risk, technology and talent. It takes about 15 minutes, and answers are published only in aggregate.",
    benefits: [
      ["Early report", "Receive the results before they are published."],
      ["Your benchmark", "Compare your company with the average for your industry and country."],
      ["Results presentation", "Invitation to the meeting with procurement leaders, January 2027."],
    ],
    meta: ["15 minutes", "Confidential", "Aggregate results"],
    regEyebrow: "Registration",
    regTitle: "Tell us who you are",
    regNote: "We use this information to send you the report and tailor the questions to your role.",
    conEyebrow: "Confidentiality",
    conTitle: "How we look after your data",
    empEyebrow: "Your company",
    empTitle: "Company profile",
    empNote: "Approximate ranges are enough. They let us compare your company with similar ones.",
    s4Eyebrow: "Context and risk",
    s4Title: "Priorities, context and supplier risk",
    s5Eyebrow: "Technology, data and AI",
    s5Title: "Technology, data and artificial intelligence",
    s6Eyebrow: "Your role",
    s6Title: {
      cpo: "Procurement performance",
      cfo: "The finance view",
      ceo: "The leadership view",
      otro: "Your industry",
    },
    s6Note: {
      cpo: "Questions for procurement, sourcing and supply chain leaders.",
      cfo: "Questions for CFOs and finance managers.",
      ceo: "Questions for CEOs and general managers.",
      otro: "A few questions based on your company's industry.",
    },
    s6Empty: "There are no extra questions for your role and industry on this step. You can continue.",
    s7Eyebrow: "Projects and talent",
    s7Title: "Projects, team and topics of interest",
    doneEyebrow: "Done",
    doneTitle: "Thank you for taking part",
    doneLead: "We received your answers. Here is what happens next:",
    doneList: [
      "We close the survey in November 2026.",
      "We will send you the report and your benchmark before publication.",
      "If you agreed, we will invite you to the results presentation in January 2027.",
    ],
    talkEyebrow: "Efficiencies",
    talkTitle: "Shall we talk about improving cost, cash and procurement?",
    talkLead: "If you want to review opportunities in your company, write to us or follow Xinergy.",
    contact: "Write to us",
    whatsapp: "WhatsApp",
    linkedin: "Follow on LinkedIn",
    website: "Explore Xinergy",
    leftMore: "left side more important",
    rightMore: "right side more important",
    equal: "equal",
    ahpA: "A. Overall priorities",
    ahpB: "B. Efficiency and financial value",
    ahpC: "C. Risk, sustainability and control",
    ahpD: "D. Transformation and capabilities",
    langLabel: "Language",
  },
} as const;

export const consentSections: Record<Lang, { title: string; body: string }[]> = {
  es: [
    { title: "Quién es responsable", body: "Xinergy SpA es responsable del tratamiento de sus datos en el marco del Radar de Compras LatAm 2027." },
    {
      title: "Para qué usamos sus respuestas",
      body: "Para elaborar un estudio sobre prácticas de compras y abastecimiento en América Latina. Analizamos las respuestas solo en forma agregada: ningún resultado publicado permitirá identificar a una persona o a una empresa. Solo publicamos cifras de grupos con al menos 5 respuestas.",
    },
    {
      title: "Sus datos de contacto",
      body: "Los usamos para enviarle el informe y su benchmark y, si lo autoriza abajo, para invitarle a la presentación de resultados. No vendemos ni cedemos sus datos a terceros.",
    },
    { title: "Cuánto tiempo los guardamos", body: "Hasta 24 meses desde el cierre del estudio. Después los eliminamos o los anonimizamos." },
    {
      title: "Sus derechos",
      body: `Puede pedir acceso, rectificación, eliminación u oposición escribiendo a ${SURVEY_CONTACT}. Aplicamos la Ley 19.628 y la Ley 21.719 de Chile, la LGPD de Brasil y la normativa de protección de datos de su país.`,
    },
    { title: "Participación voluntaria", body: "Puede dejar preguntas sin responder cuando se indica que son opcionales, o abandonar la encuesta en cualquier momento." },
  ],
  en: [
    { title: "Who is responsible", body: "Xinergy SpA is responsible for processing your data for the LatAm Procurement Radar 2027." },
    {
      title: "What we use your answers for",
      body: "To prepare a study on procurement and supply practices in Latin America. We analyze answers only in aggregate: no published result will identify a person or a company. We only publish figures for groups with at least 5 responses.",
    },
    {
      title: "Your contact details",
      body: "We use them to send you the report and your benchmark and, if you agree below, to invite you to the results presentation. We do not sell or share your data with third parties.",
    },
    { title: "How long we keep them", body: "Up to 24 months after the study closes. After that, we delete or anonymize them." },
    {
      title: "Your rights",
      body: `You can request access, correction, deletion or objection by writing to ${SURVEY_CONTACT}. We apply Chile's Laws 19.628 and 21.719, Brazil's LGPD, and the data protection rules of your country.`,
    },
    { title: "Voluntary participation", body: "You may skip questions marked as optional, or leave the survey at any time." },
  ],
  pt: [
    { title: "Quem é responsável", body: "A Xinergy SpA é a controladora dos seus dados no âmbito do Radar de Compras LatAm 2027." },
    {
      title: "Para que usamos suas respostas",
      body: "Para elaborar um estudo sobre práticas de compras e suprimentos na América Latina. As respostas são analisadas apenas de forma agregada: nenhum resultado publicado permitirá identificar uma pessoa ou uma empresa. Só publicamos números de grupos com pelo menos 5 respostas.",
    },
    {
      title: "Seus dados de contato",
      body: "Usamos para enviar o relatório e seu benchmark e, se você autorizar abaixo, para convidá-lo para a apresentação dos resultados. Não vendemos nem compartilhamos seus dados com terceiros.",
    },
    { title: "Por quanto tempo guardamos", body: "Até 24 meses após o encerramento do estudo. Depois disso, os dados são excluídos ou anonimizados." },
    {
      title: "Seus direitos",
      body: `Você pode solicitar acesso, correção, exclusão ou oposição escrevendo para ${SURVEY_CONTACT}. Aplicamos a LGPD (Lei 13.709/2018) e a legislação de proteção de dados do seu país.`,
    },
    { title: "Participação voluntária", body: "Você pode deixar sem resposta as perguntas indicadas como opcionais ou sair da pesquisa a qualquer momento." },
  ],
};

export const CONSENTS = [
  { id: "c_datos", req: true, label: L("Acepto el tratamiento de mis datos según lo descrito.", "Aceito o tratamento dos meus dados conforme descrito.") },
  { id: "c_agregado", req: true, label: L("Autorizo el uso de mis respuestas en forma agregada y anónima.", "Autorizo o uso das minhas respostas de forma agregada e anônima.") },
  { id: "c_informe", req: false, label: L("Quiero recibir el informe y mi benchmark.", "Quero receber o relatório e meu benchmark.") },
  {
    id: "c_contacto",
    req: false,
    label: L(
      "Acepto que Xinergy me invite a la presentación de resultados y me contacte sobre temas relacionados.",
      "Aceito que a Xinergy me convide para a apresentação dos resultados e entre em contato sobre temas relacionados.",
    ),
  },
];

export const SETS = {
  acuerdo: [L("Muy en desacuerdo", "Discordo totalmente"), L("En desacuerdo", "Discordo"), L("Ni de acuerdo ni en desacuerdo", "Nem concordo nem discordo"), L("De acuerdo", "Concordo"), L("Muy de acuerdo", "Concordo totalmente")],
  impacto: [L("Ninguno", "Nenhum"), L("Bajo", "Baixo"), L("Moderado", "Moderado"), L("Alto", "Alto"), L("Muy alto", "Muito alto")],
  satisf: [L("Muy insatisfecho", "Muito insatisfeito"), L("Insatisfecho", "Insatisfeito"), L("Neutral", "Neutro"), L("Satisfecho", "Satisfeito"), L("Muy satisfecho", "Muito satisfeito")],
  aporte: [L("Nada", "Nada"), L("Poco", "Pouco"), L("Moderado", "Moderado"), L("Bastante", "Bastante"), L("Mucho", "Muito")],
  preparacion: [L("Nada preparada", "Nada preparada"), L("Poco preparada", "Pouco preparada"), L("Medianamente", "Medianamente"), L("Bien preparada", "Bem preparada"), L("Totalmente preparada", "Totalmente preparada")],
} as const;

export type SetName = keyof typeof SETS;

const RANGES_PCT = [o("<10", "Menos de 10%"), o("10-30", "10–30%"), o("30-50", "30–50%"), o("50-70", "50–70%"), o(">70", "Más de 70%", "Mais de 70%"), o("ns", "No sé", "Não sei")];

type QBase = {
  id: string;
  label: Copy;
  help?: Copy;
  optional?: boolean;
  full?: boolean;
  roles?: string[];
  ind?: string[];
  auto?: string;
};

export type Question =
  | (QBase & { type: "text" | "email" | "tel" | "url" })
  | (QBase & { type: "select" | "single"; options: Choice[] })
  | (QBase & { type: "multi"; options: Choice[]; max?: number; other?: boolean })
  | (QBase & { type: "textarea" })
  | (QBase & { type: "scale"; anchors?: Copy[]; set?: SetName })
  | (QBase & { type: "matrix"; set: SetName; rows: Choice[] })
  | (QBase & { type: "ahp" });

export const AHP = {
  macros: [
    { id: "fin", label: L("Eficiencia y valor financiero", "Eficiência e valor financeiro"), children: ["costos", "caja"] },
    { id: "res", label: L("Riesgo, sostenibilidad y control", "Risco, sustentabilidade e controle"), children: ["riesgo", "control", "esg"] },
    { id: "trans", label: L("Transformación y capacidades", "Transformação e capacidades"), children: ["digital", "innovacion", "talento"] },
  ],
  criteria: {
    costos: L("Reducir costos", "Reduzir custos"),
    caja: L("Liberar caja y capital de trabajo", "Liberar caixa e capital de giro"),
    riesgo: L("Gestionar riesgo y continuidad", "Gerenciar risco e continuidade"),
    control: L("Cumplimiento y control", "Compliance e controle"),
    esg: L("Sostenibilidad y ESG", "Sustentabilidade e ESG"),
    digital: L("Digitalización e IA", "Digitalização e IA"),
    innovacion: L("Innovación con proveedores", "Inovação com fornecedores"),
    talento: L("Talento y capacidades del equipo", "Talentos e capacidades da equipe"),
  } as Record<string, Copy>,
  pairs: [
    { id: "macro_fin_res", group: "macro", a: "fin", b: "res" },
    { id: "macro_fin_trans", group: "macro", a: "fin", b: "trans" },
    { id: "macro_res_trans", group: "macro", a: "res", b: "trans" },
    { id: "fin_costos_caja", group: "fin", a: "costos", b: "caja" },
    { id: "res_riesgo_control", group: "res", a: "riesgo", b: "control" },
    { id: "res_riesgo_esg", group: "res", a: "riesgo", b: "esg" },
    { id: "res_control_esg", group: "res", a: "control", b: "esg" },
    { id: "trans_digital_innov", group: "trans", a: "digital", b: "innovacion" },
    { id: "trans_digital_talento", group: "trans", a: "digital", b: "talento" },
    { id: "trans_innov_talento", group: "trans", a: "innovacion", b: "talento" },
  ],
};

export const AHP_SCALE = [
  { token: "9", n: "9", es: "Extrema izquierda", en: "Extreme left", pt: "Extrema esquerda" },
  { token: "7", n: "7", es: "Muy fuerte izquierda", en: "Very strong left", pt: "Muito forte esquerda" },
  { token: "5", n: "5", es: "Fuerte izquierda", en: "Strong left", pt: "Forte esquerda" },
  { token: "3", n: "3", es: "Moderada izquierda", en: "Moderate left", pt: "Moderada esquerda" },
  { token: "1", n: "1", es: "Igual importancia", en: "Equal importance", pt: "Igual importância" },
  { token: "1/3", n: "3", es: "Moderada derecha", en: "Moderate right", pt: "Moderada direita" },
  { token: "1/5", n: "5", es: "Fuerte derecha", en: "Strong right", pt: "Forte direita" },
  { token: "1/7", n: "7", es: "Muy fuerte derecha", en: "Very strong right", pt: "Muito forte direita" },
  { token: "1/9", n: "9", es: "Extrema derecha", en: "Extreme right", pt: "Extrema direita" },
];

export const REG: Question[] = [
  { id: "nombre", type: "text", label: L("Nombre", "Nome"), auto: "given-name" },
  { id: "apellido", type: "text", label: L("Apellido", "Sobrenome"), auto: "family-name" },
  {
    id: "rol",
    type: "select",
    full: true,
    label: L("¿Qué cargo describe mejor su rol?", "Qual cargo descreve melhor sua função?"),
    options: [
      o("ceo", "CEO / Gerente General", "CEO / Diretor-geral"),
      o("cfo", "CFO / Gerente de Finanzas", "CFO / Diretor financeiro"),
      o("cpo", "CPO / Gerente de Compras o Abastecimiento", "CPO / Diretor de Compras ou Suprimentos"),
      o("scm", "Gerente de Supply Chain u Operaciones", "Diretor de Supply Chain ou Operações"),
      o("otro", "Otro cargo ejecutivo", "Outro cargo executivo"),
    ],
  },
  { id: "cargo", type: "text", label: L("Título exacto del cargo", "Título exato do cargo"), auto: "organization-title" },
  { id: "empresa", type: "text", label: L("Empresa", "Empresa"), auto: "organization" },
  {
    id: "pais",
    type: "select",
    label: L("País donde trabaja", "País onde trabalha"),
    options: [o("CL", "Chile"), o("MX", "México"), o("CO", "Colombia", "Colômbia"), o("PE", "Perú", "Peru"), o("BR", "Brasil"), o("AR", "Argentina"), o("otro", "Otro", "Outro")],
  },
  {
    id: "antiguedad",
    type: "select",
    label: L("Años en el cargo actual", "Anos no cargo atual"),
    options: [o("<1", "Menos de 1"), o("1-3", "1–3"), o("3-5", "3–5"), o(">5", "Más de 5", "Mais de 5")],
  },
  { id: "email", type: "email", label: L("Correo corporativo", "E-mail corporativo"), auto: "email" },
  { id: "telefono", type: "tel", optional: true, label: L("Teléfono", "Telefone"), auto: "tel" },
  { id: "linkedin", type: "url", optional: true, full: true, label: L("Perfil de LinkedIn", "Perfil do LinkedIn") },
];

export const EMP: Question[] = [
  {
    id: "rubro",
    type: "select",
    label: L("Rubro principal", "Setor principal"),
    options: [
      o("mineria", "Minería", "Mineração"),
      o("banca", "Banca y servicios financieros", "Bancos e serviços financeiros"),
      o("seguros", "Seguros"),
      o("retail", "Retail y consumo masivo", "Varejo e bens de consumo"),
      o("forestal", "Forestal, papel y celulosa", "Florestal, papel e celulose"),
      o("energia", "Energía y utilities", "Energia e utilities"),
      o("construccion", "Construcción e inmobiliaria", "Construção e imobiliário"),
      o("manufactura", "Manufactura e industria", "Manufatura e indústria"),
      o("agro", "Agroindustria y alimentos", "Agronegócio e alimentos"),
      o("salud", "Salud y farmacéutica", "Saúde e farmacêutica"),
      o("telecom", "Telecomunicaciones y tecnología", "Telecomunicações e tecnologia"),
      o("logistica", "Transporte y logística", "Transporte e logística"),
      o("publico", "Sector público", "Setor público"),
      o("otro", "Otro", "Outro"),
    ],
  },
  {
    id: "propiedad",
    type: "select",
    label: L("Tipo de propiedad", "Tipo de controle"),
    options: [
      o("familiar", "Familiar o privada local", "Familiar ou privada local"),
      o("bolsa", "Abierta en bolsa", "Capital aberto"),
      o("multinacional", "Filial de multinacional", "Subsidiária de multinacional"),
      o("pe", "Fondo de private equity", "Fundo de private equity"),
      o("estatal", "Estatal o pública", "Estatal ou pública"),
    ],
  },
  {
    id: "ventas",
    type: "select",
    label: L("Ventas anuales (USD)", "Faturamento anual (USD)"),
    options: [
      o("<50M", "Menos de 50 millones", "Menos de 50 milhões"),
      o("50-250M", "50–250 millones", "50–250 milhões"),
      o("250M-1B", "250 millones – 1.000 millones", "250 milhões – 1 bilhão"),
      o("1-5B", "1.000 – 5.000 millones", "1 – 5 bilhões"),
      o(">5B", "Más de 5.000 millones", "Mais de 5 bilhões"),
      o("nd", "Prefiero no decir", "Prefiro não dizer"),
    ],
  },
  {
    id: "spend",
    type: "select",
    label: L("Gasto anual con proveedores (spend, USD)", "Gasto anual com fornecedores (spend, USD)"),
    options: [
      o("<20M", "Menos de 20 millones", "Menos de 20 milhões"),
      o("20-100M", "20–100 millones", "20–100 milhões"),
      o("100-500M", "100–500 millones", "100–500 milhões"),
      o("500M-2B", "500 millones – 2.000 millones", "500 milhões – 2 bilhões"),
      o(">2B", "Más de 2.000 millones", "Mais de 2 bilhões"),
      o("ns", "No sé", "Não sei"),
    ],
  },
  {
    id: "empleados",
    type: "select",
    label: L("Número de empleados", "Número de funcionários"),
    options: [o("<200", "Menos de 200"), o("200-1000", "200–1.000"), o("1000-5000", "1.000–5.000"), o(">5000", "Más de 5.000", "Mais de 5.000")],
  },
  {
    id: "proveedores",
    type: "select",
    label: L("Proveedores activos", "Fornecedores ativos"),
    options: [o("<500", "Menos de 500"), o("500-2000", "500–2.000"), o("2000-10000", "2.000–10.000"), o(">10000", "Más de 10.000", "Mais de 10.000"), o("ns", "No sé", "Não sei")],
  },
  { id: "gestionado", type: "select", label: L("% del gasto que gestiona el área de compras", "% do gasto gerido pela área de compras"), options: RANGES_PCT },
  {
    id: "estructura",
    type: "select",
    label: L("Modelo de compras", "Modelo de compras"),
    options: [o("centralizado", "Centralizado"), o("descentralizado", "Descentralizado"), o("hibrido", "Híbrido (centro de excelencia + unidades)", "Híbrido (centro de excelência + unidades)")],
  },
  {
    id: "equipo",
    type: "select",
    label: L("Personas en el equipo de compras", "Pessoas na equipe de compras"),
    options: [o("<5", "Menos de 5"), o("5-15", "5–15"), o("15-50", "15–50"), o(">50", "Más de 50", "Mais de 50"), o("ns", "No sé", "Não sei")],
  },
  {
    id: "paises",
    type: "multi",
    full: true,
    label: L("Países donde opera la empresa", "Países onde a empresa opera"),
    options: [o("CL", "Chile"), o("MX", "México"), o("CO", "Colombia", "Colômbia"), o("PE", "Perú", "Peru"), o("BR", "Brasil"), o("AR", "Argentina"), o("otros", "Otros", "Outros")],
  },
];

export const S4: Question[] = [
  {
    id: "prioridades_ahp",
    type: "ahp",
    label: L("¿Cómo se comparan entre sí las prioridades de compras para su empresa en 2027?", "Como as prioridades de compras da sua empresa para 2027 se comparam entre si?"),
    help: L(
      "Compare primero 3 dimensiones generales y luego las prioridades dentro de cada una. Son 10 comparaciones breves; 1 significa igual importancia y 3–9 indican una preferencia creciente hacia uno de los lados.",
      "Compare primeiro 3 dimensões gerais e depois as prioridades dentro de cada uma. São 10 comparações breves; 1 significa igual importância e 3–9 indicam preferência crescente para um dos lados.",
    ),
  },
  {
    id: "contingencia",
    type: "matrix",
    set: "impacto",
    label: L("¿Cuánto impactarán estos factores su abastecimiento en los próximos 12 meses?", "Quanto estes fatores impactarão seus suprimentos nos próximos 12 meses?"),
    rows: [
      o("tc", "Tipo de cambio", "Câmbio"),
      o("inflacion", "Inflación de insumos y servicios", "Inflação de insumos e serviços"),
      o("aranceles", "Aranceles y tensiones comerciales (EE.UU., China)", "Tarifas e tensões comerciais (EUA, China)"),
      o("politica", "Cambios políticos y regulatorios locales", "Mudanças políticas e regulatórias locais"),
      o("logistica", "Disrupciones logísticas (puertos, fletes)", "Disrupções logísticas (portos, fretes)"),
      o("laboral", "Conflictos laborales y paros", "Conflitos trabalhistas e greves"),
      o("clima", "Clima y eventos naturales", "Clima e eventos naturais"),
      o("ciber", "Ciberseguridad de proveedores", "Cibersegurança de fornecedores"),
    ],
  },
  {
    id: "cadena",
    type: "multi",
    label: L("En los últimos 12 meses, ¿qué cambios hicieron en su cadena de suministro?", "Nos últimos 12 meses, que mudanças fizeram na cadeia de suprimentos?"),
    options: [
      o("dual", "Agregamos proveedores alternativos (dual sourcing)", "Adicionamos fornecedores alternativos (dual sourcing)"),
      o("nearshoring", "Trajimos proveedores más cerca (nearshoring)", "Aproximamos fornecedores (nearshoring)"),
      o("stock", "Aumentamos inventarios de seguridad", "Aumentamos estoques de segurança"),
      o("contratos", "Renegociamos contratos por inflación o tipo de cambio", "Renegociamos contratos por inflação ou câmbio"),
      o("riesgo", "Implementamos monitoreo de riesgo de proveedores", "Implementamos monitoramento de risco de fornecedores"),
      o("ninguno", "Ningún cambio relevante", "Nenhuma mudança relevante"),
    ],
  },
  {
    id: "r_madurez",
    type: "matrix",
    set: "acuerdo",
    label: L("¿Qué tan de acuerdo está con estas afirmaciones sobre riesgo de proveedores?", "Quanto você concorda com estas afirmações sobre risco de fornecedores?"),
    rows: [
      o("criticos", "Tenemos identificados y clasificados a nuestros proveedores críticos", "Temos nossos fornecedores críticos identificados e classificados"),
      o("evaluacion", "Evaluamos periódicamente su riesgo financiero y operacional", "Avaliamos periodicamente seu risco financeiro e operacional"),
      o("contingencia", "Tenemos planes de contingencia si un proveedor crítico falla", "Temos planos de contingência se um fornecedor crítico falhar"),
      o("alternativas", "Tenemos alternativas para los proveedores únicos", "Temos alternativas para os fornecedores únicos"),
      o("esg", "Controlamos el cumplimiento laboral, ambiental y legal de los proveedores", "Controlamos o compliance trabalhista, ambiental e legal dos fornecedores"),
    ],
  },
  {
    id: "r_single",
    type: "single",
    label: L("¿Qué parte de su gasto depende de un proveedor único, sin alternativa inmediata?", "Que parte do seu gasto depende de um fornecedor único, sem alternativa imediata?"),
    options: [o("<10", "Menos de 10%"), o("10-25", "10–25%"), o("25-50", "25–50%"), o(">50", "Más de 50%", "Mais de 50%"), o("ns", "No lo sabemos", "Não sabemos")],
  },
  {
    id: "r_incidente",
    type: "multi",
    label: L("En los últimos 12 meses, ¿sufrió alguno de estos incidentes con proveedores?", "Nos últimos 12 meses, sofreu algum destes incidentes com fornecedores?"),
    options: [
      o("quiebra", "Quiebra o insolvencia de un proveedor", "Falência ou insolvência de um fornecedor"),
      o("incumplimiento", "Incumplimiento grave de entrega", "Descumprimento grave de entrega"),
      o("paralizacion", "Paralización de operaciones por un proveedor", "Paralisação de operações por um fornecedor"),
      o("compliance", "Problema legal, laboral o de compliance", "Problema legal, trabalhista ou de compliance"),
      o("ciber", "Incidente de ciberseguridad", "Incidente de cibersegurança"),
      o("ninguno", "Ninguno", "Nenhum"),
    ],
  },
];

export const S5: Question[] = [
  {
    id: "ia_nivel",
    type: "scale",
    label: L("¿En qué etapa está el uso de IA en su área de compras?", "Em que estágio está o uso de IA na sua área de compras?"),
    anchors: [
      L("No la usamos", "Não usamos"),
      L("Uso individual (ChatGPT, Copilot)", "Uso individual (ChatGPT, Copilot)"),
      L("Pilotos formales", "Pilotos formais"),
      L("En producción en algunos procesos", "Em produção em alguns processos"),
      L("Escalada en la mayoría de los procesos", "Escalada na maioria dos processos"),
    ],
  },
  {
    id: "ia_usos",
    type: "multi",
    label: L("¿Qué usos de IA tienen hoy o planean en los próximos 12 meses?", "Que usos de IA vocês têm hoje ou planejam nos próximos 12 meses?"),
    options: [
      o("spend", "Análisis y clasificación de gasto", "Análise e classificação de gastos"),
      o("negociacion", "Preparación y apoyo a negociaciones", "Preparação e apoio a negociações"),
      o("contratos", "Revisión y gestión de contratos", "Revisão e gestão de contratos"),
      o("agentes", "Agentes que compran de forma autónoma (spot, cola larga)", "Agentes que compram de forma autônoma (spot, cauda longa)"),
      o("riesgo", "Monitoreo de riesgo de proveedores", "Monitoramento de risco de fornecedores"),
      o("p2p", "Conciliación de facturas y P2P", "Conciliação de faturas e P2P"),
      o("demanda", "Pronóstico de demanda e inventarios", "Previsão de demanda e estoques"),
      o("ninguno", "Ninguno por ahora", "Nenhum por enquanto"),
    ],
  },
  {
    id: "ia_barreras",
    type: "multi",
    max: 2,
    label: L("¿Cuáles son las 2 principales barreras para adoptar IA?", "Quais são as 2 principais barreiras para adotar IA?"),
    options: [
      o("datos", "Calidad y disponibilidad de datos", "Qualidade e disponibilidade de dados"),
      o("talento", "Falta de talento o capacidades", "Falta de talentos ou capacidades"),
      o("presupuesto", "Presupuesto", "Orçamento"),
      o("seguridad", "Seguridad y confidencialidad", "Segurança e confidencialidade"),
      o("roi", "ROI poco claro", "ROI pouco claro"),
      o("sistemas", "Integración con sistemas actuales", "Integração com sistemas atuais"),
      o("cultura", "Resistencia al cambio", "Resistência à mudança"),
    ],
  },
  {
    id: "plataformas",
    type: "multi",
    other: true,
    label: L("¿Qué plataformas tecnológicas usan en compras?", "Quais plataformas tecnológicas vocês usam em compras?"),
    help: L("Marque todas las que apliquen.", "Marque todas as que se aplicam."),
    options: [
      o("sap_erp", "SAP ERP (S/4HANA, ECC)"),
      o("ariba", "SAP Ariba"),
      o("coupa", "Coupa"),
      o("gep", "GEP SMART"),
      o("oracle", "Oracle"),
      o("jaggaer", "Jaggaer"),
      o("ivalua", "Ivalua"),
      o("zycus", "Zycus"),
      o("wherex", "Wherex"),
      o("nimbi", "Nimbi"),
      o("me", "Mercado Eletrônico"),
      o("propio", "Desarrollo propio", "Desenvolvimento próprio"),
      o("excel", "Principalmente Excel y correo", "Principalmente Excel e e-mail"),
      o("otro", "Otra", "Outra"),
    ],
  },
  { id: "tec_satisf", type: "scale", set: "satisf", label: L("¿Qué tan satisfecho está con su tecnología de compras actual?", "Quão satisfeito você está com sua tecnologia de compras atual?") },
  {
    id: "tec_plazo",
    type: "single",
    label: L("¿En qué plazo planea evaluar o incorporar nuevas tecnologías de compras?", "Em que prazo pretende avaliar ou incorporar novas tecnologias de compras?"),
    options: [
      o("ya", "Estamos evaluando ahora", "Estamos avaliando agora"),
      o("<6", "En los próximos 6 meses", "Nos próximos 6 meses"),
      o("6-12", "En 6 a 12 meses", "Em 6 a 12 meses"),
      o("12-24", "En 12 a 24 meses", "Em 12 a 24 meses"),
      o("no", "No está en los planes", "Não está nos planos"),
    ],
  },
  {
    id: "datos_dueno",
    type: "scale",
    label: L("¿Cómo se gobiernan los datos maestros de proveedores y materiales?", "Como são governados os dados mestres de fornecedores e materiais?"),
    anchors: [
      L("Sin dueño: cada área mantiene los suyos", "Sem dono: cada área mantém os seus"),
      L("TI los mantiene, sin reglas de negocio", "TI mantém, sem regras de negócio"),
      L("Hay reglas, pero no un dueño claro", "Há regras, mas sem dono claro"),
      L("Dueño definido y políticas", "Dono definido e políticas"),
      L("Gobierno de datos con control de calidad periódico", "Governança de dados com controle de qualidade periódico"),
    ],
  },
  {
    id: "datos_confianza",
    type: "single",
    label: L(
      "Si hoy le piden cuánto gastó el año pasado con sus 20 principales proveedores, ¿cuánto demora en responder con cifras confiables?",
      "Se hoje pedirem quanto vocês gastaram no ano passado com os 20 principais fornecedores, quanto tempo leva para responder com números confiáveis?",
    ),
    options: [
      o("min", "Minutos: está en un tablero", "Minutos: está em um painel"),
      o("dia", "Menos de un día", "Menos de um dia"),
      o("semana", "Una semana", "Uma semana"),
      o("mas", "Más de una semana", "Mais de uma semana"),
      o("no", "No podríamos con certeza", "Não conseguiríamos com certeza"),
    ],
  },
  {
    id: "ia_rol",
    type: "single",
    label: L("¿Tiene un rol o responsable dedicado a IA y rediseño de procesos en compras?", "Existe uma função ou responsável dedicado a IA e redesenho de processos em compras?"),
    options: [
      o("dedicado", "Sí, un rol dedicado", "Sim, uma função dedicada"),
      o("parcial", "Sí, como parte de otro cargo", "Sim, como parte de outro cargo"),
      o("puedo", "No, pero tengo autonomía para crearlo", "Não, mas tenho autonomia para criá-lo"),
      o("no", "No, y no depende de mí", "Não, e não depende de mim"),
    ],
  },
  {
    id: "ia_impacto",
    type: "scale",
    label: L("En los próximos 3 años, ¿la IA le ayudará más a reducir costos o a vender más?", "Nos próximos 3 anos, a IA ajudará mais a reduzir custos ou a vender mais?"),
    anchors: [
      L("Solo a reducir costos", "Só a reduzir custos"),
      L("Más a reducir costos", "Mais a reduzir custos"),
      L("A ambos por igual", "Aos dois igualmente"),
      L("Más a vender", "Mais a vender"),
      L("Solo a vender más", "Só a vender mais"),
    ],
  },
];

export const S6: Question[] = [
  {
    id: "p_ahorro",
    roles: ["cpo"],
    type: "single",
    label: L("Ahorro promedio logrado en el último año, como % del gasto gestionado", "Economia média obtida no último ano, como % do gasto gerido"),
    options: [o("<2", "Menos de 2%"), o("2-5", "2–5%"), o("5-8", "5–8%"), o("8-12", "8–12%"), o(">12", "Más de 12%", "Mais de 12%"), o("ns", "No medimos", "Não medimos")],
  },
  {
    id: "p_fuga",
    roles: ["cpo"],
    type: "single",
    label: L("¿Qué parte del ahorro negociado llega efectivamente al resultado (P&L)?", "Que parte da economia negociada chega de fato ao resultado (DRE)?"),
    options: [o("<25", "Menos de 25%"), o("25-50", "25–50%"), o("50-75", "50–75%"), o(">75", "Más de 75%", "Mais de 75%"), o("ns", "No lo medimos", "Não medimos")],
  },
  {
    id: "p_acuerdo",
    roles: ["cpo"],
    type: "matrix",
    set: "acuerdo",
    label: L("¿Qué tan de acuerdo está con estas afirmaciones sobre su área?", "Quanto você concorda com estas afirmações sobre sua área?"),
    rows: [
      o("valida", "Finanzas valida nuestros ahorros contra una línea base acordada", "Finanças valida nossas economias contra uma linha de base acordada"),
      o("eerr", "Puedo mostrar dónde aparecen los ahorros en el estado de resultados o el balance", "Consigo mostrar onde as economias aparecem na DRE ou no balanço"),
      o("ppto", "Los ahorros se descuentan del presupuesto del área usuaria", "As economias são descontadas do orçamento da área usuária"),
      o("procesos", "Hemos rediseñado nuestros procesos de compras en los últimos 2 años", "Redesenhamos nossos processos de compras nos últimos 2 anos"),
      o("socio", "La dirección ve a compras como un socio estratégico", "A diretoria vê compras como um parceiro estratégico"),
    ],
  },
  {
    id: "p_kpi",
    roles: ["cpo"],
    type: "multi",
    max: 3,
    label: L("¿Con qué indicadores se evalúa al área de compras?", "Com quais indicadores a área de compras é avaliada?"),
    help: L("Elija los 3 principales.", "Escolha os 3 principais."),
    options: [
      o("ahorro_ppto", "Ahorro vs. presupuesto", "Economia vs. orçamento"),
      o("ahorro_precio", "Ahorro vs. último precio", "Economia vs. último preço"),
      o("ebitda", "Impacto en EBITDA"),
      o("caja", "Capital de trabajo y caja", "Capital de giro e caixa"),
      o("cumplimiento", "Cumplimiento de políticas", "Compliance com políticas"),
      o("servicio", "Nivel de servicio y plazos", "Nível de serviço e prazos"),
      o("satisfaccion", "Satisfacción de clientes internos", "Satisfação de clientes internos"),
      o("esg", "Metas ESG"),
    ],
  },
  {
    id: "p_presupuesto",
    roles: ["cpo"],
    type: "single",
    label: L("¿Cómo evoluciona el presupuesto del área de compras para 2027?", "Como evolui o orçamento da área de compras para 2027?"),
    options: [o("baja", "Baja", "Diminui"), o("igual", "Se mantiene", "Mantém-se"), o("sube10", "Sube hasta 10%", "Aumenta até 10%"), o("sube+", "Sube más de 10%", "Aumenta mais de 10%")],
  },
  {
    id: "p_dpo",
    roles: ["cpo"],
    type: "single",
    label: L("Plazo promedio de pago a proveedores", "Prazo médio de pagamento a fornecedores"),
    options: [o("<30", "Menos de 30 días", "Menos de 30 dias"), o("30-45", "30–45 días", "30–45 dias"), o("45-60", "45–60 días", "45–60 dias"), o("60-90", "60–90 días", "60–90 dias"), o(">90", "Más de 90 días", "Mais de 90 dias")],
  },
  {
    id: "f_rol",
    roles: ["cfo"],
    type: "scale",
    label: L("¿Cómo describe hoy el rol del área de compras en su empresa?", "Como você descreve hoje o papel da área de compras na sua empresa?"),
    anchors: [
      L("Procesa pedidos", "Processa pedidos"),
      L("Negocia precios", "Negocia preços"),
      L("Gestiona el costo total", "Gerencia o custo total"),
      L("Socio en costos, caja y riesgo", "Parceiro em custos, caixa e risco"),
      L("Participa en las decisiones estratégicas", "Participa das decisões estratégicas"),
    ],
  },
  {
    id: "f_valor",
    roles: ["cfo"],
    type: "matrix",
    set: "aporte",
    label: L("¿Cuánto aporta hoy compras en cada dimensión?", "Quanto compras contribui hoje em cada dimensão?"),
    rows: [
      o("costos", "Reducción de costos", "Redução de custos"),
      o("caja", "Caja y capital de trabajo", "Caixa e capital de giro"),
      o("riesgo", "Gestión de riesgo", "Gestão de risco"),
      o("innovacion", "Innovación", "Inovação"),
      o("control", "Control y cumplimiento", "Controle e compliance"),
    ],
  },
  {
    id: "f_ahorro",
    roles: ["cfo"],
    type: "single",
    label: L("¿Qué ahorro espera de compras para 2027, como % del gasto?", "Que economia você espera de compras para 2027, como % do gasto?"),
    options: [o("<2", "Menos de 2%"), o("2-5", "2–5%"), o("5-8", "5–8%"), o(">8", "Más de 8%", "Mais de 8%"), o("ns", "No hay meta definida", "Não há meta definida")],
  },
  {
    id: "f_caja",
    roles: ["cfo"],
    type: "multi",
    label: L("¿Qué palancas de capital de trabajo usan o evalúan?", "Que alavancas de capital de giro vocês usam ou avaliam?"),
    options: [
      o("plazos", "Extender plazos de pago", "Estender prazos de pagamento"),
      o("scf", "Confirming / supply chain finance"),
      o("factoring", "Factoring", "Factoring / antecipação de recebíveis"),
      o("inventario", "Reducir inventarios", "Reduzir estoques"),
      o("dinamico", "Descuento por pronto pago", "Desconto por pagamento antecipado"),
      o("ninguna", "Ninguna por ahora", "Nenhuma por enquanto"),
    ],
  },
  {
    id: "f_acuerdo",
    roles: ["cfo"],
    type: "matrix",
    set: "acuerdo",
    label: L("¿Qué tan de acuerdo está con estas afirmaciones?", "Quanto você concorda com estas afirmações?"),
    rows: [
      o("eerr", "Los ahorros que reporta compras se ven en el estado de resultados", "As economias reportadas por compras aparecem na DRE"),
      o("valida", "Finanzas valida los ahorros contra una línea base", "Finanças valida as economias contra uma linha de base"),
      o("decisiones", "Compras participa en las decisiones de presupuesto e inversión", "Compras participa das decisões de orçamento e investimento"),
      o("talento", "El área de compras tiene el talento que necesita", "A área de compras tem os talentos de que precisa"),
    ],
  },
  { id: "c_conforme", roles: ["cfo", "ceo"], type: "scale", set: "satisf", label: L("¿Qué tan conforme está con los resultados del área de compras en el último año?", "Quão satisfeito você está com os resultados da área de compras no último ano?") },
  {
    id: "c_programa",
    roles: ["cfo", "ceo"],
    type: "single",
    label: L("¿Existe hoy un programa formal de reducción de costos en la empresa?", "Existe hoje um programa formal de redução de custos na empresa?"),
    options: [
      o("corp", "Sí, corporativo y con metas por área", "Sim, corporativo e com metas por área"),
      o("area", "Sí, solo en algunas áreas", "Sim, apenas em algumas áreas"),
      o("diseno", "En diseño", "Em desenho"),
      o("no", "No", "Não"),
    ],
  },
  {
    id: "c_energia",
    roles: ["cfo", "ceo"],
    type: "scale",
    label: L("¿Dónde pone hoy la dirección su energía: en reducir costos o en vender más?", "Onde a diretoria coloca hoje sua energia: em reduzir custos ou em vender mais?"),
    anchors: [L("Casi todo en costos", "Quase tudo em custos"), L("Más en costos", "Mais em custos"), L("Equilibrado", "Equilibrado"), L("Más en ventas", "Mais em vendas"), L("Casi todo en ventas", "Quase tudo em vendas")],
  },
  {
    id: "f_presupuesto",
    roles: ["cfo", "ceo"],
    type: "single",
    label: L("Para 2027, el presupuesto para iniciativas de eficiencia (consultoría, tecnología, tercerización)…", "Para 2027, o orçamento para iniciativas de eficiência (consultoria, tecnologia, terceirização)…"),
    options: [o("baja", "Baja", "Diminui"), o("igual", "Se mantiene", "Mantém-se"), o("sube", "Sube", "Aumenta"), o("ns", "No está definido", "Não está definido")],
  },
  {
    id: "f_modelo",
    roles: ["cfo", "ceo"],
    type: "single",
    label: L("¿Qué modelo de contratación prefiere para proyectos de eficiencia?", "Que modelo de contratação você prefere para projetos de eficiência?"),
    options: [
      o("fijo", "Honorarios fijos", "Honorários fixos"),
      o("variable", "Variable según resultados", "Variável conforme resultados"),
      o("mixto", "Mixto: fijo + variable", "Misto: fixo + variável"),
      o("interno", "Preferimos hacerlo internamente", "Preferimos fazer internamente"),
    ],
  },
  {
    id: "e_agenda",
    roles: ["ceo"],
    type: "single",
    label: L("¿Con qué frecuencia se discuten compras y abastecimiento en el directorio?", "Com que frequência compras e suprimentos são discutidos no conselho?"),
    options: [o("nunca", "Casi nunca", "Quase nunca"), o("anual", "Una vez al año", "Uma vez por ano"), o("trimestral", "Trimestralmente"), o("mensual", "Mensualmente o más", "Mensalmente ou mais")],
  },
  {
    id: "e_expectativa",
    roles: ["ceo"],
    type: "single",
    label: L("¿Qué espera principalmente del área de compras?", "O que você espera principalmente da área de compras?"),
    options: [
      o("costos", "Bajar costos", "Reduzir custos"),
      o("caja", "Mejorar la caja", "Melhorar o caixa"),
      o("continuidad", "Asegurar continuidad operacional", "Garantir continuidade operacional"),
      o("crecimiento", "Habilitar crecimiento e innovación", "Viabilizar crescimento e inovação"),
      o("control", "Control y transparencia", "Controle e transparência"),
    ],
  },
  { id: "e_confianza", roles: ["ceo"], type: "scale", set: "preparacion", label: L("¿Qué tan preparada está su cadena de suministro para su plan de crecimiento?", "Quão preparada está sua cadeia de suprimentos para o seu plano de crescimento?") },
  {
    id: "e_reporte",
    roles: ["ceo"],
    type: "single",
    label: L("¿A quién reporta el líder de compras?", "A quem o líder de compras se reporta?"),
    options: [o("ceo", "Al CEO", "Ao CEO"), o("cfo", "Al CFO", "Ao CFO"), o("operaciones", "A Operaciones", "A Operações"), o("otro", "A otra gerencia", "A outra diretoria"), o("no", "No hay un líder de compras", "Não há um líder de compras")],
  },
  { id: "i_min1", ind: ["mineria"], type: "single", label: L("¿Qué parte de su gasto corresponde a servicios y contratistas?", "Que parte do seu gasto corresponde a serviços e terceirizados?"), options: [o("<30", "Menos de 30%"), o("30-50", "30–50%"), o("50-70", "50–70%"), o(">70", "Más de 70%", "Mais de 70%")] },
  {
    id: "i_min2",
    ind: ["mineria"],
    type: "single",
    label: L("¿Cuál es su principal riesgo de abastecimiento?", "Qual é o seu principal risco de suprimento?"),
    options: [
      o("criticos", "Insumos críticos (ácido, explosivos, reactivos)", "Insumos críticos (ácido, explosivos, reagentes)"),
      o("repuestos", "Repuestos y componentes mayores", "Peças e componentes principais"),
      o("contratistas", "Contratistas y mano de obra", "Terceirizados e mão de obra"),
      o("energia", "Energía y agua", "Energia e água"),
      o("logistica", "Logística y puertos", "Logística e portos"),
    ],
  },
  { id: "i_fin1", ind: ["financiero"], type: "single", label: L("¿Qué parte de su gasto es tecnología (software, nube, servicios TI)?", "Que parte do seu gasto é tecnologia (software, nuvem, serviços de TI)?"), options: [o("<20", "Menos de 20%"), o("20-40", "20–40%"), o("40-60", "40–60%"), o(">60", "Más de 60%", "Mais de 60%")] },
  {
    id: "i_fin2",
    ind: ["financiero"],
    type: "single",
    label: L("¿Cómo gestionan el riesgo de terceros que exige el regulador?", "Como vocês gerenciam o risco de terceiros exigido pelo regulador?"),
    options: [
      o("basico", "Gestión básica, caso a caso", "Gestão básica, caso a caso"),
      o("minimo", "Cumplimos lo mínimo exigido", "Cumprimos o mínimo exigido"),
      o("formal", "Proceso formal con matriz de riesgo", "Processo formal com matriz de risco"),
      o("auto", "Proceso formal y automatizado", "Processo formal e automatizado"),
    ],
  },
  { id: "i_ret1", ind: ["retail"], type: "single", label: L("¿Qué parte de sus compras es importada?", "Que parte das suas compras é importada?"), options: [o("<20", "Menos de 20%"), o("20-40", "20–40%"), o("40-60", "40–60%"), o(">60", "Más de 60%", "Mais de 60%")] },
  {
    id: "i_ret2",
    ind: ["retail"],
    type: "single",
    label: L("¿Cuál es hoy su principal presión en compras?", "Qual é hoje sua principal pressão em compras?"),
    options: [
      o("fletes", "Costo de fletes internacionales", "Custo de fretes internacionais"),
      o("tc", "Tipo de cambio", "Câmbio"),
      o("plazos", "Plazos de entrega", "Prazos de entrega"),
      o("marcas", "Poder de negociación de grandes marcas", "Poder de negociação de grandes marcas"),
      o("indirectos", "Costos indirectos y de operación", "Custos indiretos e operacionais"),
    ],
  },
  { id: "i_ind1", ind: ["industrial"], type: "single", label: L("¿Cuánto representa mantención y repuestos (MRO) en su gasto total?", "Quanto manutenção e peças (MRO) representam no seu gasto total?"), options: [o("<10", "Menos de 10%"), o("10-20", "10–20%"), o("20-35", "20–35%"), o(">35", "Más de 35%", "Mais de 35%"), o("ns", "No sé", "Não sei")] },
  {
    id: "i_ind2",
    ind: ["industrial"],
    type: "single",
    label: L("¿Tienen un programa de optimización de inventario de repuestos?", "Vocês têm um programa de otimização de estoque de peças?"),
    options: [o("no", "No", "Não"), o("diseno", "En diseño", "Em desenho"), o("parcial", "Sí, parcial", "Sim, parcial"), o("medido", "Sí, con resultados medidos", "Sim, com resultados medidos")],
  },
  { id: "i_pub1", ind: ["publico"], type: "single", label: L("¿Qué parte de sus compras se hace por trato directo o compra ágil?", "Que parte das suas compras é feita por contratação direta ou dispensa?"), options: [o("<10", "Menos de 10%"), o("10-25", "10–25%"), o("25-50", "25–50%"), o(">50", "Más de 50%", "Mais de 50%")] },
  {
    id: "i_pub2",
    ind: ["publico"],
    type: "single",
    label: L("¿Cuál es su principal desafío en compras públicas?", "Qual é o seu principal desafio em compras públicas?"),
    options: [
      o("plazos", "Plazos de licitación", "Prazos de licitação"),
      o("normativa", "Normativa", "Normas"),
      o("equipo", "Capacidades del equipo", "Capacidades da equipe"),
      o("tecnologia", "Tecnología", "Tecnologia"),
      o("oferentes", "Poca participación de proveedores", "Pouca participação de fornecedores"),
    ],
  },
  { id: "i_sal1", ind: ["salud"], type: "single", label: L("¿Qué parte del gasto es insumos clínicos y farmacéuticos?", "Que parte do gasto é insumos clínicos e farmacêuticos?"), options: [o("<25", "Menos de 25%"), o("25-50", "25–50%"), o("50-75", "50–75%"), o(">75", "Más de 75%", "Mais de 75%")] },
  {
    id: "i_sal2",
    ind: ["salud"],
    type: "single",
    label: L("¿Cuál es su principal riesgo de abastecimiento?", "Qual é o seu principal risco de suprimento?"),
    options: [
      o("quiebres", "Quiebres de stock", "Rupturas de estoque"),
      o("importacion", "Dependencia de importaciones", "Dependência de importações"),
      o("regulacion", "Regulación sanitaria", "Regulação sanitária"),
      o("precios", "Alzas de precios", "Aumentos de preços"),
    ],
  },
];

export const S7: Question[] = [
  {
    id: "proyectos",
    type: "multi",
    label: L("¿Qué proyectos tienen planificados para los próximos 12–18 meses?", "Que projetos vocês planejam para os próximos 12–18 meses?"),
    options: [
      o("transformacion", "Transformación del modelo de compras", "Transformação do modelo de compras"),
      o("s2p", "Implementar o cambiar plataforma de compras", "Implementar ou trocar plataforma de compras"),
      o("sourcing", "Olas de ahorro y renegociación", "Ondas de economia e renegociação"),
      o("bpo", "Tercerizar parte de compras (BPO)", "Terceirizar parte de compras (BPO)"),
      o("scf", "Programa de confirming o supply chain finance", "Programa de confirming ou supply chain finance"),
      o("inventario", "Optimización de inventarios", "Otimização de estoques"),
      o("riesgo", "Gestión de riesgo de proveedores", "Gestão de risco de fornecedores"),
      o("esg", "ESG en la cadena de suministro", "ESG na cadeia de suprimentos"),
      o("ninguno", "Ninguno definido", "Nenhum definido"),
    ],
  },
  {
    id: "tercerizar",
    type: "multi",
    label: L("¿Qué actividades de compras tercerizaría?", "Que atividades de compras você terceirizaria?"),
    options: [
      o("tactico", "Compras tácticas y cola larga", "Compras táticas e cauda longa"),
      o("sourcing", "Licitaciones de categorías específicas", "Licitações de categorias específicas"),
      o("p2p", "Procesamiento de órdenes y facturas (P2P)", "Processamento de pedidos e faturas (P2P)"),
      o("proveedores", "Registro y evaluación de proveedores", "Cadastro e avaliação de fornecedores"),
      o("analitica", "Analítica de gasto", "Análise de gastos"),
      o("ninguna", "Ninguna", "Nenhuma"),
    ],
  },
  {
    id: "t_acuerdo",
    type: "matrix",
    set: "acuerdo",
    label: L("¿Qué tan de acuerdo está con estas afirmaciones sobre presupuesto y equipo?", "Quanto você concorda com estas afirmações sobre orçamento e equipe?"),
    rows: [
      o("ppto_proyectos", "Tengo presupuesto aprobado para los proyectos de 2027", "Tenho orçamento aprovado para os projetos de 2027"),
      o("ppto_talento", "Tengo presupuesto para contratar mejor talento", "Tenho orçamento para contratar talentos melhores"),
      o("capacidades", "Mi equipo tiene las capacidades para los desafíos de 2027", "Minha equipe tem as capacidades para os desafios de 2027"),
      o("roles", "Puedo crear roles nuevos en el equipo (IA, datos, procesos)", "Posso criar novas funções na equipe (IA, dados, processos)"),
      o("retencion", "Retener talento en compras es más difícil que hace 2 años", "Reter talentos em compras está mais difícil do que há 2 anos"),
    ],
  },
  {
    id: "vacantes",
    type: "single",
    label: L("¿Cuántas vacantes tiene hoy abiertas en su equipo de compras?", "Quantas vagas abertas há hoje na sua equipe de compras?"),
    options: [o("0", "Ninguna", "Nenhuma"), o("1-2", "1–2"), o("3-5", "3–5"), o(">5", "Más de 5", "Mais de 5"), o("ns", "No sé", "Não sei")],
  },
  {
    id: "tiempo_vacante",
    type: "single",
    label: L("¿Cuánto tardan en promedio en llenar una vacante de compras?", "Quanto tempo levam, em média, para preencher uma vaga de compras?"),
    options: [o("<1", "Menos de 1 mes", "Menos de 1 mês"), o("1-3", "1–3 meses"), o("3-6", "3–6 meses"), o(">6", "Más de 6 meses", "Mais de 6 meses"), o("ns", "No sé", "Não sei")],
  },
  {
    id: "rotacion",
    type: "single",
    label: L("Rotación anual aproximada del equipo de compras", "Rotatividade anual aproximada da equipe de compras"),
    options: [o("<5", "Menos de 5%"), o("5-10", "5–10%"), o("10-20", "10–20%"), o(">20", "Más de 20%", "Mais de 20%"), o("ns", "No sé", "Não sei")],
  },
  {
    id: "habilidades",
    type: "multi",
    max: 3,
    label: L("¿Qué 3 capacidades son más difíciles de encontrar?", "Quais 3 capacidades são mais difíceis de encontrar?"),
    options: [
      o("negociacion", "Negociación avanzada", "Negociação avançada"),
      o("datos", "Análisis de datos", "Análise de dados"),
      o("ia", "IA y herramientas digitales", "IA e ferramentas digitais"),
      o("categoria", "Expertise técnica por categoría", "Expertise técnica por categoria"),
      o("finanzas", "Visión financiera", "Visão financeira"),
      o("riesgo", "Gestión de riesgo", "Gestão de risco"),
      o("liderazgo", "Liderazgo y gestión del cambio", "Liderança e gestão da mudança"),
      o("esg", "Sostenibilidad", "Sustentabilidade"),
    ],
  },
  {
    id: "temas",
    type: "multi",
    label: L("¿Qué temas le interesa profundizar en el informe o en próximos encuentros?", "Que temas você gostaria de aprofundar no relatório ou em próximos encontros?"),
    options: [
      o("ia", "IA aplicada a compras", "IA aplicada a compras"),
      o("caja", "Capital de trabajo y caja", "Capital de giro e caixa"),
      o("riesgo", "Riesgo y resiliencia", "Risco e resiliência"),
      o("talento", "Talento y modelo organizacional", "Talentos e modelo organizacional"),
      o("benchmark", "Benchmarks de ahorro por industria", "Benchmarks de economia por setor"),
      o("bpo", "Tercerización de compras", "Terceirização de compras"),
      o("tecnologia", "Plataformas y tecnología", "Plataformas e tecnologia"),
      o("esg", "ESG en proveedores", "ESG em fornecedores"),
    ],
  },
  { id: "desafio", type: "textarea", optional: true, label: L("¿Cuál es el mayor desafío de su área para 2027?", "Qual é o maior desafio da sua área para 2027?") },
];

export const QUESTION_SECTIONS = [
  { id: "s4", questions: S4 },
  { id: "s5", questions: S5 },
  { id: "s6", questions: S6 },
  { id: "s7", questions: S7 },
] as const;

const IND_GROUP: Record<string, string> = {
  mineria: "mineria",
  banca: "financiero",
  seguros: "financiero",
  retail: "retail",
  forestal: "industrial",
  energia: "industrial",
  construccion: "industrial",
  manufactura: "industrial",
  agro: "industrial",
  publico: "publico",
  salud: "salud",
};

export function roleGroup(rol: string | undefined) {
  if (rol === "scm" || rol === "cpo") return "cpo";
  if (rol === "ceo" || rol === "cfo") return rol;
  return "otro";
}

export function industryGroup(rubro: string | undefined) {
  if (!rubro) return null;
  return IND_GROUP[rubro] ?? null;
}

export function isVisible(q: { roles?: string[]; ind?: string[] }, rol: string, rubro: string | null) {
  if (q.roles && !q.roles.includes(rol)) return false;
  if (q.ind && (!rubro || !q.ind.includes(rubro))) return false;
  return true;
}

export function choiceLabel(options: Choice[], value: string, lang: Lang = "es") {
  return options.find((item) => item.v === value)?.[lang] ?? value;
}

export function questionById(id: string) {
  return [...REG, ...EMP, ...S4, ...S5, ...S6, ...S7].find((item) => item.id === id);
}
