import { AHP } from "@/lib/surveys/radar-2027";

const TOKEN_VALUE: Record<string, number> = {
  "9": 9,
  "7": 7,
  "5": 5,
  "3": 3,
  "1": 1,
  "1/3": 1 / 3,
  "1/5": 1 / 5,
  "1/7": 1 / 7,
  "1/9": 1 / 9,
};

export function ahpTokenValue(token: string) {
  return TOKEN_VALUE[token] ?? null;
}

export type AhpGroup = {
  ids: string[];
  matrix: number[][];
  weights: number[];
  cr: number;
};

export type AhpAnalysis = {
  macro: AhpGroup;
  groups: Record<string, AhpGroup & { macroWeight: number }>;
  global: Record<string, number>;
  maxCr: number;
};

export function formatPercent(value: number) {
  return `${(value * 100).toFixed(1).replace(".", ",")}%`;
}

export function formatRatio(value: number) {
  if (Math.abs(value - 1) < 1e-9) return "1";
  if (value >= 1) return value.toFixed(value % 1 ? 2 : 0);
  return value.toFixed(2);
}

function matrixFor(ids: string[], group: string, values: Record<string, number>) {
  const index = Object.fromEntries(ids.map((id, position) => [id, position]));
  const matrix: number[][] = ids.map((_, row) => ids.map((__, column) => (row === column ? 1 : 0)));
  for (const pair of AHP.pairs.filter((item) => item.group === group)) {
    const value = values[pair.id];
    const left = index[pair.a];
    const right = index[pair.b];
    if (!value || left == null || right == null) return null;
    matrix[left][right] = value;
    matrix[right][left] = 1 / value;
  }
  return matrix;
}

function eigen(matrix: number[][]) {
  const size = matrix.length;
  let weights = Array(size).fill(1 / size);
  for (let step = 0; step < 100; step += 1) {
    const next = matrix.map((row) => row.reduce((sum, cell, column) => sum + cell * weights[column], 0));
    const total = next.reduce((sum, value) => sum + value, 0);
    const normalized = next.map((value) => value / total);
    if (Math.max(...normalized.map((value, index) => Math.abs(value - weights[index]))) < 1e-12) {
      weights = normalized;
      break;
    }
    weights = normalized;
  }
  const applied = matrix.map((row) => row.reduce((sum, cell, column) => sum + cell * weights[column], 0));
  const lambda = applied.reduce((sum, value, index) => sum + value / weights[index], 0) / size;
  const consistencyIndex = size <= 2 ? 0 : (lambda - size) / (size - 1);
  const randomIndex: Record<number, number> = { 1: 0, 2: 0, 3: 0.58, 4: 0.9, 5: 1.12, 6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49 };
  const ratio = randomIndex[size] ? consistencyIndex / randomIndex[size] : 0;
  return { weights, cr: ratio };
}

export function analyzeAhp(tokens: Record<string, string> | null | undefined): AhpAnalysis | null {
  if (!tokens) return null;
  const values: Record<string, number> = {};
  for (const pair of AHP.pairs) {
    const value = ahpTokenValue(String(tokens[pair.id] ?? ""));
    if (!value) return null;
    values[pair.id] = value;
  }
  return analyzeValues(values);
}

export function aggregateAhp(tokenSets: Record<string, string>[]) {
  if (!tokenSets.length) return null;
  const values: Record<string, number> = {};
  for (const pair of AHP.pairs) {
    const numbers = tokenSets
      .map((set) => ahpTokenValue(String(set[pair.id] ?? "")))
      .filter((value): value is number => value != null && value > 0);
    if (!numbers.length) return null;
    const mean = Math.exp(numbers.reduce((sum, value) => sum + Math.log(value), 0) / numbers.length);
    values[pair.id] = mean;
  }
  return analyzeValues(values);
}

function analyzeValues(values: Record<string, number>): AhpAnalysis | null {
  const macroIds = AHP.macros.map((item) => item.id);
  const macroMatrix = matrixFor(macroIds, "macro", values);
  if (!macroMatrix) return null;
  const macroEigen = eigen(macroMatrix);
  const groups: AhpAnalysis["groups"] = {};
  const global: Record<string, number> = {};
  AHP.macros.forEach((group, groupIndex) => {
    const matrix = matrixFor(group.children, group.id, values);
    if (!matrix) return;
    const result = eigen(matrix);
    const macroWeight = macroEigen.weights[groupIndex];
    groups[group.id] = { ids: group.children, matrix, weights: result.weights, cr: result.cr, macroWeight };
    group.children.forEach((id, index) => {
      global[id] = macroWeight * result.weights[index];
    });
  });
  if (Object.keys(groups).length !== AHP.macros.length) return null;
  const ratios = [macroEigen.cr, ...AHP.macros.filter((group) => group.children.length > 2).map((group) => groups[group.id].cr)];
  return {
    macro: { ids: macroIds, matrix: macroMatrix, weights: macroEigen.weights, cr: macroEigen.cr },
    groups,
    global,
    maxCr: Math.max(...ratios),
  };
}

export function ahpLabel(id: string, lang: "es" | "pt" = "es") {
  const macro = AHP.macros.find((item) => item.id === id);
  if (macro) return macro.label[lang];
  return AHP.criteria[id]?.[lang] ?? id;
}
