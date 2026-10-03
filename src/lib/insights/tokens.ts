import { createHash, randomBytes } from "crypto";

export function newDownloadToken(): { raw: string; hash: string } {
  const raw = randomBytes(32).toString("base64url");
  return { raw, hash: hashDownloadToken(raw) };
}

export function hashDownloadToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export function hashIp(ip: string): string {
  const salt = process.env.INSIGHTS_SESSION_SECRET || "xinergy-insights";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function requestCountry(request: Request): string | null {
  const raw =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("cloudfront-viewer-country") ||
    "";
  const code = raw.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code) || code === "XX" || code === "T1") return null;
  return code;
}

export function publicSiteUrl(request?: Request): string {
  if (request) {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
    if (host.startsWith("localhost") || host.startsWith("127.0.0.1")) {
      const proto = request.headers.get("x-forwarded-proto") ?? "http";
      return `${proto}://${host}`;
    }
  }
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://xinergy.lat").replace(/\/$/, "");
}

export function santiagoDate(value = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago" }).format(value);
}
