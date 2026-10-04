import { analyzeAhp } from "@/lib/surveys/ahp";
import { isBlockedEmail } from "@/lib/insights/validate";
import { AHP } from "@/lib/surveys/radar-2027";
import { CAPABILITIES, CONSENTS, COUNTRIES, DATA_READY, EVIDENCE, INDUSTRIES, INITIATIVE_COPY, AGENDA_STATUS, KNOWLEDGE, MANAGED, ORG, ROLES, SPEND, TEAM } from "@/lib/surveys/radar-b/instrument";
import { SURVEY_VERSION_B } from "@/lib/surveys/radar-b/engine";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const AHP_TOKENS = new Set(["9", "7", "5", "3", "1", "1/3", "1/5", "1/7", "1/9"]);
const LEVELS = new Set(["1", "2", "3", "4", "5", "ns"]);

type Draft = Record<string, unknown>;

export function parseOptionB(body: unknown): { ok: true; row: Record<string, unknown> } | { ok: false; honeypot?: boolean } {
  if (!body || typeof body !== "object") return { ok: false };
  const input = body as Draft;
  const honeypot = typeof input.company_url === "string" && input.company_url.trim().length > 0;
  const draft = input.d;
  if (!draft || typeof draft !== "object") return { ok: false, honeypot };
  const data = draft as Draft;
  const language = data.lang === "pt" || data.lang === "en" || data.lang === "es" ? data.lang : null;
  if (!language || data.version !== SURVEY_VERSION_B) return { ok: false, honeypot };

  const textOf = (id: string) => (typeof data[id] === "string" ? data[id].trim() : "");
  for (const field of ["nombre", "apellido", "email", "empresa", "rol", "pais", "rubro", "alcance", "spend", "managed", "organizacion", "equipo"]) {
    if (!textOf(field)) return { ok: false, honeypot };
  }
  const email = textOf("email").toLowerCase();
  if (!EMAIL.test(email) || isBlockedEmail(email)) return { ok: false, honeypot };
  if (!oneOf(ROLES, textOf("rol")) || !oneOf(COUNTRIES, textOf("pais")) || !oneOf(INDUSTRIES, textOf("rubro"))) return { ok: false, honeypot };
  if (!oneOf(SPEND, textOf("spend")) || !oneOf(MANAGED, textOf("managed")) || !oneOf(ORG, textOf("organizacion")) || !oneOf(TEAM, textOf("equipo"))) return { ok: false, honeypot };
  if (textOf("alcance") !== "empresa" && textOf("alcance") !== "unidad") return { ok: false, honeypot };
  if (textOf("alcance") === "unidad" && !textOf("unidad")) return { ok: false, honeypot };
  if ((textOf("pais") === "otro" || textOf("pais") === "regional") && !textOf("pais_detalle")) return { ok: false, honeypot };
  if (textOf("rubro") === "otra" && !textOf("rubro_detalle")) return { ok: false, honeypot };

  const consents: Record<string, boolean> = {};
  for (const item of CONSENTS) {
    consents[item.id] = data[item.id] === true;
    if (item.req && !consents[item.id]) return { ok: false, honeypot };
  }

  const pairs = record(data.prioridades_ahp);
  if (!AHP.pairs.every((pair) => AHP_TOKENS.has(pairs[pair.id] ?? ""))) return { ok: false, honeypot };
  const ahp = analyzeAhp(pairs);
  if (!ahp) return { ok: false, honeypot };

  const conocimiento = textOf("conocimiento");
  if (!oneOf(KNOWLEDGE, conocimiento)) return { ok: false, honeypot };

  const capacidades = record(data.capacidades);
  const evidencia = record(data.evidencia);
  const agenda = record(data.agenda);
  const datos = textOf("datos_ia");
  if (conocimiento !== "no") {
    if (!CAPABILITIES.every((item) => LEVELS.has(capacidades[item.id] ?? ""))) return { ok: false, honeypot };
    if (!EVIDENCE.every((item) => item.options.some((option) => option.v === evidencia[item.id]))) return { ok: false, honeypot };
    if (!oneOf(DATA_READY, datos)) return { ok: false, honeypot };
    if (!INITIATIVE_COPY.every((item) => AGENDA_STATUS.some((option) => option.v === agenda[item.id]))) return { ok: false, honeypot };
  }

  const rol = ROLES.find((item) => item.v === textOf("rol"));
  return {
    ok: true,
    row: {
      language,
      nombre: textOf("nombre").slice(0, 120),
      apellido: textOf("apellido").slice(0, 120),
      email: email.slice(0, 180),
      telefono: null,
      linkedin: null,
      cargo: rol?.es ?? textOf("rol"),
      empresa: textOf("empresa").slice(0, 180),
      pais: textOf("pais"),
      rol: textOf("rol"),
      rol_grupo: textOf("rol"),
      antiguedad: "no-preguntada",
      rubro: textOf("rubro"),
      rubro_grupo: textOf("rubro"),
      consents,
      company: {
        alcance: textOf("alcance"),
        unidad: textOf("unidad").slice(0, 180),
        pais_detalle: textOf("pais_detalle").slice(0, 120),
        rubro_detalle: textOf("rubro_detalle").slice(0, 120),
        spend: textOf("spend"),
        managed: textOf("managed"),
        organizacion: textOf("organizacion"),
        equipo: textOf("equipo"),
      },
      answers: {
        version: SURVEY_VERSION_B,
        conocimiento,
        prioridades_ahp: pairs,
        capacidades: conocimiento === "no" ? {} : capacidades,
        evidencia: conocimiento === "no" ? {} : evidencia,
        datos_ia: conocimiento === "no" ? "" : datos,
        agenda: conocimiento === "no" ? {} : agenda,
        desafio: textOf("desafio").slice(0, 4000),
      },
      ahp,
    },
  };
}

function oneOf(list: { v: string }[], value: string) {
  return list.some((item) => item.v === value);
}

function record(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const output: Record<string, string> = {};
  for (const [key, item] of Object.entries(value)) if (typeof item === "string") output[key] = item;
  return output;
}
