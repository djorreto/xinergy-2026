import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { adminHref } from "@/lib/auth/admin-path";
import { requireAdminUser } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function SurveysPage() {
  const user = await requireAdminUser();
  const admin = await createAdminClient();
  const [{ data: surveys }, { data: responses }] = await Promise.all([
    admin.from("web_surveys").select("id, slug, title").order("title"),
    admin.from("web_survey_responses").select("survey_id"),
  ]);
  const counts = new Map<string, number>();
  for (const row of responses ?? []) {
    const id = String(row.survey_id);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <AdminNav email={user.email} />
      <p className="label-editorial">Admin</p>
      <h1 className="mt-2 font-display text-3xl text-xinergy-charcoal">Encuestas y formularios</h1>
      <div className="mt-6 flex flex-col gap-3">
        {(surveys ?? []).map((survey) => (
          <Link key={survey.id} href={adminHref(`/encuestas/${survey.slug}`)} className="border border-xinergy-charcoal/10 bg-white p-5 hover:border-xinergy-orange">
            <p className="font-display text-xl text-xinergy-charcoal">{survey.title}</p>
            <p className="mt-1 text-sm text-xinergy-slate">{counts.get(survey.id) ?? 0} respuestas</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
