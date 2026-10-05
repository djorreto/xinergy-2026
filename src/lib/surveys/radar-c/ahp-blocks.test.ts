import assert from "node:assert/strict";
import test from "node:test";
import { ahpClass } from "@/lib/surveys/radar-b/engine";
import { AHP } from "@/lib/surveys/radar-2027";
import { blockCr, choiceFromToken, contradictionOf, reviewBlockIds, sideDetail, tokenFromChoice } from "@/lib/surveys/radar-c/ahp-blocks";

const rest = Object.fromEntries(AHP.pairs.map((pair) => [pair.id, "1"]));

test("la dirección y la intensidad producen el juicio Saaty", () => {
  assert.equal(tokenFromChoice("a", 3), "3");
  assert.equal(tokenFromChoice("b", 3), "1/3");
  assert.equal(tokenFromChoice("equal", null), "1");
  assert.equal(tokenFromChoice("a", null), null);
  assert.equal(tokenFromChoice("b", 9), "1/9");
  assert.deepEqual(choiceFromToken(undefined), { side: null, intensity: null });
  assert.deepEqual(choiceFromToken("1/5"), { side: "b", intensity: 5 });
});

test("una tríada consistente no pide revisión y el bloque de dos criterios tampoco", () => {
  const tokens = {
    ...rest,
    res_riesgo_control: "3",
    res_control_esg: "3",
    res_riesgo_esg: "9",
    fin_costos_caja: "9",
  };
  assert.ok((blockCr(tokens, "res") ?? 1) < 0.01);
  assert.equal(blockCr(tokens, "fin"), 0);
  assert.deepEqual(reviewBlockIds(tokens), []);
});

test("riesgo moderado sobre cumplimiento y ESG, con cumplimiento fuerte sobre ESG, marca solo ese bloque", () => {
  const tokens = {
    ...rest,
    res_riesgo_control: "3",
    res_riesgo_esg: "3",
    res_control_esg: "5",
  };
  assert.deepEqual(reviewBlockIds(tokens), ["res"]);
  const cr = blockCr(tokens, "res") ?? 0;
  assert.ok(cr > 0.2, `CR real ${cr}`);
  assert.equal(ahpClass(cr), "excluido");
  const clash = contradictionOf("res", tokens, "es");
  assert.equal(clash?.kind, "gap");
  assert.match(clash?.steps[0]?.sentence ?? "", /gestionar riesgo y continuidad es moderadamente más importante que cumplimiento y control/i);
  assert.match(clash?.steps[1]?.sentence ?? "", /cumplimiento y control es fuertemente más importante que sostenibilidad y esg/i);
  assert.match(clash?.follows?.sentence ?? "", /tendría que ser extremadamente más importante que sostenibilidad y esg/i);
  assert.match(clash?.marked?.sentence ?? "", /marcaste que gestionar riesgo y continuidad es moderadamente más importante que sostenibilidad y esg/i);
  assert.equal(clash?.follows?.fromWins, true);
  assert.equal(clash?.follows?.intensity, 9);
  assert.equal(clash?.marked?.intensity, 3);
});

test("un círculo se muestra como vuelta a la primera, no como diferencia de intensidad", () => {
  const tokens = {
    ...rest,
    res_riesgo_control: "3",
    res_control_esg: "3",
    res_riesgo_esg: "1/3",
  };
  const clash = contradictionOf("res", tokens, "es");
  assert.equal(clash?.kind, "cycle");
  assert.match(clash?.closing ?? "", /vuelve a la primera/);
  assert.equal(clash?.follows, null);
});

test("una tríada que cierra no se presenta como contradicción", () => {
  const tokens = {
    ...rest,
    res_riesgo_control: "3",
    res_control_esg: "3",
    res_riesgo_esg: "9",
  };
  assert.equal(contradictionOf("res", tokens, "es"), null);
});

test("un grupo muestra su nombre y lo que contiene", () => {
  assert.deepEqual(sideDetail("fin", "es"), {
    name: "Eficiencia y valor financiero",
    items: ["Reducir costos", "Liberar caja y capital de trabajo"],
  });
  assert.deepEqual(sideDetail("costos", "es").items, []);
});

test("los umbrales de consistencia de la versión C no se mueven", () => {
  assert.equal(ahpClass(0.1), "principal");
  assert.equal(ahpClass(0.1 + 1e-9), "exploratorio");
  assert.equal(ahpClass(0.2), "exploratorio");
  assert.equal(ahpClass(0.2 + 1e-9), "excluido");
});
