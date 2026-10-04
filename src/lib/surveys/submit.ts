import { analyzeAhp } from "@/lib/surveys/ahp";
import {
  AHP,
  CONSENTS,
  EMP,
  REG,
  S4,
  S5,
  S6,
  S7,
  SURVEY_VERSION,
  industryGroup,
  isVisible,
  roleGroup,
  type Question,
} from "@/lib/surveys/radar-2027";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const AHP_TOKENS = new Set(["9", "7", "5", "3", "1", "1/3", "1/5", "1/7", "1/9"]);

type Draft = Record<string, unknown>;

export type SurveyRow = {
  language: "es" | "en" | "pt";
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  linkedin: string | null;
  cargo: string;
  empresa: string;
  pais: string;
  rol: string;
  rol_grupo: string;
  antiguedad: string;
  rubro: string;
  rubro_grupo: string | null;
  consents: Record<string, boolean>;
  company: Record<string, string | string[]>;
  answers: Record<string, unknown>;
  ahp: ReturnType<typeof analyzeAhp>;
};

export function parseSubmission(body: unknown): { ok: true; row: SurveyRow } | { ok: false; honeypot?: boolean } {
  if (!body || typeof body !== "object") return { ok: false };
  const input = body as Draft;
  if (typeof input.company_url === "string" && input.company_url.trim()) return { ok: false, honeypot: true };
  const draft = input.d;
  if (!draft || typeof draft !== "object") return { ok: false };
  const data = draft as Draft;
  const language = data.lang === "pt" || data.lang === "en" || data.lang === "es" ? data.lang : null;
  if (!language) return { ok: false };
  if (data.version !== SURVEY_VERSION) return { ok: false };

  const text = (id: string) => (typeof data[id] === "string" ? data[id].trim() : "");
  for (const field of ["nombre", "apellido", "rol", "cargo", "empresa", "pais", "antiguedad", "email"]) {
    if (!text(field)) return { ok: false };
  }
  if (!EMAIL.test(text("email"))) return { ok: false };
  const linkedin = text("linkedin");
  if (linkedin && !/^https?:\/\/\S+\.\S+/.test(linkedin) && !/^[a-z0-9.-]*linkedin\.com\/\S+/i.test(linkedin)) return { ok: false };

  const consents: Record<string, boolean> = {};
  for (const item of CONSENTS) {
    consents[item.id] = data[item.id] === true;
    if (item.req && !consents[item.id]) return { ok: false };
  }

  const rol = roleGroup(text("rol"));
  const rubro = text("rubro");
  const group = industryGroup(rubro);
  if (!validQuestions(EMP, data, rol, group)) return { ok: false };
  if (!validQuestions([...S4, ...S5, ...S6, ...S7], data, rol, group)) return { ok: false };

  const company: Record<string, string | string[]> = {};
  for (const question of EMP) {
    const value = cleanValue(question, data[question.id]);
    if (value !== undefined) company[question.id] = value as string | string[];
  }

  const answers: Record<string, unknown> = {};
  for (const question of [...S4, ...S5, ...S6, ...S7].filter((item) => isVisible(item, rol, group))) {
    const value = cleanValue(question, data[question.id]);
    if (value !== undefined) answers[question.id] = value;
    if (question.type === "multi" && question.other) {
      const other = text(`${question.id}_otro`);
      if (other) answers[`${question.id}_otro`] = other.slice(0, 240);
    }
  }

  const ahp = analyzeAhp(isRecord(data.prioridades_ahp) ? (data.prioridades_ahp as Record<string, string>) : null);
  if (!ahp) return { ok: false };

  return {
    ok: true,
    row: {
      language,
      nombre: text("nombre").slice(0, 120),
      apellido: text("apellido").slice(0, 120),
      email: text("email").toLowerCase().slice(0, 180),
      telefono: text("telefono") ? text("telefono").slice(0, 40) : null,
      linkedin: linkedin ? linkedin.slice(0, 240) : null,
      cargo: text("cargo").slice(0, 160),
      empresa: text("empresa").slice(0, 180),
      pais: text("pais"),
      rol: text("rol"),
      rol_grupo: rol,
      antiguedad: text("antiguedad"),
      rubro,
      rubro_grupo: group,
      consents,
      company,
      answers,
      ahp,
    },
  };
}

function validQuestions(questions: Question[], data: Draft, rol: string, rubro: string | null) {
  return questions.filter((question) => isVisible(question, rol, rubro)).every((question) => validQuestion(question, data));
}

function validQuestion(question: Question, data: Draft) {
  const value = data[question.id];
  if (question.optional && isEmpty(question, value)) return true;
  if (question.type === "text" || question.type === "tel") return typeof value === "string" && value.trim().length > 0 && value.trim().length <= 180;
  if (question.type === "email") return typeof value === "string" && EMAIL.test(value.trim());
  if (question.type === "url") return true;
  if (question.type === "textarea") return typeof value !== "string" || value.length <= 4000;
  if (question.type === "select" || question.type === "single") return typeof value === "string" && question.options.some((option) => option.v === value);
  if (question.type === "multi") {
    if (!Array.isArray(value) || value.length === 0) return false;
    if (question.max && value.length > question.max) return false;
    if (!value.every((item) => typeof item === "string" && question.options.some((option) => option.v === item))) return false;
    const exclusive = value.filter((item) => item === "ninguno" || item === "ninguna");
    return exclusive.length === 0 || value.length === 1;
  }
  if (question.type === "scale") return value === "1" || value === "2" || value === "3" || value === "4" || value === "5";
  if (question.type === "matrix") {
    if (!isRecord(value)) return false;
    return question.rows.every((row) => ["1", "2", "3", "4", "5"].includes(String(value[row.v] ?? "")));
  }
  if (question.type === "ahp") {
    if (!isRecord(value)) return false;
    return AHP.pairs.every((pair) => AHP_TOKENS.has(String(value[pair.id] ?? "")));
  }
  return false;
}

function isEmpty(question: Question, value: unknown) {
  if (question.type === "multi") return !Array.isArray(value) || value.length === 0;
  if (question.type === "textarea" || question.type === "text" || question.type === "email" || question.type === "tel" || question.type === "url") {
    return typeof value !== "string" || !value.trim();
  }
  return value == null || value === "";
}

function cleanValue(question: Question, value: unknown) {
  if (question.type === "text" || question.type === "email" || question.type === "tel" || question.type === "url" || question.type === "textarea") {
    return typeof value === "string" ? value.trim().slice(0, question.type === "textarea" ? 4000 : 240) : undefined;
  }
  if (question.type === "select" || question.type === "single" || question.type === "scale") return typeof value === "string" ? value : undefined;
  if (question.type === "multi") return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : undefined;
  if (question.type === "matrix" || question.type === "ahp") return isRecord(value) ? value : undefined;
  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
