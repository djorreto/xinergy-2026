import { NextResponse } from "next/server";
import { requestInsightAdminCode } from "@/lib/auth/insights-login";

export async function POST(request: Request) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: string };
    email = body.email?.trim() ?? "";
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const result = await requestInsightAdminCode(email);
  if (!result.ok) {
    const status = result.error === "rate_limited" ? 429 : 400;
    return NextResponse.json(result, { status });
  }
  return NextResponse.json(result);
}
