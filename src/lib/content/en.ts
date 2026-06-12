export const brand = {
  name: "Xinergy",
  tagline: "We deliver efficiencies with real impact.",
  claim: "#Fitness for business",
  strongPhrase: {
    emphasis: "We share risk,",
    body: "we measure, and we're your partners in implementation and execution.",
  },
  pitchLine:
    "We share risk, we measure, and we're your partners in implementation and execution.",
  promise:
    "We implement and execute efficiencies that show up in savings, EBITDA, and cash. We share risk, we measure, and we're your partners in implementation and execution.",
  heroSubline:
    "Execution · Strategic Sourcing · BPO · Cash management · Procuretech",
  cta: "Let's talk",
  email: "contacto@xinergy.cl",
  careersEmail: "seleccion@xinergy.cl",
  address:
    "Av. Andrés Bello 2457, piso 16, Of. 1603, Providencia, Santiago, Chile",
  phone: "+56 2 1234 5678",
  linkedin: "https://cl.linkedin.com/company/xinergy-latam",
  mondayFormUrl:
    "https://forms.monday.com/forms/embed/f9158027a499677bf868b39393bd5019?r=use1",
} as const;

/** Savings diagnostic recipients (calculator). */
export const leadNotifyEmails = [
  "diego.jorreto@xinergy.cl",
  "roberto.uauy@xinergy.cl",
  "contacto@xinergy.cl",
] as const;

/** Why / What / How — messaging framework */
export const messaging = {
  why: {
    title: "Why",
    intro: "We understand your operation before we move the needle.",
    points: [
      "Assessment and client diagnostics.",
      "Process and operational flow improvement.",
      "Internal team culture and capabilities.",
      "Prioritization with impact on EBITDA and cash.",
      "Team and culture ready to sustain change.",
    ],
  },
  what: {
    title: "What we do",
    intro:
      "We transform operations and procurement end to end — design, implementation, and on-the-ground execution with impact on savings, EBITDA, and cash.",
    points: [
      "Efficiencies through strategic sourcing.",
      "BPO for procurement and contract management.",
      "Cash management and supply chain finance solutions.",
      "Technology, Procuretech, and digital enablement.",
      "Savings, EBITDA improvement, and cash release.",
    ],
  },
  how: {
    title: "How we do it",
    intro: "From planning to execution with real impact.",
    points: [
      "VRO for implementation tracking and value capture.",
      "Change management.",
      "On-the-ground implementation and training.",
      "Sourcing coach and handover to the internal team.",
      "We share risk — incentives aligned to results.",
    ],
  },
} as const;

/** Execution lines — what we do */
export const capabilities = [
  {
    title: "Efficiencies & Process Optimization",
    description:
      "Assessment, process improvement, and operational culture with a focus on measurable impact.",
    href: "/servicios/eficiencias-optimizacion",
  },
  {
    title: "Procurement Transformation",
    description:
      "Redesign of the procurement model: governance, operating model, and team enablement.",
    href: "/servicios/transformacion-abastecimiento",
  },
  {
    title: "Strategic Sourcing",
    description:
      "Execution of sourcing and negotiation projects with impact on P&L, EBITDA, and cash.",
    href: "/servicios/abastecimiento-estrategico",
  },
  {
    title: "Business process outsourcing (BPO) / Procurement Outsourcing",
    description:
      "We run procurement and contracts with SLAs, traceability, and continuous improvement.",
    href: "/servicios/bpo-abastecimiento",
  },
  {
    title: "Digitalization, Automation & Agentization",
    description:
      "Procuretech, automation, and agents that accelerate operations and adoption.",
    href: "/servicios/cadena-suministro-digital",
  },
  {
    title: "Efficiency Implementation",
    description:
      "Value Realization Office (VRO), change management, and on-the-ground implementation until value is captured in P&L and cash.",
    href: "/servicios/implementacion-eficiencias",
  },
] as const;

/** Presence in 6 countries */
export const presenceCountries = [
  "Chile",
  "Brazil",
  "Peru",
  "Colombia",
  "Mexico",
  "United States",
] as const;

/** Own offices */
export const officeCountries = [
  "Chile",
  "Brazil",
  "Mexico",
  "Colombia",
] as const;

export const presenceLabel = presenceCountries.join(" · ");
export const officesLabel = officeCountries.join(" · ");

/** @deprecated use presenceLabel — alias for compat */
export const regions = presenceCountries;
export const regionsLabel = presenceLabel;

export const problemSection = {
  title: "When spend isn't visible, efficiency is lost.",
  intro:
    "Many companies buy without a clear view of total spend. That squeezes margin and leaves procurement teams fighting fires.",
  stats: [
    { value: "4–8%", label: "typical efficiency in year one, by industry." },
    { value: "100%", label: "of our model tied to real savings." },
  ],
  opportunity: "The opportunity: improve the business without putting cash out of your pocket.",
} as const;

/** Simplified copy for the home (less density, clear language) */
export const home = {
  capabilities: {
    title: "What we do",
    headline: "We execute and implement efficiencies.",
    intro: "In projects, operations, and technology — with impact on P&L, EBITDA, and cash.",
  },
  framework: {
    title: "How we drive impact",
    headline: "Why, what, and how we do it.",
    intro:
      "We share risk, we measure, and we're your partners in implementation and execution.",
  },
  services: {
    title: "Six execution lines",
    intro: "Choose one or combine them based on where you are.",
  },
  industries: {
    title: "Industries where we deliver",
    intro: "Presence in 6 countries, with offices in Chile, Brazil, Mexico, and Colombia.",
  },
  cases: {
    label: "Success stories",
    title: "Results that speak.",
    intro:
      "Challenge, approach, and verifiable results in retail, insurance, automotive, and more.",
  },
  cta: {
    eyebrow: "Next step",
    title: "When do we talk?",
    intro: "Estimate opportunities in minutes. We share risk from the first step.",
  },
  chartBand: {
    title: "What do results look like with Xinergy?",
  },
} as const;

export const processSteps = [
  {
    step: "01",
    title: "Assessment",
    description:
      "Maturity, process, and culture diagnostics — with prioritization of impact on EBIT and working capital.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "Operational strategy, governance, and execution roadmap aligned to the business.",
  },
  {
    step: "03",
    title: "Execution",
    description:
      "Sourcing, BPO, cash management, technology, and implementation as the operation requires.",
  },
  {
    step: "04",
    title: "VRO & tracking",
    description:
      "Implementation tracking, change management, and value capture through P&L close.",
  },
  {
    step: "05",
    title: "Scale",
    description:
      "Replicable playbooks, sourcing coach, and internal capabilities for the next wave.",
  },
] as const;

export type FAQ = { q: string; a: string };

export const faqs: FAQ[] = [
  {
    q: "What does «cash neutral» mean?",
    a: "We share risk: the program is funded by the savings generated. You don't pay net fees — our model is tied to verifiable efficiencies in P&L.",
  },
  {
    q: "What industries do you work in?",
    a: "Retail, insurance and financial services, automotive, energy and resources, healthcare, and manufacturing — with presence in 6 countries and offices in Chile, Brazil, Mexico, and Colombia.",
  },
  {
    q: "Do you only advise or do you also execute?",
    a: "We execute and implement end to end — we're your partners in execution: assessment, design, sourcing, BPO, cash management, platforms (GEP, SAP Ariba, Jaggaer), and VRO for value capture.",
  },
  {
    q: "How long until you see results?",
    a: "It depends on spend and maturity. Diagnostics take days; the first savings levers usually activate within weeks with prioritized quick wins.",
  },
  {
    q: "What do I need for the efficiency calculator?",
    a: "Industry, supplier spend, and five maturity questions. Enter your email to see your potential efficiency range in ~2 minutes.",
  },
  {
    q: "How do you measure success?",
    a: "Auditable savings in P&L, procurement cycle KPIs, digital adoption, and, where applicable, ESG metrics across the supply chain.",
  },
];

export const homeFaqs: FAQ[] = [
  {
    q: "What does «no cash risk» mean?",
    a: "We share risk: the savings we generate fund the work. You don't pay net fees for the program.",
  },
  {
    q: "Do you only advise or do you also execute?",
    a: "We're your partners in execution: assessment, sourcing, BPO, technology, and VRO until the impact shows up in your numbers.",
  },
  {
    q: "What countries do you work in?",
    a: "Presence in 6 countries across the region, with offices in Chile, Brazil, Mexico, and Colombia.",
  },
  {
    q: "How do I get started?",
    a: "With the efficiency calculator: a few questions about your spend and maturity, and an opportunity estimate in minutes.",
  },
];

export const heroStats = [
  {
    value: "3B+",
    label: "Spend under management in recent programs.",
    detail: "Direct and indirect spend in sourcing, BPO, and procurement transformation across Latin America.",
  },
  {
    value: "15+",
    label: "Years delivering efficiencies for clients.",
    detail: "Regional track record executing efficiencies with verifiable impact on P&L and cash.",
  },
  {
    value: "6+",
    label: `Presence in 6 countries · offices in ${officesLabel}.`,
    detail: `Operations in ${presenceLabel} with local teams and multi-country projects.`,
  },
  {
    value: "50+",
    label: "More than 50 clients.",
    detail: "Leading companies in retail, mining, insurance, financial services, energy, and manufacturing.",
  },
  {
    value: "120+",
    label: "People in the organization.",
    detail: "Consultants, sourcing specialists, and BPO teams dedicated to capturing value on the ground.",
  },
] as const;

export const stats = [
  ...heroStats,
  { value: "100%", label: "Model aligned to real savings." },
] as const;

export const differentiators = [
  {
    title: "Real impact",
    description: "Savings, EBITDA, and cash — measured and auditable in P&L.",
  },
  {
    title: "We share risk",
    description: "We share risk with you — the program is aligned to verifiable efficiencies in P&L.",
  },
  {
    title: "We're your partners in execution",
    description: "We measure, implement, and execute on the ground with you until value is captured.",
  },
  {
    title: "Carbon neutral",
    description: "Certified operations with environmental criteria in every project.",
  },
] as const;

export const pillars = [
  {
    id: "efficiency",
    title: "Efficiencies & Optimization",
    subtitle: "Processes and culture",
    description:
      "Assessment, process improvement, and operational readiness with measurable impact.",
    href: "/servicios/eficiencias-optimizacion",
    services: [
      "Client assessment",
      "Process optimization",
      "Culture and capabilities",
      "Prioritized quick wins",
    ],
  },
  {
    id: "transformation",
    title: "Procurement Transformation",
    subtitle: "Model and governance",
    description:
      "We redesign how procurement operates: governance, operating model, and roadmap.",
    href: "/servicios/transformacion-abastecimiento",
    services: [
      "Maturity and governance",
      "Operating model",
      "Transformation roadmap",
      "Team enablement",
    ],
  },
  {
    id: "sourcing",
    title: "Strategic Sourcing",
    subtitle: "Savings in P&L and cash",
    description:
      "We execute sourcing and negotiation with tracking through financial close.",
    href: "/servicios/abastecimiento-estrategico",
    services: [
      "Opportunity assessment",
      "Negotiation and RFP",
      "Critical categories",
      "Savings assurance",
    ],
  },
  {
    id: "bpo",
    title: "BPO / Procurement Outsourcing",
    subtitle: "Outsourced operations",
    description:
      "We run procurement and contracts with SLAs, control, and continuous improvement.",
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
    title: "Digitalization & Agentization",
    subtitle: "Procuretech in action",
    description:
      "We implement technology, automation, and agents your team adopts.",
    href: "/servicios/cadena-suministro-digital",
    services: [
      "Procuretech",
      "RPA automation",
      "Agentization",
      "ERP integration",
    ],
  },
  {
    id: "implementation",
    title: "Efficiency Implementation",
    subtitle: "VRO & on-the-ground execution",
    description:
      "We take plan initiatives to measurable results with VRO, change management, and teams on the ground.",
    href: "/servicios/implementacion-eficiencias",
    services: [
      "Value Realization Office (VRO)",
      "Change management",
      "On-the-ground implementation",
      "Savings assurance",
    ],
  },
] as const;

export const services = [
  {
    slug: "eficiencias-optimizacion",
    title: "Efficiencies & Process Optimization",
    pillar: "Diagnostics & Processes",
    headline: "We identify and capture efficiencies where value is lost today",
    intro:
      "We start with a rigorous assessment of spend and operations, prioritize quick wins, and improve processes and culture — with measurable P&L impact before a deep transformation.",
    outcomes: [
      "Efficiency map by category and process with auditable baseline",
      "Prioritized quick wins with owners and capture timelines",
      "More agile procurement processes, with less friction and rework",
      "Team capabilities aligned to results, not just activity",
    ],
    approach: [
      "Assessment of spend, maturity, and critical processes",
      "Lever design and wave-based capture plan",
      "Process optimization and operating rules",
      "Coaching and enablement until impact shows in P&L",
    ],
  },
  {
    slug: "transformacion-abastecimiento",
    title: "Procurement Transformation",
    pillar: "Transformation",
    headline: "The procurement model your business needs to compete",
    intro:
      "We redesign governance, operating model, and the procurement roadmap — aligned to the C-suite, with a focus on EBIT, agility, resilience, and ESG.",
    outcomes: [
      "Governance and committees with clear roles between business and procurement",
      "Operating model and org chart aligned to strategic categories",
      "Transformation roadmap with milestones, investment, and benefits",
      "Technology stack and partners defined to scale the new model",
    ],
    approach: [
      "Maturity assessment and benchmarking vs. peers",
      "Strategy, governance, and operating model design",
      "Wave-based transformation plan with change management",
      "Technology enablement with certified partners",
    ],
  },
  {
    slug: "abastecimiento-estrategico",
    title: "Strategic Sourcing",
    pillar: "Cost & Value",
    headline: "Savings that reach P&L — and stick",
    intro:
      "We identify opportunities in direct and indirect spend, execute sourcing and negotiation, and ensure tracking through financial close.",
    outcomes: [
      "Cost reduction with verifiable EBIT impact",
      "New suppliers and optimized contracts",
      "Spend visibility by category and business unit",
      "ZBB programs and critical categories under control",
    ],
    approach: [
      "Spend analytics and opportunity assessment",
      "Category strategy and RFP design",
      "Negotiation and e-auctions where applicable",
      "Implementation tracking and savings assurance",
    ],
  },
  {
    slug: "gestion-riesgo-proveedores",
    title: "Supplier Risk Management",
    pillar: "Managed Services",
    headline: "Resilience across the external supply chain",
    intro:
      "We map, measure, and mitigate financial, operational, reputational, and ESG risk across the supplier base.",
    outcomes: [
      "Risk map by supplier and category",
      "Monitoring and contingency protocols",
      "Greater operational continuity",
      "Compliance and traceability for audit",
    ],
    approach: [
      "Risk assessment and segmentation",
      "Due diligence and scoring",
      "Mitigation and diversification plans",
      "Governance and executive reporting",
    ],
  },
  {
    slug: "bpo-abastecimiento",
    title: "Procurement BPO",
    pillar: "Managed Services",
    headline: "Outsourced procurement operations at world-class standard",
    intro:
      "We take transactional and contract operations so your internal team can focus on strategic categories and business value.",
    outcomes: [
      "Greater efficiency and operational transparency",
      "Measurable SLAs on procurement cycle",
      "Reduction of fixed cost in the function",
      "Scalability without increasing headcount",
    ],
    approach: [
      "BPO model design and transition",
      "Purchasing & contracts operations",
      "Reporting and continuous improvement",
      "Integration with ERP and e-procurement",
    ],
  },
  {
    slug: "pay-scf",
    title: "PAY and Supply Chain Finance",
    pillar: "Managed Services",
    headline: "Liquidity across the chain without sacrificing supplier relationships",
    intro:
      "We structure financing programs and working capital optimization across the supply chain.",
    outcomes: [
      "Payment term extension where viable",
      "DPO improvement and cash conversion",
      "SCF programs with strategic suppliers",
      "Commercial win-win with the supply base",
    ],
    approach: [
      "Working capital diagnostics",
      "PAY/SCF program design",
      "Negotiation with banks and suppliers",
      "Implementation and monitoring",
    ],
  },
  {
    slug: "cadena-suministro-digital",
    title: "Digital Supply Chain",
    pillar: "Digital Procurement",
    headline: "Platforms that get implemented — not left on the slide",
    intro:
      "As partners of Ariba, GEP, and Jaggaer, we deliver digitalization end to end: selection, implementation, adoption, and results.",
    outcomes: [
      "Greater spend and contract visibility",
      "Shorter procurement cycles",
      "End-to-end compliance and traceability",
      "Measurable ROI in adoption and savings",
    ],
    approach: [
      "Business case and platform selection",
      "Implementation and configuration",
      "Change management and training",
      "Hypercare and post go-live optimization",
    ],
  },
  {
    slug: "automatizacion",
    title: "Automation",
    pillar: "Digital Procurement",
    headline: "Less friction. More throughput in procurement.",
    intro:
      "We automate repetitive flows, approvals, and master data to free up the team's analytical capacity.",
    outcomes: [
      "Reduction of manual work",
      "Fewer master data errors",
      "More predictable cycle times",
      "Foundation ready for analytics and AI",
    ],
    approach: [
      "Process mapping and quick wins",
      "RPA and digital workflows",
      "Integration with ERP and P2P",
      "Productivity measurement",
    ],
  },
  {
    slug: "implementacion-eficiencias",
    title: "Efficiency Implementation",
    pillar: "Execution",
    headline: "From plan to real impact — with VRO and teams on the ground",
    intro:
      "We support the implementation of efficiency initiatives with VRO, change management, and teams that execute alongside the client until value closes in P&L and cash.",
    outcomes: [
      "Implementation tracking with Value Realization Office (VRO)",
      "Change management and sustained adoption across the team",
      "Verifiable savings capture in P&L",
      "Capability transfer with sourcing coach",
    ],
    approach: [
      "Implementation plan and prioritized quick wins",
      "VRO and savings assurance",
      "Training and on-the-ground implementation",
      "Executive reporting through financial close",
    ],
  },
] as const;

export const industries = [
  {
    slug: "retail",
    title: "Retail & Consumer",
    headline: "Procurement that protects margin in pressured retail",
    challenges: [
      "Pressure from new entrants and marketplaces",
      "Inflation in direct and indirect costs",
      "Complexity from omnichannel and assortment velocity",
    ],
    howWeHelp: [
      "Indirect spend optimization (IT, marketing, logistics)",
      "Private label and brand negotiation",
      "Supply resilience in critical categories",
    ],
    metric: "Retail conglomerate case: multi-business procurement > USD 19B sales",
  },
  {
    slug: "seguros",
    title: "Insurance & Financial Services",
    headline: "End-to-end procurement for regulated institutions",
    challenges: [
      "Indirect spend fragmented by business unit",
      "Compliance and traceability requirements",
      "Pressure on operating costs and technology",
    ],
    howWeHelp: [
      "Integrated procurement management model",
      "Governance and board reporting",
      "P2P and contract digitalization",
    ],
    metric: "Latin American insurance company — integrated model deployed",
  },
  {
    slug: "automotriz",
    title: "Automotive",
    headline: "Fast savings without slowing procurement development",
    challenges: [
      "Need for short-term savings",
      "Uneven procurement maturity",
      "Technical categories with high product impact",
    ],
    howWeHelp: [
      "Accelerated savings programs",
      "Internal capability build in parallel",
      "Sourcing in critical components and services",
    ],
    metric: "Automotive retailer — efficiencies and function development in parallel",
  },
  {
    slug: "energia",
    title: "Energy & Resources",
    headline: "CAPEX, OPEX, and suppliers in volatile environments",
    challenges: [
      "Price volatility and supply disruption",
      "CAPEX projects under time and cost pressure",
      "ESG requirements across the chain",
    ],
    howWeHelp: [
      "Direct category and services management",
      "Risk & resilience for critical suppliers",
      "Decarbonization programs across supply",
    ],
    metric: "Regional experience in high-spend categories",
  },
] as const;

export const cases = [
  {
    slug: "minera-chile-bpo",
    title: "Major Chilean mining company",
    industry: "Mining",
    service: "BPO / Procurement Outsourcing",
    challenge:
      "Highly complex procurement operations in a mining environment: high transactional volume, multiple sites and critical categories, with pressure to scale capacity without increasing internal headcount or losing control.",
    approach:
      "Deployment of a BPO model with a dedicated Xinergy team of more than 35 professionals: procurement and contract operations, process SLAs, executive reporting, integration with client systems, and continuous improvement on the ground.",
    results: [
      "Operational team of 35+ people in continuous operation",
      "Traceability and spend control in high-impact categories",
      "Measurable SLAs on procurement cycle and contract management",
      "Scalable capacity for operational demand peaks",
    ],
    highlight: "35+",
    highlightLabel: "people on the BPO team.",
  },
  {
    slug: "retail-conglomerado-latam",
    title: "Latin American retail conglomerate",
    industry: "Retail",
    service: "Strategic Sourcing",
    challenge:
      "Leading company with sales above USD 19B and procurement across five business units without consolidated visibility or common savings levers.",
    approach:
      "Spend diagnostics, cross-cutting governance design, category sourcing programs, and savings tracking with owners per business.",
    results: [
      "Unified multi-BU spend visibility",
      "Savings pipeline prioritized by EBIT impact",
      "Replicable governance model across divisions",
    ],
    highlight: "USD 19B+",
    highlightLabel: "client sales scale.",
  },
  {
    slug: "seguros-latam",
    title: "Latin American insurer",
    industry: "Insurance",
    service: "Procurement Transformation",
    challenge:
      "Fragmented procurement management; need for an integrated procurement model with compliance and efficiency.",
    approach:
      "Operating model design, policies, categories, P2P technology, and hybrid Xinergy-client team.",
    results: [
      "Integrated procurement model implemented",
      "Greater indirect spend control",
      "Internal capability developed in the process",
    ],
    highlight: "Integral",
    highlightLabel: "end-to-end transformation.",
  },
  {
    slug: "retail-software-factory",
    title: "Retailer — Software Factory",
    industry: "Retail",
    service: "Strategic Sourcing",
    challenge:
      "Critical annual development spend (>1.2M hours) without supplier standards or structured negotiation levers.",
    approach:
      "Supplier segmentation, rate benchmarking, RFP, and framework renegotiation with productivity SLAs.",
    results: [
      "Material reduction in unit development cost",
      "Contracts with delivery metrics",
      "Rationalized supplier base",
    ],
    highlight: "1.2M+",
    highlightLabel: "hours under annual management.",
  },
  {
    slug: "automotriz-savings",
    title: "Automotive retailer",
    industry: "Automotive",
    service: "Cost-Reduction",
    challenge:
      "Urgent need for savings and efficiencies while building the procurement function.",
    approach:
      "Dual program: quick wins savings in impact categories + capability roadmap.",
    results: [
      "Savings in an accelerated window",
      "Procurement function structured in parallel",
      "Governance and reporting for management",
    ],
    highlight: "Dual",
    highlightLabel: "savings + capability build.",
  },
  {
    slug: "energia-recursos",
    title: "Energy and resources company",
    industry: "Energy & Resources",
    service: "Strategic Sourcing",
    challenge:
      "Price volatility, supply chain disruption, and CAPEX projects under time, cost, and ESG compliance pressure.",
    approach:
      "Direct category and critical services management, supplier risk mapping, and efficiency programs focused on operational resilience.",
    results: [
      "Greater spend visibility in CAPEX and OPEX categories",
      "Risk mitigation for critical suppliers",
      "Efficiency programs aligned to decarbonization",
    ],
    highlight: "CAPEX",
    highlightLabel: "and OPEX under management.",
  },
] as const;

export const insights = [
  {
    slug: "alianza-gep-latam",
    type: "Partnership",
    title:
      "Xinergy and GEP sign strategic alliance for procurement and supply chain software in LATAM",
    date: "Apr 2023",
    excerpt:
      "GEP SOFTWARE™ available in Latin America: cost reduction, process digitalization, and faster time to market for companies in the region.",
    tag: "Partners",
    icon: "partnership",
    body: [
      "Santiago, Chile — Xinergy, a subsidiary of Matrix Consulting, announced a strategic alliance with GEP®, a leader in strategy, software, and managed services for procurement and supply chain for Fortune 500 and Global 2000 companies.",
      "The alliance combines Xinergy's Latin American market knowledge with GEP's technology and innovation, connecting local needs with global capabilities to reduce costs, digitalize processes, and improve time to market.",
      "Xinergy will sell and implement GEP platforms — digital procurement, contract management, sourcing, supplier risk, and spend management — so companies are more agile, resilient, and competitive amid inflation, cost pressure, and industrial volatility.",
      "«This alliance brings together GEP's global capabilities with the local presence and deep market knowledge of Xinergy and Matrix Consulting. It will allow us to deliver a unique offering, tailored to local needs, that will drive cost reduction and procurement digitalization across the region», said Roberto Uauy, Founding Partner and General Manager of Xinergy.",
      "Ken Legge, GEP's Vice President of Alliances, highlighted that Xinergy will bring technological innovation, localization, and industry experience, especially in LATAM, where local presence and language support are key.",
      "To learn more about the benefits of this alliance, write to us at contacto@xinergy.cl.",
    ],
  },
  {
    slug: "innovacion-gep-procurement",
    type: "Partnership",
    title:
      "Innovation and technology for new procurement and spend management solutions",
    date: "2023",
    excerpt:
      "Alliance with GEP Worldwide® that catalyzes cost reduction, digitalization, and the incorporation of metaverse and AI into the value proposition.",
    tag: "Technology",
    icon: "technology",
    body: [
      "We recently sealed a new alliance within our ecosystem with GEP Worldwide®, a global leader in strategy, software, and managed services for procurement and supply chain for Fortune 500 companies, based in New York, USA.",
      "This alliance catalyzes GEP's experience, cutting-edge technology, and constant innovation with our deep knowledge of regional needs to generate the best solutions in cost reduction, process digitalization, and time to market improvements.",
      "We are also incorporating the capabilities enabled by the metaverse and artificial intelligence (AI) to strengthen our value proposition for clients.",
      "Learn more about this and our metaverse in the feature published in Diario Financiero.",
    ],
    externalUrl: "https://xinergy.cl/potenciando-la-innovacion-y-tecnologia-para-generar-nuevas-soluciones-en-procurement-y-la-gestion-eficaz-del-gasto/",
  },
  {
    slug: "carbono-neutral",
    type: "ESG",
    title: "We Are Carbon Neutral",
    date: "2023",
    excerpt:
      "International CarbonNeutral Protocol certification: net-zero emissions and leadership in the fight against climate change.",
    tag: "Sustainability",
    icon: "carbon-neutral",
    body: [
      "After reducing our emissions to net zero, we received international certification that demonstrates the commitment and leadership we have in the fight against climate change.",
      "This year we received the international CarbonNeutral Protocol certification, which means that every greenhouse gas emission generated by Xinergy is offset through a program that ensures an equivalent amount is removed from the atmosphere through a clean energy project.",
      "«Our commitment to sustainability is absolute. Strengthening our clients' sustainability strategies, embedding ESG policies and practices in their procurement and supply chain processes, cannot be achieved if we are not part of the same model. We want to lead by example to drive sustainable efficiencies across all our clients», says Roberto Aron Uauy Zirinsky, CEO of Xinergy.",
      "To offset Xinergy's carbon emissions during 2021, we chose the Wind Power Portfolio project, a 33 MW wind farm located in the Biobío Region that generates clean energy for 55 thousand homes and prevents 36 thousand tons of CO₂ annually.",
      "At Xinergy we are committed to contributing to the fight against climate change. This certification puts us at the forefront of sustainability, as the first efficiency and procurement consultancy to achieve this important milestone.",
    ],
  },
  {
    slug: "partners-proveedores-carbono-neutral",
    type: "ESG",
    title: "Carbon Neutral Partners and Suppliers",
    date: "2023",
    excerpt:
      "CarbonNeutral certification drives a sustainability focus and ESG practices in procurement and supply chain for our clients.",
    tag: "Sustainability",
    icon: "supply-chain",
    body: [
      "Given the evidence of climate change risks, multiple companies across industries globally have voluntarily committed to decarbonization targets in recent years.",
      "In this context, we hold CarbonNeutral certification, a commitment that allows us to strongly drive a sustainability focus and ESG practices in our clients' procurement and supply chain processes.",
      "We require the same standard in sustainable efficiency programs: the external chain is part of the real impact we measure and execute with you.",
    ],
    externalUrl:
      "https://xinergy.cl/la-importancia-de-contar-con-partners-y-proveedores-carbono-neutral/",
  },
  {
    slug: "teletrabajo-energias-renovables",
    type: "ESG",
    title: "Remote work and renewable energy",
    date: "2023",
    excerpt:
      "Strategic remote work plan, employee emissions offset, and wind project in Biobío for clean energy.",
    tag: "Sustainability",
    icon: "renewables",
    body: [
      "Among the actions Xinergy has implemented, we established a strategic plan to leverage the benefits of remote work, limiting travel and commuting to what is necessary.",
      "«At the same time, we have decided to offset the direct emissions of our employees in their homes», explains Roberto Uauy, CEO of the company.",
      "In parallel, to offset with high-impact projects in Chile and renewable energy, we chose Wind Power Portfolio, a 33 MW wind farm located in the Biobío Region, which generates clean energy for 55 thousand homes and prevents 36 thousand tons of CO₂ annually.",
      "«Reducing the carbon footprint is not a short-term action; it is a commitment that, once embedded in the organization, cannot be replaced and must have the highest priority for fulfillment, connecting this with the company's purpose».",
    ],
    externalUrl:
      "https://xinergy.cl/xinergy-va-por-el-teletrabajo-y-las-energias-renovables/",
  },
] as const;

export const cultureValues = [
  {
    title: "High performance",
    summary:
      "Highest standard, end-to-end impact, and long-term relationships built on trust.",
  },
  {
    title: "High vitality",
    summary:
      "We think big, innovate, and challenge the status quo — outside the comfort zone.",
  },
  {
    title: "High humanism",
    summary:
      "Successes and failures belong to the team. Wellbeing, development, and ideas valued on merit.",
  },
] as const;

export const teamOffsite = {
  eyebrow: "The team",
  title: "We reach the base together",
  location: "Torres del Paine · Offsite 2024",
  quote:
    "The toughest challenges are conquered as a team — on the mountain and in business.",
  body:
    "In 2024 we gathered in southern Chile for an offsite in Torres del Paine. We hiked to the base of the towers with the same spirit with which we're your partners in execution: we prepare, we push, and we reach the destination together.",
  image: "/team/equipo-torres-paine-2024.png",
  imageAlt: "Xinergy team at the base of Torres del Paine, offsite 2024",
} as const;

export const careersPage = {
  title: "Work with us",
  eyebrow: "Careers",
  lead: "At Xinergy we're always looking for the best talent.",
  socialIntro:
    "Check our social channels or LinkedIn to learn about the team culture and open opportunities.",
  linkedInLabel: "Xinergy on LinkedIn",
  emailIntro: "You can also leave your details and CV at",
  emailOutro:
    "and our HR team will get in touch with you about any opportunity.",
} as const;

export const nosotrosPage = {
  metaTitle: "About us",
  eyebrow: "About us",
  aboutBody1:
    "We execute and implement efficiencies across processes, procurement, and operations — with impact on savings, EBITDA, and cash. We don't stop at slides: assessment, sourcing, BPO, cash management, and Procuretech as each challenge requires.",
  aboutBody2: `Presence in 6 countries (${presenceLabel}), with offices in ${officesLabel}. We measure, implement, and execute with you — with VRO, change management, and certified technology.`,
  carbonNeutralBody:
    "International certification that demonstrates our commitment to net-zero emissions in our operations and in sustainable efficiency programs.",
} as const;

export const nav = [
  { label: "About us", href: "/nosotros" },
  { label: "Cases", href: "/casos" },
  { label: "Insights", href: "/insights" },
  { label: "Work with us", href: "/trabaja-con-nosotros" },
] as const;

export const servicesPage = {
  metaTitle: "Services",
  metaDescription:
    "Six execution lines: efficiencies, transformation, sourcing, BPO, digitalization, and implementation with VRO.",
  eyebrow: "Services",
  title: "We execute efficiencies",
  description: "Six execution lines. Measurable impact on P&L, EBITDA, and cash.",
  viewPrimary: "View primary service →",
  allLinesTitle: "All service lines",
} as const;

export const industriesPage = {
  metaTitle: "Industries",
  metaDescription:
    "Efficiencies by industry in Latin America — retail, insurance, automotive, energy, and more.",
  eyebrow: "Industries",
  title: "Every industry has its own efficiency levers",
  description:
    "We speak your sector's language — with cases, metrics, and teams that know your critical categories.",
  explore: "Explore →",
  sectorLabel: "Industry",
  challengesTitle: "Sector challenges",
  howWeHelpTitle: "How we help",
} as const;

export const casesPage = {
  metaTitle: "Case studies",
  metaDescription: "Efficiencies and verifiable results for leading companies in LATAM.",
  eyebrow: "Case studies",
  title: "Results that speak",
  description:
    "Challenge, approach, and results — no empty decks. Ask us for more detail on any case.",
} as const;

export const insightsPage = {
  metaTitle: "Insights",
  metaDescription:
    "Research, partnerships, and perspectives on efficiency and sourcing in LATAM.",
  eyebrow: "Insights",
  title: "Perspectives that open doors",
  description:
    "Reports, partnerships, and analysis that position Xinergy as a regional reference — not just another blog.",
} as const;

export const contactContexts = {
  casos: {
    eyebrow: "Case studies",
    title: "Fill out the form to learn more about our case studies",
    description: "We'll share details on cases similar to yours. We respond within 24 business hours.",
  },
  diagnostico: {
    eyebrow: "Diagnostic",
    title: "Schedule your diagnostic",
    description:
      "Tell us about your operation and we'll explore the efficiencies you saw in the calculator.",
  },
  insights: {
    eyebrow: "Insights",
    title: "Want to go deeper on this topic?",
    description:
      "Write to us and we'll respond with more context on efficiencies and sourcing in LATAM.",
  },
  default: {
    eyebrow: "Contact",
    title: "First strategic conversation",
    description: "No commitment. We respond within 24 business hours.",
  },
} as const;
