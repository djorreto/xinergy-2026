import { NextResponse } from "next/server";
import { verifyInviteConfirmToken } from "@/lib/invite-confirm-token";
import { getInviteByToken, INVITES } from "@/lib/invites";
import { submitMondayInviteForm } from "@/lib/monday-form-submit";

export async function POST(request: Request) {
  let token = "";
  try {
    const payload = (await request.json()) as { token?: string };
    token = payload.token?.trim() ?? "";
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 400 });
  }

  const verified = verifyInviteConfirmToken(token);
  if (!verified.ok) {
    return NextResponse.json({ ok: false, error: verified.error }, { status: 400 });
  }

  const { payload } = verified;
  const invite = INVITES.find((item) => item.id === payload.i);
  if (!invite || !getInviteByToken(invite.token)) {
    return NextResponse.json({ ok: false, error: "invalid_invite" }, { status: 404 });
  }

  const result = await submitMondayInviteForm(
    invite.mondayFormToken,
    {
      name: payload.n,
      email: payload.e,
      phone: payload.p ?? "",
      company: payload.c ?? "",
      role: payload.r ?? "C-Level",
      consent: true,
      consentField: invite.mondayConsentField,
    },
    invite.mondayRegion,
  );

  if (!result.ok) {
    console.error("[registro/confirmar] Monday error:", invite.id, payload.e, result.error);
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    id: result.id,
    name: payload.n,
    email: payload.e,
    inviteId: payload.i,
  });
}
