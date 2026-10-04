import { narrativeBlob, type StudyCut } from "@/lib/surveys/radar-b/study-cut";

export type StudyNarrative = { thesis: string; summary: string };

const MODEL = process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b";

export function fallbackNarrative(cut: StudyCut): StudyNarrative {
  return { thesis: cut.thesis, summary: composeSummary(cut) };
}

export async function writeNarrative(cut: StudyCut): Promise<StudyNarrative> {
  const fallback = fallbackNarrative(cut);
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) return fallback;
  const allowed = numberTokens(narrativeBlob(cut));
  let last = "";
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const draft = await requestNarrative(key, cut, fallback, allowed);
      return {
        thesis: accept(draft.thesis, allowed) ? draft.thesis : fallback.thesis,
        summary: accept(draft.summary, allowed) ? draft.summary : fallback.summary,
      };
    } catch (error) {
      last = error instanceof Error ? error.message : "narrative_failed";
      if (last.toLowerCase().includes("rate limit") && attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 8000));
      }
    }
  }
  console.error("study-b", last);
  return fallback;
}

function accept(text: string, allowed: Set<string>) {
  if (!text || text.length < 40 || text.length > 4500) return false;
  if (/[#*`]|opción b|opcion b|dólar|dolares|usd\b|roi\b|representativ|demuestra que|mayor[ií]a|significativ|todas las empresas|dominante/i.test(text)) return false;
  return unknownNumbers(text, allowed).length === 0;
}

async function requestNarrative(key: string, cut: StudyCut, fallback: StudyNarrative, allowed: Set<string>): Promise<StudyNarrative> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      max_completion_tokens: 1400,
      reasoning_effort: "low",
      reasoning_format: "hidden",
      messages: [
        {
          role: "system",
          content: [
            "Eres el editor del informe preliminar de Radar Compras LatAm 2027, escrito para CPOs.",
            "Recibes un registro ya verificado. No calculas, no agregas cifras y no cambias un número.",
            "Escribe en español de negocios, concreto, sin adjetivos que no se puedan sostener.",
            "La tesis es una frase. El resumen se lee en dos minutos: tres párrafos, separados por una línea en blanco.",
            "El primer párrafo lleva la tesis y el mandato. El segundo, la capacidad y la agenda. El tercero, la implicación para los próximos 90 días.",
            "Distingue lo que las empresas reportan, lo que el cálculo indica y lo que el escenario de demostración produce.",
            "No hables de ahorro, dólares, ROI, causalidad ni de una muestra representativa.",
            "No digas mayoría, significativamente ni todas las empresas, salvo que el registro use esas palabras.",
            "No uses los nombres AHP, SG, NSG ni Opción B.",
            "No menciones personas ni empresas.",
            "Los porcentajes usan coma decimal y deben copiarse del registro.",
            "Números permitidos, y ningún otro:",
            [...allowed].join(", "),
            'Devuelve solo JSON: {"thesis":"...","summary":"..."}',
          ].join("\n"),
        },
        {
          role: "user",
          content: JSON.stringify({
            tesis_borrador: fallback.thesis,
            resumen_borrador: fallback.summary,
            hallazgos: cut.claims.map((claim) => ({
              titulo: claim.title,
              observacion: claim.observation,
              implicacion: claim.implication,
              limite: claim.limit,
            })),
          }),
        },
      ],
    }),
  });
  const payload = (await response.json()) as { choices?: { message?: { content?: string } }[]; error?: { message?: string } };
  if (!response.ok) throw new Error(payload.error?.message ?? "narrative_failed");
  const text = payload.choices?.[0]?.message?.content ?? "";
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("sin json");
  const parsed = JSON.parse(text.slice(start, end + 1)) as { thesis?: unknown; summary?: unknown };
  return {
    thesis: typeof parsed.thesis === "string" ? parsed.thesis.trim() : "",
    summary: typeof parsed.summary === "string" ? parsed.summary.trim() : "",
  };
}

function numberTokens(text: string) {
  return new Set((text.match(/\d+(?:[.,]\d+)?/g) ?? []).map((token) => token.replace(".", ",")));
}

function unknownNumbers(text: string, allowed: Set<string>) {
  return (text.match(/\d+(?:[.,]\d+)?/g) ?? []).map((token) => token.replace(".", ",")).filter((token) => !allowed.has(token));
}

export function composeSummary(cut: StudyCut): string {
  const lead = (id: string, count: number) => sentences(cut.claims.find((claim) => claim.id === id)?.observation ?? "", count);
  const paragraphs = [
    [cut.thesis, lead("mandato", 2), lead("capacidad", 2)].filter(Boolean).join(" "),
    [lead("digital", 2), lead("agenda", 3)].filter(Boolean).join(" "),
    [lead("escenarios", 2), cut.claims.find((claim) => claim.id === "capacidad")?.implication, cut.claims.find((claim) => claim.id === "agenda")?.implication]
      .filter(Boolean)
      .join(" "),
  ].filter((paragraph) => paragraph.trim());
  return paragraphs.join("\n\n");
}

function sentences(text: string, count: number) {
  const parts = text.match(/[^.]+[.]/g) ?? [];
  return (parts.length ? parts.slice(0, count).join(" ") : text).trim();
}
