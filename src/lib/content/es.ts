export const brand = {
  name: "Xinergy",
  tagline: "Ejecutamos eficiencias con impacto real.",
  claim: "#Fitness for business",
  strongPhrase: {
    emphasis: "Compartimos riesgos",
    body: "medimos, y somos tus socios en la implementación y ejecución.",
  },
  pitchLine:
    "Compartimos riesgos, medimos, y somos tus socios en la implementación y ejecución.",
  promise:
    "Implementamos y ejecutamos eficiencias que se ven en ahorros, EBITDA y caja. Compartimos riesgos, medimos, y somos tus socios en la implementación y ejecución.",
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
    intro: "Entendemos tu operación antes de mover la aguja.",
    points: [
      "Assessment y diagnóstico del cliente.",
      "Mejora de procesos y flujos operativos.",
      "Cultura y capacidades del equipo interno.",
      "Priorización con impacto en EBITDA y caja.",
      "Equipo y cultura listos para sostener el cambio.",
    ],
  },
  what: {
    title: "Qué hacemos",
    intro:
      "Transformamos operación y abastecimiento de punta a punta — diseño, implementación y ejecución en terreno, con impacto en ahorro, EBITDA y caja.",
    points: [
      "Eficiencias mediante abastecimiento estratégico.",
      "BPO de áreas de compra y gestión de contratos.",
      "Soluciones de cash management y supply chain finance.",
      "Tecnología, Procuretech y habilitación digital.",
      "Ahorros, mejora de EBITDA y liberación de caja.",
    ],
  },
  how: {
    title: "Cómo lo hacemos",
    intro: "De la planificación a la ejecución con impacto real.",
    points: [
      "VRO para seguimiento de implementación y captura de valor.",
      "Change management y gestión del cambio.",
      "Implementación en terreno y capacitaciones.",
      "Sourcing coach y transferencia al equipo interno.",
      "Compartimos riesgos — incentivos alineados a resultados.",
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
    title: "Business process outsourcing (BPO) / Externalización Compras",
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
      "Value Realization Office (VRO), change management e implementación en terreno hasta capturar valor en P&L y caja.",
    href: "/servicios/implementacion-eficiencias",
  },
  {
    title: "Working Capital Solutions",
    description:
      "Diagnóstico cuantitativo, diseño de programa DPO/AP, SCF multibanco y negociación de contratos — con partners Calculum y Monkey.",
    href: "/servicios/working-capital-solutions",
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
  title: "Cuando el gasto no se ve, la eficiencia se pierde.",
  intro:
    "Muchas empresas compran sin una vista clara del gasto total. Eso presiona el margen y deja al equipo de compras apagando incendios.",
  stats: [
    { value: "4–8%", label: "de eficiencia típica en el primer año, según industria." },
    { value: "100%", label: "de nuestro modelo ligado a ahorros reales." },
  ],
  opportunity: "La oportunidad: mejorar el negocio sin poner caja de tu bolsillo.",
} as const;

/** Copy simplificado para la home (menos densidad, lenguaje claro) */
export const home = {
  capabilities: {
    title: "Lo que hacemos",
    headline: "Ejecutamos e implementamos eficiencias.",
    intro: "En proyectos, operación y tecnología — con impacto en P&L, EBITDA y caja.",
  },
  framework: {
    title: "Cómo generamos impacto",
    headline: "Por qué, qué y cómo lo hacemos.",
    intro:
      "Compartimos riesgos, medimos y somos tus socios en la implementación y ejecución.",
  },
  services: {
    title: "Seis líneas de ejecución",
    intro: "Elige una o combínalas según tu momento.",
  },
  industries: {
    title: "Industrias donde entregamos",
    intro: "Presencia en 6 países, con oficinas en Chile, Brasil, México y Colombia.",
  },
  cases: {
    label: "Casos de éxito",
    title: "Resultados que hablan.",
    intro:
      "Desafío, enfoque y resultados verificables en retail, seguros, automotriz y más.",
  },
  cta: {
    eyebrow: "Siguiente paso",
    title: "¿Cuándo conversamos?",
    intro: "Estima oportunidades en minutos. Compartimos riesgos desde el primer paso.",
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
    a: "Compartimos riesgos: el programa se financia con el ahorro generado. Tú no desembolsas honorarios netos — nuestro modelo está ligado a eficiencias verificables en P&L.",
  },
  {
    q: "¿En qué industrias trabajan?",
    a: "Retail, seguros y financiero, automotriz, energía y recursos, salud y manufactura — con presencia en 6 países y oficinas en Chile, Brasil, México y Colombia.",
  },
  {
    q: "¿Solo asesoran o también ejecutan?",
    a: "Ejecutamos e implementamos de punta a punta — somos tus socios en la ejecución: assessment, diseño, sourcing, BPO, cash management, plataformas (GEP, SAP Ariba, Jaggaer) y VRO para captura de valor.",
  },
  {
    q: "¿Cuánto tarda ver resultados?",
    a: "Depende del spend y madurez. El diagnóstico toma días; las primeras palancas de ahorro suelen activarse en semanas con quick wins priorizados.",
  },
  {
    q: "¿Qué necesito para la calculadora de eficiencias?",
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
    a: "Compartimos riesgos: el ahorro que generamos financia el trabajo. Tú no desembolsas honorarios netos por el programa.",
  },
  {
    q: "¿Solo asesoran o también ejecutan?",
    a: "Somos tus socios en la ejecución: assessment, sourcing, BPO, tecnología y VRO hasta que el impacto quede en tus números.",
  },
  {
    q: "¿En qué países trabajan?",
    a: "Presencia en 6 países de la región, con oficinas en Chile, Brasil, México y Colombia.",
  },
  {
    q: "¿Cómo empiezo?",
    a: "Con la calculadora de eficiencias: unas preguntas sobre tu gasto y madurez, y una estimación de oportunidad en minutos.",
  },
];

export const heroStats = [
  {
    value: "3B+",
    label: "Gasto bajo gestión en programas recientes.",
    detail: "Spend directo e indirecto en sourcing, BPO y transformación de abastecimiento en Latinoamérica.",
  },
  {
    value: "15+",
    label: "Años generando eficiencias para clientes.",
    detail: "Trayectoria regional ejecutando eficiencias con impacto verificable en P&L y caja.",
  },
  {
    value: "6",
    label: `Países con presencia · oficinas en ${officesLabel}.`,
    detail: `Operación en ${presenceLabel} con equipos locales y proyectos multi-país.`,
  },
  {
    value: "50+",
    label: "Más de 50 clientes.",
    detail: "Empresas líderes en retail, minería, seguros, financiero, energía y manufactura.",
  },
  {
    value: "120+",
    label: "Personas en la organización.",
    detail: "Consultores, especialistas de sourcing y equipos BPO dedicados a capturar valor en terreno.",
  },
] as const;

export const stats = [
  ...heroStats,
  { value: "100%", label: "Modelo alineado a ahorros reales." },
] as const;

export const differentiators = [
  {
    title: "Impacto real",
    description: "Ahorros, EBITDA y caja — medidos y auditables en P&L.",
  },
  {
    title: "Compartimos riesgos",
    description: "Compartimos riesgos contigo — el programa se alinea a eficiencias verificables en P&L.",
  },
  {
    title: "Somos tus socios en la ejecución",
    description: "Medimos, implementamos y ejecutamos en terreno contigo hasta capturar valor.",
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
      "Working Capital Solutions",
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
    headline: "Más margen desde el primer trimestre",
    intro:
      "Encontramos dónde se pierde valor en tu operación, priorizamos las oportunidades de mayor impacto y las convertimos en resultados medibles en P&L — sin esperar una transformación de fondo.",
    outcomes: [
      "Mapa claro de oportunidades por categoría y proceso",
      "Quick wins con responsables, plazos y ahorro estimado",
      "Compras más ágiles, con menos fricción y retrabajo",
      "Equipos enfocados en resultados, no solo en actividad",
    ],
    approach: [
      "Diagnóstico de gasto, madurez y procesos críticos",
      "Diseño de palancas y plan de captura por oleadas",
      "Optimización de procesos y reglas operativas",
      "Acompañamiento hasta ver impacto en tus números",
    ],
  },
  {
    slug: "transformacion-abastecimiento",
    title: "Transformación de Abastecimiento",
    pillar: "Transformación",
    headline: "Un área de compras preparada para competir",
    intro:
      "Rediseñamos gobierno, modelo operativo y roadmap de compras alineados a la dirección — con foco en EBIT, agilidad, resiliencia y ESG.",
    outcomes: [
      "Roles claros entre negocio y compras, con comités que funcionan",
      "Organización y modelo operativo orientados a categorías estratégicas",
      "Hoja de ruta con hitos, inversión y beneficios esperados",
      "Tecnología y aliados definidos para escalar el nuevo modelo",
    ],
    approach: [
      "Evaluación de madurez y comparación con referentes del mercado",
      "Diseño de estrategia, gobierno y modelo operacional",
      "Plan de transformación por etapas con gestión del cambio",
      "Implementación tecnológica con partners certificados",
    ],
  },
  {
    slug: "abastecimiento-estrategico",
    title: "Abastecimiento Estratégico",
    pillar: "Cost & Value",
    headline: "Ahorros que llegan al P&L — y se sostienen",
    intro:
      "Identificamos oportunidades en gasto directo e indirecto, negociamos con el mercado y hacemos seguimiento hasta que el ahorro se refleje en tus resultados.",
    outcomes: [
      "Reducción de costos con impacto verificable en EBIT",
      "Mejores proveedores y contratos más competitivos",
      "Visibilidad del gasto por categoría y unidad de negocio",
      "Categorías críticas y programas de eficiencia bajo control",
    ],
    approach: [
      "Análisis de gasto y mapa de oportunidades",
      "Estrategia por categoría y diseño de licitación",
      "Negociación y subastas electrónicas cuando aplica",
      "Seguimiento de implementación y cierre de ahorros",
    ],
    ss: {
      assessment: {
        eyebrow: "Por dónde empezamos",
        title: "Priorizamos donde hay más valor que capturar",
        intro:
          "Analizamos tu gasto, identificamos las categorías con mayor potencial y armamos un plan claro para convertir oportunidades en ahorros reales en tu P&L.",
        phases: [
          {
            title: "Entendemos dónde está el gasto",
            bullets: [
              "Organizamos y clasificamos tu histórico de compras por categoría",
              "Cruzamos OPEX y CAPEX, y revisamos contratos clave cuando hace falta",
              "Priorizamos categorías por potencial de ahorro y facilidad de ejecución",
            ],
          },
          {
            title: "Definimos qué abordar primero",
            bullets: [
              "Seleccionamos categorías según impacto, madurez y tamaño del gasto",
              "Validamos con usuarios y compras según criticidad y vencimientos",
              "Acordamos qué llevamos nosotros y qué lidera tu equipo interno",
            ],
          },
          {
            title: "Abrimos las palancas de ahorro",
            bullets: [
              "Identificamos oportunidades en oferta y demanda",
              "Priorizamos quick wins por impacto y velocidad de captura",
              "Clasificamos iniciativas por esfuerzo y retorno esperado",
            ],
          },
          {
            title: "Planificamos la captura",
            bullets: [
              "Cronograma por oleadas según oportunidades y criticidad del servicio",
              "Priorización por vencimientos contractuales y ventanas de negociación",
              "Proyección de ahorros con hitos que puedes auditar",
            ],
          },
        ],
      },
      model: {
        title: "Sourcing estratégico, ejecutado con agilidad",
        intro:
          "Convertimos iniciativas en eficiencias reales que impactan tu resultado. Metodología probada, de la línea base hasta la captura en balance.",
        laneLabels: {
          demand: "Gestión de demanda",
          offer: "Gestión de oferta",
          savings: "Captura de ahorros",
        },
        steps: [
          { num: "1", title: "Diagnóstico de la situación actual", lane: "demand" },
          { num: "2", title: "Análisis técnico y de mercado", lane: "demand" },
          { num: "3", title: "Estrategia de categoría", lane: "demand" },
          { num: "4", title: "Licitación y salida a mercado", lane: "offer" },
          { num: "5", title: "Evaluación de propuestas y cierre", lane: "offer" },
          { num: "6", title: "Negociación final y contratos", lane: "offer" },
          { num: "7", title: "Implementación del nuevo modelo", lane: "savings" },
          { num: "8", title: "Monitoreo y control", lane: "savings" },
        ],
        benefits: [
          "Más competencia entre proveedores y mejor base de suministro",
          "Soluciones de demanda que van más allá del ahorro de precio",
          "Negociaciones digitales con ahorros promedio de ~15% en la región",
        ],
      },
      capture: {
        title: "Tres velocidades para capturar valor",
        intro:
          "Combinamos resultados rápidos con eficiencias de largo plazo, adaptando el enfoque a la urgencia y el potencial de cada categoría.",
        tracks: [
          {
            id: "quick-impact",
            name: "Quick Impact",
            tagline: "Resultados en semanas",
            focus:
              "Proveedores de alto volumen que cruzan varias categorías.",
            bullets: [
              "Negociación ágil apalancada en volumen y datos de mercado",
              "Descuentos inmediatos o retroactivos cuando el contexto lo permite",
              "Benchmarks regionales que respaldan cada captura",
            ],
            duration: "1–2 meses para empezar a capturar",
            savings: "5% – 10% de ahorro promedio",
          },
          {
            id: "rapid-savings",
            name: "Rapid Savings",
            tagline: "Quick wins por categoría",
            focus:
              "Categorías con oportunidad clara y ejecución rápida.",
            bullets: [
              "Precios de referencia actualizados para negociar desde una posición fuerte",
              "Condiciones flexibles que permiten ajustar el servicio después",
              "Negociación directa, nuevos proveedores o ajustes operativos rápidos",
            ],
            duration: "2–3 meses para empezar a capturar",
            savings: "8% – 15% de ahorro promedio",
          },
          {
            id: "strategic-sourcing",
            name: "Strategic Sourcing",
            tagline: "Ahorro que perdura",
            focus:
              "Rediseño del servicio alineado a lo que el negocio necesita hoy.",
            bullets: [
              "Cuestionamos el modelo actual y optimizamos demanda y estructura",
              "Trabajo conjunto con usuarios e integración de mejores prácticas",
              "Licitaciones competitivas que renuevan proveedores y dan resiliencia",
            ],
            duration: "4–6 meses para empezar a capturar",
            savings: "15% – 25% de ahorro promedio + mejor calidad",
          },
        ],
      },
      methodology: {
        title: "Cómo ejecutamos el sourcing estratégico",
        intro:
          "Ocho pasos con entregables concretos en cada fase, desde el diagnóstico inicial hasta el seguimiento del ahorro en tus resultados.",
        steps: [
          {
            num: "1",
            title: "Diagnóstico de la situación actual",
            description:
              "Entendemos cómo opera hoy el servicio: niveles, penalidades, KPIs y costo total (precio, cantidad y calidad).",
            deliverables: ["Línea base", "Listado de categorías", "Iniciativas"],
          },
          {
            num: "2",
            title: "Análisis técnico y de mercado",
            description:
              "Dimensionamos oportunidades, validamos factibilidad y leemos tendencias del mercado.",
            deliverables: [],
          },
          {
            num: "3",
            title: "Estrategia de categoría",
            description:
              "Definimos la mejor ruta de negociación y abastecimiento, alineada a lo que el negocio necesita.",
            deliverables: ["Estrategia de categoría"],
          },
          {
            num: "4",
            title: "Licitación y salida a mercado",
            description:
              "Identificamos proveedores, preparamos el pliego, definimos cotizaciones y publicamos el proceso.",
            deliverables: ["Pliego de licitación"],
          },
          {
            num: "5",
            title: "Evaluación de propuestas",
            description:
              "Recibimos ofertas, las evaluamos en lo técnico, económico y financiero, y definimos la estrategia de cierre.",
            deliverables: ["Proveedores preseleccionados", "Estrategia de cierre"],
          },
          {
            num: "6",
            title: "Negociación final y contratos",
            description:
              "Cerramos la negociación, formalizamos el ahorro, adjudicamos y firmamos contratos.",
            deliverables: ["Resultados preliminares", "Contratos firmados"],
          },
          {
            num: "7",
            title: "Implementación",
            description:
              "Ponemos en marcha el nuevo servicio y acompañamos al equipo en la transición.",
            deliverables: ["Plan de implementación"],
          },
          {
            num: "8",
            title: "Monitoreo y control",
            description:
              "Seguimos la captura de ahorros y corregimos desvíos antes de que se pierda valor.",
            deliverables: ["Análisis de brechas"],
          },
        ],
      },
      successPillars: {
        title: "Tres factores que marcan la diferencia",
        pillars: [
          {
            title: "Compromiso de la dirección",
            description:
              "Cuando la alta gerencia participa, las decisiones se toman más rápido y el impacto llega a los resultados.",
          },
          {
            title: "Gestión del cambio",
            description:
              "Alineamos al equipo interno desde el inicio para que los nuevos modelos se adopten y se sostengan.",
          },
          {
            title: "Ahorro que se ve en el P&L",
            description:
              "No nos quedamos en el plan: hacemos seguimiento hasta que el ahorro se refleje en tus números.",
          },
        ],
      },
      tools: {
        title: "Tecnología que da visibilidad y control",
        intro:
          "Plataformas digitales para seguir cada categoría, cada negociación y cada ahorro — con trazabilidad de punta a punta.",
        categories: [
          {
            title: "Gestión del proyecto",
            bullets: [
              "Estado, pendientes y responsables por categoría",
              "Cronogramas, ahorros proyectados y respaldo de entregables",
              "Dashboards consolidados y seguimiento de implementación",
            ],
          },
          {
            title: "Procesos con proveedores",
            bullets: [
              "Información clara y comparable para todo el equipo",
              "Evaluaciones técnicas con visibilidad para quien decide",
              "Cierres electrónicos: subasta inversa, sobre cerrado y más",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "gestion-riesgo-proveedores",
    title: "Gestión de Riesgo de Proveedores",
    pillar: "Managed Services",
    headline: "Proveedores bajo control, operación sin sorpresas",
    intro:
      "Identificamos, medimos y reducimos riesgos financieros, operacionales, reputacionales y ESG en tu base de proveedores — antes de que impacten el negocio.",
    outcomes: [
      "Mapa de riesgo claro por proveedor y categoría",
      "Protocolos de monitoreo y planes de contingencia",
      "Mayor continuidad operacional ante disrupciones",
      "Trazabilidad lista para auditoría y compliance",
    ],
    approach: [
      "Evaluación y segmentación de riesgo",
      "Due diligence y scoring de proveedores",
      "Planes de mitigación y diversificación",
      "Reportes ejecutivos y gobierno continuo",
    ],
  },
  {
    slug: "bpo-abastecimiento",
    title: "BPO de Abastecimiento",
    pillar: "Managed Services",
    headline: "Tu operación de compras, funcionando a la perfección",
    intro:
      "Nos hacemos cargo de la operación transaccional y de contratos para que tu equipo se concentre en lo estratégico y en generar valor al negocio.",
    outcomes: [
      "Operación más eficiente y transparente",
      "SLAs medibles en todo el ciclo de compra",
      "Menor costo fijo del área",
      "Escala sin aumentar headcount",
    ],
    approach: [
      "Diseño del modelo BPO y plan de transición",
      "Operación de compras y gestión de contratos",
      "Reportes y mejora continua",
      "Integración con ERP y e-procurement",
    ],
    bpo: {
      vision: {
        eyebrow: "BPO — Managed Services",
        title: "Más que operar compras",
        intro:
          "Combinamos talento, tecnología y datos para que tu área de compras genere más valor con menos fricción — no solo más personas.",
        pillars: [
          {
            num: "1",
            title: "Talento especializado",
            description:
              "Equipos expertos en sourcing, escalables según tu operación y unidades de negocio.",
          },
          {
            num: "2",
            title: "Analítica e inteligencia artificial",
            description:
              "Convertimos datos de gasto en oportunidades de ahorro, consolidación y mejora del canal de compra.",
          },
          {
            num: "3",
            title: "Contratos y continuidad",
            description:
              "Vigilamos cumplimiento contractual y desempeño de proveedores para que no se escape valor.",
          },
          {
            num: "4",
            title: "Mejora continua",
            description:
              "Optimizamos la operación de forma proactiva, con datos y mejores prácticas del mercado.",
          },
          {
            num: "5",
            title: "Compromiso ESG",
            description:
              "Seguimos programas de proveedores en diversidad, liderazgo femenino, comunidades y huella de carbono.",
          },
        ],
        valueEnablersTitle: "Qué acelera el valor",
        valueEnablers: [
          "Especialistas por categoría cuando hace falta",
          "Cumplimiento de SLAs acordados",
          "Mejores prácticas de la industria",
        ],
        automationEnablersTitle: "Qué automatiza la operación",
        automationEnablers: [
          "Herramientas y plantillas de gestión de contratos",
          "Catálogos y marketplace",
          "Tecnología de compras integrada al servicio",
        ],
      },
      operatingModel: {
        title: "Un modelo para cada tipo de gasto",
        intro:
          "Estrategia, tecnología y equipos especializados para cada segmento — del gasto estratégico al tail spend.",
        layers: [
          {
            title: "Gasto estratégico — donde está el mayor valor",
            items: [
              "Gestión de categorías y sourcing estratégico",
              "Análisis de costos y gestión de categorías clave",
              "Administración de convenios y contratos",
              "Captura de valor y transformación",
            ],
          },
          {
            title: "Gasto táctico y spot — velocidad y control",
            items: [
              "Gestión de categorías tácticas y tail spend",
              "Compras por catálogo y compras guiadas",
              "Mesa de ayuda y soporte de sistemas",
              "Compliance, desempeño y riesgo de proveedores",
            ],
          },
          {
            title: "Torre de control — visibilidad total",
            items: [
              "Inteligencia de proveedores, analytics y seguimiento de proyectos",
              "Gestión de contratos e inteligencia de mercado",
              "Gobierno corporativo y mejora de procesos",
              "Automatización e integración con ERP",
            ],
          },
          {
            title: "Tecnología incluida en el servicio",
            items: [
              "Workbench de categorías, catálogos y compras guiadas",
              "Sourcing simplificado y asistentes con IA",
              "Portal de compradores integrado con SAP y tus sistemas",
              "Visibilidad de punta a punta para quien decide",
            ],
          },
        ],
        technologyNote:
          "Plataformas de clase mundial como servicio: tecnología de punta sin que tengas que invertir en licencias ni sistemas propios.",
      },
      spendSegments: {
        title: "Cada peso de gasto, bien gestionado",
        intro:
          "Liberamos a tu equipo estratégico para que se enfoque en crear valor, mientras la operación táctica corre con agilidad y control.",
        segments: [
          {
            id: "strategic",
            name: "Gasto estratégico",
            spendShare: "~80% del gasto total",
            txShare: "~10% transacciones",
            focus: "Donde negociamos condiciones que mueven el P&L.",
            bullets: [
              "Revisión de especificaciones y costo total del servicio",
              "Gestión de demanda con mirada externa y experta",
              "Negociación de condiciones excepcionales con proveedores",
              "Implementamos el cambio, no solo lo recomendamos",
            ],
          },
          {
            id: "tactical",
            name: "Gasto táctico",
            spendShare: "~15% del gasto total",
            txShare: "~30% transacciones",
            focus: "Operación eficiente de compras del día a día.",
            bullets: [
              "Gestión de solicitudes alineada a tus políticas",
              "Menos pasos y aprobaciones más simples",
              "Visibilidad total con operación externalizada",
              "Canal de compra optimizado",
            ],
          },
          {
            id: "tail",
            name: "Tail spend",
            spendShare: "~5% del gasto total",
            txShare: "~60% transacciones",
            focus: "Agilidad y control en compras de bajo valor.",
            bullets: [
              "Compras guiadas que simplifican el proceso",
              "Automatización y cumplimiento vía catálogos",
              "Adhesión a precios y convenios ya negociados",
              "Gestión proactiva de convenios y categorías relevantes",
            ],
          },
        ],
      },
      operationModels: {
        title: "El modelo que se adapta a tu necesidad",
        intro:
          "Cuatro formas de trabajar juntos. Elegimos la que mejor calza con tu urgencia, complejidad y objetivos de negocio.",
        models: [
          {
            id: "staff-augmentation",
            name: "Staff Augmentation",
            tagline: "Refuerzo inmediato",
            bullets: [
              "Profesionales con el perfil exacto que necesitas",
              "Cobertura de vacantes, adecuación técnica y herramientas digitales",
              "Gestión legal, normativa y laboral incluida",
              "Ideal para continuidad operativa o refuerzo puntual",
            ],
            economics: "Tarifa mensual por recurso, con supervisión de tu equipo.",
          },
          {
            id: "bpo",
            name: "BPO",
            tagline: "Operación completa",
            bullets: [
              "Externalizamos personas, procesos y resultados",
              "Torres de control y modelos digitales para más visibilidad",
              "Reclutamiento, capacitación y gestión a nuestro cargo",
              "Impacto en 24–36 meses: ahorros y operación sostenible",
            ],
            economics: "Tarifa mensual clara, ligada a volumen y resultados.",
          },
          {
            id: "digital-bpo",
            name: "Digital BPO",
            tagline: "Tecnología incluida",
            bullets: [
              "Personas, procesos y plataforma en un solo servicio",
              "Procuretech, torres de control y analytics sin inversión inicial",
              "Procesos estandarizados con visibilidad en tiempo real",
              "Operación multi-país en una plataforma integrada",
            ],
            economics: "Tarifa mensual + fee por uso, ligado a eficiencias logradas.",
          },
          {
            id: "managed-services",
            name: "Managed Services integral",
            tagline: "Resultados de punta a punta",
            bullets: [
              "Eficiencia y transparencia desde el primer día",
              "Liberamos a tu equipo para lo estratégico",
              "Integración con ERP, e-procurement y analytics",
              "Track record en minería y extractivas: +100 FTE en operaciones de largo plazo",
            ],
            economics: "Modelo recurrente alineado a SLAs, volumen y captura de valor.",
          },
        ],
      },
      measurement: {
        title: "Resultados que se miden y se ven",
        intro:
          "Seguimos la satisfacción de usuarios, la calidad de la operación y la percepción de valor — con indicadores claros y reportes accionables.",
        bullets: [
          "Encuestas de satisfacción por usuarios, operaciones y servicios",
          "Cobertura y calificación por segmento de gasto",
          "Dashboards con visibilidad del flujo operativo completo",
          "Seguimiento oportuno de compras y órdenes de compra",
        ],
      },
      platform: {
        title: "Control total del ciclo de compra",
        intro:
          "Seguimos cada iniciativa de punta a punta: tickets, trazabilidad, avances y cumplimiento — con visibilidad permanente para tu equipo.",
        capabilities: [
          "Tickets con historial de interacciones por iniciativa",
          "Control de PO, aprobaciones y notificaciones automatizadas",
          "Cronogramas y dashboards de resultados por orden de compra",
          "Resumen ejecutivo para activar mejoras del servicio",
        ],
        flexibilityNote:
          "Operamos con nuestra plataforma propia o nos adaptamos a la tuya, integrándonos a tus procesos y políticas sin fricción.",
      },
    },
  },
  {
    slug: "pay-scf",
    title: "PAY y Supply Chain Finance",
    pillar: "Managed Services",
    headline: "Más caja en la cadena, mejores relaciones con proveedores",
    intro:
      "Diseñamos programas de financiamiento y optimización de capital de trabajo que benefician a tu empresa y a tu base de proveedores.",
    outcomes: [
      "Extensión de plazos de pago donde tiene sentido comercial",
      "Mejor DPO y conversión de caja",
      "Programas SCF con proveedores estratégicos",
      "Acuerdos win-win con tu cadena de suministro",
    ],
    approach: [
      "Diagnóstico de capital de trabajo",
      "Diseño del programa PAY/SCF",
      "Negociación con banca y proveedores",
      "Implementación y seguimiento",
    ],
  },
  {
    slug: "working-capital-solutions",
    title: "Working Capital Solutions",
    pillar: "Cash & Liquidez",
    headline: "Más caja, con diagnóstico antes que banca",
    intro:
      "Programa integral en cuatro pilares: diagnóstico cuantitativo, diseño del programa de capital de trabajo, financiamiento de cadena con los mejores partners y renegociación de contratos. Sin conflicto de interés.",
    outcomes: [
      "Diagnóstico de DPO, gasto y oportunidad de caja antes de estructurar financiamiento",
      "Priorización de proveedores por impacto en flujo de caja",
      "Programas SCF multibanco: confirming, pronto pago y portal de proveedores",
      "Tus KPIs — DPO, EBITDA y FCF — no los del banco",
    ],
    approach: [
      "Diagnóstico y segmentación con plataforma Calculum",
      "Diseño de programa DPO, cuentas por pagar y tesorería",
      "Implementación SCF con Monkey y banca multibanco",
      "Auditoría y renegociación de contratos y costo total",
    ],
    wcs: {
      platform: {
        eyebrow: "Plataforma en acción",
        title: "Del diagnóstico a la ejecución — en una sola vista",
        intro:
          "Dashboard ejecutivo, segmentación de proveedores, cascada de flujo de caja y ficha por contraparte. Cifras ilustrativas; cada cliente parte de su realidad.",
        tourHintAuto: "Recorrido automático · haz clic en un paso para detenerlo",
        tourHintLocked: "Lámina seleccionada. Haz clic en otra para explorar.",
      },
      platformSteps: [
        {
          id: "dashboard",
          title: "Dashboard ejecutivo",
          subtitle: "DPO, oportunidad, caja potencial y gasto analizado",
        },
        {
          id: "segmentation",
          title: "Segmentación de proveedores",
          subtitle: "Priorización por impacto y viabilidad",
        },
        {
          id: "waterfall",
          title: "Cascada de flujo de caja",
          subtitle: "Extensión de plazos y caja potencial por estrategia",
        },
        {
          id: "supplier",
          title: "Ficha de proveedor",
          subtitle: "Benchmark, scoring y estrategia por contraparte",
        },
      ],
      pillarsTitle: "Cuatro pilares, un solo programa",
      pillarsIntro:
        "Cada pilar tiene responsable, entregables y partners especializados. Coordinamos el programa de punta a punta.",
      pillars: [
        {
          num: "01",
          title: "Diagnóstico",
          partner: "Calculum",
          bullets: [
            "Analytics de gasto y benchmarks de DPO por industria",
            "Segmentación y scoring de proveedores",
            "Línea base para presentar al comité ejecutivo",
          ],
        },
        {
          num: "02",
          title: "Diseño del programa",
          bullets: [
            "Políticas de DPO y cuentas por pagar",
            "Tesorería, proyección de caja y automatización",
            "Plan de captura en 8–12 semanas",
          ],
        },
        {
          num: "03",
          title: "Financiamiento de cadena",
          partner: "Monkey",
          bullets: [
            "Confirming multibanco y pronto pago",
            "Portal de proveedores y onboarding",
            "Acuerdos win-win sin depender de un solo banco",
          ],
        },
        {
          num: "04",
          title: "Contratos y costo total",
          bullets: [
            "Auditoría de contratos y condiciones comerciales",
            "Renegociación de plazo, precio y volumen",
            "Alineación entre legal, compras y finanzas",
          ],
        },
      ],
      differentiatorsTitle: "Qué nos diferencia",
      differentiators: [
        {
          title: "Diagnóstico primero",
          description:
            "Partimos con datos y segmentación — no con un producto financiero empaquetado.",
        },
        {
          title: "8–12 semanas",
          description:
            "Programa acotado con hitos claros, del diagnóstico a la implementación.",
        },
        {
          title: "Tus KPIs, no los del banco",
          description:
            "Medimos DPO, EBITDA y flujo de caja de tu negocio — no solo volumen colocado.",
        },
        {
          title: "Sin conflicto de interés",
          description:
            "Independientes en banca y tecnología; elegimos la mejor combinación para tu caso.",
        },
        {
          title: "Los mejores partners",
          description:
            "Calculum para analytics, Monkey para SCF, GEP y otros según tu stack.",
        },
        {
          title: "Ejecución, no presentaciones",
          description:
            "Implementamos, negociamos y hacemos seguimiento hasta ver impacto en caja.",
        },
      ],
      partnersTitle: "Partners del programa",
      partnerNames: ["Calculum", "Monkey", "GEP"],
    },
  },
  {
    slug: "cadena-suministro-digital",
    title: "Cadena de Suministro Digital",
    pillar: "Digital Procurement",
    headline: "Tecnología que se adopta — y que genera resultados",
    intro:
      "Como partners de Ariba, GEP y Jaggaer, llevamos la digitalización de punta a punta: selección, implementación, adopción y resultados medibles.",
    outcomes: [
      "Visibilidad total del gasto y los contratos",
      "Ciclos de compra más cortos",
      "Compliance y trazabilidad de punta a punta",
      "ROI medible en adopción y ahorro",
    ],
    approach: [
      "Business case y selección de plataforma",
      "Implementación y configuración",
      "Capacitación y gestión del cambio",
      "Soporte post go-live y optimización",
    ],
  },
  {
    slug: "automatizacion",
    title: "Automatización",
    pillar: "Digital Procurement",
    headline: "Menos tareas manuales. Más capacidad para lo estratégico.",
    intro:
      "Automatizamos flujos repetitivos, aprobaciones y datos maestros para que tu equipo se enfoque en análisis y negociación.",
    outcomes: [
      "Menos trabajo manual en procesos repetitivos",
      "Datos maestros más limpios y confiables",
      "Tiempos de ciclo predecibles",
      "Base lista para analytics e inteligencia artificial",
    ],
    approach: [
      "Mapeo de procesos y quick wins",
      "Automatización y workflows digitales",
      "Integración con ERP y P2P",
      "Medición de productividad",
    ],
  },
  {
    slug: "implementacion-eficiencias",
    title: "Implementación de Eficiencias",
    pillar: "Ejecución",
    headline: "Del plan al impacto real",
    intro:
      "Acompañamos la implementación de iniciativas de eficiencia con equipos en terreno y seguimiento riguroso hasta cerrar valor en P&L y caja.",
    outcomes: [
      "Seguimiento con Value Realization Office (VRO)",
      "Adopción sostenida en el equipo",
      "Ahorros verificables en tus resultados",
      "Transferencia de capacidades al equipo interno",
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
    highlightLabel: "personas en equipo BPO.",
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
    highlightLabel: "escala de ventas del cliente.",
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
    highlightLabel: "transformación end-to-end.",
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
    highlightLabel: "horas bajo gestión anual.",
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
    highlightLabel: "savings + capability build.",
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
    highlightLabel: "y OPEX bajo gestión.",
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
      "Para conocer más sobre las ventajas de esta alianza, escríbenos a contacto@xinergy.cl.",
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
      "Exigimos el mismo estándar en programas de eficiencia sostenible: la cadena externa es parte del impacto real que medimos y ejecutamos contigo.",
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

export const teamMembers = [
  {
    name: "Roberto Uauy",
    role: "Socio",
    image: "/team/people/roberto.jpg",
    objectPosition: "center center",
  },
  {
    name: "Gonzalo de la Barra",
    role: "Socio",
    image: "/team/people/gonzalo-de-la-barra.jpg",
    objectPosition: "center 20%",
  },
  {
    name: "Diego Jorreto",
    role: "Gerente Comercial",
    image: "/team/people/diego-jorreto.jpg",
    objectPosition: "center 28%",
  },
  {
    name: "Sandra",
    role: "Directora Comercial",
    image: "/team/people/sandra.jpg",
    objectPosition: "center 20%",
  },
  {
    name: "Esteban Vallejos",
    role: "Country Manager · México",
    image: "/team/people/esteban-vallejos.jpg",
    objectPosition: "center 22%",
  },
  {
    name: "Marcelo Moreno",
    role: "Country Manager · Colombia",
    image: "/team/people/marcelo-moreno.jpg",
    objectPosition: "center 24%",
  },
  {
    name: "Celso Alberti",
    role: "Socio · Director Brasil",
    image: "/team/people/celso-alberti.jpg",
    objectPosition: "center 24%",
  },
  {
    name: "Christophe Le Flech",
    role: "VP Consulting",
    image: "/team/people/christophe-le-flech.jpg",
    objectPosition: "center 26%",
  },
  {
    name: "Pablo Valencia",
    role: "VP Strategic Sourcing",
    image: "/team/people/pablo-valencia.jpg",
  },
  {
    name: "Gonzalo Aguirrebeña",
    role: "Gerente · Cumplimiento y Legal",
    image: "/team/people/gonzalo-aguirre.jpg",
    objectPosition: "center 20%",
  },
  {
    name: "Karin Schuster",
    role: "HR Business Partner",
    image: "/team/people/karin-schuster.jpg",
  },
  {
    name: "Pedro Pablo Maurel",
    role: "Gerente · BPO & Managed Services",
    image: "/team/people/pedro-pablo-maurel.jpg",
    objectPosition: "center 24%",
  },
] as const;

export const teamOffsite = {
  eyebrow: "El equipo",
  title: "Llegamos juntos a la meta",
  location: "Torres del Paine · 2024",
  quote:
    "Los desafíos más exigentes se conquistan en equipo — en la montaña y en el negocio.",
  body:
    "En 2024 nos reunimos en el sur de Chile, en Torres del Paine. OneX VPs, directores, advisors, fundadores y socios caminamos hasta la meta con el mismo espíritu con el que somos tus socios en la ejecución: nos preparamos, nos esforzamos y llegamos juntos al destino.",
  image: "/team/equipo-torres-paine-2024.png",
  imageAlt: "Equipo Xinergy en Torres del Paine, 2024 — OneX VPs, directores, advisors, fundadores y socios",
  imageSecondary: "/team/equipo-grupo-2024.png",
  imageSecondaryAlt:
    "Equipo Xinergy reunido — profesionales de toda la región en nuestras oficinas",
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
  cultureTitle: "Cómo trabajamos",
  cultureLink: "Conoce más sobre nosotros →",
} as const;

export const nosotrosPage = {
  metaTitle: "Nosotros",
  eyebrow: "Nosotros",
  aboutBody1:
    "Ejecutamos e implementamos eficiencias en procesos, abastecimiento y operación — con impacto en ahorros, EBITDA y caja. No nos quedamos en la presentación: assessment, sourcing, BPO, cash management y Procuretech según lo que cada desafío requiera.",
  aboutBody2: `Presencia en 6 países (${presenceLabel}), con oficinas en ${officesLabel}. Medimos, implementamos y ejecutamos contigo — con VRO, change management y tecnología certificada.`,
  carbonNeutralBody:
    "Certificación internacional CarbonNeutral Protocol: emisiones neto cero en nuestra operación y en programas de eficiencia sostenible.",
  teamEyebrow: "Equipo",
  teamTitle: "Liderazgo de Xinergy",
  teamLead:
    "Socios, VPs y líderes regionales — parte del equipo que ejecuta y acompaña a nuestros clientes en Latinoamérica.",
} as const;

export const nav = [
  { label: "Nosotros", href: "/nosotros" },
  { label: "Casos", href: "/casos" },
  { label: "Insights", href: "/insights" },
  { label: "Trabaja con nosotros", href: "/trabaja-con-nosotros" },
] as const;

export const servicesPage = {
  metaTitle: "Servicios",
  metaDescription:
    "Seis líneas de ejecución: eficiencias, transformación, sourcing, BPO, digitalización e implementación con VRO.",
  eyebrow: "Servicios",
  title: "Ejecutamos eficiencias",
  description: "Seis líneas de ejecución. Impacto medible en P&L, EBITDA y caja.",
  viewPrimary: "Ver servicio principal →",
  allLinesTitle: "Todas las líneas de servicio",
} as const;

export const industriesPage = {
  metaTitle: "Industrias",
  metaDescription:
    "Eficiencias por industria en Latinoamérica — retail, seguros, automotriz, energía y más.",
  eyebrow: "Industrias",
  title: "Cada industria tiene sus propias palancas de eficiencia",
  description:
    "Hablamos el idioma de tu sector — con casos, métricas y equipos que conocen tus categorías críticas.",
  explore: "Explorar →",
  sectorLabel: "Industria",
  challengesTitle: "Desafíos del sector",
  howWeHelpTitle: "Cómo ayudamos",
} as const;

export const casesPage = {
  metaTitle: "Casos de éxito",
  metaDescription: "Eficiencias y resultados verificables para empresas líderes en LATAM.",
  eyebrow: "Casos de éxito",
  title: "Resultados que hablan",
  description:
    "Desafío, enfoque y resultados — sin presentaciones vacías. Pídenos más detalle sobre cualquier caso.",
} as const;

export const insightsPage = {
  metaTitle: "Insights",
  metaDescription:
    "Investigación, alianzas y perspectivas sobre eficiencia y abastecimiento en LATAM.",
  eyebrow: "Insights",
  title: "Perspectivas que abren puertas",
  description:
    "Informes, alianzas y análisis que posicionan a Xinergy como referente regional — no como un blog más.",
} as const;

export const contactContexts = {
  casos: {
    eyebrow: "Casos de éxito",
    title: "Llena el formulario para conocer más de nuestros casos de éxito",
    description: "Te compartimos el detalle de casos similares al tuyo. Respondemos en 24 horas hábiles.",
  },
  diagnostico: {
    eyebrow: "Diagnóstico",
    title: "Agenda tu diagnóstico",
    description:
      "Cuéntanos sobre tu operación y profundizamos las eficiencias que viste en el cálculo.",
  },
  insights: {
    eyebrow: "Insights",
    title: "¿Quieres profundizar en este tema?",
    description:
      "Escríbenos y te respondemos con más contexto sobre eficiencias y abastecimiento en LATAM.",
  },
  default: {
    eyebrow: "Contacto",
    title: "Primera conversación estratégica",
    description: "Sin compromiso. Te respondemos en 24 horas hábiles.",
  },
} as const;
