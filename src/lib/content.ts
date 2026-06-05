export const brand = {
  name: "Xinergy",
  tagline: "Ejecutamos eficiencias con impacto real",
  claim: "#Fitness for business",
  strongPhrase: {
    lead: "Expertos en generación de eficiencias",
    highlight: "con impacto real,",
    body: "compartimos riesgos, medimos resultados y acompañamos a nuestros clientes.",
  },
  promise:
    "Implementamos y ejecutamos eficiencias que se ven en ahorros, EBITDA y caja. Compartimos riesgos, medimos y acompañamos.",
  heroSubline:
    "Ejecución · Strategic Sourcing · BPO · Cash management · Procuretech",
  cta: "Hablemos",
  email: "contacto@xinergy.cl",
  careersEmail: "seleccion@xinergy.cl",
  address:
    "Av. Andrés Bello 2457, piso 16, Of. 1603, Providencia, Santiago, Chile",
  phone: "+56 2 1234 5678",
  linkedin: "https://cl.linkedin.com/company/xinergy-latam",
  mondayFormUrl:
    "https://forms.monday.com/forms/embed/f9158027a499677bf868b39393bd5019?r=use1",
} as const;

/** Destinatarios del diagnóstico de ahorro (calculadora). */
export const leadNotifyEmails = [
  "diego.jorreto@xinergy.cl",
  "roberto.uauy@xinergy.cl",
  "contacto@xinergy.cl",
] as const;

/** Por qué / Qué / Cómo — marco de mensaje */
export const messaging = {
  why: {
    title: "Por qué",
    intro: "Entendemos su operación antes de mover la aguja.",
    points: [
      "Assessment y diagnóstico del cliente",
      "Mejora de procesos y flujos operativos",
      "Cultura y capacidades del equipo interno",
      "Priorización con impacto en EBITDA y caja",
      "Equipo y cultura listos para sostener el cambio",
    ],
  },
  what: {
    title: "Qué hacemos",
    intro:
      "Transformamos operación y abastecimiento de punta a punta — diseño, implementación y ejecución en terreno, con impacto en ahorro, EBITDA y caja.",
    points: [
      "Eficiencias mediante abastecimiento estratégico",
      "BPO de áreas de compra y gestión de contratos",
      "Soluciones de cash management y supply chain finance",
      "Tecnología, Procuretech y habilitación digital",
      "Ahorros, mejora de EBITDA y liberación de caja",
    ],
  },
  how: {
    title: "Cómo lo hacemos",
    intro: "De la ejecución al impacto real, con acompañamiento continuo.",
    points: [
      "VRO para seguimiento de implementación y captura de valor",
      "Change management y gestión del cambio",
      "Implementación en terreno y capacitaciones",
      "Sourcing coach y transferencia al equipo interno",
      "Modelo alineado a resultados — compartimos riesgos",
    ],
  },
} as const;

/** Líneas de ejecución — lo que hacemos */
export const capabilities = [
  {
    title: "Eficiencias & Optimización de procesos",
    description:
      "Assessment, mejora de procesos y cultura operativa con foco en impacto medible.",
    href: "/servicios/eficiencias-optimizacion",
  },
  {
    title: "Transformación Abastecimiento",
    description:
      "Rediseño del modelo de abastecimiento: gobierno, operating model y habilitación del área.",
    href: "/servicios/transformacion-abastecimiento",
  },
  {
    title: "Strategic Sourcing",
    description:
      "Ejecución de proyectos de sourcing y negociación con impacto en P&L, EBITDA y caja.",
    href: "/servicios/abastecimiento-estrategico",
  },
  {
    title: "BPO / Externalización Compras",
    description:
      "Operamos compras y contratos con SLAs, trazabilidad y mejora continua.",
    href: "/servicios/bpo-abastecimiento",
  },
  {
    title: "Digitalización, Automatización & Agentización",
    description:
      "Procuretech, automatización e agentes que aceleran la operación y la adopción.",
    href: "/servicios/cadena-suministro-digital",
  },
  {
    title: "Implementación de Eficiencias",
    description:
      "VRO, change management e implementación en terreno hasta capturar valor en P&L y caja.",
    href: "/servicios/implementacion-eficiencias",
  },
] as const;

/** Presencia en 6 países */
export const presenceCountries = [
  "Chile",
  "Brasil",
  "Perú",
  "Colombia",
  "México",
  "Estados Unidos",
] as const;

/** Oficinas propias */
export const officeCountries = [
  "Chile",
  "Brasil",
  "México",
  "Colombia",
] as const;

export const presenceLabel = presenceCountries.join(" · ");
export const officesLabel = officeCountries.join(" · ");

/** @deprecated use presenceLabel — alias for compat */
export const regions = presenceCountries;
export const regionsLabel = presenceLabel;

export const problemSection = {
  title: "Cuando el gasto no se ve, la eficiencia se pierde",
  intro:
    "Muchas empresas compran sin una vista clara del gasto total. Eso presiona el margen y deja al equipo de compras apagando incendios.",
  stats: [
    { value: "4–8%", label: "de eficiencia típica en el primer año, según industria" },
    { value: "100%", label: "de nuestro modelo ligado a ahorros reales" },
  ],
  opportunity: "La oportunidad: mejorar el negocio sin poner caja de su bolsillo.",
} as const;

/** Copy simplificado para la home (menos densidad, lenguaje claro) */
export const home = {
  capabilities: {
    title: "Lo que hacemos",
    headline: "Ejecutamos e implementamos eficiencias",
    intro: "En proyectos, operación y tecnología — con impacto en P&L, EBITDA y caja.",
  },
  framework: {
    title: "Cómo generamos impacto",
    headline: "Por qué, qué y cómo lo hacemos",
    intro: "Un mismo estándar: eficiencias con resultados que se ven en el negocio.",
  },
  services: {
    title: "Seis líneas de ejecución",
    intro: "Elija una o combínelas según su momento.",
  },
  industries: {
    title: "Industrias donde entregamos",
    intro: "Presencia en 6 países, con oficinas en Chile, Brasil, México y Colombia.",
  },
  cases: {
    label: "Casos de éxito",
    title: "Resultados que hablan",
    intro:
      "Desafío, enfoque y resultados verificables en retail, seguros, automotriz y más.",
  },
  insights: {
    title: "Ideas y tendencias",
    intro: "Lo que observamos en eficiencia y compras en la región.",
  },
  careers: {
    title: "Trabaja con nosotros",
    intro:
      "Buscamos personas que quieran impacto visible: proyectos con clientes líderes, aprendizaje continuo y cultura de equipo en LATAM.",
    emailLabel: "Escríbenos a",
  },
  cta: {
    eyebrow: "Siguiente paso",
    title: "¿Conversamos?",
    intro: "Diagnóstico de oportunidades sin costo en minutos. Sin compromiso.",
  },
  chartBand: {
    title: "¿Cómo son los resultados con Xinergy?",
  },
} as const;

export const processSteps = [
  {
    step: "01",
    title: "Assessment",
    description:
      "Diagnóstico de madurez, procesos y cultura — con priorización de impacto en EBIT y capital de trabajo.",
  },
  {
    step: "02",
    title: "Diseño",
    description:
      "Estrategia operativa, gobierno y roadmap de ejecución alineados al negocio.",
  },
  {
    step: "03",
    title: "Ejecución",
    description:
      "Sourcing, BPO, cash management, tecnología e implementación según lo que la operación requiere.",
  },
  {
    step: "04",
    title: "VRO & tracking",
    description:
      "Seguimiento de implementación, change management y captura de valor hasta cierre en P&L.",
  },
  {
    step: "05",
    title: "Escala",
    description:
      "Playbooks replicables, sourcing coach y capacidades internas para la siguiente ola.",
  },
] as const;

export type FAQ = { q: string; a: string };

export const faqs: FAQ[] = [
  {
    q: "¿Qué significa «cash neutral»?",
    a: "El programa se financia con el ahorro generado. El cliente no desembolsa honorarios netos: nuestro modelo está ligado a eficiencias verificables en P&L.",
  },
  {
    q: "¿En qué industrias trabajan?",
    a: "Retail, seguros y financiero, automotriz, energía y recursos, salud y manufactura — con presencia en 6 países y oficinas en Chile, Brasil, México y Colombia.",
  },
  {
    q: "¿Solo asesoran o también ejecutan?",
    a: "Ejecutamos e implementamos de punta a punta: desde assessment y diseño hasta sourcing, BPO, cash management, plataformas (GEP, SAP Ariba, Jaggaer) y VRO para captura de valor.",
  },
  {
    q: "¿Cuánto tarda ver resultados?",
    a: "Depende del spend y madurez. El diagnóstico toma días; las primeras palancas de ahorro suelen activarse en semanas con quick wins priorizados.",
  },
  {
    q: "¿Qué necesito para el diagnóstico de oportunidades sin costo?",
    a: "Industria, gasto con proveedores y cinco preguntas de madurez. Ingresa tu correo para ver el rango de eficiencia potencial en ~2 minutos.",
  },
  {
    q: "¿Cómo miden el éxito?",
    a: "Ahorros auditables en P&L, KPIs de ciclo de compra, adopción digital y, cuando aplica, métricas ESG en la cadena de suministro.",
  },
];

export const homeFaqs: FAQ[] = [
  {
    q: "¿Qué significa «sin riesgo de caja»?",
    a: "El ahorro que generamos financia el trabajo. Usted no desembolsa honorarios netos por el programa.",
  },
  {
    q: "¿Solo asesoran o también ejecutan?",
    a: "Ejecutamos e implementamos: assessment, sourcing, BPO, tecnología y acompañamiento con VRO hasta que el impacto quede en sus números.",
  },
  {
    q: "¿En qué países trabajan?",
    a: "Presencia en 6 países de la región, con oficinas en Chile, Brasil, México y Colombia.",
  },
  {
    q: "¿Cómo empiezo?",
    a: "Con el diagnóstico de oportunidades sin costo: unas preguntas sobre su gasto y madurez, y una estimación de oportunidad en minutos.",
  },
];

export const heroStats = [
  { value: "3B+", label: "Gasto bajo gestión en programas recientes" },
  { value: "15+", label: "Años generando eficiencias para clientes" },
  {
    value: "6+",
    label: `Presentes en más de 6 países · entre ellos, oficinas en ${officesLabel}`,
  },
  { value: "50+", label: "Más de 50 clientes" },
  { value: "120+", label: "Personas en la organización" },
] as const;

export const stats = [
  ...heroStats,
  { value: "100%", label: "Modelo alineado a ahorros reales" },
] as const;

export const differentiators = [
  {
    title: "Impacto real",
    description: "Ahorros, EBITDA y caja — medidos y auditables en P&L.",
  },
  {
    title: "Compartimos riesgos",
    description: "El programa se financia con la eficiencia que generamos.",
  },
  {
    title: "Ejecutamos e implementamos",
    description: "Assessment, sourcing, BPO, tecnología y VRO en un solo partner.",
  },
  {
    title: "Carbono neutral",
    description: "Operación certificada con criterio ambiental en cada proyecto.",
  },
] as const;

export const pillars = [
  {
    id: "efficiency",
    title: "Eficiencias & Optimización",
    subtitle: "Procesos y cultura",
    description:
      "Assessment, mejora de procesos y preparación operativa con impacto medible.",
    href: "/servicios/eficiencias-optimizacion",
    services: [
      "Assessment del cliente",
      "Optimización de procesos",
      "Cultura y capacidades",
      "Quick wins priorizados",
    ],
  },
  {
    id: "transformation",
    title: "Transformación Abastecimiento",
    subtitle: "Modelo y gobierno",
    description:
      "Rediseñamos cómo opera el abastecimiento: gobierno, modelo operacional y roadmap.",
    href: "/servicios/transformacion-abastecimiento",
    services: [
      "Madurez y gobierno",
      "Operating model",
      "Roadmap de transformación",
      "Habilitación del área",
    ],
  },
  {
    id: "sourcing",
    title: "Strategic Sourcing",
    subtitle: "Ahorro en P&L y caja",
    description:
      "Ejecutamos sourcing y negociación con tracking hasta cierre financiero.",
    href: "/servicios/abastecimiento-estrategico",
    services: [
      "Opportunity assessment",
      "Negociación y RFP",
      "Categorías críticas",
      "Savings assurance",
    ],
  },
  {
    id: "bpo",
    title: "BPO / Externalización Compras",
    subtitle: "Operación externalizada",
    description:
      "Operamos compras y contratos con SLAs, control y mejora continua.",
    href: "/servicios/bpo-abastecimiento",
    services: [
      "Purchasing BPO",
      "Contracts management",
      "Cash & PAY programs",
      "Risk & providers",
    ],
  },
  {
    id: "digital",
    title: "Digitalización & Agentización",
    subtitle: "Procuretech en acción",
    description:
      "Implementamos tecnología, automatización y agentes que el equipo adopta.",
    href: "/servicios/cadena-suministro-digital",
    services: [
      "Procuretech",
      "Automatización RPA",
      "Agentización",
      "Integración ERP",
    ],
  },
  {
    id: "implementation",
    title: "Implementación de Eficiencias",
    subtitle: "VRO & ejecución en terreno",
    description:
      "Llevamos las iniciativas del plan a resultados medibles con VRO, change management y equipos en terreno.",
    href: "/servicios/implementacion-eficiencias",
    services: [
      "Value Realization Office (VRO)",
      "Change management",
      "Implementación en terreno",
      "Savings assurance",
    ],
  },
] as const;

export const services = [
  {
    slug: "eficiencias-optimizacion",
    title: "Eficiencias & Optimización de procesos",
    pillar: "Diagnóstico & Procesos",
    headline: "Identificamos y capturamos eficiencias donde hoy se pierde valor",
    intro:
      "Partimos con un assessment riguroso del gasto y la operación, priorizamos quick wins y mejoramos procesos y cultura — con impacto medible en P&L antes de una transformación de fondo.",
    outcomes: [
      "Mapa de eficiencias por categoría y proceso con baseline audit-able",
      "Quick wins priorizados con owners y plazos de captura",
      "Procesos de compra más ágiles, con menos fricción y retrabajo",
      "Capacidades del equipo alineadas a resultados, no solo a actividad",
    ],
    approach: [
      "Assessment de gasto, madurez y procesos críticos",
      "Diseño de palancas y plan de captura por oleadas",
      "Optimización de procesos y reglas operativas",
      "Coaching y habilitación hasta ver impacto en P&L",
    ],
  },
  {
    slug: "transformacion-abastecimiento",
    title: "Transformación de Abastecimiento",
    pillar: "Transformación",
    headline: "El modelo de abastecimiento que tu negocio necesita para competir",
    intro:
      "Rediseñamos gobierno, operating model y roadmap del área de compras — alineados al C-suite, con foco en EBIT, agilidad, resiliencia y ESG.",
    outcomes: [
      "Gobierno y comités con roles claros entre negocio y procurement",
      "Operating model y organigrama alineados a categorías estratégicas",
      "Roadmap de transformación con hitos, inversión y beneficios",
      "Stack tecnológico y partners definidos para escalar el nuevo modelo",
    ],
    approach: [
      "Evaluación de madurez y benchmarking vs. referentes",
      "Diseño de estrategia, governance y modelo operacional",
      "Plan de transformación por oleadas con change management",
      "Habilitación tecnológica con partners certificados",
    ],
  },
  {
    slug: "abastecimiento-estrategico",
    title: "Abastecimiento Estratégico",
    pillar: "Cost & Value",
    headline: "Ahorros que llegan al P&L — y se sostienen",
    intro:
      "Identificamos oportunidades en gasto directo e indirecto, ejecutamos sourcing y negociación, y aseguramos el tracking hasta el cierre financiero.",
    outcomes: [
      "Reducción de costos con impacto en EBIT verificable",
      "Nuevos proveedores y contratos optimizados",
      "Visibilidad de gasto por categoría y unidad de negocio",
      "Programas ZBB y categorías críticas bajo control",
    ],
    approach: [
      "Spend analytics y opportunity assessment",
      "Estrategia de categoría y diseño de RFP",
      "Negociación y e-auctions cuando aplica",
      "Implementation tracking y savings assurance",
    ],
  },
  {
    slug: "gestion-riesgo-proveedores",
    title: "Gestión de Riesgo de Proveedores",
    pillar: "Managed Services",
    headline: "Resiliencia en la cadena externa",
    intro:
      "Mapeamos, medimos y mitigamos riesgo financiero, operacional, reputacional y ESG en la base de proveedores.",
    outcomes: [
      "Mapa de riesgo por proveedor y categoría",
      "Protocolos de monitoreo y contingencia",
      "Mayor continuidad operacional",
      "Cumplimiento y trazabilidad para auditoría",
    ],
    approach: [
      "Risk assessment y segmentación",
      "Due diligence y scoring",
      "Planes de mitigación y diversificación",
      "Governance y reporting ejecutivo",
    ],
  },
  {
    slug: "bpo-abastecimiento",
    title: "BPO de Abastecimiento",
    pillar: "Managed Services",
    headline: "Operación de compras externalizada con estándar de clase mundial",
    intro:
      "Tomamos la operación transaccional y de contratos para que tu equipo interno se enfoque en categorías estratégicas y valor al negocio.",
    outcomes: [
      "Mayor eficiencia y transparencia operacional",
      "SLAs medibles en ciclo de compra",
      "Reducción de costo fijo del área",
      "Escalabilidad sin aumentar headcount",
    ],
    approach: [
      "Diseño de modelo BPO y transición",
      "Operación purchasing & contracts",
      "Reporting y mejora continua",
      "Integración con ERP y e-procurement",
    ],
  },
  {
    slug: "pay-scf",
    title: "PAY y Supply Chain Finance",
    pillar: "Managed Services",
    headline: "Liquidez en la cadena sin sacrificar relación con proveedores",
    intro:
      "Estructuramos programas de financiamiento y optimización de capital de trabajo en la cadena de suministro.",
    outcomes: [
      "Extensión de plazos de pago donde es viable",
      "Mejora de DPO y cash conversion",
      "Programas SCF con proveedores estratégicos",
      "Win-win comercial con la base de supply",
    ],
    approach: [
      "Diagnóstico de working capital",
      "Diseño de programa PAY/SCF",
      "Negociación con banca y proveedores",
      "Implementación y monitoreo",
    ],
  },
  {
    slug: "cadena-suministro-digital",
    title: "Cadena de Suministro Digital",
    pillar: "Digital Procurement",
    headline: "Plataformas que se implementan — no que quedan en el slide",
    intro:
      "Como partners de Ariba, GEP y Jaggaer, llevamos la digitalización de punta a punta: selección, implementación, adopción y resultados.",
    outcomes: [
      "Mayor visibilidad de gasto y contratos",
      "Ciclos de compra más cortos",
      "Compliance y trazabilidad end-to-end",
      "ROI medible en adopción y ahorro",
    ],
    approach: [
      "Business case y selección de plataforma",
      "Implementación y configuración",
      "Change management y capacitación",
      "Hypercare y optimización post go-live",
    ],
  },
  {
    slug: "automatizacion",
    title: "Automatización",
    pillar: "Digital Procurement",
    headline: "Menos fricción. Más throughput en procurement.",
    intro:
      "Automatizamos flujos repetitivos, aprobaciones y datos maestros para liberar capacidad analítica del equipo.",
    outcomes: [
      "Reducción de trabajo manual",
      "Menos errores en datos maestros",
      "Tiempos de ciclo más predecibles",
      "Base lista para analytics e IA",
    ],
    approach: [
      "Mapeo de procesos y quick wins",
      "RPA y workflows digitales",
      "Integración con ERP y P2P",
      "Medición de productividad",
    ],
  },
  {
    slug: "implementacion-eficiencias",
    title: "Implementación de Eficiencias",
    pillar: "Ejecución",
    headline: "Del plan al impacto real — con VRO y equipos en terreno",
    intro:
      "Acompañamos la implementación de iniciativas de eficiencia con VRO, gestión del cambio y equipos que ejecutan junto al cliente hasta cerrar valor en P&L y caja.",
    outcomes: [
      "Seguimiento de implementación con Value Realization Office (VRO)",
      "Change management y adopción sostenida en el equipo",
      "Captura de ahorros verificable en P&L",
      "Transferencia de capacidades con sourcing coach",
    ],
    approach: [
      "Plan de implementación y quick wins priorizados",
      "VRO y savings assurance",
      "Capacitaciones e implementación en terreno",
      "Reporting ejecutivo hasta cierre financiero",
    ],
  },
] as const;

export const industries = [
  {
    slug: "retail",
    title: "Retail & Consumo",
    headline: "Procurement que protege margen en un retail bajo presión",
    challenges: [
      "Presión de nuevos entrantes y marketplaces",
      "Inflación en costos directos e indirectos",
      "Complejidad por omnicanalidad y velocidad de assortment",
    ],
    howWeHelp: [
      "Optimización de gasto indirecto (IT, marketing, logística)",
      "Private label y negociación con marcas",
      "Resiliencia de supply en categorías críticas",
    ],
    metric: "Caso retail conglomerado: compras multi-negocio > USD 19B ventas",
  },
  {
    slug: "seguros",
    title: "Seguros & Financiero",
    headline: "Abastecimiento integral para instituciones reguladas",
    challenges: [
      "Gasto indirecto fragmentado por unidad de negocio",
      "Exigencia de compliance y trazabilidad",
      "Presión en costos operacionales y tecnología",
    ],
    howWeHelp: [
      "Modelo integral de gestión de compras",
      "Governance y reporting para directorio",
      "Digitalización de P2P y contratos",
    ],
    metric: "Compañía latinoamericana de seguros — modelo integral desplegado",
  },
  {
    slug: "automotriz",
    title: "Automotriz",
    headline: "Ahorros rápidos sin frenar el desarrollo del área de compras",
    challenges: [
      "Necesidad de savings en corto plazo",
      "Madurez desigual del área de procurement",
      "Categorías técnicas con alto impacto en producto",
    ],
    howWeHelp: [
      "Programas de ahorro acelerado",
      "Build del capability interno en paralelo",
      "Sourcing en componentes y servicios críticos",
    ],
    metric: "Retailer automotriz — eficiencias y desarrollo de área en paralelo",
  },
  {
    slug: "energia",
    title: "Energía & Recursos",
    headline: "CAPEX, OPEX y proveedores en entornos volátiles",
    challenges: [
      "Volatilidad de precios y supply disruption",
      "Proyectos CAPEX bajo presión de plazo y costo",
      "Requisitos ESG en la cadena",
    ],
    howWeHelp: [
      "Gestión de categorías directas y servicios",
      "Risk & resilience en proveedores críticos",
      "Programas de descarbonización en supply",
    ],
    metric: "Experiencia regional en categorías de alto spend",
  },
] as const;

export const cases = [
  {
    slug: "minera-chile-bpo",
    title: "Importante minera chilena",
    industry: "Minería",
    service: "BPO / Externalización Compras",
    challenge:
      "Operación de abastecimiento de alta complejidad en entorno minero: alto volumen transaccional, múltiples faenas y categorías críticas, con presión por escalar capacidad sin aumentar headcount interno ni perder control.",
    approach:
      "Despliegue de modelo BPO con equipo Xinergy dedicado de más de 35 profesionales: operación de compras y contratos, SLAs por proceso, reporting ejecutivo, integración con sistemas del cliente y mejora continua en terreno.",
    results: [
      "Equipo operativo de 35+ personas en operación continua",
      "Trazabilidad y control de gasto en categorías de alto impacto",
      "SLAs medibles en ciclo de compra y gestión de contratos",
      "Capacidad escalable para picos de demanda operacional",
    ],
    highlight: "35+",
    highlightLabel: "personas en equipo BPO",
  },
  {
    slug: "retail-conglomerado-latam",
    title: "Conglomerado retail latinoamericano",
    industry: "Retail",
    service: "Abastecimiento Estratégico",
    challenge:
      "Empresa líder con ventas superiores a USD 19B y compras en cinco unidades de negocio sin visibilidad consolidada ni palancas comunes de ahorro.",
    approach:
      "Diagnóstico de gasto, diseño de governance transversal, programas de sourcing por categoría y tracking de savings con owners por negocio.",
    results: [
      "Visibilidad unificada de gasto multi-BU",
      "Pipeline de ahorros priorizado por impacto en EBIT",
      "Modelo de gobierno replicable entre divisiones",
    ],
    highlight: "USD 19B+",
    highlightLabel: "escala de ventas del cliente",
  },
  {
    slug: "seguros-latam",
    title: "Aseguradora latinoamericana",
    industry: "Seguros",
    service: "Procurement Transformation",
    challenge:
      "Gestión de compras fragmentada; necesidad de un modelo integral de abastecimiento con compliance y eficiencia.",
    approach:
      "Diseño de operating model, políticas, categorías, tecnología P2P y equipo híbrido Xinergy-cliente.",
    results: [
      "Modelo integral de abastecimiento implementado",
      "Mayor control de gasto indirecto",
      "Capacidad interna desarrollada en el proceso",
    ],
    highlight: "Integral",
    highlightLabel: "transformación end-to-end",
  },
  {
    slug: "retail-software-factory",
    title: "Retailer — Software Factory",
    industry: "Retail",
    service: "Abastecimiento Estratégico",
    challenge:
      "Gasto crítico en desarrollo anual (>1.2M horas) sin estándar de proveedor ni palancas de negociación estructuradas.",
    approach:
      "Segmentación de proveedores, benchmark de rates, RFP y renegociación de marco con SLAs de productividad.",
    results: [
      "Reducción material del costo unitario de desarrollo",
      "Contratos con métricas de entrega",
      "Base de proveedores rationalizada",
    ],
    highlight: "1.2M+",
    highlightLabel: "horas bajo gestión anual",
  },
  {
    slug: "automotriz-savings",
    title: "Retailer automotriz",
    industry: "Automotriz",
    service: "Cost-Reduction",
    challenge:
      "Necesidad urgente de ahorros y eficiencias mientras se construye el área de compras.",
    approach:
      "Programa dual: quick wins de savings en categorías de impacto + roadmap de capability.",
    results: [
      "Ahorros en ventana acelerada",
      "Área de compras estructurada en paralelo",
      "Gobernanza y reporting para gerencia",
    ],
    highlight: "Dual",
    highlightLabel: "savings + capability build",
  },
  {
    slug: "energia-recursos",
    title: "Empresa de energía y recursos",
    industry: "Energía & Recursos",
    service: "Abastecimiento Estratégico",
    challenge:
      "Volatilidad de precios, disrupción en la cadena de suministro y proyectos CAPEX bajo presión de plazo, costo y cumplimiento ESG.",
    approach:
      "Gestión de categorías directas y servicios críticos, mapeo de riesgo en proveedores y programas de eficiencia con foco en resiliencia operacional.",
    results: [
      "Mayor visibilidad de spend en categorías CAPEX y OPEX",
      "Mitigación de riesgo en proveedores críticos",
      "Programas de eficiencia alineados a descarbonización",
    ],
    highlight: "CAPEX",
    highlightLabel: "y OPEX bajo gestión",
  },
] as const;

export const insights = [
  {
    slug: "alianza-gep-latam",
    type: "Alianza",
    title:
      "Xinergy y GEP firman alianza estratégica para software de compras y supply chain en LATAM",
    date: "Abr 2023",
    excerpt:
      "GEP SOFTWARE™ disponible en América Latina: reducción de costos, digitalización de procesos y menor time to market para empresas de la región.",
    tag: "Partners",
    icon: "partnership",
    body: [
      "Santiago, Chile — Xinergy, subsidiaria de Matrix Consulting, anunció una alianza estratégica con GEP®, líder en estrategia, software y servicios administrados de adquisición y cadena de suministro para empresas Fortune 500 y Global 2000.",
      "La alianza combina el conocimiento del mercado latinoamericano de Xinergy con la tecnología e innovación de GEP, uniendo necesidades locales con capacidades globales para reducir costos, digitalizar procesos y mejorar el time to market.",
      "Xinergy venderá e implementará las plataformas de GEP — compras digitales, gestión de contratos, licitaciones, riesgo de proveedores y gestión de gastos — para que las empresas sean más ágiles, resilientes y competitivas frente a inflación, presión de costos y volatilidad industrial.",
      "«Esta alianza une las capacidades globales de GEP con la presencia local y el profundo conocimiento de mercado de Xinergy y Matrix Consulting. Nos permitirá brindar una oferta única, adaptada a las necesidades locales, que impulsará la reducción de costos y la digitalización de compras en la región», afirmó Roberto Uauy, Socio Fundador y Gerente General de Xinergy.",
      "Ken Legge, vicepresidente de Alianzas de GEP, destacó que Xinergy aportará innovación tecnológica, localización y experiencia en la industria, especialmente en LATAM, donde la presencia local y el soporte lingüístico son clave.",
      "Para conocer más sobre las ventajas de esta alianza, escríbanos a contacto@xinergy.cl.",
    ],
  },
  {
    slug: "innovacion-gep-procurement",
    type: "Alianza",
    title:
      "Innovación y tecnología para nuevas soluciones en procurement y gestión del gasto",
    date: "2023",
    excerpt:
      "Alianza con GEP Worldwide® que cataliza reducción de costos, digitalización e incorporación de metaverso e IA en la oferta de valor.",
    tag: "Tecnología",
    icon: "technology",
    body: [
      "Recientemente sellamos una nueva alianza dentro de nuestro ecosistema con GEP Worldwide®, compañía líder mundial de estrategia, software y servicios administrados de adquisición y cadena de suministro para empresas Fortune 500, con base en New York, USA.",
      "Esta alianza cataliza la experiencia de GEP, su tecnología de punta y constante innovación, con el profundo conocimiento que tenemos de las necesidades de la región para generar las mejores soluciones en reducción de costos, digitalización de procesos y mejoras del time to market.",
      "Asimismo, estamos incorporando las capacidades que habilita el metaverso y la inteligencia artificial (IA) para potenciar la oferta de valor de cara a nuestros clientes.",
      "Conoce más sobre esto y nuestro metaverso en el reportaje publicado en Diario Financiero.",
    ],
    externalUrl: "https://xinergy.cl/potenciando-la-innovacion-y-tecnologia-para-generar-nuevas-soluciones-en-procurement-y-la-gestion-eficaz-del-gasto/",
  },
  {
    slug: "carbono-neutral",
    type: "ESG",
    title: "Somos Carbono Neutral",
    date: "2023",
    excerpt:
      "Certificación internacional CarbonNeutral Protocol: emisiones neto cero y liderazgo en la lucha contra el cambio climático.",
    tag: "Sostenibilidad",
    icon: "carbon-neutral",
    body: [
      "Luego de reducir nuestras emisiones a neto cero, recibimos la certificación internacional que comprueba el compromiso y liderazgo que tenemos en la lucha contra el cambio climático.",
      "Este año recibimos la certificación internacional CarbonNeutral Protocol, lo que significa que cada emisión de gas de efecto invernadero generada por Xinergy es compensada a través de un programa que garantiza que una cantidad equivalente es reducida de la atmósfera mediante un proyecto de energías limpias.",
      "«Nuestro compromiso con la sustentabilidad es absoluto. Potenciar las estrategias de sustentabilidad de nuestros clientes, permeando las políticas y prácticas de ESG en sus procesos de abastecimiento y supply chain, no se puede lograr si no somos parte del mismo modelo. Queremos dar el ejemplo para potenciar las eficiencias sustentables en todos nuestros clientes», comenta Roberto Aron Uauy Zirinsky, CEO de Xinergy.",
      "Para compensar las emisiones de carbono de Xinergy durante 2021, elegimos el proyecto Wind Power Portfolio, un parque eólico de 33 MW ubicado en la Región del Biobío que genera energía limpia para abastecer a 55 mil hogares y prevenir 36 mil toneladas de CO₂ anualmente.",
      "En Xinergy estamos comprometidos con aportar en la lucha contra el cambio climático. Esta certificación nos pone a la vanguardia en sostenibilidad, como la primera consultora de eficiencias y procurement en lograr este importante hito.",
    ],
  },
  {
    slug: "partners-proveedores-carbono-neutral",
    type: "ESG",
    title: "Partners y proveedores Carbono Neutral",
    date: "2023",
    excerpt:
      "La certificación CarbonNeutral impulsa en nuestros clientes un enfoque de sustentabilidad y prácticas ESG en abastecimiento y supply chain.",
    tag: "Sostenibilidad",
    icon: "supply-chain",
    body: [
      "Ante la evidencia de los riesgos del cambio climático, múltiples empresas en diversas industrias a nivel global han comprometido voluntariamente metas de descarbonización en los últimos años.",
      "En dicho contexto, contamos con la certificación CarbonNeutral, compromiso que nos permite impulsar con fuerza en nuestros clientes un enfoque de sustentabilidad y prácticas de ESG en sus procesos de abastecimiento y supply chain.",
      "Exigimos el mismo estándar a partners y proveedores en programas de eficiencia sostenible: la cadena externa es parte del impacto real que medimos y acompañamos.",
    ],
    externalUrl:
      "https://xinergy.cl/la-importancia-de-contar-con-partners-y-proveedores-carbono-neutral/",
  },
  {
    slug: "teletrabajo-energias-renovables",
    type: "ESG",
    title: "Teletrabajo y energías renovables",
    date: "2023",
    excerpt:
      "Plan estratégico de teletrabajo, compensación de emisiones de colaboradores y proyecto eólico en el Biobío para energía limpia.",
    tag: "Sostenibilidad",
    icon: "renewables",
    body: [
      "Entre las acciones que Xinergy ha implementado, establecimos un plan estratégico para aprovechar los beneficios del teletrabajo, limitando los viajes y traslados solo a lo necesario.",
      "«Al mismo tiempo, hemos decidido compensar las emisiones directas de nuestros colaboradores en sus hogares», explica Roberto Uauy, CEO de la empresa.",
      "En paralelo, para compensar con proyectos de impacto en Chile y en energías renovables, optamos por Wind Power Portfolio, un parque eólico de 33 MW ubicado en la Región del Biobío, que genera energía limpia para abastecer a 55 mil hogares y prevenir 36 mil toneladas de CO₂ anualmente.",
      "«Disminuir la huella de carbono no es una acción a corto plazo, es un compromiso que, de instalarse en la organización, no puede ser sustituido y tiene que tener la máxima prioridad para su cumplimiento, conectando esto con el propósito de la compañía».",
    ],
    externalUrl:
      "https://xinergy.cl/xinergy-va-por-el-teletrabajo-y-las-energias-renovables/",
  },
] as const;

export const cultureValues = [
  {
    title: "Alto rendimiento",
    summary:
      "Máximo estándar, impacto end to end y relaciones de largo plazo basadas en confianza.",
  },
  {
    title: "Alta vitalidad",
    summary:
      "Pensamos en grande, innovamos y desafiamos el status quo — fuera de la zona de confort.",
  },
  {
    title: "Alto humanismo",
    summary:
      "Los éxitos y los fracasos son del equipo. Bienestar, desarrollo y ideas valoradas por mérito.",
  },
] as const;

export const teamOffsite = {
  eyebrow: "El equipo",
  title: "Llegamos juntos a la base",
  location: "Torres del Paine · Offsite 2024",
  quote:
    "Los desafíos más exigentes se conquistan en equipo — en la montaña y en el negocio.",
  body:
    "En 2024 nos reunimos en el sur de Chile para un offsite en Torres del Paine. Caminamos hasta la base de las torres con el mismo espíritu con el que acompañamos a nuestros clientes: preparación, esfuerzo compartido y llegar a destino.",
  image: "/team/equipo-torres-paine-2024.png",
  imageAlt: "Equipo Xinergy en la base de las Torres del Paine, offsite 2024",
} as const;

export const careersPage = {
  title: "Trabaja con nosotros",
  eyebrow: "Carreras",
  lead: "En Xinergy siempre estamos buscando al mejor talento.",
  socialIntro:
    "Revisa nuestras redes sociales o LinkedIn para conocer la cultura del equipo y las oportunidades abiertas.",
  linkedInLabel: "LinkedIn de Xinergy",
  emailIntro: "También puedes dejarnos tus datos y CV en",
  emailOutro:
    "y nuestro equipo de RRHH se pondrá en contacto contigo por cualquier oportunidad.",
} as const;

export const nav = [
  { label: "Nosotros", href: "/nosotros" },
  { label: "Casos", href: "/casos" },
  { label: "Insights", href: "/insights" },
  { label: "Trabaja con nosotros", href: "/trabaja-con-nosotros" },
] as const;
