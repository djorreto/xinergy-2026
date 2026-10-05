import { analyzeAhp, ahpLabel, ahpTokenValue } from "@/lib/surveys/ahp";
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

export type ContrastSide = {
  from: string;
  to: string;
  sentence: string;
  fromWins: boolean | null;
  intensity: AhpIntensity | null;
};

export type Contradiction = {
  kind: "cycle" | "gap";
  steps: { from: string; to: string; sentence: string }[];
  closing: string;
  follows: ContrastSide | null;
  marked: ContrastSide | null;
};

export function contradictionOf(blockId: AhpBlockId, tokens: Record<string, string>, lang: Lang): Contradiction | null {
  const block = AHP_BLOCKS.find((item) => item.id === blockId);
  if (!block || block.pairIds.length < 3) return null;
  const cycle = cycleOrder(block.pairIds, tokens);
  if (cycle) {
    const steps = [
      linkSentence(block.pairIds, tokens, cycle[0], cycle[1], lang),
      linkSentence(block.pairIds, tokens, cycle[1], cycle[2], lang),
      linkSentence(block.pairIds, tokens, cycle[2], cycle[0], lang),
    ].filter((step): step is NonNullable<typeof step> => Boolean(step));
    if (steps.length < 3) return null;
    return {
      kind: "cycle",
      steps,
      closing: lang === "en"
        ? "Each one beats the next, and the last one comes back to the first. The three cannot all be true."
        : lang === "pt"
          ? "Cada uma ganha da seguinte, e a última volta à primeira. As três não podem ser verdadeiras juntas."
          : "Cada una le gana a la siguiente, y la última vuelve a la primera. Las tres no pueden ser ciertas juntas.",
      follows: null,
      marked: null,
    };
  }
  const items = [...new Set(block.pairIds.flatMap((id) => {
    const pair = pairMeta(id);
    return pair ? [pair.a, pair.b] : [];
  }))];
  let best: { from: string; mid: string; to: string; gap: number } | null = null;
  for (const from of items) {
    for (const mid of items) {
      if (mid === from) continue;
      for (const to of items) {
        if (to === from || to === mid) continue;
        const first = directedRatio(block.pairIds, tokens, from, mid);
        const second = directedRatio(block.pairIds, tokens, mid, to);
        const direct = directedRatio(block.pairIds, tokens, from, to);
        if (first == null || second == null || direct == null || first < 1 || second < 1) continue;
        const gap = Math.abs(Math.log(first * second) - Math.log(direct));
        if (!best || gap > best.gap) best = { from, mid, to, gap };
      }
    }
  }
  if (!best || best.gap < Math.log(2)) return null;
  const first = linkSentence(block.pairIds, tokens, best.from, best.mid, lang);
  const second = linkSentence(block.pairIds, tokens, best.mid, best.to, lang);
  const stated = directedRatio(block.pairIds, tokens, best.from, best.to);
  const implied = directedRatio(block.pairIds, tokens, best.from, best.mid)! * directedRatio(block.pairIds, tokens, best.mid, best.to)!;
  if (!first || !second || stated == null) return null;
  return {
    kind: "gap",
    steps: [first, second],
    closing: "",
    follows: contrast(best.from, best.to, implied, lang, "follows"),
    marked: contrast(best.from, best.to, stated, lang, "marked"),
  };
}

function contrast(fromId: string, toId: string, ratio: number, lang: Lang, role: "follows" | "marked"): ContrastSide {
  const from = ahpLabel(fromId, lang);
  const to = ahpLabel(toId, lang);
  const told = magnitudeWord(ratio, lang);
  if (told.equal) {
    const sentence = role === "follows"
      ? (lang === "en" ? `${from} and ${to} would have equal importance` : lang === "pt" ? `${from} e ${to} teriam igual importância` : `${from} y ${to} tendrían igual importancia`)
      : (lang === "en" ? `You marked that ${from} and ${to} have equal importance` : lang === "pt" ? `Você marcou que ${from} e ${to} têm igual importância` : `Marcaste que ${from} y ${to} tienen igual importancia`);
    return { from, to, sentence, fromWins: null, intensity: null };
  }
  const winner = told.flipped ? to : from;
  const loser = told.flipped ? from : to;
  const word = told.word;
  const sentence = role === "follows"
    ? (lang === "en" ? `${winner} would have to be ${word} more important than ${loser}` : lang === "pt" ? `${winner} teria de ser ${word} mais importante que ${loser}` : `${winner} tendría que ser ${word} más importante que ${loser}`)
    : (lang === "en" ? `You marked that ${winner} is ${word} more important than ${loser}` : lang === "pt" ? `Você marcou que ${winner} é ${word} mais importante que ${loser}` : `Marcaste que ${winner} es ${word} más importante que ${loser}`);
  return { from, to, sentence, fromWins: !told.flipped, intensity: told.intensity };
}

function linkSentence(pairIds: readonly string[], tokens: Record<string, string>, fromId: string, toId: string, lang: Lang) {
  const ratio = directedRatio(pairIds, tokens, fromId, toId);
  if (ratio == null) return null;
  const from = ahpLabel(fromId, lang);
  const to = ahpLabel(toId, lang);
  const told = magnitudeWord(ratio, lang);
  if (told.equal) {
    const sentence = lang === "en" ? `${from} and ${to} have equal importance` : lang === "pt" ? `${from} e ${to} têm igual importância` : `${from} y ${to} tienen igual importancia`;
    return { from, to, sentence };
  }
  const winner = told.flipped ? to : from;
  const loser = told.flipped ? from : to;
  const sentence = lang === "en"
    ? `${winner} is ${told.word} more important than ${loser}`
    : lang === "pt"
      ? `${winner} é ${told.word} mais importante que ${loser}`
      : `${winner} es ${told.word} más importante que ${loser}`;
  return { from, to, sentence };
}

function magnitudeWord(ratio: number, lang: Lang) {
  const magnitude = ratio >= 1 ? ratio : 1 / ratio;
  if (magnitude < 2) return { flipped: false, equal: true, intensity: null as AhpIntensity | null, word: "" };
  const intensity: AhpIntensity = magnitude >= 8 ? 9 : magnitude >= 6 ? 7 : magnitude >= 4 ? 5 : 3;
  return { flipped: ratio < 1, equal: false, intensity, word: WORDS[lang][intensity] };
}

function directedRatio(pairIds: readonly string[], tokens: Record<string, string>, from: string, to: string) {
  for (const id of pairIds) {
    const pair = pairMeta(id);
    const value = ahpTokenValue(tokens[id] ?? "");
    if (!pair || value == null) continue;
    if (pair.a === from && pair.b === to) return value;
    if (pair.a === to && pair.b === from) return 1 / value;
  }
  return null;
}

function cycleOrder(pairIds: readonly string[], tokens: Record<string, string>) {
  const beats = new Map<string, Set<string>>();
  for (const id of pairIds) {
    const pair = pairMeta(id);
    const choice = choiceFromToken(tokens[id]);
    if (!pair || !choice.side || choice.side === "equal") continue;
    const [winner, loser] = choice.side === "a" ? [pair.a, pair.b] : [pair.b, pair.a];
    const next = beats.get(winner) ?? new Set<string>();
    next.add(loser);
    beats.set(winner, next);
  }
  for (const [first, losers] of beats) {
    for (const second of losers) {
      for (const third of beats.get(second) ?? []) {
        if (beats.get(third)?.has(first)) return [first, second, third] as const;
      }
    }
  }
  return null;
}
