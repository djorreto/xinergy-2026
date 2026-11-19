import { analyzeAhp, ahpLabel } from "@/lib/surveys/ahp";
import { AHP } from "@/lib/surveys/radar-2027";
import type { Lang } from "@/lib/surveys/radar-c/instrument";

/** Bloques lógicos para CR, huellas y asignación de puntos. */
export const AHP_LOGICAL_BLOCKS = {
  general: ["macro_fin_res", "macro_fin_trans", "macro_res_trans"],
  fin: ["fin_costos_caja"],
  res: ["res_riesgo_control", "res_riesgo_esg", "res_control_esg"],
  trans: ["trans_digital_innov", "trans_digital_talento", "trans_innov_talento"],
} as const;

export const AHP_INSIDE_SECTIONS = [
  { id: "fin", pairIds: AHP_LOGICAL_BLOCKS.fin },
  { id: "res", pairIds: AHP_LOGICAL_BLOCKS.res },
  { id: "trans", pairIds: AHP_LOGICAL_BLOCKS.trans },
] as const;

export const AHP_BLOCKS = [
  { id: "general", pairIds: AHP_LOGICAL_BLOCKS.general, sections: null },
  {
    id: "inside",
    pairIds: [...AHP_LOGICAL_BLOCKS.fin, ...AHP_LOGICAL_BLOCKS.res, ...AHP_LOGICAL_BLOCKS.trans],
    sections: AHP_INSIDE_SECTIONS,
  },
] as const;

export type AhpScreenId = (typeof AHP_BLOCKS)[number]["id"];
export type AhpBlockId = keyof typeof AHP_LOGICAL_BLOCKS;
export type AhpInsideSectionId = (typeof AHP_INSIDE_SECTIONS)[number]["id"];

export type AhpSide = "a" | "b" | "equal";
export type AhpIntensity = 3 | 5;
export type AhpIntensityStored = AhpIntensity | 7 | 9;

const INTENSITY_TOKEN: Record<AhpIntensityStored, string> = {
  3: "3",
  5: "5",
  7: "7",
  9: "9",
};
const RECIPROCAL: Record<AhpIntensityStored, string> = {
  3: "1/3",
  5: "1/5",
  7: "1/7",
  9: "1/9",
};

/** Escala compacta de cinco botones para la encuesta C v3. Izquierda favorece A; derecha favorece B. */
export const AHP_SCALE_C = [
  { token: "5", n: "5", es: "Mucho más", en: "Much more", pt: "Muito mais" },
  { token: "3", n: "3", es: "Más", en: "More", pt: "Mais" },
  { token: "1", n: "1", es: "Igual", en: "Equal", pt: "Igual" },
  { token: "1/3", n: "3", es: "Más", en: "More", pt: "Mais" },
  { token: "1/5", n: "5", es: "Mucho más", en: "Much more", pt: "Muito mais" },
] as const;

const C_CRITERION_LABELS: Record<string, { es: string; en: string; pt: string }> = {
  costos: { es: "Reducir costo total", en: "Reduce total cost", pt: "Reduzir custo total" },
};

export function criterionLabelC(id: string, lang: Lang) {
  const override = C_CRITERION_LABELS[id];
  if (override) return override[lang] || override.es;
  return ahpLabel(id, lang);
}

export const AHP_INSIDE_SECTION_TITLES: Record<AhpInsideSectionId, { es: string; en: string; pt: string }> = {
  fin: {
    es: "Costos y caja",
    en: "Cost and cash",
    pt: "Custos e caixa",
  },
  res: {
    es: "Riesgo, control y sostenibilidad",
    en: "Risk, control and sustainability",
    pt: "Risco, controle e sustentabilidade",
  },
  trans: {
    es: "Tecnología, innovación y talento",
    en: "Technology, innovation and talent",
    pt: "Tecnologia, inovação e talento",
  },
};

export function tokenFromChoice(side: AhpSide, intensity: AhpIntensity | null) {
  if (side === "equal") return "1";
  if (!intensity) return null;
  return side === "a" ? INTENSITY_TOKEN[intensity] : RECIPROCAL[intensity];
}

/** Acepta tokens v1 (9, 7, 1/7, 1/9) para recálculo de respuestas antiguas. */
export function choiceFromToken(token: string | undefined): { side: AhpSide | null; intensity: AhpIntensityStored | null } {
  if (!token) return { side: null, intensity: null };
  if (token === "1") return { side: "equal", intensity: null };
  if (token === "3" || token === "5" || token === "7" || token === "9") {
    return { side: "a", intensity: Number(token) as AhpIntensityStored };
  }
  const reciprocal = Object.entries(RECIPROCAL).find(([, value]) => value === token);
  if (reciprocal) return { side: "b", intensity: Number(reciprocal[0]) as AhpIntensityStored };
  return { side: null, intensity: null };
}

export function pairMeta(id: string) {
  return AHP.pairs.find((pair) => pair.id === id) ?? null;
}

export function pairNames(id: string, lang: Lang) {
  const pair = pairMeta(id);
  if (!pair) return { a: id, b: id };
  return { a: criterionLabelC(pair.a, lang), b: criterionLabelC(pair.b, lang) };
}

export function sideDetail(id: string, lang: Lang) {
  const macro = AHP.macros.find((item) => item.id === id);
  if (!macro) return { name: criterionLabelC(id, lang), items: [] as string[] };
  return {
    name: macro.label[lang] || macro.label.es,
    items: macro.children.map((child) => criterionLabelC(child, lang)),
  };
}

export function screenComplete(screenId: AhpScreenId, tokens: Record<string, string>) {
  const screen = AHP_BLOCKS.find((item) => item.id === screenId);
  return Boolean(screen && screen.pairIds.every((id) => choiceFromToken(tokens[id]).side));
}

export function blockComplete(screenId: AhpScreenId, tokens: Record<string, string>) {
  return screenComplete(screenId, tokens);
}

export function blockFingerprint(blockId: AhpBlockId, tokens: Record<string, string>) {
  const pairIds = AHP_LOGICAL_BLOCKS[blockId];
  return pairIds.map((id) => tokens[id] ?? "").join("|");
}

export function subgroupComplete(blockId: AhpBlockId, tokens: Record<string, string>) {
  const pairIds = AHP_LOGICAL_BLOCKS[blockId];
  return pairIds.every((id) => choiceFromToken(tokens[id]).side);
}

/** CR de un subgrupo (tres comparaciones) o bloque lógico; null si faltan respuestas. */
export function subgroupCr(tokens: Record<string, string>, blockId: AhpBlockId): number | null {
  if (!subgroupComplete(blockId, tokens)) return null;
  return blockCr(tokens, blockId);
}

/** @deprecated Alias de subgroupCr por id de bloque lógico. */
export function crForPairIds(tokens: Record<string, string>, blockId: AhpBlockId) {
  return subgroupCr(tokens, blockId);
}

/** Bloques 3x3 cuyo CR supera 0,10. El par único de costos y caja no entra. */
export function reviewBlockIds(tokens: Record<string, string>): AhpBlockId[] {
  const analysis = analyzeAhp(tokens);
  if (!analysis) return [];
  const checks: { id: AhpBlockId; cr: number }[] = [
    { id: "general", cr: analysis.macro.cr },
    { id: "res", cr: analysis.groups.res?.cr ?? 0 },
    { id: "trans", cr: analysis.groups.trans?.cr ?? 0 },
  ];
  return checks.filter((item) => item.cr > 0.1).map((item) => item.id);
}

export function blockCr(tokens: Record<string, string>, blockId: AhpBlockId) {
  const analysis = analyzeAhp(tokens);
  if (!analysis) return null;
  if (blockId === "general") return analysis.macro.cr;
  if (blockId === "fin") return analysis.groups.fin?.cr ?? 0;
  if (blockId === "res") return analysis.groups.res?.cr ?? null;
  return analysis.groups.trans?.cr ?? null;
}

const WORDS: Record<Lang, Record<AhpIntensityStored, string>> = {
  es: { 3: "moderadamente", 5: "fuertemente", 7: "muy fuertemente", 9: "extremadamente" },
  en: { 3: "moderately", 5: "strongly", 7: "very strongly", 9: "extremely" },
  pt: { 3: "moderadamente", 5: "fortemente", 7: "muito fortemente", 9: "extremadamente" },
};

export function describeChoice(id: string, token: string, lang: Lang) {
  const names = pairNames(id, lang);
  const choice = choiceFromToken(token);
  if (choice.side === "equal") {
    if (lang === "en") return `${names.a} and ${names.b} have equal importance`;
    if (lang === "pt") return `${names.a} e ${names.b} têm igual importância`;
    return `${names.a} y ${names.b} tienen igual importancia`;
  }
  if (!choice.side || !choice.intensity) return "";
  const winner = choice.side === "a" ? names.a : names.b;
  const loser = choice.side === "a" ? names.b : names.a;
  const word = WORDS[lang][choice.intensity];
  if (lang === "en") return `${winner} is ${word} more important than ${loser}`;
  if (lang === "pt") return `${winner} é ${word} mais importante que ${loser}`;
  return `${winner} es ${word} más importante que ${loser}`;
}