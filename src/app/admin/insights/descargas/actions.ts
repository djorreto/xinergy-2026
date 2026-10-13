"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/admin";
import { adminHref } from "@/lib/auth/admin-path";
import { createAdminClient } from "@/lib/supabase/admin";

export async function setDownloadHidden(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  const hidden = formData.get("hidden") === "1";
  const stayOnHidden = formData.get("view") === "ocultos";
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect(adminHref("/insights/descargas"));

  const admin = await createAdminClient();
  await admin
    .from("web_insight_downloads")
    .update({ hidden_at: hidden ? new Date().toISOString() : null })
    .eq("id", id);

  revalidatePath(adminHref("/insights/descargas"));
  redirect(adminHref(stayOnHidden ? "/insights/descargas?ocultos=1" : "/insights/descargas"));
}
