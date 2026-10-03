import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

const COVER_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function extension(filename: string, kind: "cover" | "pdf" | "gallery") {
  if (kind === "pdf") return "pdf";
  const lower = filename.toLowerCase();
  if (lower.endsWith(".png")) return "png";
  if (lower.endsWith(".webp")) return "webp";
  return "jpg";
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const body = (await request.json()) as {
    insightId?: string;
    kind?: "cover" | "pdf" | "gallery";
    filename?: string;
    contentType?: string;
  };
  const insightId = body.insightId?.trim() ?? "";
  const kind = body.kind;
  const contentType = body.contentType ?? "";
  if (!insightId || (kind !== "cover" && kind !== "pdf" && kind !== "gallery")) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  if (kind === "pdf" && contentType !== "application/pdf") {
    return NextResponse.json({ ok: false, error: "pdf" }, { status: 400 });
  }
  if (kind !== "pdf" && !COVER_TYPES.has(contentType)) {
    return NextResponse.json({ ok: false, error: "cover" }, { status: 400 });
  }

  const admin = await createAdminClient();
  const { data: insight } = await admin.from("web_insights").select("id").eq("id", insightId).maybeSingle();
  if (!insight) return NextResponse.json({ ok: false }, { status: 404 });

  const bucket = kind === "pdf" ? "insight-pdfs" : "insight-covers";
  const path = `${insightId}/${kind}-${Date.now()}.${extension(body.filename ?? "", kind)}`;
  const signed = await admin.storage.from(bucket).createSignedUploadUrl(path);
  if (signed.error || !signed.data) {
    return NextResponse.json({ ok: false, error: signed.error?.message ?? "upload" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, path: signed.data.path, token: signed.data.token, bucket });
}

export async function PATCH(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const body = (await request.json()) as { insightId?: string; kind?: "cover" | "pdf" | "gallery"; path?: string };
  const insightId = body.insightId?.trim() ?? "";
  const path = body.path?.trim() ?? "";
  const kind = body.kind;
  if (!insightId || !path.startsWith(`${insightId}/`) || (kind !== "cover" && kind !== "pdf" && kind !== "gallery")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const admin = await createAdminClient();
  const bucket = kind === "pdf" ? "insight-pdfs" : "insight-covers";
  const folder = insightId;
  const name = path.slice(folder.length + 1);
  const listed = await admin.storage.from(bucket).list(folder);
  if (!listed.data?.some((file) => file.name === name)) {
    return NextResponse.json({ ok: false, error: "missing" }, { status: 400 });
  }

  const { data: current } = await admin
    .from("web_insights")
    .select("cover_path, pdf_path, gallery_paths")
    .eq("id", insightId)
    .maybeSingle();
  const previous = kind === "pdf" ? current?.pdf_path : kind === "cover" ? current?.cover_path : null;
  const gallery = Array.isArray(current?.gallery_paths) ? current.gallery_paths : [];
  const update =
    kind === "pdf"
      ? { pdf_path: path, updated_at: new Date().toISOString() }
      : kind === "gallery"
        ? { gallery_paths: [...gallery, path], updated_at: new Date().toISOString() }
        : { cover_path: path, updated_at: new Date().toISOString() };
  const { error } = await admin.from("web_insights").update(update).eq("id", insightId);
  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  if (previous && previous !== path && !previous.startsWith("/")) await admin.storage.from(bucket).remove([previous]);

  return NextResponse.json({ ok: true, path });
}
