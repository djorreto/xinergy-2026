import {
  calculateOpportunity,
  formatUsd,
  industries,
  maturityQuestions,
  spendBands,
  type CalculatorInput,
} from "@/lib/calculator";

export const CALCULATOR_LEAD_SOURCE = "calculo ahorro pagina web";

function industryLabel(id: CalculatorInput["industry"]): string {
  return industries.find((i) => i.id === id)?.label ?? id;
}

function spendLabel(id: CalculatorInput["spendBand"]): string {
  return spendBands.find((s) => s.id === id)?.label ?? id;
}

export function buildCalculatorLeadSummary(
  input: CalculatorInput,
  email: string,
): string {
  const result = calculateOpportunity(input);
  const lines = [
    CALCULATOR_LEAD_SOURCE,
    "",
    "═══ PASO 1 · EMPRESA ═══",
    `Industria: ${industryLabel(input.industry)}`,
    `Gasto anual con proveedores: ${spendLabel(input.spendBand)}`,
    `Países donde operan compras: ${input.countries}`,
    "",
    "═══ PASO 2 · MADUREZ ═══",
    ...maturityQuestions.map((q, i) => {
      const answer = input.maturityAnswers[i];
      return `${i + 1}. ${q.question}\n   Respuesta: ${answer}/4 (${q.lowLabel} → ${q.highLabel})`;
    }),
    "",
    `Puntaje madurez: ${result.maturityScore}/20 · Nivel: ${result.maturityLevel}`,
    "",
    "═══ PASO 3 · RESULTADO ═══",
    `Correo: ${email}`,
    "",
    "Oportunidad estimada (año 1):",
    `  · Esperada: ${formatUsd(result.savingsExpected)}`,
    `  · Rango prudente: ${formatUsd(result.savingsConservative)} – ${formatUsd(result.savingsAggressive)}`,
    `  · Gasto addressable: ${formatUsd(result.addressableSpendUsd)} (~${result.addressablePct}% del total)`,
    `  · Gasto anual referencia: ${formatUsd(result.annualSpendUsd)}`,
    "",
    `Tasa esperada: ${result.rateExpected}% del addressable`,
    `Tasa conservadora / agresiva: ${result.rateConservative}% / ${result.rateAggressive}%`,
    `Ventana cash neutral estimada: ~${result.monthsToNeutral} meses`,
    "",
    "Palancas prioritarias:",
    ...result.priorityLevers.map((l) => `  · ${l}`),
    "",
    `Servicios sugeridos: ${result.recommendedServices.join(" · ")}`,
  ];
  return lines.join("\n");
}
