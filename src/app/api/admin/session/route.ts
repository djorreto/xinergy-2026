import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";

export async function GET() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 403 });
  return NextResponse.json({ ok: true, email: user.email });
}
