import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { createAdminClient, supabaseConfigured } from "@/lib/supabase/admin";
import { evaluationOf } from "@/lib/surveys/evaluacion";
import { SURVEY_SLUG_C } from "@/lib/surveys/radar-c/instrument";
import { paperPdfC } from "@/lib/surveys/radar-c/paper-pdf";
import { buildPersonC } from "@/lib/surveys/radar-c/report";

export const maxDuration = 60;

export async function GET() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  if (!supabaseConfigured()) return NextResponse.json({ ok: false }, { status: 503 });
  const people = await loadPeople();
  if (!people) return NextResponse.json({ ok: false }, { status: 404 });
  const bytes = await paperPdfC(people, "Working paper · C (versión oficial)");
  return pdf(bytes, "radar-compras-2027-c-paper.pdf");
}

export async function loadPeople() {
  const admin = await createAdminClient();
  const { data: survey } = await admin.from("web_surveys").select("id").eq("slug", SURVEY_SLUG_C).maybeSingle();
  if (!survey) return null;
  const { data } = await admin.from("web_survey_responses").select("id, created_at, email, empresa, pais, rol, rubro, evaluacion, company, answers").eq("survey_id", survey.id);
  return (data ?? []).map((row) => buildPersonC({
    id: row.id,
    createdAt: String(row.created_at ?? ""),
    email: row.email,
    empresa: row.empresa,
    pais: row.pais,
    rol: row.rol,
    rubro: row.rubro,
    evaluacion: evaluationOf(row.evaluacion),
    company: row.company ?? {},
    answers: row.answers ?? {},
  }));
}

export function pdf(bytes: Uint8Array, filename: string) {
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
