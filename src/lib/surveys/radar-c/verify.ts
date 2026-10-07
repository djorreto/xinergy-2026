import { analyzeAhp } from "@/lib/surveys/ahp";
import { AHP } from "@/lib/surveys/radar-2027";
import { ahpClass, jaccard, maturityOf, optimizePortfolio, planGap, TARGET_LEVEL } from "@/lib/surveys/radar-b/engine";
import { aiProblems, EXECUTIVE_FIELDS, OPERATIONAL_FIELDS } from "@/lib/surveys/radar-c/instrument";

export function versionCChecks() {
  const problems: string[] = [];
  const expect = (name: string, ok: boolean) => {
    if (!ok) problems.push(name);
  };
  expect("ruta operativa 51", OPERATIONAL_FIELDS.length === 51);
  const blank = { ia_activos: "", ia_activos_n: "", ia_compras_n: "", ia_presupuesto: "", ia_presupuesto_compras: "", ia_escala: "", ia_modo: "" };
  expect("ia vacía no exige nada en la ruta opcional", Object.keys(aiProblems(blank, "optional")).length === 0);
  expect("ia sí sin cantidad no pasa", aiProblems({ ...blank, ia_activos: "si", ia_presupuesto: "no" }, "required").ia_activos_n === "count");
  expect("ia de compras no supera el total", aiProblems({ ...blank, ia_activos: "si", ia_activos_n: "2", ia_compras_n: "4", ia_escala: "si", ia_modo: "solos", ia_presupuesto: "si", ia_presupuesto_compras: "40" }, "required").ia_compras_n === "over");
  expect("ia completa no marca problemas", Object.keys(aiProblems({ ...blank, ia_activos: "no", ia_presupuesto: "si", ia_presupuesto_compras: "0" }, "required")).length === 0);
  expect("ruta ejecutiva 20", EXECUTIVE_FIELDS.length === 20);
  expect("nivel 1 es 0", maturityOf(1) === 0);
  expect("nivel 4 es 0,75", maturityOf(4) === TARGET_LEVEL);
  expect("nivel 5 es 1", maturityOf(5) === 1);
  expect("brecha negativa es cero", planGap(1) === 0);
  expect("cr 0,15 exploratorio", ahpClass(0.15) === "exploratorio");
  expect("cr 0,25 excluido", ahpClass(0.25) === "excluido");
  expect("cr 0,10 principal", ahpClass(0.1) === "principal");

  const weightsA = [0.8, 0.2, 0, 0, 0, 0, 0, 0];
  const weightsB = [0.2, 0.8, 0, 0, 0, 0, 0, 0];
  const gapsA = [0.5, 0, 0, 0, 0, 0, 0, 0];
  const gapsB = [0, 0.5, 0, 0, 0, 0, 0, 0];
  const meanProduct = [0, 1].map((index) => (weightsA[index] * gapsA[index] + weightsB[index] * gapsB[index]) / 2);
  const productOfMeans = [0, 1].map((index) => ((weightsA[index] + weightsB[index]) / 2) * ((gapsA[index] + gapsB[index]) / 2));
  expect("media del producto distinta del producto de medias", meanProduct.some((value, index) => Math.abs(value - productOfMeans[index]) > 1e-9));

  const closed = optimizePortfolio([1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], Array.from({ length: 11 }, () => true), 1, { budget: 6, effort: 7, maxCount: 2 });
  expect("G0 cero sin cierre", closed.closure == null && closed.ids.length === 0);
  expect("agendas iguales", jaccard(["i1"], ["i1"]) === 1);
  expect("ambas vacias no aplica", jaccard([], []) == null);
  expect("una vacia es cero", jaccard([], ["i1"]) === 0);

  const equal = analyzeAhp(Object.fromEntries(AHP.pairs.map((pair) => [pair.id, "1"])));
  const sum = equal ? Object.values(equal.global).reduce((total, value) => total + value, 0) : 0;
  expect("juicios iguales suman uno", Boolean(equal) && Math.abs(sum - 1) < 1e-9 && equal?.maxCr === 0);

  const share = 8 / 15;
  expect("8 de 15 es 53,3% de personas", Math.abs(share * 100 - 53.333333) < 0.01);

  return { ok: problems.length === 0, problems };
}
