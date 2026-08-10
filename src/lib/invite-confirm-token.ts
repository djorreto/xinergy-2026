import { createHmac, timingSafeEqual } from "crypto";
import type { InviteId } from "@/lib/invites";

export type InviteConfirmPayload = {
  v: 1;
  /** Invite type */
  i: InviteId;
  /** Nombre completo */
  n: string;
  /** Email */
  e: string;
  /** Empresa (opcional) */
  c?: string;
  /** Cargo (opcional) */
  r?: string;
  /** Teléfono (opcional) */
  p?: string;
  /** Expiración unix seconds */
  exp: number;
};

function getSecret(): string {
  const secret = process.env.INVITE_CONFIRM_SECRET?.trim();
  if (!secret) {
    throw new Error("Missing INVITE_CONFIRM_SECRET");
  }
  return secret;
}

function toBase64Url(value: string | Buffer): string {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string): Buffer {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return Buffer.from(padded + pad, "base64");
}

function signBody(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body).digest("base64url");
}

export function createInviteConfirmToken(
  input: Omit<InviteConfirmPayload, "v" | "exp"> & { exp?: number },
  secret = getSecret(),
): string {
  const payload: InviteConfirmPayload = {
    v: 1,
    i: input.i,
    n: input.n.trim(),
    e: input.e.trim().toLowerCase(),
    c: input.c?.trim() || undefined,
    r: input.r?.trim() || undefined,
    p: input.p?.trim() || undefined,
    // Por defecto válido hasta fin del día del evento (19 ago 2026 Chile ~ UTC-4)
    exp: input.exp ?? Math.floor(new Date("2026-08-20T06:00:00.000Z").getTime() / 1000),
  };

  const body = toBase64Url(JSON.stringify(payload));
  const sig = signBody(body, secret);
  return `${body}.${sig}`;
}

export function verifyInviteConfirmToken(
  token: string,
  secret = getSecret(),
):
  | { ok: true; payload: InviteConfirmPayload }
  | { ok: false; error: "invalid_token" | "expired_token" | "missing_secret" } {
  try {
    const [body, sig] = token.split(".");
    if (!body || !sig) return { ok: false, error: "invalid_token" };

    const expected = signBody(body, secret);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, error: "invalid_token" };
    }

    const payload = JSON.parse(fromBase64Url(body).toString("utf8")) as InviteConfirmPayload;
    if (payload.v !== 1 || !payload.n || !payload.e || (payload.i !== "almuerzo" && payload.i !== "evento")) {
      return { ok: false, error: "invalid_token" };
    }
    if (!payload.exp || payload.exp * 1000 < Date.now()) {
      return { ok: false, error: "expired_token" };
    }

    return { ok: true, payload };
  } catch (error) {
    if (error instanceof Error && error.message.includes("INVITE_CONFIRM_SECRET")) {
      return { ok: false, error: "missing_secret" };
    }
    return { ok: false, error: "invalid_token" };
  }
}

export function buildInviteConfirmUrl(token: string, locale = "es"): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://xinergy.lat").replace(/\/$/, "");
  return `${base}/${locale}/registro/confirmar?t=${encodeURIComponent(token)}`;
}
