import { NextResponse } from "next/server";
import { ANNIVERSARY_TOKEN, isAnniversaryTravelValue } from "@/lib/anniversary";
import { submitMondayAnniversaryRsvp } from "@/lib/monday-form-submit";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function POST(request: Request) {
  let token = "";
  let firstName = "";
  let lastName = "";
  let email = "";
  let travel = "";

  try {
    const payload = (await request.json()) as {
      token?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      travel?: string;
    };
    token = payload.token?.trim() ?? "";
    firstName = payload.firstName?.trim() ?? "";
    lastName = payload.lastName?.trim() ?? "";
    email = payload.email?.trim() ?? "";
    travel = payload.travel?.trim() ?? "";
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  if (token !== ANNIVERSARY_TOKEN) {
    return NextResponse.json({ ok: false, error: "invalid_invite" }, { status: 404 });
  }

  if (!firstName || firstName.length < 2) {
    return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 400 });
  }

  if (!lastName || lastName.length < 2) {
    return NextResponse.json({ ok: false, error: "invalid_last_name" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  if (!isAnniversaryTravelValue(travel)) {
    return NextResponse.json({ ok: false, error: "invalid_travel" }, { status: 400 });
  }

  const result = await submitMondayAnniversaryRsvp({
    firstName,
    lastName,
    email,
    travel,
  });

  if (!result.ok) {
    console.error("[aniversario] Monday form error:", result.error);
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id: result.id });
}
