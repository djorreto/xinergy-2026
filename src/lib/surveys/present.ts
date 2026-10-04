import { SETS, choiceLabel, questionById, tx, type Lang, type Question } from "@/lib/surveys/radar-2027";

export function formatStored(id: string, value: unknown, lang: Lang = "es"): string {
  const question = questionById(id);
  if (!question) return textOf(value);
  return formatQuestion(question, value, lang);
}

export function formatQuestion(question: Question, value: unknown, lang: Lang = "es") {
  if (value == null || value === "") return "—";
  if (question.type === "select" || question.type === "single") {
    return typeof value === "string" ? choiceLabel(question.options, value, lang) : "—";
  }
  if (question.type === "multi") {
    if (!Array.isArray(value)) return "—";
    return value.map((item) => (typeof item === "string" ? choiceLabel(question.options, item, lang) : "")).filter(Boolean).join(", ");
  }
  if (question.type === "scale") {
    const index = Number(value) - 1;
    const anchors = question.anchors ?? (question.set ? SETS[question.set] : []);
    const anchor = anchors[index];
    return anchor ? `${value}. ${tx(anchor, lang)}` : String(value);
  }
  if (question.type === "matrix") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return "—";
    const record = value as Record<string, string>;
    const anchors = SETS[question.set];
    return question.rows
      .map((row) => {
        const score = record[row.v];
        const anchor = anchors[Number(score) - 1];
        return `${tx(row, lang)}: ${score ?? "—"}${anchor ? ` (${tx(anchor, lang)})` : ""}`;
      })
      .join("\n");
  }
  if (question.type === "ahp") return "Priorización AHP";
  return textOf(value);
}

function textOf(value: unknown) {
  if (typeof value === "string") return value || "—";
  if (Array.isArray(value)) return value.join(", ");
  return "—";
}
