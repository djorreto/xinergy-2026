import assert from "node:assert/strict";
import test from "node:test";
import { AHP } from "@/lib/surveys/radar-2027";
import { optimizePortfolio } from "@/lib/surveys/radar-b/engine";
import { blockCr } from "@/lib/surveys/radar-c/ahp-blocks";
import {
  activeAllocation,
  allocationStatus,
  blocksNeedingAllocation,
  confirmAllocation,
  criteriaOf,
  resolvePriorities,
  retireStaleAllocations,
} from "@/lib/surveys/radar-c/ahp-allocation";
import { buildBenchmarkC, buildPersonC, type RadarCInput } from "@/lib/surveys/radar-c/report";

const rest = Object.fromEntries(AHP.pairs.map((pair) => [pair.id, "1"]));
const cycle = { ...rest, res_riesgo_control: "3", res_control_esg: "3", res_riesgo_esg: "1/3" };
const intensity = { ...rest, res_riesgo_control: "3", res_riesgo_esg: "3", res_control_esg: "5" };
const acceptable = { ...rest, res_riesgo_control: "3", res_control_esg: "3", res_riesgo_esg: "9" };

test("un bloque con CR aceptable no pide aclaración y el de dos criterios tampoco", () => {
  assert.deepEqual(blocksNeedingAllocation(acceptable), []);
  assert.equal(blocksNeedingAllocation(acceptable).includes("fin" as never), false);
  assert.equal((blockCr(acceptable, "res") ?? 1) <= 0.1, true);
});

test("un ciclo y un desajuste de intensidades piden el mismo bloque, sin elegir un par", () => {
  assert.deepEqual(blocksNeedingAllocation(cycle), ["res"]);
  assert.deepEqual(blocksNeedingAllocation(intensity), ["res"]);
  assert.deepEqual(criteriaOf("res"), ["riesgo", "control", "esg"]);
});

test("solo se aceptan enteros completos que suman 100, incluidos ceros y empates", () => {
  const ids = criteriaOf("res");
  assert.equal(allocationStatus({ riesgo: "50", control: "50", esg: "0" }, ids).ready, true);
  assert.equal(allocationStatus({ riesgo: "34", control: "33", esg: "33" }, ids).ready, true);
  assert.equal(allocationStatus({ riesgo: "", control: "50", esg: "50" }, ids).ready, false);
  assert.equal(allocationStatus({ riesgo: "40", control: "40", esg: "10" }, ids).ready, false);
  assert.equal(allocationStatus({ riesgo: "101", control: "0", esg: "0" }, ids).ready, false);
  assert.equal(allocationStatus({ riesgo: "1.5", control: "50", esg: "48.5" }, ids).ready, false);
  assert.equal(allocationStatus({ riesgo: "0", control: "0", esg: "100" }, ids).assigned, 100);
});

test("la aclaración reemplaza solo ese bloque y una de macro actualiza todos los pesos globales", () => {
  const saved = confirmAllocation(null, "res", intensity, { riesgo: 50, control: 50, esg: 0 });
  const resolved = resolvePriorities(intensity, saved);
  assert.equal(resolved?.mode, "hibrido");
  assert.equal(resolved?.clarificationComplete, true);
  assert.equal(resolved?.blocks.find((block) => block.id === "res")?.source, "DIRECT_ALLOCATION");
  assert.equal(resolved?.blocks.find((block) => block.id === "trans")?.source, "AHP");
  assert.equal(resolved?.blocks.find((block) => block.id === "fin")?.source, "AHP");
  assert.ok(Math.abs((resolved?.global.riesgo ?? 0) - (1 / 3) * 0.5) < 1e-9);
  assert.equal(resolved?.global.esg, 0);
  assert.ok(Math.abs(Object.values(resolved?.global ?? {}).reduce((sum, value) => sum + value, 0) - 1) < 1e-9);
  assert.equal(resolved?.ahp.maxCr, blockCr(intensity, "res"));

  const macroTokens = { ...rest, macro_fin_res: "3", macro_fin_trans: "3", macro_res_trans: "9" };
  assert.ok((blockCr(macroTokens, "general") ?? 0) > 0.1);
  const macroSaved = confirmAllocation(null, "general", macroTokens, { fin: 80, res: 20, trans: 0 });
  const macro = resolvePriorities(macroTokens, macroSaved);
  assert.deepEqual(macro?.macro.map((value) => Number(value.toFixed(6))), [0.8, 0.2, 0]);
  assert.ok(Math.abs((macro?.global.costos ?? 0) - 0.4) < 1e-9);
  assert.equal(macro?.global.digital, 0);
  assert.ok(Math.abs(Object.values(macro?.global ?? {}).reduce((sum, value) => sum + value, 0) - 1) < 1e-9);
});

test("cambiar una comparación invalida la aclaración y conserva el registro anterior", () => {
  const saved = confirmAllocation(null, "res", intensity, { riesgo: 70, control: 20, esg: 10 });
  assert.ok(activeAllocation("res", intensity, saved));
  const retired = retireStaleAllocations(saved, { ...intensity, res_control_esg: "1" });
  assert.equal(activeAllocation("res", { ...intensity, res_control_esg: "1" }, retired), null);
  assert.equal(retired.res.history.length, 1);
  assert.equal(retired.res.history[0]?.points.esg, 10);
  assert.equal(retired.res.cr > 0.1, true);
});

test("el portafolio de un perfil excluido usa los pesos finales cuando la aclaración está completa", () => {
  const saved = confirmAllocation(null, "res", intensity, { riesgo: 100, control: 0, esg: 0 });
  const withAllocation = personFrom(intensity, saved);
  const without = personFrom(intensity, null);
  assert.equal(withAllocation.priorityMode, "hibrido");
  assert.equal(without.priorityMode, "ahp");
  assert.equal(without.ahpClass, "excluido");
  assert.equal(without.scenarios.every((item) => item.closure == null), true);
  assert.equal(withAllocation.scenarios.some((item) => item.reason === ""), true);
  assert.notDeepEqual(withAllocation.weights, without.weights);
  const gaps = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
  const available = Array.from({ length: 11 }, () => true);
  const fromFinal = optimizePortfolio(withAllocation.weights ?? [], gaps, available, 1, { budget: 8, effort: 8, maxCount: 4 });
  const fromAhp = optimizePortfolio(without.ahpWeights ?? [], gaps, available, 1, { budget: 8, effort: 8, maxCount: 4 });
  assert.ok(fromFinal.ids.length >= 0);
  assert.notDeepEqual(fromFinal.gap, fromAhp.gap);
});

test("la base principal queda en AHP y la ampliada suma los híbridos completos", () => {
  const pure = personFrom(acceptable, null);
  const hybrid = personFrom(intensity, confirmAllocation(null, "res", intensity, { riesgo: 40, control: 40, esg: 20 }));
  pure.included = true;
  hybrid.included = true;
  pure.rol = "cpo";
  hybrid.rol = "cpo";
  pure.empresa = "Una";
  hybrid.empresa = "Otra";
  const benchmark = buildBenchmarkC([pure, hybrid]);
  assert.deepEqual(benchmark.priorityIds, [pure.id]);
  assert.equal(benchmark.expandedIds.includes(pure.id) && benchmark.expandedIds.includes(hybrid.id), true);
  assert.ok(benchmark.aip);
  assert.ok(benchmark.expandedAip);
  assert.notDeepEqual(benchmark.aip, benchmark.expandedAip);
});

function personFrom(tokens: Record<string, string>, allocation: unknown) {
  const row: RadarCInput = {
    id: tokens.res_riesgo_esg === "9" ? "puro" : "hibrido",
    createdAt: "2026-10-04",
    email: "a@demo.xinergy.test",
    empresa: "Demo",
    pais: "CL",
    rol: "cpo",
    rubro: "mineria",
    evaluacion: "Incluido en análisis",
    company: { alcance: "pais", paises: ["CL"] },
    answers: {
      ruta: "operativa",
      prioridades_ahp: tokens,
      ahp_aclaracion: allocation,
      capacidades: Object.fromEntries(["costos", "caja", "riesgo", "control", "esg", "digital", "innovacion", "talento"].map((id) => [id, "3"])),
      agenda: Object.fromEntries(["i1", "i2", "i3", "i4", "i5", "i6", "i7", "i8", "i9", "i10", "i11"].map((id) => [id, "NOT_CONSIDERED"])),
      r1: "READY",
      e1: "5-8",
      e2: "50-75",
      e3: "<10",
      e4: "1-3",
      e5: "piloto",
    },
  };
  return buildPersonC(row);
}
