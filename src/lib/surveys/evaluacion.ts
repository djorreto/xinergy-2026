export const EVAL_INCLUDED = "Incluido en análisis";
export const EVAL_ISOLATED = "Aislado de la evaluación";

export type Evaluacion = typeof EVAL_INCLUDED | typeof EVAL_ISOLATED;

export function evaluationOf(value: string | null | undefined): Evaluacion {
  return value === EVAL_ISOLATED ? EVAL_ISOLATED : EVAL_INCLUDED;
}

export function isIncluded(value: string | null | undefined) {
  return evaluationOf(value) === EVAL_INCLUDED;
}
