import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { createAdminClient, supabaseConfigured } from "@/lib/supabase/admin";
import { writeExecutiveBrief } from "@/lib/surveys/executive-ai";
import { briefIsStale, type StoredBrief } from "@/lib/surveys/executive";
import { evaluationOf } from "@/lib/surveys/evaluacion";
import { SURVEY_SLUG_B } from "@/lib/surveys/radar-b/engine";
import { OPTION_B_ASKS, buildOptionBFacts } from "@/lib/surveys/radar-b/facts";
import { buildBenchmark, buildPerson, type RadarBInput } from "@/lib/surveys/radar-b/report";

type BriefRow = {
  generated_at: string;
  response_count: number;
  latest_response_at: string | null;
  context: string;
  themes: StoredBrief["themes"];
};

function toBrief(row: BriefRow): StoredBrief {
  return {
    generatedAt: row.generated_at,
    responseCount: row.response_count,
    latestResponseAt: row.latest_response_at,
    context: row.context,
    themes: row.themes,
  };
}

export async function POST() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  if (!supabaseConfigured()) return NextResponse.json({ ok: false }, { status: 503 });

  const admin = await createAdminClient();
  const { data: survey } = await admin.from("web_surveys").select("id").eq("slug", SURVEY_SLUG_B).maybeSingle();
  if (!survey) return NextResponse.json({ ok: false }, { status: 404 });

  const { data } = await admin
    .from("web_survey_responses")
    .select("id, created_at, nombre, apellido, email, empresa, pais, rol, rubro, evaluacion, company, answers")
    .eq("survey_id", survey.id)
    .order("created_at", { ascending: false });

  const people = ((data ?? []) as Array<RadarBInput & { created_at?: string; evaluacion?: string }>).map((row) =>
    buildPerson({
      id: row.id,
      createdAt: String(row.created_at ?? ""),
      nombre: row.nombre,
      apellido: row.apellido,
      email: row.email,
      empresa: row.empresa,
      pais: row.pais,
      rol: row.rol,
      rubro: row.rubro,
      evaluacion: evaluationOf(row.evaluacion),
      company: row.company ?? {},
      answers: row.answers ?? {},
    }),
  );
  const included = people.filter((person) => person.included);
  if (!included.length) return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });

  const { data: existing } = await admin
    .from("web_survey_briefs")
    .select("generated_at, response_count, latest_response_at, context, themes")
    .eq("survey_id", survey.id)
    .maybeSingle();
  const current = existing ? toBrief(existing as BriefRow) : null;
  if (current && !briefIsStale(current, included)) return NextResponse.json({ ok: true, brief: current, refreshed: false });

  let written: Pick<StoredBrief, "context" | "themes">;
  try {
    written = await writeExecutiveBrief(buildOptionBFacts(people, buildBenchmark(people)), {
      asks: OPTION_B_ASKS,
      extra: [
        "Esta es la opción B. Habla de prioridades, capacidad y brecha. El portafolio es un escenario de demostración, no un ahorro.",
        "No conviertas un nivel de capacidad de 1 a 5 en un porcentaje.",
      ],
    });
  } catch {
    return NextResponse.json({ ok: false, error: "ai" }, { status: 502 });
  }

  const latestResponseAt = included.reduce((max, item) => (item.createdAt > max ? item.createdAt : max), included[0].createdAt);
  const saved = {
    survey_id: survey.id,
    generated_at: new Date().toISOString(),
    response_count: included.length,
    latest_response_at: latestResponseAt,
    context: written.context,
    themes: written.themes,
    updated_at: new Date().toISOString(),
  };
  const { data: stored, error } = await admin.from("web_survey_briefs").upsert(saved, { onConflict: "survey_id" }).select("generated_at, response_count, latest_response_at, context, themes").single();
  if (error || !stored) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true, brief: toBrief(stored as BriefRow), refreshed: true });
}
