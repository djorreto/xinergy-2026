#!/usr/bin/env node
/**
 * Genera links personales de confirmación one-click para el almuerzo C-Level.
 *
 * Uso:
 *   INVITE_CONFIRM_SECRET=... node scripts/generate-almuerzo-confirm-links.mjs guests.csv
 *
 * CSV con encabezado: name,email,company,role,phone
 * (company, role y phone son opcionales)
 *
 * Salida: TSV name / email / confirmUrl
 */

import { createHmac } from "crypto";
import { readFileSync } from "fs";
import { resolve } from "path";

const secret = process.env.INVITE_CONFIRM_SECRET?.trim();
const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://xinergy.lat").replace(/\/$/, "");
const csvPath = process.argv[2];

if (!secret) {
  console.error("Falta INVITE_CONFIRM_SECRET en el entorno.");
  process.exit(1);
}
if (!csvPath) {
  console.error("Uso: node scripts/generate-almuerzo-confirm-links.mjs guests.csv");
  process.exit(1);
}

function toBase64Url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function createToken({ name, email, company, role, phone }) {
  const payload = {
    v: 1,
    i: "almuerzo",
    n: name.trim(),
    e: email.trim().toLowerCase(),
    c: company?.trim() || undefined,
    r: role?.trim() || undefined,
    p: phone?.trim() || undefined,
    exp: Math.floor(new Date("2026-08-20T06:00:00.000Z").getTime() / 1000),
  };
  const body = toBase64Url(JSON.stringify(payload));
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? "";
    });
    return row;
  });
}

const rows = parseCsv(readFileSync(resolve(csvPath), "utf8"));
console.log(["name", "email", "confirmUrl"].join("\t"));
for (const row of rows) {
  if (!row.name || !row.email) continue;
  const token = createToken({
    name: row.name,
    email: row.email,
    company: row.company,
    role: row.role,
    phone: row.phone,
  });
  const url = `${site}/es/registro/confirmar?t=${encodeURIComponent(token)}`;
  console.log([row.name, row.email, url].join("\t"));
}
