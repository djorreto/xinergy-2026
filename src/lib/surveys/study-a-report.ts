import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { EVAL_INCLUDED, evaluationOf } from "@/lib/surveys/evaluacion";
import { industryGroup, roleGroup } from "@/lib/surveys/radar-2027";
import { REPORT_VERSION_A, buildStudyCutA, type AAnswer } from "@/lib/surveys/study-a-cut";
import { fallbackNarrativeA, writeNarrativeA, type StudyNarrativeA } from "@/lib/surveys/study-a-narrative";
import { studyPdfA } from "@/lib/surveys/study-a-pdf";
import { studyIsStale, studyStamp } from "@/lib/surveys/study";

const dateFormat = new Intl.DateTimeFormat("es-CL", { dateStyle: "long", timeZone: "America/Santiago" });

export async function studyResponseA(admin: SupabaseClient, surveyId: string) {
  const { data } = await admin
    .from("web_survey_responses")
    .select("id, created_at, empresa, pais, rol, rol_grupo, rubro, rubro_grupo, company, answers, evaluacion")
    .eq("survey_id", surveyId);
  const people: AAnswer[] = (data ?? []).map((row) => ({
    id: row.id,
    createdAt: String(row.created_at ?? ""),
    empresa: row.empresa ?? "",
    pais: row.pais ?? "",
    rol: row.rol ?? "",
    rolGrupo: row.rol_grupo || roleGroup(row.rol),
    rubro: row.rubro ?? "",
    rubroGrupo: row.rubro_grupo || industryGroup(row.rubro),
    company: row.company ?? {},
    answers: row.answers ?? {},
    included: evaluationOf(row.evaluacion) === EVAL_INCLUDED,
  }));
  const included = people.filter((row) => row.included);
  if (!included.length) return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  const cut = buildStudyCutA(people);
  if (!cut.principal) return NextResponse.json({ ok: false, error: "ahp" }, { status: 500 });

  const { data: existing } = await admin.from("web_survey_reports").select("generated_at, response_count, latest_response_at, sections").eq("survey_id", surveyId).maybeSingle();
  const stored = existing && !studyIsStale({ responseCount: existing.response_count, latestResponseAt: existing.latest_response_at }, included) ? readNarrative(existing.sections) : null;
  let narrative = stored;
  let generatedAt = existing?.generated_at ?? new Date().toISOString();
  if (!narrative) {
    narrative = await writeNarrativeA(cut).catch(() => fallbackNarrativeA(cut));
    generatedAt = new Date().toISOString();
    const { error } = await admin.from("web_survey_reports").upsert(
      {
        survey_id: surveyId,
        generated_at: generatedAt,
        response_count: included.length,
        latest_response_at: studyStamp(included),
        sections: [{ id: "a-narrative", title: REPORT_VERSION_A, body: JSON.stringify(narrative) }],
        updated_at: generatedAt,
      },
      { onConflict: "survey_id" },
    );
    if (error) return NextResponse.json({ ok: false }, { status: 500 });
  }

  const bytes = await studyPdfA({
    cut,
    thesis: narrative.thesis,
    summary: narrative.summary,
    cutLabel: cut.newestAt ? `Corte al ${dateFormat.format(new Date(cut.newestAt))}` : "Corte preliminar",
    generatedLabel: `Generado el ${dateFormat.format(new Date(generatedAt))}`,
  });
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="radar-compras-2027-informe-preliminar.pdf"',
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function readNarrative(sections: unknown): StudyNarrativeA | null {
  if (!Array.isArray(sections)) return null;
  const row = sections.find((item) => item && typeof item === "object" && "id" in item && "title" in item && "body" in item && item.id === "a-narrative" && item.title === REPORT_VERSION_A);
  if (!row || typeof row.body !== "string") return null;
  try {
    const parsed = JSON.parse(row.body) as { thesis?: unknown; summary?: unknown };
    if (typeof parsed.thesis !== "string" || typeof parsed.summary !== "string" || !parsed.thesis || !parsed.summary) return null;
    return { thesis: parsed.thesis, summary: parsed.summary };
  } catch {
    return null;
  }
}
