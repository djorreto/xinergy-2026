import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

const TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const form = await request.formData();
  const id = String(form.get("id") ?? "");
  const file = form.get("photo");
  if (!id || !(file instanceof File) || !TYPES.has(file.type) || file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${id}/foto-${Date.now()}.${extension}`;
  const admin = await createAdminClient();
  const uploaded = await admin.storage.from("team-photos").upload(path, new Uint8Array(await file.arrayBuffer()), {
    contentType: file.type,
    upsert: true,
  });
  if (uploaded.error) return NextResponse.json({ ok: false }, { status: 500 });
  const { error } = await admin.from("web_team_members").update({ image_path: path }).eq("id", id);
  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  for (const locale of ["es", "en", "pt"]) revalidatePath(`/${locale}/nosotros`);
  return NextResponse.json({ ok: true, path });
}
