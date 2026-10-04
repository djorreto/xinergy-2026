import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { createAdminClient, supabaseConfigured } from "@/lib/supabase/admin";
import { EVAL_INCLUDED, EVAL_ISOLATED, type Evaluacion } from "@/lib/surveys/evaluacion";
import { SURVEY_SLUG_B } from "@/lib/surveys/radar-b/engine";

const ALLOWED = new Set<Evaluacion>([EVAL_INCLUDED, EVAL_ISOLATED]);

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  if (!supabaseConfigured()) return NextResponse.json({ ok: false }, { status: 503 });

  const body = (await request.json().catch(() => null)) as { id?: unknown; evaluacion?: unknown } | null;
  const id = typeof body?.id === "string" ? body.id : "";
  const evaluacion = typeof body?.evaluacion === "string" ? body.evaluacion : "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) || !ALLOWED.has(evaluacion as Evaluacion)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const admin = await createAdminClient();
  const { data: survey } = await admin.from("web_surveys").select("id").eq("slug", SURVEY_SLUG_B).maybeSingle();
  if (!survey) return NextResponse.json({ ok: false }, { status: 404 });

  const { data, error } = await admin
    .from("web_survey_responses")
    .update({
      evaluacion,
      evaluacion_at: new Date().toISOString(),
      evaluacion_por: user.email,
    })
    .eq("id", id)
    .eq("survey_id", survey.id)
    .select("id, evaluacion, evaluacion_at, evaluacion_por")
    .maybeSingle();

  if (error || !data) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id, evaluacion: data.evaluacion, evaluacionAt: data.evaluacion_at, evaluacionPor: data.evaluacion_por });
}
