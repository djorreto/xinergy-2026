import assert from "node:assert/strict";
import test from "node:test";
import { AHP } from "@/lib/surveys/radar-2027";
import { AHP_BLOCKS, blockCr, reviewBlockIds } from "@/lib/surveys/radar-c/ahp-blocks";
import {
  AHP_SCALE_TOKENS,
  blockFingerprint,
  corroborationOf,
  pendingCorroboration,
  triadCr,
  type TemplateId,
} from "@/lib/surveys/radar-c/ahp-corroboration";

const rest: Record<string, string> = Object.fromEntries(AHP.pairs.map((pair) => [pair.id, "1"]));
const RES = ["res_riesgo_control", "res_riesgo_esg", "res_control_esg"] as const;

test("el CR de la tríada coincide con el cálculo del proyecto", () => {
  const tokens = { ...rest, res_riesgo_control: "3", res_riesgo_esg: "3", res_control_esg: "5" };
  assert.ok(Math.abs((triadCr("res", tokens) ?? 0) - (blockCr(tokens, "res") ?? 1)) < 1e-9);
  assert.equal(reviewBlockIds(tokens).includes("fin"), false);
});

test("guardar reemplaza el par original y la confirmación queda atada a esos juicios", () => {
  const tokens = { ...rest, res_riesgo_control: "3", res_riesgo_esg: "3", res_control_esg: "5" };
  const card = corroborationOf("res", tokens, "es");
  assert.ok(card);
  const saved: Record<string, string> = { ...tokens, [card.pairId]: "1" };
  assert.equal(Object.keys(saved).length, AHP.pairs.length);
  assert.equal(saved[card.pairId], "1");
  const stamp = { res: blockFingerprint("res", saved) };
  assert.deepEqual(pendingCorroboration(saved, stamp).includes("res"), false);
  const edited = { ...saved, res_riesgo_control: saved.res_riesgo_control === "9" ? "7" : "9" };
  assert.equal(pendingCorroboration(edited, stamp).includes("res"), reviewBlockIds(edited).includes("res"));
  assert.deepEqual(pendingCorroboration(tokens, { res: blockFingerprint("res", tokens) }), reviewBlockIds(tokens).filter((id) => id !== "res"));
});

test("las 729 combinaciones de una tríada tienen plantilla solo sobre el umbral", () => {
  const seen = new Map<TemplateId, Record<string, string>>();
  let flagged = 0;
  for (const left of AHP_SCALE_TOKENS) {
    for (const middle of AHP_SCALE_TOKENS) {
      for (const right of AHP_SCALE_TOKENS) {
        const tokens = { ...rest, res_riesgo_control: left, res_riesgo_esg: middle, res_control_esg: right };
        const cr = blockCr(tokens, "res") ?? 0;
        const card = corroborationOf("res", tokens, "es");
        if (cr <= 0.1) {
          assert.equal(card, null);
          continue;
        }
        flagged += 1;
        assert.ok(card);
        assert.ok(RES.includes(card.pairId as (typeof RES)[number]));
        assert.ok(card.template >= 1 && card.template <= 9);
        assert.doesNotMatch(`${card.context} ${card.question} ${card.current}`, /contradic|incorrect|correg|tension|\bCR\b|1\/9|1\/7|1\/5|1\/3/i);
        assert.equal(card.optionP.length > 0 && card.optionQ.length > 0, true);
        assert.deepEqual(card.intensities.map((item) => item.value), [3, 5, 7, 9]);
        assertSelection(tokens, card.pairId);
        assertFaithful(card.template, card.context, card.current, tokens, card.pairId);
        if (!seen.has(card.template)) seen.set(card.template, { res_riesgo_control: left, res_riesgo_esg: middle, res_control_esg: right, pair: card.pairId });
      }
    }
  }
  assert.equal(flagged > 0, true);
  const reached = [...seen.keys()].sort((a, b) => a - b);
  const missing = ([1, 2, 3, 4, 5, 6, 7, 8, 9] as TemplateId[]).filter((id) => !seen.has(id));
  assert.deepEqual(reached, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(missing, []);
  for (const [template, example] of seen) {
    const tokens = { ...rest, ...example };
    delete (tokens as { pair?: string }).pair;
    const card = corroborationOf("res", tokens, "es");
    assert.equal(card?.template, template);
    assert.match(card?.title ?? "", /Confirma esta comparación/);
    assert.match(card?.question ?? "", /Para la agenda de Compras de 2027/);
  }
});

function assertSelection(tokens: Record<string, string>, pairId: string) {
  const current = blockCr(tokens, "res") ?? 0;
  const scored = RES.map((id) => {
    let reduction = Number.NEGATIVE_INFINITY;
    let distance = Number.POSITIVE_INFINITY;
    const now = Number(tokens[id].includes("/") ? 1 / Number(tokens[id].slice(2)) : tokens[id]);
    for (const token of AHP_SCALE_TOKENS) {
      const next = blockCr({ ...tokens, [id]: token }, "res") ?? 0;
      const value = Number(token.includes("/") ? 1 / Number(token.slice(2)) : token);
      const gained = current - next;
      const step = Math.abs(Math.log(value) - Math.log(now));
      if (gained > reduction + 1e-8) {
        reduction = gained;
        distance = step;
      } else if (Math.abs(gained - reduction) <= 1e-8 && step < distance) distance = step;
    }
    return { id, reduction, distance };
  });
  const best = scored.reduce((chosen, item) => {
    if (!chosen) return item;
    if (item.reduction > chosen.reduction + 1e-8) return item;
    if (Math.abs(item.reduction - chosen.reduction) > 1e-8) return chosen;
    if (item.distance < chosen.distance - 1e-9) return item;
    if (Math.abs(item.distance - chosen.distance) > 1e-9) return chosen;
    return item.id < chosen.id ? item : chosen;
  });
  assert.equal(best?.id, pairId);
}

function assertFaithful(template: TemplateId, context: string, current: string, tokens: Record<string, string>, pairId: string) {
  const names: Record<string, string> = {
    riesgo: "Gestionar riesgo y continuidad",
    control: "Cumplimiento y control",
    esg: "Sostenibilidad y ESG",
  };
  const words: Record<string, string> = { "3": "moderadamente", "5": "fuertemente", "7": "muy fuertemente", "9": "extremadamente", "1/3": "moderadamente", "1/5": "fuertemente", "1/7": "muy fuertemente", "1/9": "extremadamente" };
  const pairs = {
    res_riesgo_control: ["riesgo", "control"],
    res_riesgo_esg: ["riesgo", "esg"],
    res_control_esg: ["control", "esg"],
  } as const;
  const [p, q] = pairs[pairId as keyof typeof pairs];
  const r = (["riesgo", "control", "esg"] as const).find((id) => id !== p && id !== q)!;
  const rel = (id: string) => {
    const ends = pairs[id as keyof typeof pairs];
    const token = tokens[id];
    if (token === "1") return { equal: true as const };
    const towardA = !token.startsWith("1/");
    return { equal: false as const, winner: towardA ? ends[0] : ends[1], word: words[token] };
  };
  const link = (left: string, right: string) => {
    const id = RES.find((item) => {
      const ends = pairs[item];
      return ends.includes(left as never) && ends.includes(right as never);
    })!;
    return rel(id);
  };
  const pr = link(p, r);
  const qr = link(q, r);
  const direct = rel(pairId);
  if (template === 1) {
    assert.match(context, new RegExp(names[p]));
    assert.match(context, new RegExp(names[q]));
    assert.match(context, new RegExp(names[r]));
    assert.match(context, /igual importancia/);
  }
  if (template === 3 || template === 4) assert.match(context, /misma intensidad/);
  if (template === 5 || template === 6 || template === 9) {
    if (!pr.equal) assert.match(context, new RegExp(pr.word));
    if (!qr.equal) assert.match(context, new RegExp(qr.word));
  }
  if (template === 7) assert.match(context, /comparación directa/);
  if (template === 8) assert.match(context, /igual importancia/);
  if (direct.equal) assert.match(current, /Igual importancia/);
  else assert.match(current, new RegExp(direct.word));
  assert.equal(AHP_BLOCKS.find((item) => item.id === "res")?.pairIds.includes(pairId as never), true);
}
