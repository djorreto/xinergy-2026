import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { pdfDownloadName } from "@/lib/insights/pdf-name";
import { createAdminClient } from "@/lib/supabase/admin";

const SIGNED_URL_SECONDS = 60 * 10;

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ ok: false }, { status: 404 });

  const admin = await createAdminClient();
  const { data } = await admin.from("web_insights").select("slug, kind, pdf_path, pdf_filename").eq("id", id).maybeSingle();
  if (data?.kind === "noticia" || !data?.pdf_path) return NextResponse.json({ ok: false }, { status: 404 });

  const signed = await admin.storage.from("insight-pdfs").createSignedUrl(data.pdf_path, SIGNED_URL_SECONDS, {
    download: pdfDownloadName(data.pdf_filename, data.slug),
  });
  if (signed.error || !signed.data?.signedUrl) return NextResponse.json({ ok: false }, { status: 404 });
  return NextResponse.redirect(signed.data.signedUrl);
}
