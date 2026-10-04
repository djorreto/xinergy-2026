import { aggregateAhp, ahpLabel, formatPercent } from "@/lib/surveys/ahp";
import { formatStored } from "@/lib/surveys/present";
import { EMP, REG, S4, S5, S6, S7, SETS, isVisible, tx, type Question } from "@/lib/surveys/radar-2027";

export type FactAnswer = {
  createdAt: string;
  language: string;
  pais: string;
  rol: string;
  rolGrupo: string;
  antiguedad: string;
  rubro: string;
  rubroGrupo: string | null;
  company: Record<string, unknown>;
  answers: Record<string, unknown>;
};

const QUESTIONS = [...EMP, ...S4, ...S5, ...S6, ...S7];

function tally(labels: string[]) {
  const counts = new Map<string, number>();
  for (const label of labels) {
    if (!label || label === "—") continue;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  const total = labels.filter((label) => label && label !== "—").length;
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([nombre, n]) => ({ nombre, n, pct: total ? Math.round((n / total) * 1000) / 10 : 0 }));
}

function recordOf(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, string>;
}

function valueOf(question: Question, item: FactAnswer) {
  return EMP.some((entry) => entry.id === question.id) ? item.company[question.id] : item.answers[question.id];
}

function questionFact(question: Question, audience: FactAnswer[]) {
  const n = audience.length;
  if (question.type === "select" || question.type === "single") {
    const labels = audience.map((item) => {
      const value = valueOf(question, item);
      return typeof value === "string" ? formatStored(question.id, value) : "";
    });
    return { pregunta: tx(question.label, "es"), n, opciones: tally(labels) };
  }
  if (question.type === "multi") {
    const opciones = question.options.map((option) => {
      const count = audience.filter((item) => {
        const value = valueOf(question, item);
        return Array.isArray(value) && value.includes(option.v);
      }).length;
      return { nombre: tx(option, "es"), n: count, pct: n ? Math.round((count / n) * 1000) / 10 : 0 };
    }).filter((option) => option.n > 0);
    return { pregunta: tx(question.label, "es"), n, opciones };
  }
  if (question.type === "scale") {
    const scores = audience.map((item) => Number(valueOf(question, item))).filter((value) => value >= 1 && value <= 5);
    if (!scores.length) return null;
    const mean = scores.reduce((sum, value) => sum + value, 0) / scores.length;
    const anchors = question.anchors ?? (question.set ? SETS[question.set] : []);
    const nearest = anchors[Math.round(mean) - 1];
    return {
      pregunta: tx(question.label, "es"),
      n: scores.length,
      promedioDe1a5: Math.round(mean * 10) / 10,
      seLeeComo: nearest ? tx(nearest, "es") : null,
      nota: "Esto es una frase de la escala, no un porcentaje.",
    };
  }
  if (question.type === "matrix") {
    const anchors = SETS[question.set];
    return {
      pregunta: tx(question.label, "es"),
      n,
      escala: anchors.length ? `1 = ${tx(anchors[0], "es")} · 5 = ${tx(anchors[anchors.length - 1], "es")}` : "1 a 5",
      filas: question.rows.map((row) => {
        const scores = audience.map((item) => Number(recordOf(valueOf(question, item))?.[row.v])).filter((value) => value >= 1 && value <= 5);
        const mean = scores.length ? scores.reduce((sum, value) => sum + value, 0) / scores.length : null;
        const nearest = mean == null ? null : anchors[Math.round(mean) - 1];
        return {
          nombre: tx(row, "es"),
          n: scores.length,
          seLeeComo: nearest ? tx(nearest, "es") : null,
        };
      }),
    };
  }
  return null;
}

export function buildExecutiveFacts(responses: FactAnswer[]) {
  const paisQuestion = REG.find((question) => question.id === "pais");
  const paisOptions = paisQuestion && "options" in paisQuestion ? paisQuestion.options : [];
  const present = new Set(responses.map((item) => item.pais));
  const ahp = aggregateAhp(
    responses
      .map((item) => recordOf(item.answers.prioridades_ahp))
      .filter((item): item is Record<string, string> => Boolean(item)),
  );
  const ranking = ahp
    ? Object.entries(ahp.global)
        .sort((left, right) => right[1] - left[1])
        .map(([id, weight], index) => ({ puesto: index + 1, prioridad: ahpLabel(id), peso: formatPercent(weight) }))
    : [];

  return {
    respuestas: responses.length,
    umbralParaPublicarUnCorte: 5,
    regla: "Un grupo con menos de 5 respuestas no se publica como cifra del estudio. Hoy todo es preliminar.",
    idiomas: tally(responses.map((item) => (item.language === "en" ? "Inglés" : item.language === "pt" ? "Portugués" : "Español"))),
    paises: tally(responses.map((item) => formatStored("pais", item.pais))),
    paisesDelRadarSinRespuesta: paisOptions.filter((option) => !present.has(option.v)).map((option) => tx(option, "es")),
    roles: tally(responses.map((item) => formatStored("rol", item.rol))),
    antiguedad: tally(responses.map((item) => formatStored("antiguedad", item.antiguedad))),
    rubros: tally(responses.map((item) => formatStored("rubro", item.rubro))),
    priorizacion: ahp
      ? {
          macroprioridades: ahp.macro.ids.map((id, index) => ({ nombre: ahpLabel(id), peso: formatPercent(ahp.macro.weights[index] ?? 0) })),
          ranking,
          consistencia: ahp.maxCr <= 0.1 ? "adecuada" : "revisar",
          crMaximo: Number(ahp.maxCr.toFixed(3)),
        }
      : null,
    preguntas: QUESTIONS.map((question) => {
      const audience = responses.filter((item) => isVisible(question, item.rolGrupo, item.rubroGrupo));
      if (!audience.length || question.type === "ahp" || question.type === "textarea" || question.type === "text") return null;
      return questionFact(question, audience);
    }).filter(Boolean),
  };
}
