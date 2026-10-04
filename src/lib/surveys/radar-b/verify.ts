import { analyzeAhp } from "@/lib/surveys/ahp";
import { AHP } from "@/lib/surveys/radar-2027";
import { DIMENSIONS, SCENARIOS, dot, maturityOf, optimizePortfolio, planGap, type InitiativeId } from "@/lib/surveys/radar-b/engine";

const DEMO_WEIGHTS = [0.26, 0.12, 0.19, 0.1, 0.06, 0.13, 0.05, 0.09];
const DEMO_LEVELS = [3, 2, 2, 3, 2, 2, 2, 3];
const ALL_AVAILABLE = Array.from({ length: 11 }, () => true);

function gapsFrom(levels: number[]) {
  return levels.map((level) => planGap(maturityOf(level)));
}

function same(ids: InitiativeId[], expected: InitiativeId[]) {
  return ids.join(",") === expected.join(",");
}

export function demoChecks() {
  const gaps = gapsFrom(DEMO_LEVELS);
  const base = dot(DEMO_WEIGHTS, gaps);
  const available = ALL_AVAILABLE;
  const results = SCENARIOS.map((scenario) =>
    optimizePortfolio(DEMO_WEIGHTS, gaps, available, 0, { budget: scenario.budget, effort: scenario.effort, maxCount: scenario.maxCount }),
  );
  const profileA = optimizePortfolio(DEMO_WEIGHTS, gapsFrom([1, 4, 4, 4, 4, 4, 4, 4]), available, 0, {
    budget: 6,
    effort: 7,
    maxCount: 2,
  });
  const profileB = optimizePortfolio(DEMO_WEIGHTS, gapsFrom([4, 1, 4, 4, 4, 4, 4, 4]), available, 0, {
    budget: 6,
    effort: 7,
    maxCount: 2,
  });
  const equal = analyzeAhp(Object.fromEntries(AHP.pairs.map((pair) => [pair.id, "1"])));
  const leaves = equal ? DIMENSIONS.map((id) => equal.global[id]) : [];
  const monotonic = results[2].gap <= results[1].gap + 1e-9 && results[1].gap <= results[0].gap + 1e-9;

  const checks = [
    ["G0", Math.abs(base - 0.3875) < 1e-12],
    ["lean", same(results[0].ids, ["i3", "i5"]) && results[0].cost === 5 && results[0].effort === 7 && Math.abs(results[0].gap - 0.283575) < 5e-5],
    ["balanced", same(results[1].ids, ["i3", "i5", "i7", "i11"]) && results[1].cost === 11 && results[1].effort === 13 && Math.abs(results[1].gap - 0.21606) < 5e-5],
    ["transformational", same(results[2].ids, ["i1", "i3", "i5", "i6", "i7", "i11"]) && results[2].cost === 16 && results[2].effort === 20 && Math.abs(results[2].gap - 0.162066) < 5e-5],
    ["profile-a", same(profileA.ids, ["i1", "i7"]) && profileA.cost === 5 && profileA.effort === 5],
    ["profile-b", same(profileB.ids, ["i2", "i11"]) && profileB.cost === 6 && profileB.effort === 7],
    ["equal-weights", Boolean(equal) && Math.abs((leaves[0] ?? 0) - 1 / 6) < 1e-9 && Math.abs((leaves[2] ?? 0) - 1 / 9) < 1e-9 && (equal?.maxCr ?? 1) === 0],
    ["monotonic", monotonic],
    ["empty-feasible", results[0].count >= 0],
  ] as const;

  return {
    ok: checks.every(([, pass]) => pass),
    checks,
    gaps: results.map((item) => item.gap),
    ids: results.map((item) => item.ids),
  };
}
