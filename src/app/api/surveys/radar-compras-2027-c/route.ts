import { NextResponse } from "next/server";
import { createAdminClient, supabaseConfigured } from "@/lib/supabase/admin";
import { SURVEY_SLUG_C } from "@/lib/surveys/radar-c/instrument";
import { parseOptionC } from "@/lib/surveys/radar-c/submit";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const parsed = parseOptionC(body);
  if (!parsed.ok) {
    if (parsed.honeypot) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  if (!supabaseConfigured()) return NextResponse.json({ ok: false, error: "save" }, { status: 503 });
  const admin = await createAdminClient();
  const { data: survey, error: surveyError } = await admin.from("web_surveys").select("id").eq("slug", SURVEY_SLUG_C).maybeSingle();
  if (surveyError || !survey) return NextResponse.json({ ok: false, error: "save" }, { status: 500 });
  const { data, error } = await admin.from("web_survey_responses").insert({ survey_id: survey.id, ...parsed.row }).select("id").single();
  if (error || !data) return NextResponse.json({ ok: false, error: "save" }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id });
}
