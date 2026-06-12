import {
  calculateOpportunity,
  formatUsd,
  type CalculatorInput,
} from "@/lib/calculator";
import { getCalculatorCopy } from "@/lib/calculator-i18n";

export const CALCULATOR_LEAD_SOURCE = "calculo eficiencias pagina web";

function industryLabel(id: CalculatorInput["industry"], locale = "es"): string {
  const copy = getCalculatorCopy(locale);
  return copy.industries[id] ?? id;
}

function spendLabel(id: CalculatorInput["spendBand"], locale = "es"): string {
  const copy = getCalculatorCopy(locale);
  return copy.spendBands[id] ?? id;
}

export function buildCalculatorLeadSummary(
  input: CalculatorInput,
  email: string,
  locale = "es",
): string {
  const copy = getCalculatorCopy(locale);
  const result = calculateOpportunity(input, copy);
  const lines = [
    CALCULATOR_LEAD_SOURCE,
    "",
    "═══ PASO 1 · EMPRESA ═══",
    `Industria: ${industryLabel(input.industry, locale)}`,
    `Gasto anual con proveedores: ${spendLabel(input.spendBand, locale)}`,
    "",
    "═══ PASO 2 · MADUREZ ═══",
    ...copy.maturityQuestions.map((q, i) => {
      const answer = input.maturityAnswers[i];
      return `${i + 1}. ${q.question}\n   Respuesta: ${answer}/4 (${q.lowLabel} → ${q.highLabel})`;
    }),
    "",
    `Puntaje madurez: ${result.maturityScore}/20 · Nivel: ${result.maturityLevel}`,
    "",
    "═══ HERRAMIENTAS ═══",
    ...copy.toolQuestions.map((q, i) => {
      const answer =
        i === 0 ? input.hasNegotiationTool : input.hasStockPlanningTool;
      return `${i + 6}. ${q.question}\n   Respuesta: ${answer ? "Sí" : "No"}`;
    }),
    "",
    "═══ PASO 3 · RESULTADO ═══",
    `Correo: ${email}`,
    "",
    "Eficiencias estimadas (año 1):",
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
