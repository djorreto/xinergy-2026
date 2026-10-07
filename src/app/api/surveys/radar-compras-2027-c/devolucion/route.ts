import { NextResponse } from "next/server";
import { createAdminClient, supabaseConfigured } from "@/lib/supabase/admin";
import { SURVEY_SLUG_C } from "@/lib/surveys/radar-c/instrument";
import { personPdfC } from "@/lib/surveys/radar-c/pdf";
import { personFromRow, RESPONSE_COLUMNS_C, type SurveyResponseRowC } from "@/lib/surveys/radar-c/report";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ ok: false }, { status: 404 });
  if (!supabaseConfigured()) return NextResponse.json({ ok: false }, { status: 503 });
  const admin = await createAdminClient();
  const { data: survey } = await admin.from("web_surveys").select("id").eq("slug", SURVEY_SLUG_C).maybeSingle();
  if (!survey) return NextResponse.json({ ok: false }, { status: 404 });
  const { data } = await admin.from("web_survey_responses").select(RESPONSE_COLUMNS_C).eq("id", id).eq("survey_id", survey.id).maybeSingle();
  if (!data) return NextResponse.json({ ok: false }, { status: 404 });
  const person = personFromRow(data as SurveyResponseRowC);
  const bytes = await personPdfC(person, "Devolución individual");
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="radar-compras-2027-c-devolucion.pdf"',
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
