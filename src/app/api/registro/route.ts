import { NextResponse } from "next/server";
import { isEventAttendance, isEventContentInterest } from "@/lib/invite-form";
import { getPublicFormInviteByToken } from "@/lib/invites";
import { submitMondayInviteForm } from "@/lib/monday-form-submit";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function POST(request: Request) {
  let token = "";
  let name = "";
  let email = "";
  let phone = "";
  let company = "";
  let role = "";
  let consent = false;
  let contentInterest = "";
  let attendanceMode = "";

  try {
    const payload = (await request.json()) as {
      token?: string;
      name?: string;
      email?: string;
      phone?: string;
      company?: string;
      role?: string;
      consent?: boolean;
      contentInterest?: string;
      attendanceMode?: string;
    };
    token = payload.token?.trim() ?? "";
    name = payload.name?.trim() ?? "";
    email = payload.email?.trim() ?? "";
    phone = payload.phone?.trim() ?? "";
    company = payload.company?.trim() ?? "";
    role = payload.role?.trim() ?? "";
    consent = payload.consent === true;
    contentInterest = payload.contentInterest?.trim() ?? "";
    attendanceMode = payload.attendanceMode?.trim() ?? "";
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const invite = getPublicFormInviteByToken(token);
  if (!invite) {
    return NextResponse.json({ ok: false, error: "invalid_invite" }, { status: 404 });
  }

  if (!name || name.length < 2) {
    return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  if (!consent) {
    return NextResponse.json({ ok: false, error: "invalid_consent" }, { status: 400 });
  }

  if (invite.id === "evento") {
    if (!isEventContentInterest(contentInterest)) {
      return NextResponse.json(
        { ok: false, error: "invalid_content_interest" },
        { status: 400 },
      );
    }
    if (!isEventAttendance(attendanceMode)) {
      return NextResponse.json(
        { ok: false, error: "invalid_attendance" },
        { status: 400 },
      );
    }
  }

  const result = await submitMondayInviteForm(
    invite.mondayFormToken,
    {
      name,
      email,
      phone,
      company,
      role,
      consent: true,
      consentField: invite.mondayConsentField,
      contentInterest: invite.id === "evento" ? contentInterest : undefined,
      attendanceMode: invite.id === "evento" ? attendanceMode : undefined,
    },
    invite.mondayRegion,
  );

  if (!result.ok) {
    console.error("[registro] Monday form error:", invite.id, result.error);
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id: result.id });
}
