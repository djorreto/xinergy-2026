import type { IndustryId, SpendBand } from "./calculator";
import type { Locale } from "@/i18n/routing";

export type MaturityQuestion = {
  id: string;
  question: string;
  lowLabel: string;
  highLabel: string;
};

export type ToolQuestion = {
  id: string;
  question: string;
};

export type CalculatorCopy = {
  industries: Record<IndustryId, string>;
  spendBands: Record<SpendBand, string>;
  maturityQuestions: MaturityQuestion[];
  toolQuestions: ToolQuestion[];
  priorityLevers: Record<string, string>;
  recommendedServices: Record<string, string>;
  disclaimer: string;
  maturityLevels: Record<string, string>;
};

const es: CalculatorCopy = {
  industries: {
    retail: "Retail & consumo",
    mineria: "Minería",
    seguros: "Seguros",
    financiero: "Servicios financieros",
    automotriz: "Automotriz",
    energia: "Energía & recursos",
    manufactura: "Manufactura",
    otro: "Otra industria",
  },
  spendBands: {
    "0-5": "Menos de USD 5 millones",
    "5-25": "USD 5 – 25 millones",
    "25-100": "USD 25 – 100 millones",
    "100-500": "USD 100 – 500 millones",
    "500-2000": "USD 500M – 2.000 millones",
    "2000+": "Más de USD 2.000 millones",
  },
  maturityQuestions: [
    {
      id: "visibility",
      question: "¿Tienen visibilidad consolidada del gasto con proveedores (directo + indirecto)?",
      lowLabel: "Muy limitada",
      highLabel: "Completa y actualizada",
    },
    {
      id: "governance",
      question: "¿Existe gobierno de compras (políticas, categorías, comités)?",
      lowLabel: "No formalizado",
      highLabel: "Maduro y ejecutado",
    },
    {
      id: "sourcing",
      question: "¿Las categorías críticas siguen un proceso estructurado de sourcing/negociación?",
      lowLabel: "Ad hoc",
      highLabel: "Sistemático con benchmarks",
    },
    {
      id: "digital",
      question: "¿Usan herramientas digitales de compras (e-procurement) con adopción real?",
      lowLabel: "Manual / Excel",
      highLabel: "Plataforma integrada",
    },
    {
      id: "savings",
      question: "¿Hacen tracking formal de eficiencias contra el P&L?",
      lowLabel: "No",
      highLabel: "Sí, auditado",
    },
  ],
  toolQuestions: [
    {
      id: "negotiationTool",
      question: "¿Cuenta con una herramienta especializada para negociaciones y licitaciones?",
    },
    {
      id: "stockPlanningTool",
      question: "¿Cuenta con una herramienta para compras de stock planificadas?",
    },
  ],
  priorityLevers: {
    visibility: "Spend analytics y visibilidad de gasto",
    governance: "Gobierno y operating model de procurement",
    sourcing: "Strategic sourcing en categorías de mayor spend",
    digital: "Digitalización y e-procurement",
    savings: "Savings assurance y tracking a P&L",
    default: "Optimización de categorías tácticas y estratégicas",
  },
  recommendedServices: {
    visibility: "Abastecimiento estratégico",
    governance: "Procurement Transformation",
    sourcing: "Abastecimiento estratégico",
    digital: "Cadena de suministro digital",
    savings: "Abastecimiento estratégico",
    default1: "Abastecimiento estratégico",
    default2: "Gestión de riesgo de proveedores",
  },
  disclaimer:
    "Estimación referencial elaborada con base en la información ingresada. No constituye oferta comercial, asesoría vinculante ni garantía de resultados; los montos y supuestos definitivos estarán sujetos a un assessment y a la validación de la información.",
  maturityLevels: {
    Inicial: "Inicial",
    "En desarrollo": "En desarrollo",
    Definido: "Definido",
    Avanzado: "Avanzado",
    Optimizado: "Optimizado",
  },
};

const en: CalculatorCopy = {
  industries: {
    retail: "Retail & consumer",
    mineria: "Mining",
    seguros: "Insurance",
    financiero: "Financial services",
    automotriz: "Automotive",
    energia: "Energy & resources",
    manufactura: "Manufacturing",
    otro: "Other industry",
  },
  spendBands: {
    "0-5": "Less than USD 5 million",
    "5-25": "USD 5 – 25 million",
    "25-100": "USD 25 – 100 million",
    "100-500": "USD 100 – 500 million",
    "500-2000": "USD 500M – 2 billion",
    "2000+": "More than USD 2 billion",
  },
  maturityQuestions: [
    {
      id: "visibility",
      question: "Do you have consolidated visibility of supplier spend (direct + indirect)?",
      lowLabel: "Very limited",
      highLabel: "Complete and up to date",
    },
    {
      id: "governance",
      question: "Is there procurement governance (policies, categories, committees)?",
      lowLabel: "Not formalized",
      highLabel: "Mature and enforced",
    },
    {
      id: "sourcing",
      question: "Do critical categories follow a structured sourcing/negotiation process?",
      lowLabel: "Ad hoc",
      highLabel: "Systematic with benchmarks",
    },
    {
      id: "digital",
      question: "Do you use digital procurement tools (e-procurement) with real adoption?",
      lowLabel: "Manual / Excel",
      highLabel: "Integrated platform",
    },
    {
      id: "savings",
      question: "Do you formally track efficiencies against the P&L?",
      lowLabel: "No",
      highLabel: "Yes, audited",
    },
  ],
  toolQuestions: [
    {
      id: "negotiationTool",
      question: "Do you have a specialized tool for negotiations and RFPs?",
    },
    {
      id: "stockPlanningTool",
      question: "Do you have a tool for planned stock purchasing?",
    },
  ],
  priorityLevers: {
    visibility: "Spend analytics and spend visibility",
    governance: "Procurement governance and operating model",
    sourcing: "Strategic sourcing in highest-spend categories",
    digital: "Digitalization and e-procurement",
    savings: "Savings assurance and P&L tracking",
    default: "Tactical and strategic category optimization",
  },
  recommendedServices: {
    visibility: "Strategic sourcing",
    governance: "Procurement Transformation",
    sourcing: "Strategic sourcing",
    digital: "Digital supply chain",
    savings: "Strategic sourcing",
    default1: "Strategic sourcing",
    default2: "Supplier risk management",
  },
  disclaimer:
    "Reference estimate based on the information provided. This does not constitute a commercial offer, binding advice, or guarantee of results; final amounts and assumptions are subject to an assessment and validation of information.",
  maturityLevels: {
    Inicial: "Initial",
    "En desarrollo": "Developing",
    Definido: "Defined",
    Avanzado: "Advanced",
    Optimizado: "Optimized",
  },
};

const pt: CalculatorCopy = {
  industries: {
    retail: "Retail & consumo",
    mineria: "Mineração",
    seguros: "Seguros",
    financiero: "Serviços financeiros",
    automotriz: "Automotivo",
    energia: "Energia & recursos",
    manufactura: "Manufatura",
    otro: "Outra indústria",
  },
  spendBands: {
    "0-5": "Menos de USD 5 milhões",
    "5-25": "USD 5 – 25 milhões",
    "25-100": "USD 25 – 100 milhões",
    "100-500": "USD 100 – 500 milhões",
    "500-2000": "USD 500M – 2 bilhões",
    "2000+": "Mais de USD 2 bilhões",
  },
  maturityQuestions: [
    {
      id: "visibility",
      question: "Vocês têm visibilidade consolidada do gasto com fornecedores (direto + indireto)?",
      lowLabel: "Muito limitada",
      highLabel: "Completa e atualizada",
    },
    {
      id: "governance",
      question: "Existe governança de compras (políticas, categorias, comitês)?",
      lowLabel: "Não formalizado",
      highLabel: "Maduro e executado",
    },
    {
      id: "sourcing",
      question: "As categorias críticas seguem um processo estruturado de sourcing/negociação?",
      lowLabel: "Ad hoc",
      highLabel: "Sistemático com benchmarks",
    },
    {
      id: "digital",
      question: "Usam ferramentas digitais de compras (e-procurement) com adoção real?",
      lowLabel: "Manual / Excel",
      highLabel: "Plataforma integrada",
    },
    {
      id: "savings",
      question: "Fazem tracking formal de eficiências contra o P&L?",
      lowLabel: "Não",
      highLabel: "Sim, auditado",
    },
  ],
  toolQuestions: [
    {
      id: "negotiationTool",
      question: "Você conta com uma ferramenta especializada para negociações e licitações?",
    },
    {
      id: "stockPlanningTool",
      question: "Você conta com uma ferramenta para compras de estoque planejadas?",
    },
  ],
  priorityLevers: {
    visibility: "Spend analytics e visibilidade de gasto",
    governance: "Governança e operating model de procurement",
    sourcing: "Strategic sourcing em categorias de maior spend",
    digital: "Digitalização e e-procurement",
    savings: "Savings assurance e tracking no P&L",
    default: "Otimização de categorias táticas e estratégicas",
  },
  recommendedServices: {
    visibility: "Abastecimento estratégico",
    governance: "Procurement Transformation",
    sourcing: "Abastecimento estratégico",
    digital: "Cadeia de suprimentos digital",
    savings: "Abastecimento estratégico",
    default1: "Abastecimento estratégico",
    default2: "Gestão de risco de fornecedores",
  },
  disclaimer:
    "Estimativa referencial elaborada com base nas informações inseridas. Não constitui oferta comercial, assessoria vinculante nem garantia de resultados; os valores e premissas definitivos estarão sujeitos a um assessment e à validação das informações.",
  maturityLevels: {
    Inicial: "Inicial",
    "En desarrollo": "Em desenvolvimento",
    Definido: "Definido",
    Avanzado: "Avançado",
    Optimizado: "Otimizado",
  },
};

const copies: Record<Locale, CalculatorCopy> = { es, en, pt };

export function getCalculatorCopy(locale: string): CalculatorCopy {
  if (locale in copies) return copies[locale as Locale];
  return copies.es;
}

export function formatUsd(n: number, locale: string): string {
  const loc = locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-CL";
  if (n >= 1_000_000_000) return `USD ${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `USD ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `USD ${(n / 1_000).toFixed(0)}K`;
  return `USD ${n.toLocaleString(loc)}`;
}
