export const FORM_GATE_COOKIE = "xinergy_gate";

const MIN_AGE_MS = 3_000;
const MAX_AGE_MS = 2 * 60 * 60 * 1000;

export type FormGateStatus = "ok" | "missing" | "early" | "expired";

function gateSecret(): string {
  return process.env.INSIGHTS_SESSION_SECRET?.trim() || "";
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return mismatch === 0;
}

async function sign(body: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(gateSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`form-gate:${body}`));
  return bytesToBase64Url(new Uint8Array(signature));
}

export async function createFormGate(now = Date.now()): Promise<string> {
  const body = String(now);
  return `${body}.${await sign(body)}`;
}

export function formGateCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(MAX_AGE_MS / 1000),
  };
}

export async function formGateStatus(token: string | undefined, minAgeMs = MIN_AGE_MS, now = Date.now()): Promise<FormGateStatus> {
  if (!gateSecret() || !token || !token.includes(".")) return "missing";
  const dot = token.indexOf(".");
  const body = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const issued = Number(body);
  if (!Number.isFinite(issued)) return "missing";
  const expected = await sign(body);
  if (!safeEqual(expected, signature)) return "missing";
  const age = now - issued;
  if (age < minAgeMs) return "early";
  if (age > MAX_AGE_MS) return "expired";
  return "ok";
}

export async function formGateIsCurrent(token: string | undefined): Promise<boolean> {
  const status = await formGateStatus(token, 0);
  return status === "ok";
}

export function readFormGateCookie(request: Request): string | undefined {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    if (!trimmed.startsWith(`${FORM_GATE_COOKIE}=`)) continue;
    return decodeURIComponent(trimmed.slice(FORM_GATE_COOKIE.length + 1));
  }
  return undefined;
}

export async function requestFormGate(request: Request, minAgeMs = MIN_AGE_MS): Promise<FormGateStatus> {
  return formGateStatus(readFormGateCookie(request), minAgeMs);
}
