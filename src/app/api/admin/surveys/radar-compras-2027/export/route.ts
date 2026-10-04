import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { createAdminClient, supabaseConfigured } from "@/lib/supabase/admin";
import { analysisPdf } from "@/lib/surveys/export-pdf";
import { analysisSheets, buildAnalysis, responseTable, type ExportPerson } from "@/lib/surveys/export-model";
import { workbookBytes } from "@/lib/surveys/export-xlsx";
import type { StoredBrief } from "@/lib/surveys/executive";
import { isIncluded } from "@/lib/surveys/evaluacion";
import { SURVEY_SLUG } from "@/lib/surveys/radar-2027";

function file(bytes: Uint8Array, type: string, filename: string) {
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export async function GET(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  if (!supabaseConfigured()) return NextResponse.json({ ok: false }, { status: 503 });

  const tipo = new URL(request.url).searchParams.get("tipo");
  const admin = await createAdminClient();
  const { data: survey } = await admin.from("web_surveys").select("id").eq("slug", SURVEY_SLUG).maybeSingle();
  if (!survey) return NextResponse.json({ ok: false }, { status: 404 });

  const [{ data: rows }, { data: briefRow }] = await Promise.all([
    admin
      .from("web_survey_responses")
      .select("created_at, language, nombre, apellido, email, telefono, linkedin, cargo, empresa, pais, rol, rol_grupo, antiguedad, rubro, rubro_grupo, consents, company, answers, evaluacion, evaluacion_at, evaluacion_por")
      .eq("survey_id", survey.id)
      .order("created_at", { ascending: true }),
    admin.from("web_survey_briefs").select("generated_at, response_count, latest_response_at, context, themes").eq("survey_id", survey.id).maybeSingle(),
  ]);

  const people: ExportPerson[] = (rows ?? []).map((row) => ({
    createdAt: row.created_at,
    language: row.language,
    nombre: row.nombre,
    apellido: row.apellido,
    email: row.email,
    telefono: row.telefono,
    linkedin: row.linkedin,
    cargo: row.cargo,
    empresa: row.empresa,
    pais: row.pais,
    rol: row.rol,
    rolGrupo: row.rol_grupo,
    antiguedad: row.antiguedad,
    rubro: row.rubro,
    rubroGrupo: row.rubro_grupo,
    consents: row.consents ?? {},
    company: row.company ?? {},
    answers: row.answers ?? {},
    evaluacion: row.evaluacion,
    evaluacionAt: row.evaluacion_at,
    evaluacionPor: row.evaluacion_por,
  }));
  const included = people.filter((person) => isIncluded(person.evaluacion));
  const brief: StoredBrief | null = briefRow
    ? {
        generatedAt: briefRow.generated_at,
        responseCount: briefRow.response_count,
        latestResponseAt: briefRow.latest_response_at,
        context: briefRow.context,
        themes: briefRow.themes ?? [],
      }
    : null;

  if (tipo === "respuestas") {
    const table = responseTable(people);
    const bytes = await workbookBytes([{ name: "Respuestas", rows: [table.columns, ...table.rows] }]);
    return file(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "radar-compras-2027-respuestas.xlsx");
  }

  const model = buildAnalysis(included, brief, people.length - included.length);
  if (tipo === "analisis") {
    const bytes = await workbookBytes(analysisSheets(model));
    return file(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "radar-compras-2027-analisis.xlsx");
  }
  if (tipo === "pdf") {
    const bytes = await analysisPdf(model);
    return file(bytes, "application/pdf", "radar-compras-2027-analisis-preliminar.pdf");
  }
  return NextResponse.json({ ok: false }, { status: 400 });
}
