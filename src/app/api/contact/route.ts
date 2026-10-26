import { NextResponse } from "next/server";
import { submitMondayContactForm } from "@/lib/monday-form-submit";
import { domainAcceptsMail } from "@/lib/insights/mail-domain";
import { clientIp } from "@/lib/insights/tokens";
import { emailDomain, isBlockedEmail, isPersonName } from "@/lib/insights/validate";
import { requestFormGate } from "@/lib/security/form-gate";
import { honeypotTripped, isRateLimited, verifyTurnstile } from "@/lib/security/public-form";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function POST(request: Request) {
  let name = "";
  let email = "";
  let phone = "";
  let company = "";
  let role = "";
  let message = "";
  let companyUrl = "";
  let turnstileToken = "";

  try {
    const payload = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      company?: string;
      role?: string;
      message?: string;
      company_url?: string;
      turnstileToken?: string;
    };
    name = payload.name?.trim() ?? "";
    email = payload.email?.trim() ?? "";
    phone = payload.phone?.trim() ?? "";
    company = payload.company?.trim() ?? "";
    role = payload.role?.trim() ?? "";
    message = payload.message?.trim() ?? "";
    companyUrl = payload.company_url?.trim() ?? "";
    turnstileToken = payload.turnstileToken?.trim() ?? "";
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  if (honeypotTripped(companyUrl)) return NextResponse.json({ ok: true });

  if (!isPersonName(name)) {
    return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 400 });
  }

  if (!isValidEmail(email) || email.length > 160 || isBlockedEmail(email) || !(await domainAcceptsMail(emailDomain(email)))) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  if ((await requestFormGate(request)) !== "ok") {
    return NextResponse.json({ ok: false, error: "captcha" }, { status: 400 });
  }

  if ((message.match(/https?:\/\/|www\./gi) ?? []).length >= 2) {
    return NextResponse.json({ ok: false, error: "invalid_message" }, { status: 400 });
  }

  if (phone.length > 40 || company.length > 120 || role.length > 80) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  if (!message || message.length < 10 || message.length > 4000) {
    return NextResponse.json({ ok: false, error: "invalid_message" }, { status: 400 });
  }

  const ip = clientIp(request);
  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return NextResponse.json({ ok: false, error: "captcha" }, { status: 400 });
  }

  if (await isRateLimited(request, "contact")) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const result = await submitMondayContactForm({ name, email, phone, company, role, message });
  if (!result.ok) {
    console.error("[contact] Monday form error:", result.error);
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id: result.id });
}
