export type IndustryId =
  | "retail"
  | "seguros"
  | "automotriz"
  | "energia"
  | "financiero"
  | "manufactura"
  | "otro";

export type SpendBand =
  | "5-25"
  | "25-100"
  | "100-500"
  | "500-2000"
  | "2000+";

export interface CalculatorInput {
  industry: IndustryId;
  spendBand: SpendBand;
  countries: number;
  maturityAnswers: number[]; // 1-4 each, 5 questions
}

export interface CalculatorResult {
  annualSpendUsd: number;
  addressableSpendUsd: number;
  addressablePct: number;
  maturityScore: number;
  maturityLevel: "Inicial" | "En desarrollo" | "Definido" | "Avanzado" | "Optimizado";
  savingsConservative: number;
  savingsExpected: number;
  savingsAggressive: number;
  rateConservative: number;
  rateExpected: number;
  rateAggressive: number;
  monthsToNeutral: number;
  priorityLevers: string[];
  recommendedServices: string[];
}

export const industries: {
  id: IndustryId;
  label: string;
  baseRate: number;
  addressableBoost: number;
}[] = [
  { id: "retail", label: "Retail & consumo", baseRate: 0.055, addressableBoost: 0.05 },
  { id: "seguros", label: "Seguros", baseRate: 0.065, addressableBoost: 0.04 },
  { id: "financiero", label: "Servicios financieros", baseRate: 0.07, addressableBoost: 0.06 },
  { id: "automotriz", label: "Automotriz", baseRate: 0.045, addressableBoost: 0.03 },
  { id: "energia", label: "Energía & recursos", baseRate: 0.04, addressableBoost: 0.02 },
  { id: "manufactura", label: "Manufactura", baseRate: 0.05, addressableBoost: 0.03 },
  { id: "otro", label: "Otra industria", baseRate: 0.05, addressableBoost: 0.03 },
];

export const spendBands: { id: SpendBand; label: string; midpointUsd: number }[] = [
  { id: "5-25", label: "USD 5 – 25 millones", midpointUsd: 15_000_000 },
  { id: "25-100", label: "USD 25 – 100 millones", midpointUsd: 60_000_000 },
  { id: "100-500", label: "USD 100 – 500 millones", midpointUsd: 250_000_000 },
  { id: "500-2000", label: "USD 500M – 2.000 millones", midpointUsd: 1_000_000_000 },
  { id: "2000+", label: "Más de USD 2.000 millones", midpointUsd: 3_500_000_000 },
];

export const maturityQuestions = [
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
    question: "¿Hacen tracking formal de ahorros contra el P&L?",
    lowLabel: "No",
    highLabel: "Sí, auditado",
  },
] as const;

const serviceMap: Record<string, string[]> = {
  visibility: ["Abastecimiento estratégico", "Procurement Transformation"],
  governance: ["Procurement Transformation", "BPO de Abastecimiento"],
  sourcing: ["Abastecimiento estratégico", "Automatización"],
  digital: ["Cadena de suministro digital", "Automatización"],
  savings: ["Abastecimiento estratégico", "Procurement Transformation"],
};

function getMaturityLevel(score: number): CalculatorResult["maturityLevel"] {
  if (score <= 6) return "Inicial";
  if (score <= 10) return "En desarrollo";
  if (score <= 14) return "Definido";
  if (score <= 17) return "Avanzado";
  return "Optimizado";
}

function getWeakestLevers(answers: number[]): string[] {
  const levers: string[] = [];
  maturityQuestions.forEach((q, i) => {
    if (answers[i] <= 2) {
      levers.push(
        q.id === "visibility"
          ? "Spend analytics y visibilidad de gasto"
          : q.id === "governance"
            ? "Gobierno y operating model de procurement"
            : q.id === "sourcing"
              ? "Strategic sourcing en categorías de mayor spend"
              : q.id === "digital"
                ? "Digitalización y e-procurement"
                : "Savings assurance y tracking a P&L",
      );
    }
  });
  return levers.length ? levers.slice(0, 3) : ["Optimización de categorías tácticas y estratégicas"];
}

export function calculateOpportunity(input: CalculatorInput): CalculatorResult {
  const industry = industries.find((i) => i.id === input.industry)!;
  const spend = spendBands.find((s) => s.id === input.spendBand)!;

  const maturityScore = input.maturityAnswers.reduce((a, b) => a + b, 0);
  const maturityPct = maturityScore / 20;

  const addressablePct = Math.min(
    0.88,
    Math.max(0.5, 0.52 + industry.addressableBoost + maturityPct * 0.22),
  );
  const addressableSpendUsd = spend.midpointUsd * addressablePct;

  const maturityGap = 1 - maturityPct;
  const countryFactor = 1 + Math.min(input.countries - 1, 5) * 0.025;

  const expectedRate =
    industry.baseRate * (1 + maturityGap * 0.55) * countryFactor;
  const rateConservative = expectedRate * 0.65;
  const rateAggressive = expectedRate * 1.35;

  const savingsExpected = Math.round(addressableSpendUsd * expectedRate);
  const savingsConservative = Math.round(addressableSpendUsd * rateConservative);
  const savingsAggressive = Math.round(addressableSpendUsd * rateAggressive);

  const monthlySavings = savingsExpected / 12;
  const assumedFeeMonths = 4;
  const monthsToNeutral = monthlySavings > 0 ? Math.max(2, Math.ceil(assumedFeeMonths * 0.85)) : 6;

  const recommended = new Set<string>();
  input.maturityAnswers.forEach((ans, i) => {
    if (ans <= 2) {
      const key = maturityQuestions[i].id;
      serviceMap[key]?.forEach((s) => recommended.add(s));
    }
  });
  if (recommended.size === 0) {
    recommended.add("Abastecimiento estratégico");
    recommended.add("Gestión de riesgo de proveedores");
  }

  return {
    annualSpendUsd: spend.midpointUsd,
    addressableSpendUsd: Math.round(addressableSpendUsd),
    addressablePct: Math.round(addressablePct * 100),
    maturityScore,
    maturityLevel: getMaturityLevel(maturityScore),
    savingsConservative,
    savingsExpected,
    savingsAggressive,
    rateConservative: Math.round(rateConservative * 1000) / 10,
    rateExpected: Math.round(expectedRate * 1000) / 10,
    rateAggressive: Math.round(rateAggressive * 1000) / 10,
    monthsToNeutral,
    priorityLevers: getWeakestLevers(input.maturityAnswers),
    recommendedServices: [...recommended].slice(0, 3),
  };
}

export function formatUsd(n: number): string {
  if (n >= 1_000_000_000) return `USD ${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `USD ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `USD ${(n / 1_000).toFixed(0)}K`;
  return `USD ${n.toLocaleString("es-CL")}`;
}
