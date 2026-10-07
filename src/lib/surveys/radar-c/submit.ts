import { analyzeAhp } from "@/lib/surveys/ahp";
import { AHP } from "@/lib/surveys/radar-2027";
import { isBlockedEmail } from "@/lib/insights/validate";
import { aiProblems, CAPABILITIES, CONSENTS, COUNTRIES, DATA_READY, INDUSTRIES, INITIATIVE_COPY, ROLES, SCOPES, SPEND_C, STATUSES, SURVEY_VERSION_C, type AiAnswers } from "@/lib/surveys/radar-c/instrument";
import { BARRIERS, BARRIER_EXCLUSIVE, BUDGET_DIRECTION, EFFORT_HOURS, EXPOSURE, PARTICIPATION, REALIZATION, SAVINGS, SAVINGS_EXPECTATION, VALIDATE_FREQ, AI_STAGE } from "@/lib/surveys/radar-c/instrument";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const AHP_TOKENS = new Set(["9", "7", "5", "3", "1", "1/3", "1/5", "1/7", "1/9"]);
const LEVELS = new Set(["1", "2", "3", "4", "5", "ns"]);

type Draft = Record<string, unknown>;

export function parseOptionC(body: unknown): { ok: true; row: Record<string, unknown> } | { ok: false; honeypot?: boolean } {
  if (!body || typeof body !== "object") return { ok: false };
  const input = body as Draft;
  const honeypot = typeof input.company_url === "string" && input.company_url.trim().length > 0;
  const draft = input.d;
  if (!draft || typeof draft !== "object") return { ok: false, honeypot };
  const data = draft as Draft;
  const language = data.lang === "pt" || data.lang === "en" || data.lang === "es" ? data.lang : null;
  if (!language || data.version !== SURVEY_VERSION_C) return { ok: false, honeypot };
  const textOf = (id: string) => (typeof data[id] === "string" ? data[id].trim() : "");
  for (const field of ["nombre", "apellido", "cargo", "email", "empresa", "rol", "rubro", "alcance"]) {
    if (!textOf(field)) return { ok: false, honeypot };
  }
  const email = textOf("email").toLowerCase();
  if (!EMAIL.test(email) || isBlockedEmail(email)) return { ok: false, honeypot };
  if (!oneOf(ROLES, textOf("rol")) || !oneOf(INDUSTRIES, textOf("rubro")) || !oneOf(SCOPES, textOf("alcance"))) return { ok: false, honeypot };
  const paises = codes(data.paises);
  if (!paises.length) return { ok: false, honeypot };
  if (textOf("alcance") === "pais" && paises.length !== 1) return { ok: false, honeypot };
  if (textOf("alcance") === "multipais" && paises.length < 2) return { ok: false, honeypot };
  if (textOf("alcance") === "unidad" && !textOf("unidad")) return { ok: false, honeypot };
  if (paises.some((code) => code === "otro" || code === "regional") && !textOf("pais_detalle")) return { ok: false, honeypot };
  if (textOf("rubro") === "otra" && !textOf("rubro_detalle")) return { ok: false, honeypot };
  if (textOf("spend") && !oneOf(SPEND_C, textOf("spend"))) return { ok: false, honeypot };

  const consents: Record<string, boolean> = {};
  for (const item of CONSENTS) {
    consents[item.id] = data[item.id] === true;
    if (item.req && !consents[item.id]) return { ok: false, honeypot };
  }
  const pairs = record(data.prioridades_ahp);
  if (!AHP.pairs.every((pair) => AHP_TOKENS.has(pairs[pair.id] ?? ""))) return { ok: false, honeypot };
  const ahp = analyzeAhp(pairs);
  if (!ahp) return { ok: false, honeypot };

  const rol = textOf("rol");
  const procurement = rol === "cpo" || rol === "scm";
  const capacidades = record(data.capacidades);
  const agenda = record(data.agenda);
  if (procurement) {
    if (!CAPABILITIES.every((item) => LEVELS.has(capacidades[item.id] ?? ""))) return { ok: false, honeypot };
    if (!oneOf(SAVINGS, textOf("e1")) || !oneOf(REALIZATION, textOf("e2")) || !oneOf(EXPOSURE, textOf("e3"))) return { ok: false, honeypot };
    if (!oneOf(EFFORT_HOURS, textOf("e4")) || !oneOf(AI_STAGE, textOf("e5")) || !oneOf(DATA_READY, textOf("r1"))) return { ok: false, honeypot };
    if (!barriersOk(data.e6)) return { ok: false, honeypot };
    if (!INITIATIVE_COPY.every((item) => oneOf(STATUSES, agenda[item.id] ?? ""))) return { ok: false, honeypot };
  } else {
    if (Object.values(capacidades).some((value) => !LEVELS.has(value))) return { ok: false, honeypot };
    if (!optionalOne(SAVINGS, textOf("e1")) || !optionalOne(REALIZATION, textOf("e2")) || !optionalOne(EXPOSURE, textOf("e3"))) return { ok: false, honeypot };
    if (!optionalOne(EFFORT_HOURS, textOf("e4")) || !optionalOne(AI_STAGE, textOf("e5")) || !optionalOne(DATA_READY, textOf("r1"))) return { ok: false, honeypot };
    if (codes(data.e6).length && !barriersOk(data.e6)) return { ok: false, honeypot };
    if (Object.values(agenda).some((value) => !oneOf(STATUSES, value))) return { ok: false, honeypot };
    if (rol === "cfo" && (!oneOf(SAVINGS_EXPECTATION, textOf("f1")) || !oneOf(VALIDATE_FREQ, textOf("f2")))) return { ok: false, honeypot };
    if (rol === "ceo" && (!oneOf(BUDGET_DIRECTION, textOf("g1")) || !oneOf(PARTICIPATION, textOf("g2")))) return { ok: false, honeypot };
    if (rol !== "cfo" && rol !== "ceo" && rol !== "otro") return { ok: false, honeypot };
  }
  const ai = aiOf(data);
  if (Object.keys(aiProblems(ai, procurement ? "required" : "optional")).length) return { ok: false, honeypot };
  const completeOperation = CAPABILITIES.every((item) => LEVELS.has(capacidades[item.id] ?? ""))
    && oneOf(SAVINGS, textOf("e1")) && oneOf(REALIZATION, textOf("e2")) && oneOf(EXPOSURE, textOf("e3"))
    && oneOf(EFFORT_HOURS, textOf("e4")) && oneOf(AI_STAGE, textOf("e5")) && oneOf(DATA_READY, textOf("r1"))
    && barriersOk(data.e6)
    && Object.keys(aiProblems(ai, "required")).length === 0
    && INITIATIVE_COPY.every((item) => oneOf(STATUSES, agenda[item.id] ?? ""));
  const operational = procurement || completeOperation;

  const role = ROLES.find((item) => item.v === rol);
  return {
    ok: true,
    row: {
      language,
      nombre: textOf("nombre").slice(0, 120),
      apellido: textOf("apellido").slice(0, 120),
      email: email.slice(0, 180),
      telefono: textOf("telefono").slice(0, 40) || null,
      linkedin: textOf("linkedin").slice(0, 240) || null,
      cargo: textOf("cargo").slice(0, 180) || role?.es || rol,
      empresa: textOf("empresa").slice(0, 180),
      pais: paises.join(","),
      rol,
      rol_grupo: rol,
      antiguedad: "no-preguntada",
      rubro: textOf("rubro"),
      rubro_grupo: textOf("rubro"),
      consents,
      company: {
        alcance: textOf("alcance"),
        unidad: textOf("unidad").slice(0, 180),
        paises,
        pais_detalle: textOf("pais_detalle").slice(0, 120),
        rubro_detalle: textOf("rubro_detalle").slice(0, 120),
        spend: textOf("spend"),
      },
      answers: {
        version: SURVEY_VERSION_C,
        ruta: operational ? "operativa" : "ejecutiva",
        prioridades_ahp: pairs,
        ahp_aclaracion: data.ahp_aclaracion ?? null,
        capacidades,
        e1: textOf("e1"),
        e2: textOf("e2"),
        e3: textOf("e3"),
        e4: textOf("e4"),
        e5: textOf("e5"),
        r1: textOf("r1"),
        ...ai,
        e6: barriersOk(data.e6) ? codes(data.e6) : [],
        agenda,
        f1: textOf("f1"),
        f2: textOf("f2"),
        g1: textOf("g1"),
        g2: textOf("g2"),
        desafio: textOf("desafio").slice(0, 4000),
      },
      ahp,
    },
  };
}

function aiOf(data: Draft): AiAnswers {
  const text = (id: string) => (typeof data[id] === "string" ? data[id].trim() : "");
  const activos = text("ia_activos");
  const presupuesto = text("ia_presupuesto");
  const running = activos === "si";
  const funded = presupuesto === "si";
  return {
    ia_activos: activos,
    ia_activos_n: running ? text("ia_activos_n") : "",
    ia_compras_n: running ? text("ia_compras_n") : "",
    ia_presupuesto: presupuesto,
    ia_presupuesto_compras: funded ? text("ia_presupuesto_compras") : "",
    ia_escala: running ? text("ia_escala") : "",
    ia_modo: running ? text("ia_modo") : "",
  };
}

function barriersOk(value: unknown) {
  const picked = codes(value);
  if (!picked.length || picked.length > 2) return false;
  const exclusive = picked.some((code) => oneOf(BARRIER_EXCLUSIVE, code));
  if (exclusive) return picked.length === 1;
  return picked.every((code) => oneOf(BARRIERS, code));
}

function codes(value: unknown) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean))];
}

function oneOf(list: { v: string }[], value: string) {
  return list.some((item) => item.v === value);
}

function optionalOne(list: { v: string }[], value: string) {
  return !value || oneOf(list, value);
}

function record(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {} as Record<string, string>;
  const output: Record<string, string> = {};
  for (const [key, item] of Object.entries(value)) if (typeof item === "string") output[key] = item;
  return output;
}
