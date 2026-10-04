import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { supabaseConfigured } from "@/lib/supabase/admin";
import { loadPeople } from "@/app/api/admin/surveys/radar-compras-2027-c/informe/route";
import { paperDocument, paperMarkdown } from "@/lib/surveys/radar-c/paper-doc";
import { buildPaperCut } from "@/lib/surveys/radar-c/paper-cut";

export const maxDuration = 60;

export async function GET() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  if (!supabaseConfigured()) return NextResponse.json({ ok: false }, { status: 503 });
  const people = await loadPeople();
  if (!people) return NextResponse.json({ ok: false }, { status: 404 });
  const markdown = paperMarkdown(paperDocument(buildPaperCut(people), "Working paper · C (versión oficial)"));
  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"radar-compras-2027-c-paper.md\"",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
