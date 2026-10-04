/** Motor de la opción B. La matriz de impacto es de demostración, no una calibración. */

export const SURVEY_SLUG_B = "radar-compras-2027-b";
export const SURVEY_VERSION_B = "radar-2027-b-v1";
export const TARGET_LEVEL = 0.75;
export const IMPACT_MATRIX_VERSION = "demo-2026-10-04";

export const DIMENSIONS = ["costos", "caja", "riesgo", "control", "esg", "digital", "innovacion", "talento"] as const;
export const INITIATIVES = ["i1", "i2", "i3", "i4", "i5", "i6", "i7", "i8", "i9", "i10", "i11"] as const;

export type DimensionId = (typeof DIMENSIONS)[number];
export type InitiativeId = (typeof INITIATIVES)[number];
export type AhpClass = "principal" | "exploratorio" | "excluido";

/** Fracción de brecha que cada iniciativa cerraría sola. Filas I1–I11, columnas C1–C8. */
export const IMPACT: readonly (readonly number[])[] = [
  [0.3, 0.1, 0.1, 0.1, 0.05, 0.05, 0.1, 0.1],
  [0.05, 0.3, 0.05, 0.1, 0, 0.05, 0, 0.05],
  [0.05, 0.05, 0.3, 0.2, 0.1, 0.1, 0.05, 0.1],
  [0.1, 0.05, 0.1, 0.3, 0.1, 0.3, 0.05, 0.1],
  [0.2, 0.05, 0.1, 0.2, 0.05, 0.3, 0.1, 0.2],
  [0.2, 0.05, 0.1, 0.1, 0.05, 0.3, 0.2, 0.2],
  [0.2, 0.1, 0.05, 0.2, 0.05, 0.1, 0.05, 0.1],
  [0.1, 0.05, 0.1, 0.1, 0.05, 0.1, 0.2, 0.3],
  [0.05, 0.05, 0.1, 0.05, 0.1, 0.05, 0.3, 0.1],
  [0.05, 0, 0.1, 0.2, 0.3, 0.05, 0.05, 0.1],
  [0.1, 0.3, 0.2, 0.05, 0.05, 0.1, 0.05, 0.1],
];

export const COST = [2, 3, 2, 5, 3, 3, 3, 3, 2, 2, 3];
export const EFFORT = [3, 3, 3, 5, 4, 4, 2, 4, 3, 3, 4];

export const SCENARIOS = [
  { id: "lean", budget: 6, effort: 7, maxCount: 2 },
  { id: "balanced", budget: 11, effort: 13, maxCount: 4 },
  { id: "transformational", budget: 18, effort: 20, maxCount: 6 },
] as const;

export type ScenarioId = (typeof SCENARIOS)[number]["id"];

const I5 = 4;
const I6 = 5;

export function ahpClass(maxCr: number): AhpClass {
  if (maxCr <= 0.1) return "principal";
  if (maxCr <= 0.2) return "exploratorio";
  return "excluido";
}

export function maturityOf(level: number) {
  return (level - 1) / 4;
}

export function planGap(maturity: number, target = TARGET_LEVEL) {
  return Math.max(0, target - maturity);
}

export function dot(left: readonly number[], right: readonly number[]) {
  return left.reduce((sum, value, index) => sum + value * right[index], 0);
}

export type Limits = { budget: number; effort: number; maxCount: number };

export type Portfolio = {
  ids: InitiativeId[];
  mask: number;
  gap: number;
  improvement: number;
  closure: number | null;
  cost: number;
  effort: number;
  count: number;
  ties: number;
  overlapClosure: number | null;
  disjointClosure: number | null;
};

export function optimizePortfolio(weights: readonly number[], gaps: readonly number[], available: readonly boolean[], dataReady: 0 | 1, limits: Limits): Portfolio {
  const base = dot(weights, gaps);
  let bestGap = Number.POSITIVE_INFINITY;
  const feasible: { mask: number; gap: number; cost: number; effort: number; count: number }[] = [];

  for (let mask = 0; mask < 2048; mask += 1) {
    let cost = 0;
    let effort = 0;
    let count = 0;
    let allowed = true;
    const selected = Array.from({ length: 11 }, (_, index) => ((mask >> index) & 1) === 1);
    for (let index = 0; index < 11; index += 1) {
      if (!selected[index]) continue;
      if (!available[index]) {
        allowed = false;
        break;
      }
      cost += COST[index];
      effort += EFFORT[index];
      count += 1;
    }
    if (!allowed || cost > limits.budget || effort > limits.effort || count > limits.maxCount) continue;
    if (dataReady === 0 && selected[I6] && !selected[I5]) continue;

    const remaining = gaps.map((gap, dimension) => gap * selected.reduce((product, on, index) => product * (on ? 1 - IMPACT[index][dimension] : 1), 1));
    const gap = dot(weights, remaining);
    feasible.push({ mask, gap, cost, effort, count });
    if (gap < bestGap) bestGap = gap;
  }

  const ties = feasible.filter((item) => item.gap <= bestGap + 1e-9);
  ties.sort((a, b) => {
    const resource = a.cost / limits.budget + a.effort / limits.effort - (b.cost / limits.budget + b.effort / limits.effort);
    if (Math.abs(resource) > 1e-12) return resource;
    if (a.count !== b.count) return a.count - b.count;
    return a.mask - b.mask;
  });
  const winner = ties[0];
  const selected = Array.from({ length: 11 }, (_, index) => ((winner.mask >> index) & 1) === 1);
  const improvement = base - winner.gap;
  return {
    ids: INITIATIVES.filter((_, index) => selected[index]),
    mask: winner.mask,
    gap: winner.gap,
    improvement,
    closure: base > 0 ? improvement / base : null,
    cost: winner.cost,
    effort: winner.effort,
    count: winner.count,
    ties: ties.length,
    overlapClosure: closureOf(weights, gaps, overlapRemaining(gaps, selected), base),
    disjointClosure: closureOf(weights, gaps, disjointRemaining(gaps, selected), base),
  };
}

function closureOf(weights: readonly number[], gaps: readonly number[], remaining: number[], base: number) {
  if (base <= 0) return null;
  return (base - dot(weights, remaining)) / base;
}

function overlapRemaining(gaps: readonly number[], selected: boolean[]) {
  return gaps.map((gap, dimension) => {
    const best = selected.reduce((max, on, index) => (on ? Math.max(max, IMPACT[index][dimension]) : max), 0);
    return gap * (1 - best);
  });
}

function disjointRemaining(gaps: readonly number[], selected: boolean[]) {
  return gaps.map((gap, dimension) => {
    const total = selected.reduce((sum, on, index) => sum + (on ? IMPACT[index][dimension] : 0), 0);
    return gap * Math.max(0, 1 - total);
  });
}

export function improvementOf(weights: readonly number[], gaps: readonly number[], ids: readonly InitiativeId[], dataReady: 0 | 1) {
  const selected = INITIATIVES.map((id) => ids.includes(id));
  if (dataReady === 0 && selected[I6] && !selected[I5]) return null;
  const remaining = gaps.map((gap, dimension) => gap * selected.reduce((product, on, index) => product * (on ? 1 - IMPACT[index][dimension] : 1), 1));
  const base = dot(weights, gaps);
  const gap = dot(weights, remaining);
  return { gap, improvement: base - gap, cost: selected.reduce((sum, on, index) => sum + (on ? COST[index] : 0), 0), effort: selected.reduce((sum, on, index) => sum + (on ? EFFORT[index] : 0), 0), count: selected.filter(Boolean).length };
}

export function jaccard(declared: readonly string[], recommended: readonly string[]) {
  if (!declared.length && !recommended.length) return null;
  const left = new Set(declared);
  const right = new Set(recommended);
  let shared = 0;
  for (const id of left) if (right.has(id)) shared += 1;
  const union = new Set([...left, ...right]).size;
  return union ? shared / union : null;
}

export function roleDistance(left: readonly number[], right: readonly number[]) {
  return left.reduce((sum, value, index) => sum + Math.abs(value - right[index]), 0) / 2;
}

export function median(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function quartile(values: number[], fraction: number) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const position = (sorted.length - 1) * fraction;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  return sorted[lower] * (upper - position) + sorted[upper] * (position - lower);
}
