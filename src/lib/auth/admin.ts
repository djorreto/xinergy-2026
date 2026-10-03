import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminHref } from "@/lib/auth/admin-path";
import { isAllowedEmail } from "@/lib/auth/domain";
import { INSIGHTS_SESSION_COOKIE, readSessionToken } from "@/lib/auth/insights-session";
import { createAdminClient } from "@/lib/supabase/admin";

export async function insightAdminEnabled(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!isAllowedEmail(normalized)) return false;
  const admin = await createAdminClient();
  const { data } = await admin
    .from("web_insight_admins")
    .select("email")
    .eq("email", normalized)
    .eq("enabled", true)
    .maybeSingle();
  return Boolean(data?.email);
}

export async function getAdminUser() {
  const cookieStore = await cookies();
  const email = await readSessionToken(cookieStore.get(INSIGHTS_SESSION_COOKIE)?.value);
  if (!email || !(await insightAdminEnabled(email))) return null;
  return { email };
}

export async function requireAdminUser() {
  const cookieStore = await cookies();
  const email = await readSessionToken(cookieStore.get(INSIGHTS_SESSION_COOKIE)?.value);
  if (!email) redirect(adminHref("/login"));
  if (!(await insightAdminEnabled(email))) redirect("/api/admin/logout?disabled=1");
  return { email };
}
