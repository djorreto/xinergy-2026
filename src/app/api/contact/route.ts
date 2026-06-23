import { NextResponse } from "next/server";
import { submitMondayContactForm } from "@/lib/monday-form-submit";

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

  try {
    const payload = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      company?: string;
      role?: string;
      message?: string;
    };
    name = payload.name?.trim() ?? "";
    email = payload.email?.trim() ?? "";
    phone = payload.phone?.trim() ?? "";
    company = payload.company?.trim() ?? "";
    role = payload.role?.trim() ?? "";
    message = payload.message?.trim() ?? "";
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  if (!name || name.length < 2) {
    return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  if (!message || message.length < 10) {
    return NextResponse.json({ ok: false, error: "invalid_message" }, { status: 400 });
  }

  const result = await submitMondayContactForm({ name, email, phone, company, role, message });
  if (!result.ok) {
    console.error("[contact] Monday form error:", result.error);
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id: result.id });
}
