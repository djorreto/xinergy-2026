import type { CalculatorInput } from "@/lib/calculator";

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Envía la evaluación al formulario de Monday (CTA Xinergy) vía API del servidor. */
export async function submitCalculatorLead(
  email: string,
  input: CalculatorInput,
): Promise<boolean> {
  try {
    const response = await fetch("/api/calculator-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), input }),
    });
    const data = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !data.ok) {
      if (process.env.NODE_ENV === "development" && data.error) {
        console.warn("[Xinergy CRM]", data.error);
      }
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
