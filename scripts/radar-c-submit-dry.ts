/**
 * Valida parseOptionC para roles cpo, lider_compras, cfo y otro sin escribir en Supabase.
 */
import { parseOptionC } from "../src/lib/surveys/radar-c/submit";
import { AHP } from "../src/lib/surveys/radar-2027";
import { CAPABILITIES, INITIATIVE_COPY, SURVEY_VERSION_C } from "../src/lib/surveys/radar-c/instrument";

function draft(rol: string, extra: Record<string, unknown> = {}) {
  const pairs = Object.fromEntries(AHP.pairs.map((pair) => [pair.id, "1"]));
  const capacidades = Object.fromEntries(CAPABILITIES.map((item) => [item.id, "3"]));
  const agenda = Object.fromEntries(INITIATIVE_COPY.map((item) => [item.id, "EVALUATING"]));
  const base = {
    lang: "es",
    version: SURVEY_VERSION_C,
    nombre: "Prueba",
    apellido: "V3",
    cargo: "Tester",
    email: "prueba.v3@example.com",
    empresa: "Xinergy Test",
    rol,
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
    e3a: "10-25",
    e3b: "<10",
    e4: "1-8h",
    e5: "piloto",
    ia_usos: ["gasto"],
    ia_activos: "no",
    ia_presupuesto: "no",
    r1: "PARTIAL",
    e6: ["datos"],
    ...extra,
  };
  return { company_url: "", d: base };
}

const cases = [
  ["cpo", { equipo_estrategico: "2", equipo_operativo: "3", equipo_soporte: "1", equipo_proximo: "igual" }],
  ["lider_compras", { equipo_estrategico: "1", equipo_operativo: "2", equipo_soporte: "0", equipo_proximo: "mas" }],
  ["cfo", { f1: "2-5", f2: "algunos" }],
  ["otro", {}],
] as const;

let failed = 0;
for (const [rol, extra] of cases) {
  const parsed = parseOptionC(draft(rol, { ...extra }));
  if (!parsed.ok) {
    failed += 1;
    console.log(`FAIL ${rol}`);
    continue;
  }
  const answers = parsed.row.answers as Record<string, unknown>;
  const ahp = parsed.row.ahp as { ahpScale?: string };
  const ok =
    answers.version === SURVEY_VERSION_C &&
    ahp.ahpScale === "compact5" &&
    answers.e3a === "10-25" &&
    Array.isArray(answers.ia_usos);
  console.log(ok ? `OK ${rol}` : `FAIL ${rol} payload`, { version: answers.version, ahpScale: ahp.ahpScale, equipo_n: answers.equipo_n });
  if (!ok) failed += 1;
}

process.exit(failed === 0 ? 0 : 1);
