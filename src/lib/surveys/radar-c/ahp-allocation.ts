import { analyzeAhp, type AhpAnalysis } from "@/lib/surveys/ahp";
import { AHP } from "@/lib/surveys/radar-2027";
import { blockCr, blockFingerprint, reviewBlockIds } from "@/lib/surveys/radar-c/ahp-blocks";
import type { Lang } from "@/lib/surveys/radar-c/instrument";

/** Bloques de tres criterios. Costos y caja no entra en esta revisión. */
export const ALLOCATION_BLOCKS = ["general", "res", "trans"] as const;
export type AllocationBlockId = (typeof ALLOCATION_BLOCKS)[number];
export type WeightSource = "AHP" | "DIRECT_ALLOCATION";

export type AllocationSnapshot = {
  points: Record<string, number>;
  fingerprint: string;
  cr: number;
  weightsAhp: number[];
};

export type AllocationRecord = {
  points: Record<string, number> | null;
  fingerprint: string;
  cr: number;
  weightsAhp: number[];
  history: AllocationSnapshot[];
};

export type BlockWeight = {
  id: AllocationBlockId | "fin";
  source: WeightSource;
  cr: number | null;
  criteria: string[];
  local: number[];
  weightsAhp: number[];
  points: Record<string, number> | null;
};

export type PriorityResolution = {
  ahp: AhpAnalysis;
  mode: "ahp" | "hibrido";
  clarificationComplete: boolean;
  global: Record<string, number>;
  ahpGlobal: Record<string, number>;
  macro: number[];
  blocks: BlockWeight[];
};

const SUM_TOLERANCE = 1e-9;

export function criteriaOf(blockId: AllocationBlockId | "fin") {
  if (blockId === "general") return AHP.macros.map((item) => item.id);
  return AHP.macros.find((item) => item.id === blockId)?.children ?? [];
}

/** Reparte 100 en partes lo más iguales posible. El resto queda en el último criterio. */
export function evenSplit(ids: string[]) {
  const points: Record<string, number> = {};
  if (!ids.length) return points;
  const base = Math.floor(100 / ids.length);
  let extra = 100 - base * ids.length;
  for (let index = ids.length - 1; index >= 0; index -= 1) {
    const add = extra > 0 ? 1 : 0;
    if (extra > 0) extra -= 1;
    points[ids[index]] = base + add;
  }
  return points;
}

/** Fija un criterio y reparte el resto entre los demás, en proporción, siempre en enteros que suman 100. */
export function rebalanceShares(current: Record<string, number>, id: string, next: number, ids: string[]) {
  const target = Math.max(0, Math.min(100, Math.round(next)));
  const others = ids.filter((item) => item !== id);
  const remaining = 100 - target;
  const result: Record<string, number> = { [id]: others.length ? target : 100 };
  if (!others.length) return result;
  const pool = others.reduce((sum, item) => sum + (current[item] ?? 0), 0);
  if (pool <= 0) {
    const base = Math.floor(remaining / others.length);
    let extra = remaining - base * others.length;
    for (let index = others.length - 1; index >= 0; index -= 1) {
      const add = extra > 0 ? 1 : 0;
      if (extra > 0) extra -= 1;
      result[others[index]] = base + add;
    }
    return result;
  }
  const rows = others.map((item) => {
    const exact = ((current[item] ?? 0) / pool) * remaining;
    return { item, exact, value: Math.floor(exact) };
  });
  let leftover = remaining - rows.reduce((sum, row) => sum + row.value, 0);
  for (const row of [...rows].sort((left, right) => right.exact - right.value - (left.exact - left.value) || others.indexOf(left.item) - others.indexOf(right.item))) {
    if (leftover <= 0) break;
    row.value += 1;
    leftover -= 1;
  }
  for (const row of rows) result[row.item] = row.value;
  return result;
}

export function blocksNeedingAllocation(tokens: Record<string, string>) {
  return reviewBlockIds(tokens).filter((id): id is AllocationBlockId => (ALLOCATION_BLOCKS as readonly string[]).includes(id));
}

export function readAllocations(value: unknown) {
  const records: Record<string, AllocationRecord> = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return records;
  for (const [key, item] of Object.entries(value)) {
    const parsed = parseRecord(item);
    if (parsed) records[key] = parsed;
  }
  return records;
}

export function activeAllocation(blockId: AllocationBlockId, tokens: Record<string, string>, value: unknown) {
  const record = readAllocations(value)[blockId];
  if (!record?.points || !Object.keys(record.points).length) return null;
  return record.fingerprint === blockFingerprint(blockId, tokens) ? record : null;
}

export function retireStaleAllocations(value: unknown, tokens: Record<string, string>) {
  const records = readAllocations(value);
  let changed = false;
  for (const id of ALLOCATION_BLOCKS) {
    const record = records[id];
    if (!record?.points || record.fingerprint === blockFingerprint(id, tokens)) continue;
    records[id] = {
      ...record,
      points: null,
      history: [...record.history, { points: record.points, fingerprint: record.fingerprint, cr: record.cr, weightsAhp: record.weightsAhp }],
    };
    changed = true;
  }
  return changed ? records : readAllocations(value);
}

export function confirmAllocation(value: unknown, blockId: AllocationBlockId, tokens: Record<string, string>, points: Record<string, number>) {
  const ready = normalizePoints(points, criteriaOf(blockId));
  const cr = blockCr(tokens, blockId);
  const ahp = analyzeAhp(tokens);
  if (!ready || cr == null || !ahp) return null;
  const previous = readAllocations(value)[blockId];
  const history = previous?.points
    ? [...previous.history, { points: previous.points, fingerprint: previous.fingerprint, cr: previous.cr, weightsAhp: previous.weightsAhp }]
    : previous?.history ?? [];
  return {
    ...readAllocations(value),
    [blockId]: {
      points: ready,
      fingerprint: blockFingerprint(blockId, tokens),
      cr,
      weightsAhp: localAhp(ahp, blockId),
      history,
    },
  };
}

export function allocationStatus(entries: Record<string, string>, ids: string[]) {
  const values: Record<string, number> = {};
  let complete = true;
  let assigned = 0;
  for (const id of ids) {
    const raw = entries[id] ?? "";
    if (!/^(0|[1-9]\d*)$/.test(raw)) {
      complete = false;
      continue;
    }
    const points = Number(raw);
    if (points > 100) {
      complete = false;
      continue;
    }
    values[id] = points;
    assigned += points;
  }
  return { complete, assigned, ready: complete && assigned === 100, values: complete ? values : null };
}

export function resolvePriorities(tokens: Record<string, string>, raw: unknown): PriorityResolution | null {
  const ahp = analyzeAhp(tokens);
  if (!ahp) return null;
  const store = readAllocations(raw);
  const needed = blocksNeedingAllocation(tokens);
  const blocks: BlockWeight[] = [];
  for (const id of ["general", "fin", "res", "trans"] as const) {
    const criteria = criteriaOf(id);
    const weightsAhp = localAhp(ahp, id);
    const cr = id === "fin" ? ahp.groups.fin?.cr ?? 0 : blockCr(tokens, id);
    const record = id === "fin" ? null : activeAllocation(id, tokens, store);
    const useDirect = Boolean(record && needed.includes(id as AllocationBlockId));
    const local = useDirect ? criteria.map((criterion) => (record?.points?.[criterion] ?? 0) / 100) : weightsAhp;
    blocks.push({
      id,
      source: useDirect ? "DIRECT_ALLOCATION" : "AHP",
      cr,
      criteria,
      local,
      weightsAhp,
      points: useDirect ? record?.points ?? null : null,
    });
  }
  if (blocks.some((block) => block.local.length !== block.criteria.length || !sumsToOne(block.local))) return null;
  const macro = blocks.find((block) => block.id === "general")?.local ?? [];
  const global: Record<string, number> = {};
  AHP.macros.forEach((group, index) => {
    const local = blocks.find((block) => block.id === group.id)?.local ?? [];
    group.children.forEach((criterion, child) => {
      global[criterion] = (macro[index] ?? 0) * (local[child] ?? 0);
    });
  });
  if (!sumsToOne(Object.values(global)) || !sumsToOne(macro)) return null;
  const hybrid = blocks.some((block) => block.source === "DIRECT_ALLOCATION");
  const clarificationComplete = needed.every((id) => blocks.find((block) => block.id === id)?.source === "DIRECT_ALLOCATION");
  return { ahp, mode: hybrid ? "hibrido" : "ahp", clarificationComplete, global, ahpGlobal: ahp.global, macro, blocks };
}

function listNames(names: string[], lang: Lang) {
  const quoted = names.map((name) => `«${name}»`);
  if (quoted.length < 2) return quoted[0] ?? "";
  const and = lang === "en" ? "and" : lang === "pt" ? "e" : "y";
  return `${quoted.slice(0, -1).join(", ")} ${and} ${quoted[quoted.length - 1]}`;
}

export function allocationCopy(lang: Lang) {
  if (lang === "en") {
    return {
      progress: (current: number, total: number) => `Clarification ${current} of ${total}`,
      reason: (names: string[]) => `To keep the questions ${listNames(names, lang)} consistent, please indicate these percentages.`,
      question: "For your 2027 Procurement agenda, distribute 100 points across these three priorities according to their importance.",
      ties: "You can assign the same number to priorities that matter equally.",
      adjust: "Move each bar. Raising one lowers the others, and the total stays at 100.",
      confirm: "Confirm priorities",
    };
  }
  if (lang === "pt") {
    return {
      progress: (current: number, total: number) => `Esclarecimento ${current} de ${total}`,
      reason: (names: string[]) => `Para assegurar consistência entre as perguntas ${listNames(names, lang)}, indique estas porcentagens.`,
      question: "Para sua agenda de Compras 2027, distribua 100 pontos entre estas três prioridades segundo sua importância.",
      ties: "Você pode atribuir a mesma quantidade a prioridades igualmente importantes.",
      adjust: "Mova cada barra. Ao aumentar uma, as outras descem e a soma continua em 100.",
      confirm: "Confirmar prioridades",
    };
  }
  return {
    progress: (current: number, total: number) => `Aclaración ${current} de ${total}`,
    reason: (names: string[]) => `Para asegurar consistencia entre las preguntas ${listNames(names, lang)}, por favor indica estos porcentajes.`,
    question: "Para tu agenda de Compras 2027, distribuye 100 puntos entre estas tres prioridades según su importancia.",
    ties: "Puedes asignar la misma cantidad a prioridades igualmente importantes.",
    adjust: "Mueva cada barra. Al subir una, las otras bajan y la suma sigue en 100.",
    confirm: "Confirmar prioridades",
  };
}

function localAhp(ahp: AhpAnalysis, blockId: AllocationBlockId | "fin") {
  if (blockId === "general") return [...ahp.macro.weights];
  return [...(ahp.groups[blockId]?.weights ?? [])];
}

function normalizePoints(points: Record<string, number>, ids: string[]) {
  if (!ids.length || ids.some((id) => !Number.isInteger(points[id]) || points[id] < 0 || points[id] > 100)) return null;
  const sum = ids.reduce((total, id) => total + points[id], 0);
  if (sum !== 100) return null;
  return Object.fromEntries(ids.map((id) => [id, points[id]]));
}

function sumsToOne(values: number[]) {
  return Math.abs(values.reduce((sum, value) => sum + value, 0) - 1) <= SUM_TOLERANCE;
}

function parseRecord(value: unknown): AllocationRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const points = record.points == null ? null : parsePoints(record.points);
  const history = Array.isArray(record.history) ? record.history.map(parseSnapshot).filter((item): item is AllocationSnapshot => Boolean(item)) : [];
  if (points === undefined || typeof record.fingerprint !== "string" || typeof record.cr !== "number" || !Array.isArray(record.weightsAhp)) return null;
  return { points, fingerprint: record.fingerprint, cr: record.cr, weightsAhp: record.weightsAhp.filter((item): item is number => typeof item === "number"), history };
}

function parseSnapshot(value: unknown): AllocationSnapshot | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const points = parsePoints(record.points);
  if (!points || typeof record.fingerprint !== "string" || typeof record.cr !== "number" || !Array.isArray(record.weightsAhp)) return null;
  return { points, fingerprint: record.fingerprint, cr: record.cr, weightsAhp: record.weightsAhp.filter((item): item is number => typeof item === "number") };
}

function parsePoints(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const points: Record<string, number> = {};
  for (const [key, item] of Object.entries(value)) {
    if (typeof item !== "number" || !Number.isInteger(item)) return undefined;
    points[key] = item;
  }
  return points;
}
