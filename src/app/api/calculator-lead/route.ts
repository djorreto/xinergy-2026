import { NextResponse } from "next/server";
import type { CalculatorInput } from "@/lib/calculator";
import { domainAcceptsMail } from "@/lib/insights/mail-domain";
import { clientIp } from "@/lib/insights/tokens";
import { emailDomain, isBlockedEmail } from "@/lib/insights/validate";
import { submitMondayCalculatorForm } from "@/lib/monday-form-submit";
import { requestFormGate } from "@/lib/security/form-gate";
import { honeypotTripped, isRateLimited, verifyTurnstile } from "@/lib/security/public-form";

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
  let companyUrl = "";
  let turnstileToken = "";

  try {
    const payload = (await request.json()) as {
      email?: string;
      input?: unknown;
      company_url?: string;
      turnstileToken?: string;
    };
    email = payload.email?.trim() ?? "";
    input = isCalculatorInput(payload.input) ? payload.input : null;
    companyUrl = payload.company_url?.trim() ?? "";
    turnstileToken = payload.turnstileToken?.trim() ?? "";
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  if (honeypotTripped(companyUrl)) return NextResponse.json({ ok: true });

  if (!isValidEmail(email) || email.length > 160 || isBlockedEmail(email) || !(await domainAcceptsMail(emailDomain(email)))) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  if ((await requestFormGate(request)) !== "ok") {
    return NextResponse.json({ ok: false, error: "captcha" }, { status: 400 });
  }

  if (!input) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  const ip = clientIp(request);
  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return NextResponse.json({ ok: false, error: "captcha" }, { status: 400 });
  }

  if (await isRateLimited(request, "calculator")) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const result = await submitMondayCalculatorForm(email, input);
  if (!result.ok) {
    console.error("[calculator-lead] Monday form error:", result.error);
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id: result.id });
}
