import { NextResponse } from "next/server";
import { requestFormGate } from "@/lib/security/form-gate";
import { whatsappUrl } from "@/lib/whatsapp-server";

export async function POST(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const host = request.headers.get("host") ?? "";
  if (!host || (origin !== `https://${host}` && origin !== `http://${host}`)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  if ((await requestFormGate(request, 0)) !== "ok") {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  let text = "";
  try {
    const body = (await request.json()) as { text?: string };
    text = body.text?.trim() ?? "";
  } catch {
    text = "";
  }

  return NextResponse.json({ ok: true, url: whatsappUrl(text) });
}
