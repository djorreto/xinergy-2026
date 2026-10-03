import { NextResponse } from "next/server";
import { verifyInsightAdminCode } from "@/lib/auth/insights-login";
import { createSessionToken, INSIGHTS_SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/insights-session";

export async function POST(request: Request) {
  let email = "";
  let code = "";
  try {
    const body = (await request.json()) as { email?: string; code?: string };
    email = body.email?.trim() ?? "";
    code = body.code?.trim() ?? "";
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const result = await verifyInsightAdminCode(email, code);
  if (!result.ok) return NextResponse.json(result, { status: 400 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(INSIGHTS_SESSION_COOKIE, await createSessionToken(email), sessionCookieOptions());
  return response;
}
