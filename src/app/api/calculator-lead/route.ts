import { NextResponse } from "next/server";
import type { CalculatorInput } from "@/lib/calculator";
import { submitMondayCalculatorForm } from "@/lib/monday-form-submit";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isCalculatorInput(value: unknown): value is CalculatorInput {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.industry === "string" &&
    typeof v.spendBand === "string" &&
    Array.isArray(v.maturityAnswers) &&
    v.maturityAnswers.length === 5 &&
    v.maturityAnswers.every((a) => typeof a === "number") &&
    typeof v.hasNegotiationTool === "boolean" &&
    typeof v.hasStockPlanningTool === "boolean"
  );
}

export async function POST(request: Request) {
  let email = "";
  let input: CalculatorInput | null = null;

  try {
    const payload = (await request.json()) as {
      email?: string;
      input?: unknown;
    };
    email = payload.email?.trim() ?? "";
    input = isCalculatorInput(payload.input) ? payload.input : null;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  if (!input) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  const result = await submitMondayCalculatorForm(email, input);
  if (!result.ok) {
    console.error("[calculator-lead] Monday form error:", result.error);
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id: result.id });
}
