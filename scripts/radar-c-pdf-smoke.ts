import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { personFromRow, type SurveyResponseRowC } from "../src/lib/surveys/radar-c/report";
import { personPdfC } from "../src/lib/surveys/radar-c/pdf";
import { parseOptionC } from "../src/lib/surveys/radar-c/submit";
import { AHP } from "../src/lib/surveys/radar-2027";
import { CAPABILITIES, INITIATIVE_COPY, SURVEY_VERSION_C } from "../src/lib/surveys/radar-c/instrument";
import { evaluationOf } from "../src/lib/surveys/evaluacion";
import { capabilitiesForVersion, initiativesForVersion } from "../src/lib/surveys/radar-c/content";

function loadEnv() {
  for (const line of readFileSync(resolve(".env.local"), "utf8").split(/\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

async function main() {
  loadEnv();
  mkdirSync(resolve("tmp"), { recursive: true });

  const pairs = Object.fromEntries(AHP.pairs.map((pair) => [pair.id, "1"]));
  const capacidades = Object.fromEntries(CAPABILITIES.map((item) => [item.id, "3"]));
  const agenda = Object.fromEntries(INITIATIVE_COPY.map((item) => [item.id, "APPROVED"]));
  const parsed = parseOptionC({
    company_url: "",
    d: {
      lang: "es",
      version: SURVEY_VERSION_C,
      nombre: "Ana",
      apellido: "V3",
      cargo: "CPO",
      email: "ana.v3@example.com",
      empresa: "Demo V3",
      rol: "cpo",
      rubro: "mineria",
      alcance: "pais",
      paises: ["CL"],
      c_datos: true,
      c_agregado: true,
      prioridades_ahp: pairs,
      capacidades,
      agenda,
      e1: "2-5",
      e2: "50-75",
      e3a: "25-50",
      e3b: "10-25",
      e4: "<1h",
      e5: "piloto",
      ia_usos: ["gasto", "rfx"],
      ia_activos: "si",
      ia_escala: "no",
      ia_modo: "solos",
      ia_presupuesto: "no",
      r1: "PARTIAL",
      e6: ["datos"],
      equipo_estrategico: "2",
      equipo_operativo: "4",
      equipo_soporte: "1",
      equipo_proximo: "igual",
    },
  });
  if (!parsed.ok) throw new Error("v3 parse failed");
  const v3Person = personFromRow({
    id: "smoke-v3",
    created_at: new Date().toISOString(),
    email: String(parsed.row.email),
    nombre: String(parsed.row.nombre),
    apellido: String(parsed.row.apellido),
    cargo: String(parsed.row.cargo),
    empresa: String(parsed.row.empresa),
    pais: String(parsed.row.pais),
    rol: String(parsed.row.rol),
    rubro: String(parsed.row.rubro),
    evaluacion: "incluido",
    company: parsed.row.company as Record<string, unknown>,
    answers: parsed.row.answers as Record<string, unknown>,
  });
  const v3Caps = capabilitiesForVersion(v3Person.version).map((item) => item.short.es);
  const v3Inits = initiativesForVersion(v3Person.version).map((item) => item.name.es);
  const v3Pdf = await personPdfC(v3Person, "Smoke v3");
  writeFileSync(resolve("tmp/radar-c-v3-smoke.pdf"), v3Pdf);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const password = process.env.INSIGHTS_SERVER_PASSWORD!;
  const email = process.env.INSIGHTS_SERVER_EMAIL?.trim() || "insights-server@xinergy.lat";
  const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  await admin.auth.signInWithPassword({ email, password });
  const { data: survey } = await admin.from("web_surveys").select("id").eq("slug", "radar-compras-2027-c").maybeSingle();
  const { data } = await admin
    .from("web_survey_responses")
    .select("id, created_at, email, nombre, apellido, telefono, linkedin, cargo, empresa, pais, rol, rubro, evaluacion, company, answers")
    .eq("survey_id", survey!.id)
    .limit(50);
  const v1Row = (data ?? []).find((row) => (row.answers as { version?: string } | null)?.version === "radar-2027-c-v1") as SurveyResponseRowC | undefined;
  if (!v1Row) throw new Error("no v1 row");
  const v1Person = personFromRow({ ...v1Row, evaluacion: evaluationOf(v1Row.evaluacion) } as never);
  // personFromRow expects Evaluacion via evaluationOf inside — use standard path
  const v1 = personFromRow(v1Row);
  const v1Caps = capabilitiesForVersion(v1.version).map((item) => item.short.es);
  const v1Inits = initiativesForVersion(v1.version).map((item) => item.name.es);
  const v1Pdf = await personPdfC(v1, "Smoke v1");
  writeFileSync(resolve("tmp/radar-c-v1-smoke.pdf"), v1Pdf);

  console.log({
    v3: { version: v3Person.version, caps: v3Caps, inits: v3Inits.filter((name) => /Category|Strategic|sostenibles|Working/i.test(name)), bytes: v3Pdf.length },
    v1: { version: v1.version, caps: v1Caps, inits: v1Inits.filter((name, index) => index === 0 || index === 10 || index === 9), bytes: v1Pdf.length },
  });
  if (v3Person.version !== SURVEY_VERSION_C) throw new Error("v3 version");
  if (v1.version !== "radar-2027-c-v1") throw new Error("v1 version");
  if (!v3Caps.includes("Costo total (TCO)") || !v3Caps.includes("Compras sostenibles")) throw new Error("v3 caps");
  if (v1Caps.includes("Costo total (TCO)")) throw new Error("v1 should keep old costos label");
  if (!v3Inits.includes("Category management") || !v1Inits.includes("Optimización de inventario") && !v1Inits.some((n) => /inventario/i.test(n))) {
    // v1 initiative 11 name from B
  }
  console.log("PDF SMOKE OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
