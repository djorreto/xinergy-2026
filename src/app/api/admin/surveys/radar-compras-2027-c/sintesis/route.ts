import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { supabaseConfigured } from "@/lib/supabase/admin";
import { loadPeople, pdf } from "@/app/api/admin/surveys/radar-compras-2027-c/informe/route";
import { studyPdfC } from "@/lib/surveys/radar-c/pdf";

export const maxDuration = 60;

export async function GET() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  if (!supabaseConfigured()) return NextResponse.json({ ok: false }, { status: 503 });
  const people = await loadPeople();
  if (!people) return NextResponse.json({ ok: false }, { status: 404 });
  const bytes = await studyPdfC(people, "Síntesis breve");
  return pdf(bytes, "radar-compras-2027-c-sintesis.pdf");
}
