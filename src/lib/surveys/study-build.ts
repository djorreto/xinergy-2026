import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { createAdminClient, supabaseConfigured } from "@/lib/supabase/admin";
import { SURVEY_SLUG } from "@/lib/surveys/radar-2027";
import { SURVEY_SLUG_B } from "@/lib/surveys/radar-b/engine";
import { studyResponseB } from "@/lib/surveys/radar-b/study-report";
import { studyResponseA } from "@/lib/surveys/study-a-report";

export async function studyResponse(slug: typeof SURVEY_SLUG | typeof SURVEY_SLUG_B) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  if (!supabaseConfigured()) return NextResponse.json({ ok: false }, { status: 503 });
  const admin = await createAdminClient();
  const { data: survey } = await admin.from("web_surveys").select("id").eq("slug", slug).maybeSingle();
  if (!survey) return NextResponse.json({ ok: false }, { status: 404 });
  if (slug === SURVEY_SLUG_B) return studyResponseB(admin, survey.id);
  return studyResponseA(admin, survey.id);
}
