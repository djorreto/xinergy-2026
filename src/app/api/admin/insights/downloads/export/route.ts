import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { DOWNLOAD_LIST_COLUMNS, downloadSheet, type DownloadListRow } from "@/lib/insights/download-table";
import { workbookBytes } from "@/lib/surveys/export-xlsx";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const admin = await createAdminClient();
  const { data } = await admin
    .from("web_insight_downloads")
    .select(DOWNLOAD_LIST_COLUMNS)
    .not("validated_at", "is", null)
    .is("hidden_at", null)
    .order("created_at", { ascending: false });

  const bytes = await workbookBytes([{ name: "Descargas", rows: downloadSheet((data ?? []) as unknown as DownloadListRow[]) }]);
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=\"descargas-insights.xlsx\"",
      "Cache-Control": "no-store",
    },
  });
}
