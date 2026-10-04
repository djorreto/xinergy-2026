import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { personPdfC } from "@/lib/surveys/radar-c/pdf";
import { loadPeople, pdf } from "@/app/api/admin/surveys/radar-compras-2027-c/informe/route";

export async function GET(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id") ?? "";
  const people = await loadPeople();
  const person = people?.find((item) => item.id === id);
  if (!person) return NextResponse.json({ ok: false }, { status: 404 });
  const bytes = await personPdfC(person, "Devolución individual");
  return pdf(bytes, "radar-compras-2027-c-devolucion.pdf");
}
