import { createHash, randomInt } from "crypto";
import { isAllowedEmail } from "@/lib/auth/domain";
import { sendResendEmail } from "@/lib/email/resend";
import { createAdminClient } from "@/lib/supabase/admin";

const CODE_MINUTES = 10;

function codePepper(): string {
  return process.env.INSIGHTS_SESSION_SECRET || "xinergy-insights";
}

function hashCode(email: string, code: string): string {
  return createHash("sha256").update(`${codePepper()}:${email}:${code}`).digest("hex");
}

export async function requestInsightAdminCode(email: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const normalized = email.trim().toLowerCase();
  if (!isAllowedEmail(normalized)) return { ok: false, error: "domain" };

  const admin = await createAdminClient();
  const { data: access } = await admin
    .from("web_insight_admins")
    .select("email")
    .eq("email", normalized)
    .eq("enabled", true)
    .maybeSingle();
  if (!access) return { ok: false, error: "not_invited" };

  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("web_insight_login_codes")
    .select("id", { count: "exact", head: true })
    .eq("email", normalized)
    .gte("created_at", since);
  if ((count ?? 0) >= 5) return { ok: false, error: "rate_limited" };

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const { error } = await admin.from("web_insight_login_codes").insert({
    email: normalized,
    code_hash: hashCode(normalized, code),
    expires_at: new Date(Date.now() + CODE_MINUTES * 60 * 1000).toISOString(),
  });
  if (error) return { ok: false, error: "unavailable" };

  const sent = await sendResendEmail({
    to: normalized,
    subject: "Tu código de acceso — Insights Xinergy",
    text: `Tu código para entrar al administrador de Insights es ${code}. Vence en ${CODE_MINUTES} minutos.`,
    html: `<p>Tu código para entrar al administrador de Insights es</p><p style="font-size:32px;font-weight:700;letter-spacing:6px">${code}</p><p>Vence en ${CODE_MINUTES} minutos. Si no lo pediste, ignora este correo.</p>`,
  });
  if (!sent.ok) {
    console.error("[insights-admin] no se pudo enviar el código:", sent.error);
    return { ok: false, error: "email_failed" };
  }
  return { ok: true };
}

export async function verifyInsightAdminCode(email: string, code: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const normalized = email.trim().toLowerCase();
  const token = code.replace(/\s/g, "");
  if (!/^\d{6}$/.test(token)) return { ok: false, error: "invalid_code" };

  const admin = await createAdminClient();
  const { data } = await admin
    .from("web_insight_login_codes")
    .select("id, code_hash, expires_at, used_at, attempts")
    .eq("email", normalized)
    .is("used_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data || new Date(data.expires_at).getTime() < Date.now() || data.attempts >= 5) {
    return { ok: false, error: "invalid_code" };
  }
  if (data.code_hash !== hashCode(normalized, token)) {
    await admin.from("web_insight_login_codes").update({ attempts: data.attempts + 1 }).eq("id", data.id);
    return { ok: false, error: "invalid_code" };
  }

  await admin.from("web_insight_login_codes").update({ used_at: new Date().toISOString() }).eq("id", data.id);
  return { ok: true };
}
