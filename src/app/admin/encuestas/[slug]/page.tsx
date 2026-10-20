import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { RadarDeskC } from "@/components/admin/RadarDeskC";
import { requireAdminUser } from "@/lib/auth/admin";
import { adminHref } from "@/lib/auth/admin-path";
import { createAdminClient } from "@/lib/supabase/admin";
import { SURVEY_PUBLIC_SLUG_C, SURVEY_SLUG_C } from "@/lib/surveys/radar-c/instrument";
import { buildBenchmarkC, personFromRow, RESPONSE_COLUMNS_C, type SurveyResponseRowC } from "@/lib/surveys/radar-c/report";
import { versionCChecks } from "@/lib/surveys/radar-c/verify";

export default async function SurveyAdminPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== SURVEY_PUBLIC_SLUG_C) notFound();
  const user = await requireAdminUser();
  return optionC(user.email);
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
      <RadarDeskC people={people} benchmark={buildBenchmarkC(people)} publicUrl={`${site}/${SURVEY_PUBLIC_SLUG_C}`} verified={versionCChecks().ok} />
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
