import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { RadarDesk, type RadarAnswer } from "@/components/admin/RadarDesk";
import { RadarDeskB } from "@/components/admin/RadarDeskB";
import { RadarDeskC } from "@/components/admin/RadarDeskC";
import { requireAdminUser } from "@/lib/auth/admin";
import { adminHref } from "@/lib/auth/admin-path";
import { createAdminClient } from "@/lib/supabase/admin";
import { evaluationOf } from "@/lib/surveys/evaluacion";
import { SURVEY_SLUG_B } from "@/lib/surveys/radar-b/engine";
import { SURVEY_SLUG_C } from "@/lib/surveys/radar-c/instrument";
import { buildBenchmarkC, personFromRow, RESPONSE_COLUMNS_C, type SurveyResponseRowC } from "@/lib/surveys/radar-c/report";
import { versionCChecks } from "@/lib/surveys/radar-c/verify";
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
  if (slug !== SURVEY_SLUG && slug !== SURVEY_SLUG_B && slug !== SURVEY_SLUG_C) notFound();
  const user = await requireAdminUser();
  if (slug === SURVEY_SLUG_B) return optionB(user.email);
  if (slug === SURVEY_SLUG_C) return optionC(user.email);
  const admin = await createAdminClient();
  const { data: survey } = await admin.from("web_surveys").select("id, title").eq("slug", slug).maybeSingle();
  if (!survey) notFound();
  const { data } = await admin
    .from("web_survey_responses")
    .select("id, created_at, language, nombre, apellido, email, telefono, linkedin, cargo, empresa, pais, rol, rol_grupo, antiguedad, rubro, rubro_grupo, consents, company, answers, evaluacion, evaluacion_at, evaluacion_por")
    .eq("survey_id", survey.id)
    .order("created_at", { ascending: false });

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

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <AdminNav email={user.email} />
      <SurveyBack />
      <RadarDesk responses={responses} publicUrl={`${site}/radar-compras-2027`} />
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
      <SurveyBack />
      <RadarDeskB people={people} benchmark={buildBenchmark(people)} publicUrl={`${site}/radar-compras-2027-b`} verified={demoChecks().ok} />
    </div>
  );
}

async function optionC(email: string) {
  const admin = await createAdminClient();
  const { data: survey } = await admin.from("web_surveys").select("id").eq("slug", SURVEY_SLUG_C).maybeSingle();
  if (!survey) notFound();
  const { data } = await admin.from("web_survey_responses").select(RESPONSE_COLUMNS_C).eq("survey_id", survey.id).order("created_at", { ascending: false });
  const people = ((data ?? []) as SurveyResponseRowC[]).map((row) => personFromRow(row));
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://xinergy.lat").replace(/\/$/, "");
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <AdminNav email={email} />
      <SurveyBack />
      <RadarDeskC people={people} benchmark={buildBenchmarkC(people)} publicUrl={`${site}/radar-compras-2027-c`} verified={versionCChecks().ok} />
    </div>
  );
}

function SurveyBack() {
  return (
    <Link href={adminHref("/encuestas")} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-xinergy-slate hover:text-xinergy-charcoal">
      <span aria-hidden="true">←</span>
      Encuestas
    </Link>
  );
}
