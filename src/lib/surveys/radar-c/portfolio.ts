import {
  INITIATIVES,
  dot,
  type InitiativeId,
  type Limits,
  type Portfolio,
} from "@/lib/surveys/radar-b/engine";
import { COST_C, EFFORT_C, IMPACT_C } from "@/lib/surveys/radar-c/content";

const I5 = 4;
const I6 = 5;

export function optimizePortfolioC(
  weights: readonly number[],
  gaps: readonly number[],
  available: readonly boolean[],
  dataReady: 0 | 1,
  limits: Limits,
  impact: readonly (readonly number[])[] = IMPACT_C,
): Portfolio {
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
      cost += COST_C[index];
      effort += EFFORT_C[index];
      count += 1;
    }
    if (!allowed || cost > limits.budget || effort > limits.effort || count > limits.maxCount) continue;
    if (dataReady === 0 && selected[I6] && !selected[I5]) continue;

    const remaining = gaps.map((gap, dimension) => gap * selected.reduce((product, on, index) => product * (on ? 1 - impact[index][dimension] : 1), 1));
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
  if (!winner) {
    return {
      ids: [],
      mask: 0,
      gap: base,
      improvement: 0,
      closure: null,
      cost: 0,
      effort: 0,
      count: 0,
      ties: 0,
      overlapClosure: null,
      disjointClosure: null,
    };
  }
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
    overlapClosure: closureOf(weights, gaps, overlapRemaining(gaps, selected, impact), base),
    disjointClosure: closureOf(weights, gaps, disjointRemaining(gaps, selected, impact), base),
  };
}

function closureOf(weights: readonly number[], gaps: readonly number[], remaining: number[], base: number) {
  if (base <= 0) return null;
  return (base - dot(weights, remaining)) / base;
}

function overlapRemaining(gaps: readonly number[], selected: boolean[], impact: readonly (readonly number[])[]) {
  return gaps.map((gap, dimension) => {
    const best = selected.reduce((max, on, index) => (on ? Math.max(max, impact[index][dimension]) : max), 0);
    return gap * (1 - best);
  });
}

function disjointRemaining(gaps: readonly number[], selected: boolean[], impact: readonly (readonly number[])[]) {
  return gaps.map((gap, dimension) => {
    const total = selected.reduce((sum, on, index) => sum + (on ? impact[index][dimension] : 0), 0);
    return gap * Math.max(0, 1 - total);
  });
}

export function improvementOfC(weights: readonly number[], gaps: readonly number[], ids: readonly InitiativeId[], dataReady: 0 | 1) {
  const selected = INITIATIVES.map((id) => ids.includes(id));
  if (dataReady === 0 && selected[I6] && !selected[I5]) return null;
  const remaining = gaps.map((gap, dimension) => gap * selected.reduce((product, on, index) => product * (on ? 1 - IMPACT_C[index][dimension] : 1), 1));
  const base = dot(weights, gaps);
  const gap = dot(weights, remaining);
  return {
    gap,
    improvement: base - gap,
    cost: selected.reduce((sum, on, index) => sum + (on ? COST_C[index] : 0), 0),
    effort: selected.reduce((sum, on, index) => sum + (on ? EFFORT_C[index] : 0), 0),
    count: selected.filter(Boolean).length,
  };
}