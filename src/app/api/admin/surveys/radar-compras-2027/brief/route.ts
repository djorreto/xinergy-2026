import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { createAdminClient, supabaseConfigured } from "@/lib/supabase/admin";
import { writeExecutiveBrief } from "@/lib/surveys/executive-ai";
import { buildExecutiveFacts, type FactAnswer } from "@/lib/surveys/executive-facts";
import { briefIsStale, type StoredBrief } from "@/lib/surveys/executive";
import { isIncluded } from "@/lib/surveys/evaluacion";
import { SURVEY_SLUG } from "@/lib/surveys/radar-2027";

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
  const { data: survey } = await admin.from("web_surveys").select("id").eq("slug", SURVEY_SLUG).maybeSingle();
  if (!survey) return NextResponse.json({ ok: false }, { status: 404 });

  const { data: rows } = await admin
    .from("web_survey_responses")
    .select("created_at, language, pais, rol, rol_grupo, antiguedad, rubro, rubro_grupo, company, answers, evaluacion")
    .eq("survey_id", survey.id)
    .order("created_at", { ascending: false });

  const responses: FactAnswer[] = (rows ?? []).filter((row) => isIncluded(row.evaluacion)).map((row) => ({
    createdAt: row.created_at,
    language: row.language,
    pais: row.pais,
    rol: row.rol,
    rolGrupo: row.rol_grupo,
    antiguedad: row.antiguedad,
    rubro: row.rubro,
    rubroGrupo: row.rubro_grupo,
    company: row.company ?? {},
    answers: row.answers ?? {},
  }));
  if (!responses.length) return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });

  const { data: existing } = await admin
    .from("web_survey_briefs")
    .select("generated_at, response_count, latest_response_at, context, themes")
    .eq("survey_id", survey.id)
    .maybeSingle();
  const current = existing ? toBrief(existing as BriefRow) : null;
  if (current && !briefIsStale(current, responses)) {
    return NextResponse.json({ ok: true, brief: current, refreshed: false });
  }

  let written: Pick<StoredBrief, "context" | "themes">;
  try {
    written = await writeExecutiveBrief(buildExecutiveFacts(responses));
  } catch {
    return NextResponse.json({ ok: false, error: "ai" }, { status: 502 });
  }

  const latestResponseAt = responses.reduce((max, item) => (item.createdAt > max ? item.createdAt : max), responses[0].createdAt);
  const saved = {
    survey_id: survey.id,
    generated_at: new Date().toISOString(),
    response_count: responses.length,
    latest_response_at: latestResponseAt,
    context: written.context,
    themes: written.themes,
    updated_at: new Date().toISOString(),
  };
  const { data: stored, error } = await admin
    .from("web_survey_briefs")
    .upsert(saved, { onConflict: "survey_id" })
    .select("generated_at, response_count, latest_response_at, context, themes")
    .single();
  if (error || !stored) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true, brief: toBrief(stored as BriefRow), refreshed: true });
}
