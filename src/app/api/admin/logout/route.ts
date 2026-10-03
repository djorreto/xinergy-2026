import { NextResponse } from "next/server";
import { INSIGHTS_SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/insights-session";

export async function GET(request: Request) {
  const current = new URL(request.url);
  const login = new URL("/admin/login", request.url);
  if (current.searchParams.get("disabled")) login.searchParams.set("error", "not_invited");
  const response = NextResponse.redirect(login, 303);
  response.cookies.set(INSIGHTS_SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url), 303);
  response.cookies.set(INSIGHTS_SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
