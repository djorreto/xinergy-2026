import { NextResponse } from "next/server";
import { createAdminClient, supabaseConfigured } from "@/lib/supabase/admin";
import { evaluationOf } from "@/lib/surveys/evaluacion";
import { SURVEY_SLUG_C } from "@/lib/surveys/radar-c/instrument";
import { personPdfC } from "@/lib/surveys/radar-c/pdf";
import { buildPersonC } from "@/lib/surveys/radar-c/report";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ ok: false }, { status: 404 });
  if (!supabaseConfigured()) return NextResponse.json({ ok: false }, { status: 503 });
  const admin = await createAdminClient();
  const { data: survey } = await admin.from("web_surveys").select("id").eq("slug", SURVEY_SLUG_C).maybeSingle();
  if (!survey) return NextResponse.json({ ok: false }, { status: 404 });
  const { data } = await admin.from("web_survey_responses").select("id, created_at, email, empresa, pais, rol, rubro, evaluacion, company, answers").eq("id", id).eq("survey_id", survey.id).maybeSingle();
  if (!data) return NextResponse.json({ ok: false }, { status: 404 });
  const person = buildPersonC({
    id: data.id,
    createdAt: String(data.created_at ?? ""),
    email: data.email,
    empresa: data.empresa,
    pais: data.pais,
    rol: data.rol,
    rubro: data.rubro,
    evaluacion: evaluationOf(data.evaluacion),
    company: data.company ?? {},
    answers: data.answers ?? {},
  });
  const bytes = await personPdfC(person, "Devolución individual");
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="radar-compras-2027-c-devolucion.pdf"',
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
