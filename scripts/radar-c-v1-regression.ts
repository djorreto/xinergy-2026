/**
 * Solo lectura: recalcula AHP de respuestas radar-2027-c-v1 y compara con ahp guardado.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { analyzeAhp } from "../src/lib/surveys/ahp";
import { CAPABILITIES } from "../src/lib/surveys/radar-c/instrument";

function loadEnv() {
  const path = resolve(process.cwd(), ".env.local");
  for (const line of readFileSync(path, "utf8").split(/\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2];
  }
}

function record(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {} as Record<string, string>;
  const output: Record<string, string> = {};
  for (const [key, item] of Object.entries(value)) if (typeof item === "string") output[key] = item;
  return output;
}

function nearly(a: number, b: number, eps = 1e-9) {
  return Math.abs(a - b) <= eps;
}

async function main() {
  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const password = process.env.INSIGHTS_SERVER_PASSWORD;
  const email = process.env.INSIGHTS_SERVER_EMAIL?.trim() || "insights-server@xinergy.lat";
  if (!url || !key || !password) throw new Error("Falta configuración Supabase en .env.local");

  const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error: authError } = await admin.auth.signInWithPassword({ email, password });
  if (authError) throw new Error(authError.message);

  const { data: survey, error: surveyError } = await admin.from("web_surveys").select("id").eq("slug", "radar-compras-2027-c").maybeSingle();
  if (surveyError || !survey) throw new Error(`survey: ${surveyError?.message ?? "not found"}`);

  const { data, error } = await admin.from("web_survey_responses").select("id, answers, ahp").eq("survey_id", survey.id);
  if (error) throw new Error(error.message);

  const v1 = (data ?? []).filter((row) => (row.answers as { version?: string } | null)?.version === "radar-2027-c-v1");
  console.log(`total=${data?.length ?? 0} v1=${v1.length}`);

  let mismatches = 0;
  for (const row of v1) {
    const answers = row.answers as Record<string, unknown>;
    const tokens = record(answers.prioridades_ahp);
    const stored = row.ahp as { maxCr?: number; global?: Record<string, number> } | null;
    const recomputed = analyzeAhp(tokens);
    if (!recomputed || !stored) {
      mismatches += 1;
      console.log(`FAIL ${row.id}: sin AHP`);
      continue;
    }
    const problems: string[] = [];
    if (!nearly(Number(stored.maxCr), recomputed.maxCr)) problems.push(`maxCr ${stored.maxCr} vs ${recomputed.maxCr}`);
    for (const item of CAPABILITIES) {
      const left = Number(stored.global?.[item.id] ?? NaN);
      const right = recomputed.global[item.id] ?? NaN;
      if (!nearly(left, right)) problems.push(`${item.id} ${left} vs ${right}`);
    }
    if (problems.length) {
      mismatches += 1;
      console.log(`FAIL ${row.id}: ${problems.join("; ")}`);
    } else {
      console.log(`OK ${row.id}`);
    }
  }

  console.log(mismatches === 0 ? `REGRESSION OK (${v1.length})` : `REGRESSION FAIL (${mismatches})`);
  process.exit(mismatches === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
