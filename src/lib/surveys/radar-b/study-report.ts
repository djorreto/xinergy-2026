import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { evaluationOf } from "@/lib/surveys/evaluacion";
import { buildPerson, type RadarBInput } from "@/lib/surveys/radar-b/report";
import { REPORT_VERSION, buildStudyCut } from "@/lib/surveys/radar-b/study-cut";
import { fallbackNarrative, writeNarrative, type StudyNarrative } from "@/lib/surveys/radar-b/study-narrative";
import { studyPdfB } from "@/lib/surveys/radar-b/study-pdf";
import { studyIsStale, studyStamp } from "@/lib/surveys/study";

const dateFormat = new Intl.DateTimeFormat("es-CL", { dateStyle: "long", timeZone: "America/Santiago" });

export async function studyResponseB(admin: SupabaseClient, surveyId: string) {
  const { data } = await admin
    .from("web_survey_responses")
    .select("id, created_at, nombre, apellido, email, empresa, pais, rol, rubro, evaluacion, company, answers")
    .eq("survey_id", surveyId);
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

  const cut = buildStudyCut(people);
  if (!cut.replayOk) return NextResponse.json({ ok: false, error: "replay" }, { status: 500 });

  const { data: existing } = await admin
    .from("web_survey_reports")
    .select("generated_at, response_count, latest_response_at, sections")
    .eq("survey_id", surveyId)
    .maybeSingle();
  const stored = existing && !studyIsStale(
    { responseCount: existing.response_count, latestResponseAt: existing.latest_response_at },
    included,
  )
    ? readNarrative(existing.sections)
    : null;
  let narrative = stored;
  let generatedAt = existing?.generated_at ?? new Date().toISOString();
  if (!narrative) {
    narrative = await writeNarrative(cut).catch(() => fallbackNarrative(cut));
    generatedAt = new Date().toISOString();
    const saved = {
      survey_id: surveyId,
      generated_at: generatedAt,
      response_count: included.length,
      latest_response_at: studyStamp(included),
      sections: [{ id: "b-narrative", title: REPORT_VERSION, body: JSON.stringify(narrative) }],
      updated_at: generatedAt,
    };
    const { error } = await admin.from("web_survey_reports").upsert(saved, { onConflict: "survey_id" });
    if (error) return NextResponse.json({ ok: false }, { status: 500 });
  }

  const bytes = await studyPdfB({
    cut,
    thesis: narrative.thesis,
    summary: narrative.summary,
    cutLabel: cut.newestAt ? `Corte al ${dateFormat.format(new Date(cut.newestAt))}` : "Corte preliminar",
    generatedLabel: `Generado el ${dateFormat.format(new Date(generatedAt))}`,
  });
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="radar-compras-2027-b-informe-preliminar.pdf"',
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function readNarrative(sections: unknown): StudyNarrative | null {
  if (!Array.isArray(sections)) return null;
  const row = sections.find((item) => item && typeof item === "object" && "id" in item && "title" in item && "body" in item && item.id === "b-narrative" && item.title === REPORT_VERSION);
  if (!row || typeof row.body !== "string") return null;
  try {
    const parsed = JSON.parse(row.body) as { thesis?: unknown; summary?: unknown };
    if (typeof parsed.thesis !== "string" || typeof parsed.summary !== "string" || !parsed.thesis || !parsed.summary) return null;
    return { thesis: parsed.thesis, summary: parsed.summary };
  } catch {
    return null;
  }
}
