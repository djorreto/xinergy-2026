import assert from "node:assert/strict";
import test from "node:test";
import { ahpClass } from "@/lib/surveys/radar-b/engine";
import { AHP } from "@/lib/surveys/radar-2027";
import { blockCr, choiceFromToken, reviewBlockIds, tokenFromChoice, triadExplanation } from "@/lib/surveys/radar-c/ahp-blocks";

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
  const text = triadExplanation("res", tokens, "es");
  assert.match(text, /gestionar riesgo y continuidad es moderadamente más importante que cumplimiento y control/i);
  assert.match(text, /cumplimiento y control es fuertemente más importante que sostenibilidad y esg/i);
  assert.match(text, /¿Estas intensidades reflejan/);
  assert.doesNotMatch(text, /círculo/);
});

test("los umbrales de consistencia de la versión C no se mueven", () => {
  assert.equal(ahpClass(0.1), "principal");
  assert.equal(ahpClass(0.1 + 1e-9), "exploratorio");
  assert.equal(ahpClass(0.2), "exploratorio");
  assert.equal(ahpClass(0.2 + 1e-9), "excluido");
});
