import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { createAdminClient, supabaseConfigured } from "@/lib/supabase/admin";
import { SURVEY_SLUG_C } from "@/lib/surveys/radar-c/instrument";
import { paperPdfC } from "@/lib/surveys/radar-c/paper-pdf";
import { personFromRow, RESPONSE_COLUMNS_C, type SurveyResponseRowC } from "@/lib/surveys/radar-c/report";

export const maxDuration = 60;

export async function GET() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  if (!supabaseConfigured()) return NextResponse.json({ ok: false }, { status: 503 });
  const people = await loadPeople();
  if (!people) return NextResponse.json({ ok: false }, { status: 404 });
  const bytes = await paperPdfC(people, "Working paper · C (versión oficial)");
  return pdf(bytes, "radar-compras-2027-c-paper.pdf");
}

export async function loadPeople() {
  const admin = await createAdminClient();
  const { data: survey } = await admin.from("web_surveys").select("id").eq("slug", SURVEY_SLUG_C).maybeSingle();
  if (!survey) return null;
  const { data } = await admin.from("web_survey_responses").select(RESPONSE_COLUMNS_C).eq("survey_id", survey.id);
  return (data ?? []).map((row) => personFromRow(row as SurveyResponseRowC));
}

export function pdf(bytes: Uint8Array, filename: string) {
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
