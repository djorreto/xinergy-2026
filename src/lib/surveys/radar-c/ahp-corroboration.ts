import { AHP } from "@/lib/surveys/radar-2027";
import { ahpLabel, ahpTokenValue, comparisonCr } from "@/lib/surveys/ahp";
import { AHP_BLOCKS, choiceFromToken, reviewBlockIds, type AhpBlockId, type AhpIntensity } from "@/lib/surveys/radar-c/ahp-blocks";
import type { Lang } from "@/lib/surveys/radar-c/instrument";

/**
 * Corroboración de un solo par por bloque 3x3 con CR > 0,10.
 * El par se elige por la mayor reducción de CR al cambiar solo ese juicio.
 * Empate: menor distancia logarítmica respecto del juicio actual; luego el id estable del par.
 * Los nueve valores se prueban por dentro y no se muestran ni se preseleccionan.
 * Las 729 combinaciones de una tríada alcanzan las nueve plantillas con esta regla.
 */
export const AHP_SCALE_TOKENS = ["1/9", "1/7", "1/5", "1/3", "1", "3", "5", "7", "9"] as const;

const CR_TIE = 1e-8;
const DISTANCE_TIE = 1e-9;

const ADVERB: Record<Lang, Record<AhpIntensity, string>> = {
  es: { 3: "moderadamente", 5: "fuertemente", 7: "muy fuertemente", 9: "extremadamente" },
  en: { 3: "moderately", 5: "strongly", 7: "very strongly", 9: "extremely" },
  pt: { 3: "moderadamente", 5: "fortemente", 7: "muito fortemente", 9: "extremamente" },
};

const INTENSITY_LABEL: Record<Lang, Record<AhpIntensity, string>> = {
  es: { 3: "Moderadamente más importante", 5: "Fuertemente más importante", 7: "Muy fuertemente más importante", 9: "Extremadamente más importante" },
  en: { 3: "Moderately more important", 5: "Strongly more important", 7: "Very strongly more important", 9: "Extremely more important" },
  pt: { 3: "Moderadamente mais importante", 5: "Fortemente mais importante", 7: "Muito fortemente mais importante", 9: "Extremamente mais importante" },
};

export type TemplateId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type CorroborationCard = {
  blockId: AhpBlockId;
  pairId: string;
  template: TemplateId;
  title: string;
  context: string;
  question: string;
  optionP: string;
  optionEqual: string;
  optionQ: string;
  intensityQuestion: string;
  intensities: { value: AhpIntensity; label: string }[];
  current: string;
  keep: string;
  save: string;
  pId: string;
  qId: string;
};

type Pref = { equal: true } | { equal: false; winner: string; loser: string; intensity: AhpIntensity };

export function readStamps(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {} as Record<string, string>;
  const stamps: Record<string, string> = {};
  for (const [key, item] of Object.entries(value)) {
    if (typeof item === "string") stamps[key] = item;
  }
  return stamps;
}

export function blockFingerprint(blockId: AhpBlockId, tokens: Record<string, string>) {
  const block = AHP_BLOCKS.find((item) => item.id === blockId);
  return block ? block.pairIds.map((id) => tokens[id] ?? "").join("|") : "";
}

export function pendingCorroboration(tokens: Record<string, string>, stamps: Record<string, string>) {
  return reviewBlockIds(tokens).filter((id) => stamps[id] !== blockFingerprint(id, tokens));
}

export function corroborationOf(blockId: AhpBlockId, tokens: Record<string, string>, lang: Lang): CorroborationCard | null {
  const block = AHP_BLOCKS.find((item) => item.id === blockId);
  if (!block || block.pairIds.length < 3) return null;
  if (!reviewBlockIds(tokens).includes(blockId)) return null;
  const pairId = selectPair(blockId, tokens);
  if (!pairId) return null;
  const pair = AHP.pairs.find((item) => item.id === pairId);
  if (!pair) return null;
  const criteria = criteriaOf(blockId);
  const third = criteria.find((id) => id !== pair.a && id !== pair.b);
  if (!third) return null;
  const pr = prefBetween(block.pairIds, tokens, pair.a, third);
  const qr = prefBetween(block.pairIds, tokens, pair.b, third);
  const pq = prefBetween(block.pairIds, tokens, pair.a, pair.b);
  if (!pr || !qr || !pq) return null;
  const template = classify(pair.a, pair.b, third, pr, qr, pq);
  const name = (id: string) => ahpLabel(id, lang);
  return {
    blockId,
    pairId,
    template,
    title: titleOf(lang),
    context: contextOf(lang, template, pair.a, pair.b, third, pr, qr),
    question: questionOf(lang),
    optionP: name(pair.a),
    optionEqual: equalOf(lang),
    optionQ: name(pair.b),
    intensityQuestion: intensityQuestionOf(lang),
    intensities: ([3, 5, 7, 9] as const).map((value) => ({ value, label: INTENSITY_LABEL[lang][value] })),
    current: currentOf(lang, pq),
    keep: keepOf(lang),
    save: saveOf(lang),
    pId: pair.a,
    qId: pair.b,
  };
}

export function triadCr(blockId: AhpBlockId, tokens: Record<string, string>) {
  const matrix = triadMatrix(blockId, tokens);
  return matrix ? comparisonCr(matrix) : null;
}

function selectPair(blockId: AhpBlockId, tokens: Record<string, string>) {
  const block = AHP_BLOCKS.find((item) => item.id === blockId);
  const currentCr = triadCr(blockId, tokens);
  if (!block || currentCr == null) return null;
  let best: { pairId: string; reduction: number; distance: number } | null = null;
  for (const pairId of block.pairIds) {
    const current = ahpTokenValue(tokens[pairId] ?? "");
    if (current == null) return null;
    let reduction = Number.NEGATIVE_INFINITY;
    let distance = Number.POSITIVE_INFINITY;
    for (const token of AHP_SCALE_TOKENS) {
      const nextCr = triadCr(blockId, { ...tokens, [pairId]: token });
      const value = ahpTokenValue(token);
      if (nextCr == null || value == null) continue;
      const gained = currentCr - nextCr;
      const step = Math.abs(Math.log(value) - Math.log(current));
      if (gained > reduction + CR_TIE) {
        reduction = gained;
        distance = step;
      } else if (Math.abs(gained - reduction) <= CR_TIE && step < distance) {
        distance = step;
      }
    }
    const candidate = { pairId, reduction, distance };
    if (!best || betterPair(candidate, best)) best = candidate;
  }
  return best?.pairId ?? null;
}

function betterPair(candidate: { pairId: string; reduction: number; distance: number }, best: { pairId: string; reduction: number; distance: number }) {
  if (candidate.reduction > best.reduction + CR_TIE) return true;
  if (Math.abs(candidate.reduction - best.reduction) > CR_TIE) return false;
  if (candidate.distance < best.distance - DISTANCE_TIE) return true;
  if (Math.abs(candidate.distance - best.distance) > DISTANCE_TIE) return false;
  return candidate.pairId < best.pairId;
}

function criteriaOf(blockId: AhpBlockId) {
  if (blockId === "general") return AHP.macros.map((item) => item.id);
  return AHP.macros.find((item) => item.id === blockId)?.children ?? [];
}

function triadMatrix(blockId: AhpBlockId, tokens: Record<string, string>) {
  const block = AHP_BLOCKS.find((item) => item.id === blockId);
  const ids = criteriaOf(blockId);
  if (!block || ids.length < 3) return null;
  const index = Object.fromEntries(ids.map((id, position) => [id, position]));
  const matrix: number[][] = ids.map((_, row) => ids.map((__, column) => (row === column ? 1 : 0)));
  for (const pairId of block.pairIds) {
    const pair = AHP.pairs.find((item) => item.id === pairId);
    const value = ahpTokenValue(tokens[pairId] ?? "");
    if (!pair || value == null || index[pair.a] == null || index[pair.b] == null) return null;
    matrix[index[pair.a]][index[pair.b]] = value;
    matrix[index[pair.b]][index[pair.a]] = 1 / value;
  }
  return matrix;
}

function prefBetween(pairIds: readonly string[], tokens: Record<string, string>, left: string, right: string): Pref | null {
  for (const id of pairIds) {
    const pair = AHP.pairs.find((item) => item.id === id);
    if (!pair) continue;
    const matches = (pair.a === left && pair.b === right) || (pair.a === right && pair.b === left);
    if (!matches) continue;
    const choice = choiceFromToken(tokens[id]);
    if (!choice.side) return null;
    if (choice.side === "equal") return { equal: true };
    if (!choice.intensity) return null;
    const winner = choice.side === "a" ? pair.a : pair.b;
    const loser = choice.side === "a" ? pair.b : pair.a;
    return { equal: false, winner, loser, intensity: choice.intensity };
  }
  return null;
}

function classify(p: string, q: string, r: string, pr: Pref, qr: Pref, pq: Pref): TemplateId {
  if (pr.equal && qr.equal) return 1;
  if (pr.equal !== qr.equal) return 2;
  if (!pr.equal && !qr.equal && pr.winner === p && qr.winner === q) return pr.intensity === qr.intensity ? 3 : 5;
  if (!pr.equal && !qr.equal && pr.winner === r && qr.winner === r) return pr.intensity === qr.intensity ? 4 : 6;
  const superior = !pr.equal && pr.winner === p ? p : q;
  const inferior = superior === p ? q : p;
  if (pq.equal) return 8;
  if (!pq.equal && pq.winner === inferior) return 7;
  return 9;
}

function contextOf(lang: Lang, template: TemplateId, p: string, q: string, r: string, pr: Pref, qr: Pref) {
  const P = ahpLabel(p, lang);
  const Q = ahpLabel(q, lang);
  const R = ahpLabel(r, lang);
  const word = (pref: Pref) => (pref.equal ? "" : ADVERB[lang][pref.intensity]);
  if (template === 1) return bothEqual(lang, P, Q, R);
  if (template === 2) return oneEqual(lang, P, Q, R, p, q, pr, qr);
  if (template === 3) return bothOver(lang, P, Q, R, word(pr));
  if (template === 4) return thirdOver(lang, P, Q, R, word(pr));
  if (template === 5) return bothOverSplit(lang, P, Q, R, word(pr), word(qr));
  if (template === 6) return thirdOverSplit(lang, P, Q, R, word(pr), word(qr));
  const superiorId = !pr.equal && pr.winner === p ? p : q;
  const superior = ahpLabel(superiorId, lang);
  const inferior = ahpLabel(superiorId === p ? q : p, lang);
  const first = superiorId === p ? pr : qr;
  const second = superiorId === p ? qr : pr;
  if (template === 7) return chainReverse(lang, superior, R, inferior);
  if (template === 8) return chainEqual(lang, superior, R, inferior);
  return chainDirect(lang, superior, R, inferior, word(first), word(second));
}

function bothEqual(lang: Lang, p: string, q: string, r: string) {
  if (lang === "en") return `You marked that ${p} and ${r} have equal importance, and also that ${q} and ${r} have equal importance. We want to confirm the direct comparison between ${p} and ${q}.`;
  if (lang === "pt") return `Você marcou que ${p} e ${r} têm igual importância, e também que ${q} e ${r} têm igual importância. Queremos confirmar a comparação direta entre ${p} e ${q}.`;
  return `Marcaste que ${p} y ${r} tienen igual importancia, y también que ${q} y ${r} tienen igual importancia. Queremos confirmar la comparación directa entre ${p} y ${q}.`;
}

function oneEqual(lang: Lang, p: string, q: string, r: string, pId: string, qId: string, pr: Pref, qr: Pref) {
  const equalName = pr.equal ? p : q;
  const otherName = pr.equal ? q : p;
  const other = pr.equal ? qr : pr;
  const otherId = pr.equal ? qId : pId;
  const otherWins = !other.equal && other.winner === otherId;
  const intensity = other.equal ? "" : ADVERB[lang][other.intensity];
  if (lang === "en") {
    const second = otherWins
      ? `${otherName} is ${intensity} more important than ${r}`
      : `${r} is ${intensity} more important than ${otherName}`;
    return `You marked that ${equalName} and ${r} have equal importance. Also that ${second}. We want to confirm the direct comparison between ${p} and ${q}.`;
  }
  if (lang === "pt") {
    const second = otherWins
      ? `${otherName} é ${intensity} mais importante que ${r}`
      : `${r} é ${intensity} mais importante que ${otherName}`;
    return `Você marcou que ${equalName} e ${r} têm igual importância. Também que ${second}. Queremos confirmar a comparação direta entre ${p} e ${q}.`;
  }
  const second = otherWins
    ? `${otherName} es ${intensity} más importante que ${r}`
    : `${r} es ${intensity} más importante que ${otherName}`;
  return `Marcaste que ${equalName} y ${r} tienen igual importancia. También que ${second}. Queremos confirmar la comparación directa entre ${p} y ${q}.`;
}

function bothOver(lang: Lang, p: string, q: string, r: string, intensity: string) {
  if (lang === "en") return `You chose that both ${p} and ${q} are ${intensity} more important than ${r}. Because you used the same intensity in both answers, we want to confirm the difference between ${p} and ${q}.`;
  if (lang === "pt") return `Você escolheu que tanto ${p} quanto ${q} são ${intensity} mais importantes que ${r}. Como usou a mesma intensidade nas duas respostas, queremos confirmar a diferença entre ${p} e ${q}.`;
  return `Elegiste que tanto ${p} como ${q} son ${intensity} más importantes que ${r}. Como usaste la misma intensidad en ambas respuestas, queremos confirmar la diferencia entre ${p} y ${q}.`;
}

function thirdOver(lang: Lang, p: string, q: string, r: string, intensity: string) {
  if (lang === "en") return `You chose that ${r} is ${intensity} more important than ${p} and also than ${q}. Because you used the same intensity in both answers, we want to confirm the difference between ${p} and ${q}.`;
  if (lang === "pt") return `Você escolheu que ${r} é ${intensity} mais importante que ${p} e também que ${q}. Como usou a mesma intensidade nas duas respostas, queremos confirmar a diferença entre ${p} e ${q}.`;
  return `Elegiste que ${r} es ${intensity} más importante que ${p} y también que ${q}. Como usaste la misma intensidad en ambas respuestas, queremos confirmar la diferencia entre ${p} y ${q}.`;
}

function bothOverSplit(lang: Lang, p: string, q: string, r: string, intensityP: string, intensityQ: string) {
  if (lang === "en") return `You marked that ${p} is ${intensityP} more important than ${r}, and that ${q} is ${intensityQ} more important than ${r}. We want to confirm how you compare ${p} and ${q} directly.`;
  if (lang === "pt") return `Você marcou que ${p} é ${intensityP} mais importante que ${r}, e que ${q} é ${intensityQ} mais importante que ${r}. Queremos confirmar como você compara diretamente ${p} e ${q}.`;
  return `Marcaste que ${p} es ${intensityP} más importante que ${r}, y que ${q} es ${intensityQ} más importante que ${r}. Queremos confirmar cómo comparas directamente ${p} y ${q}.`;
}

function thirdOverSplit(lang: Lang, p: string, q: string, r: string, intensityP: string, intensityQ: string) {
  if (lang === "en") return `You marked that ${r} is ${intensityP} more important than ${p}, and ${intensityQ} more important than ${q}. We want to confirm how you compare ${p} and ${q} directly.`;
  if (lang === "pt") return `Você marcou que ${r} é ${intensityP} mais importante que ${p}, e ${intensityQ} mais importante que ${q}. Queremos confirmar como você compara diretamente ${p} e ${q}.`;
  return `Marcaste que ${r} es ${intensityP} más importante que ${p}, y ${intensityQ} más importante que ${q}. Queremos confirmar cómo comparas directamente ${p} y ${q}.`;
}

function chainReverse(lang: Lang, superior: string, middle: string, inferior: string) {
  if (lang === "en") return `In two answers you chose ${superior} over ${middle}, and ${middle} over ${inferior}. In the direct comparison you chose ${inferior}. We want to confirm this last choice.`;
  if (lang === "pt") return `Em duas respostas você escolheu ${superior} acima de ${middle}, e ${middle} acima de ${inferior}. Na comparação direta você escolheu ${inferior}. Queremos confirmar esta última escolha.`;
  return `En dos respuestas elegiste ${superior} por encima de ${middle}, y ${middle} por encima de ${inferior}. En la comparación directa elegiste ${inferior}. Queremos confirmar esta última elección.`;
}

function chainEqual(lang: Lang, superior: string, middle: string, inferior: string) {
  if (lang === "en") return `You chose ${superior} over ${middle}, and ${middle} over ${inferior}. When comparing ${superior} and ${inferior} directly, you marked equal importance. We want to confirm that equality.`;
  if (lang === "pt") return `Você escolheu ${superior} acima de ${middle}, e ${middle} acima de ${inferior}. Ao comparar diretamente ${superior} e ${inferior}, marcou igual importância. Queremos confirmar essa igualdade.`;
  return `Elegiste ${superior} por encima de ${middle}, y ${middle} por encima de ${inferior}. Al comparar directamente ${superior} y ${inferior}, marcaste igual importancia. Queremos confirmar esa igualdad.`;
}

function chainDirect(lang: Lang, superior: string, middle: string, inferior: string, first: string, second: string) {
  if (lang === "en") return `You marked that ${superior} is ${first} more important than ${middle}, and that ${middle} is ${second} more important than ${inferior}. We want to confirm the intensity of your direct comparison between ${superior} and ${inferior}.`;
  if (lang === "pt") return `Você marcou que ${superior} é ${first} mais importante que ${middle}, e que ${middle} é ${second} mais importante que ${inferior}. Queremos confirmar a intensidade da sua comparação direta entre ${superior} e ${inferior}.`;
  return `Marcaste que ${superior} es ${first} más importante que ${middle}, y que ${middle} es ${second} más importante que ${inferior}. Queremos confirmar la intensidad de tu comparación directa entre ${superior} y ${inferior}.`;
}

function titleOf(lang: Lang) {
  if (lang === "en") return "Confirm this comparison";
  if (lang === "pt") return "Confirme esta comparação";
  return "Confirma esta comparación";
}

function questionOf(lang: Lang) {
  if (lang === "en") return "For the 2027 Procurement agenda, which should matter more?";
  if (lang === "pt") return "Para a agenda de Compras de 2027, qual deveria ter maior importância?";
  return "Para la agenda de Compras de 2027, ¿cuál debería tener mayor importancia?";
}

function equalOf(lang: Lang) {
  if (lang === "en") return "Equal importance";
  if (lang === "pt") return "Igual importância";
  return "Igual importancia";
}

function intensityQuestionOf(lang: Lang) {
  if (lang === "en") return "By how much?";
  if (lang === "pt") return "Com que intensidade?";
  return "¿Con qué intensidad?";
}

function keepOf(lang: Lang) {
  if (lang === "en") return "Keep my choice and continue";
  if (lang === "pt") return "Manter minha escolha e continuar";
  return "Mantener mi elección y continuar";
}

function saveOf(lang: Lang) {
  if (lang === "en") return "Save and continue";
  if (lang === "pt") return "Salvar e continuar";
  return "Guardar y continuar";
}

function currentOf(lang: Lang, pq: Pref) {
  if (pq.equal) {
    if (lang === "en") return "Your current choice: Equal importance.";
    if (lang === "pt") return "Sua escolha atual: Igual importância.";
    return "Tu elección actual: Igual importancia.";
  }
  const winner = ahpLabel(pq.winner, lang);
  const word = ADVERB[lang][pq.intensity];
  if (lang === "en") return `Your current choice: ${winner}, ${word} more important.`;
  if (lang === "pt") return `Sua escolha atual: ${winner}, ${word} mais importante.`;
  return `Tu elección actual: ${winner}, ${word} más importante.`;
}
