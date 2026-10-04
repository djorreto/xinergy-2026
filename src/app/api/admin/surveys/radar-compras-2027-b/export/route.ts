import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { createAdminClient, supabaseConfigured } from "@/lib/supabase/admin";
import { workbookBytes } from "@/lib/surveys/export-xlsx";
import { evaluationOf } from "@/lib/surveys/evaluacion";
import { CAPABILITIES, INITIATIVE_COPY } from "@/lib/surveys/radar-b/instrument";
import { SCENARIOS, SURVEY_SLUG_B } from "@/lib/surveys/radar-b/engine";
import { buildBenchmark, buildPerson, industryName, percent, roleName, type RadarBInput } from "@/lib/surveys/radar-b/report";

export async function GET() {
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
    .order("created_at", { ascending: true });

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
  const benchmark = buildBenchmark(people);
  const header = ["Fecha", "Empresa", "Nombre", "Apellido", "Email", "Rol", "País", "Industria", "Evaluación", "Conocimiento", "AHP", "Motor", "Brecha G0", ...CAPABILITIES.map((item) => item.short.es), ...INITIATIVE_COPY.map((item) => item.name.es)];
  const rows = people.map((person) => [
    person.createdAt,
    person.empresa,
    person.nombre,
    person.apellido,
    person.email,
    roleName(person.rol),
    person.pais,
    industryName(person.rubro),
    person.included ? "Incluido en análisis" : "Aislado de la evaluación",
    person.conocimiento,
    person.ahpClass ?? "",
    person.motor,
    person.g0 == null ? "" : String(person.g0),
    ...person.levels.map((level) => (level == null ? "ns" : String(level))),
    ...INITIATIVE_COPY.map((item) => person.agenda[item.id] ?? ""),
  ]);
  const priority = ["Prioridad", ...CAPABILITIES.map((item) => item.short.es)];
  const priorityRow = ["Media AIP", ...(benchmark.ahpMean ?? CAPABILITIES.map(() => null)).map((value) => percent(value))];
  const portfolios = [["Empresa", "Escenario", "Iniciativas", "Costo", "Esfuerzo", "Cierre", "Similitud", "Alineación"]];
  for (const person of people.filter((item) => item.included)) {
    for (const scenario of person.scenarios) {
      portfolios.push([
        person.empresa,
        scenario.id,
        scenario.portfolio?.ids.join(" ") ?? "",
        scenario.portfolio ? String(scenario.portfolio.cost) : "",
        scenario.portfolio ? String(scenario.portfolio.effort) : "",
        percent(scenario.portfolio?.closure),
        percent(scenario.similarity),
        percent(scenario.eta),
      ]);
    }
  }
  const bytes = await workbookBytes([
    { name: "Respuestas", rows: [header, ...rows] },
    { name: "Benchmark", rows: [priority, priorityRow, ["Empresas", String(benchmark.companies)], ["Nota", "Matriz de impacto de demostración. Meta de planificación: nivel 4."], ...SCENARIOS.map((scenario) => [scenario.id, `costo ${scenario.budget}`, `esfuerzo ${scenario.effort}`, `máximo ${scenario.maxCount}`])] },
    { name: "Portafolios", rows: portfolios },
  ]);
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=\"radar-compras-2027-b.xlsx\"",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
