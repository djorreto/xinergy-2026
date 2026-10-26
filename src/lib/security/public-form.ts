import { clientIp, hashIp } from "@/lib/insights/tokens";
import { createAdminClient, supabaseConfigured } from "@/lib/supabase/admin";

const LIMITS = {
  contact: { hour: 10, day: 30 },
  calculator: { hour: 10, day: 30 },
  survey: { hour: 30, day: 80 },
} as const;

export type PublicFormBucket = keyof typeof LIMITS;

const RATE_EMAIL_PREFIX = "rate-limit:";

export function honeypotTripped(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip && ip !== "unknown") body.set("remoteip", ip);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const data = (await response.json().catch(() => ({}))) as { success?: boolean };
  return Boolean(data.success);
}

/** True when this IP is over the bucket limit. Uses the existing attempts table so no extra schema is required. */
export async function isRateLimited(request: Request, bucket: PublicFormBucket): Promise<boolean> {
  if (!supabaseConfigured()) return false;
  const limits = LIMITS[bucket];
  const ipHash = hashIp(clientIp(request));
  const marker = `${RATE_EMAIL_PREFIX}${bucket}`;
  const sinceHour = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const sinceDay = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  try {
    const admin = await createAdminClient();
    const [{ count: hourCount, error: hourError }, { count: dayCount, error: dayError }] = await Promise.all([
      admin
        .from("web_insight_attempts")
        .select("id", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .eq("email", marker)
        .gte("created_at", sinceHour),
      admin
        .from("web_insight_attempts")
        .select("id", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .eq("email", marker)
        .gte("created_at", sinceDay),
    ]);
    if (hourError || dayError) {
      console.error("[rate-limit]", bucket, hourError?.message || dayError?.message);
      return false;
    }
    if ((hourCount ?? 0) >= limits.hour || (dayCount ?? 0) >= limits.day) return true;
    const { error } = await admin.from("web_insight_attempts").insert({ ip_hash: ipHash, email: marker });
    if (error) {
      console.error("[rate-limit]", bucket, error.message);
      return false;
    }
    return false;
  } catch (error) {
    console.error("[rate-limit]", bucket, error);
    return false;
  }
}
