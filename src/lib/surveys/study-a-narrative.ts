import { narrativeBlobA, type StudyCutA } from "@/lib/surveys/study-a-cut";

export type StudyNarrativeA = { thesis: string; summary: string };

const MODEL = process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b";

export function fallbackNarrativeA(cut: StudyCutA): StudyNarrativeA {
  return { thesis: cut.thesis, summary: composeSummaryA(cut) };
}

export async function writeNarrativeA(cut: StudyCutA): Promise<StudyNarrativeA> {
  const fallback = fallbackNarrativeA(cut);
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) return fallback;
  const allowed = numberTokens(narrativeBlobA(cut));
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
      if (last.toLowerCase().includes("rate limit") && attempt < 2) await new Promise((resolve) => setTimeout(resolve, 8000));
    }
  }
  console.error("study-a", last);
  return fallback;
}

function accept(text: string, allowed: Set<string>) {
  if (!text || text.length < 40 || text.length > 4500) return false;
  if (/[#*`]|opción b|opcion b|dólar|usd\b|representativ|demuestra que|mayor[ií]a|significativ|todas las empresas|dominante|indicadores individuales|organizacion|avanza|consistencia entre perfiles|95,2\s*%\s*(usa|usan)|53,3\s*%\s*del ahorro|monitoreo de proveedores:\s*85/i.test(text)) return false;
  if (/(?<![\d,])\d{1,2}\s*%/.test(text)) return false;
  return unknownNumbers(text, allowed).length === 0;
}

async function requestNarrative(key: string, cut: StudyCutA, fallback: StudyNarrativeA, allowed: Set<string>) {
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
            "Eres el editor del informe preliminar de Radar Compras LatAm 2027, versión A, escrito para CPOs.",
            "Recibes un registro verificado. No calculas y no agregas cifras.",
            "La tesis es una frase. El resumen se lee en dos minutos, en tres párrafos separados por una línea en blanco.",
            "Distingue lo declarado, el perfil de prioridades y lo que el cruce muestra persona por persona.",
            "Un rango elegido por varias personas no es el promedio del ahorro. Una mención de uso actual o previsto no es adopción. Renegociar no es monitorear.",
            "ROI poco claro es el nombre de una barrera declarada, no un retorno medido.",
            "No hables de dólares, causalidad, muestra representativa ni de una prioridad dominante.",
            "No uses las palabras opción B, brecha normalizada ni portafolio óptimo.",
            "Porcentajes con coma decimal, copiados del registro.",
            "Números permitidos:",
            [...allowed].join(", "),
            'Devuelve solo JSON: {"thesis":"...","summary":"..."}',
          ].join("\n"),
        },
        {
          role: "user",
          content: JSON.stringify({
            tesis_borrador: fallback.thesis,
            resumen_borrador: fallback.summary,
            hallazgos: cut.claims.map((claim) => ({ titulo: claim.title, observacion: claim.observation, implicacion: claim.implication, limite: claim.limit })),
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
  return { thesis: typeof parsed.thesis === "string" ? parsed.thesis.trim() : "", summary: typeof parsed.summary === "string" ? parsed.summary.trim() : "" };
}

export function composeSummaryA(cut: StudyCutA) {
  const lead = (id: string, count: number) => sentences(cut.claims.find((claim) => claim.id === id)?.observation ?? "", count);
  return [
    [cut.thesis, lead("prioridades", 2)].filter(Boolean).join(" "),
    [lead("valor", 3), lead("continuidad", 2)].filter(Boolean).join(" "),
    [lead("digital", 2), cut.claims.find((claim) => claim.id === "valor")?.implication].filter(Boolean).join(" "),
  ].filter((paragraph) => paragraph.trim()).join("\n\n");
}

function sentences(text: string, count: number) {
  const parts = text.match(/[^.]+[.]/g) ?? [];
  return (parts.length ? parts.slice(0, count).join(" ") : text).trim();
}

function numberTokens(text: string) {
  return new Set((text.match(/\d+(?:[.,]\d+)?/g) ?? []).map((token) => token.replace(".", ",")));
}

function unknownNumbers(text: string, allowed: Set<string>) {
  return (text.match(/\d+(?:[.,]\d+)?/g) ?? []).map((token) => token.replace(".", ",")).filter((token) => !allowed.has(token));
}
