import { analyzeAhp, ahpLabel } from "@/lib/surveys/ahp";
import { AHP } from "@/lib/surveys/radar-2027";
import type { Lang } from "@/lib/surveys/radar-c/instrument";

export const AHP_BLOCKS = [
  { id: "general", pairIds: ["macro_fin_res", "macro_fin_trans", "macro_res_trans"] },
  { id: "fin", pairIds: ["fin_costos_caja"] },
  { id: "res", pairIds: ["res_riesgo_control", "res_riesgo_esg", "res_control_esg"] },
  { id: "trans", pairIds: ["trans_digital_innov", "trans_digital_talento", "trans_innov_talento"] },
] as const;

export type AhpBlockId = (typeof AHP_BLOCKS)[number]["id"];
export type AhpSide = "a" | "b" | "equal";
export type AhpIntensity = 3 | 5 | 7 | 9;

const INTENSITY_TOKEN: Record<AhpIntensity, string> = { 3: "3", 5: "5", 7: "7", 9: "9" };
const RECIPROCAL: Record<AhpIntensity, string> = { 3: "1/3", 5: "1/5", 7: "1/7", 9: "1/9" };

export function tokenFromChoice(side: AhpSide, intensity: AhpIntensity | null) {
  if (side === "equal") return "1";
  if (!intensity) return null;
  return side === "a" ? INTENSITY_TOKEN[intensity] : RECIPROCAL[intensity];
}

export function choiceFromToken(token: string | undefined): { side: AhpSide | null; intensity: AhpIntensity | null } {
  if (!token) return { side: null, intensity: null };
  if (token === "1") return { side: "equal", intensity: null };
  if (token === "3" || token === "5" || token === "7" || token === "9") return { side: "a", intensity: Number(token) as AhpIntensity };
  const reciprocal = Object.entries(RECIPROCAL).find(([, value]) => value === token);
  if (reciprocal) return { side: "b", intensity: Number(reciprocal[0]) as AhpIntensity };
  return { side: null, intensity: null };
}

export function pairMeta(id: string) {
  return AHP.pairs.find((pair) => pair.id === id) ?? null;
}

export function pairNames(id: string, lang: Lang) {
  const pair = pairMeta(id);
  if (!pair) return { a: id, b: id };
  return { a: ahpLabel(pair.a, lang), b: ahpLabel(pair.b, lang) };
}

export function sideDetail(id: string, lang: Lang) {
  const macro = AHP.macros.find((item) => item.id === id);
  if (!macro) return { name: ahpLabel(id, lang), items: [] as string[] };
  return { name: macro.label[lang] || macro.label.es, items: macro.children.map((child) => ahpLabel(child, lang)) };
}

export function blockComplete(blockId: AhpBlockId, tokens: Record<string, string>) {
  const block = AHP_BLOCKS.find((item) => item.id === blockId);
  return Boolean(block && block.pairIds.every((id) => choiceFromToken(tokens[id]).side));
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

const WORDS: Record<Lang, Record<AhpIntensity, string>> = {
  es: { 3: "moderadamente", 5: "fuertemente", 7: "muy fuertemente", 9: "extremadamente" },
  en: { 3: "moderately", 5: "strongly", 7: "very strongly", 9: "extremely" },
  pt: { 3: "moderadamente", 5: "fortemente", 7: "muito fortemente", 9: "extremamente" },
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

