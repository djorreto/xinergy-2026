import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { RadarDesk, type RadarAnswer } from "@/components/admin/RadarDesk";
import { RadarDeskB } from "@/components/admin/RadarDeskB";
import { requireAdminUser } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { StoredBrief } from "@/lib/surveys/executive";
import { evaluationOf } from "@/lib/surveys/evaluacion";
import { SURVEY_SLUG_B } from "@/lib/surveys/radar-b/engine";
import { buildBenchmark, buildPerson, type RadarBInput } from "@/lib/surveys/radar-b/report";
import { demoChecks } from "@/lib/surveys/radar-b/verify";
import { SURVEY_SLUG } from "@/lib/surveys/radar-2027";

type Row = {
  id: string;
  created_at: string;
  language: "es" | "en" | "pt";
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  linkedin: string | null;
  cargo: string;
  empresa: string;
  pais: string;
  rol: string;
  rol_grupo: string;
  antiguedad: string;
  rubro: string;
  rubro_grupo: string | null;
  consents: Record<string, boolean>;
  company: Record<string, unknown>;
  answers: Record<string, unknown>;
  evaluacion: string;
  evaluacion_at: string | null;
  evaluacion_por: string | null;
};

export default async function SurveyAdminPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== SURVEY_SLUG && slug !== SURVEY_SLUG_B) notFound();
  const user = await requireAdminUser();
  if (slug === SURVEY_SLUG_B) return optionB(user.email);
  const admin = await createAdminClient();
  const { data: survey } = await admin.from("web_surveys").select("id, title").eq("slug", slug).maybeSingle();
  if (!survey) notFound();
  const [{ data }, { data: briefRow }] = await Promise.all([
    admin
      .from("web_survey_responses")
      .select("id, created_at, language, nombre, apellido, email, telefono, linkedin, cargo, empresa, pais, rol, rol_grupo, antiguedad, rubro, rubro_grupo, consents, company, answers, evaluacion, evaluacion_at, evaluacion_por")
      .eq("survey_id", survey.id)
      .order("created_at", { ascending: false }),
    admin
      .from("web_survey_briefs")
      .select("generated_at, response_count, latest_response_at, context, themes")
      .eq("survey_id", survey.id)
      .maybeSingle(),
  ]);

  const responses: RadarAnswer[] = ((data ?? []) as Row[]).map((row) => ({
    id: row.id,
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
    evaluacion: evaluationOf(row.evaluacion),
    evaluacionAt: row.evaluacion_at,
    evaluacionPor: row.evaluacion_por,
  }));

  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://xinergy.lat").replace(/\/$/, "");
  const brief: StoredBrief | null = briefRow
    ? {
        generatedAt: briefRow.generated_at,
        responseCount: briefRow.response_count,
        latestResponseAt: briefRow.latest_response_at,
        context: briefRow.context,
        themes: briefRow.themes ?? [],
      }
    : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <AdminNav email={user.email} />
      <RadarDesk responses={responses} publicUrl={`${site}/radar-compras-2027`} brief={brief} />
    </div>
  );
}

async function optionB(email: string) {
  const admin = await createAdminClient();
  const { data: survey } = await admin.from("web_surveys").select("id").eq("slug", SURVEY_SLUG_B).maybeSingle();
  if (!survey) notFound();
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
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://xinergy.lat").replace(/\/$/, "");
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <AdminNav email={email} />
      <RadarDeskB people={people} benchmark={buildBenchmark(people)} publicUrl={`${site}/radar-compras-2027-b`} verified={demoChecks().ok} />
    </div>
  );
}
