import { briefIsStale, newestResponseAt } from "@/lib/surveys/executive";

export const STUDY_SECTIONS = [
  {
    id: "resumen",
    title: "Resumen ejecutivo",
    ask: "Abre el informe para el CEO de Xinergy. En 180 a 230 palabras, di qué descubrió esta muestra sobre compras en 2027: dónde está la prioridad, qué comportamiento la acompaña y qué decisión abre. Tres ideas en prosa, sin viñetas. Usa solo cifras del JSON.",
  },
  {
    id: "muestra",
    title: "Qué permite decir esta muestra",
    ask: "En 120 a 170 palabras, describe la muestra: cuántas respuestas, países, roles e industrias, y qué queda fuera. Di si ya alcanza para un primer relato regional y dónde todavía es una señal. No la llames representativa de América Latina.",
  },
  {
    id: "prioridades",
    title: "Dónde está la prioridad en 2027",
    ask: "En 170 a 220 palabras, interpreta el ranking y los grupos de prioridad. Explica qué concentra la atención, qué queda atrás y qué significa eso para una agenda de compras en 2027. No repitas la tabla: explica el comportamiento.",
  },
  {
    id: "comportamiento",
    title: "Cómo se comporta la operación",
    ask: "En 180 a 240 palabras, cruza la prioridad con lo que la operación declara. Si hay niveles de 1 a 5, léelos como práctica, nunca como porcentaje. Si hay un portafolio, es un escenario de demostración: no es ahorro ni ROI. Señala la brecha más clara entre lo que se prioriza y lo que se hace.",
  },
  {
    id: "segmentos",
    title: "Diferencias que ya se ven",
    ask: "En 140 a 190 palabras, cuenta diferencias por país, rol o industria que sí estén en el JSON. Un corte con menos de 5 respuestas es una señal, no un hallazgo. Si Finanzas y Compras difieren, dilo como expectativa distinta, no como conflicto.",
  },
  {
    id: "recomendaciones",
    title: "Qué haríamos con esto",
    ask: "En 180 a 240 palabras, propone cuatro sugerencias concretas para 2027, útiles para Xinergy y para las empresas de la muestra. Cada una debe apoyarse en un dato del JSON. Son hipótesis de trabajo, interesantes y específicas, no consejos genéricos. No prometas dólares, ahorro ni retorno.",
  },
  {
    id: "limites",
    title: "Hasta dónde llega este preliminar",
    ask: "En 80 a 120 palabras, cierra con los límites: participación voluntaria, corte preliminar, y qué no se puede afirmar todavía. Si el JSON dice que la matriz es de demostración, inclúyelo en una frase. Si no lo dice, no hables de matrices ni de que faltan.",
  },
] as const;

export type StudySectionId = (typeof STUDY_SECTIONS)[number]["id"];

export type StudySection = { id: StudySectionId; title: string; body: string };

export type StoredStudy = {
  generatedAt: string;
  responseCount: number;
  latestResponseAt: string | null;
  sections: StudySection[];
};

export function studyIsStale(study: Pick<StoredStudy, "responseCount" | "latestResponseAt"> | null, responses: { createdAt: string }[]) {
  return briefIsStale(study, responses);
}

export function studyStamp(responses: { createdAt: string }[]) {
  return newestResponseAt(responses);
}

const MODEL = process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b";

function clip(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("sin json");
  return JSON.parse(text.slice(start, end + 1));
}

export async function writeStudy(facts: unknown, instrumentNote: string): Promise<StudySection[]> {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) throw new Error("missing_key");
  let lastError = "study_failed";
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await requestStudy(key, facts, instrumentNote);
    } catch (error) {
      lastError = error instanceof Error ? error.message : "study_failed";
      if (lastError.toLowerCase().includes("rate limit") && attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 8000));
      }
    }
  }
  throw new Error(lastError);
}

async function requestStudy(key: string, facts: unknown, instrumentNote: string): Promise<StudySection[]> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.4,
      max_completion_tokens: 3200,
      reasoning_effort: "low",
      reasoning_format: "hidden",
      messages: [
        {
          role: "system",
          content: [
            "Eres el autor del informe preliminar del Radar de Compras LatAm 2027 de Xinergy.",
            "Xinergy trabaja con CEOs, CFOs y líderes de compras para que las eficiencias se vean en ahorro, EBITDA y caja.",
            "Escribes un estudio que se va a entregar, en español de negocios, concreto y con mirada regional hacia 2027.",
            "Reglas:",
            "- Usa solo las cifras del JSON. No inventes porcentajes, países, empresas, nombres ni citas.",
            "- No menciones personas ni compañías.",
            "- Si hay menos de 5 respuestas, habla de quien respondió. No digas el mercado ni América Latina ya muestra.",
            "- Con 5 o más, puedes decir esta muestra. No la llames representativa de la región.",
            "- Una nota de 1 a 5 no es un porcentaje.",
            "- Si el dato es un rango, cita el rango. No elijas un punto medio.",
            "- Los porcentajes se escriben con coma decimal.",
            "- Sin viñetas y sin markdown. Prosa.",
            "- Devuelve solo JSON.",
            '- Forma: {"sections":[{"id":"resumen","body":"..."},{"id":"muestra","body":"..."},{"id":"prioridades","body":"..."},{"id":"comportamiento","body":"..."},{"id":"segmentos","body":"..."},{"id":"recomendaciones","body":"..."},{"id":"limites","body":"..."}]}',
          ].join("\n"),
        },
        {
          role: "user",
          content: [instrumentNote, ...STUDY_SECTIONS.map((section) => `${section.id}: ${section.ask}`), "Cifras:", JSON.stringify(facts)].join("\n\n"),
        },
      ],
    }),
  });
  const payload = (await response.json().catch(() => null)) as {
    choices?: { message?: { content?: string | null } }[];
    error?: { message?: string };
  } | null;
  if (!response.ok) throw new Error(payload?.error?.message || "groq_failed");
  const parsed = extractJson(payload?.choices?.[0]?.message?.content ?? "") as { sections?: { id?: string; body?: unknown }[] };
  return STUDY_SECTIONS.map((section) => {
    const found = parsed.sections?.find((item) => item.id === section.id);
    const body = clip(found?.body, 4000);
    if (body.length < 80) throw new Error(`section_short:${section.id}`);
    return { id: section.id, title: section.title, body };
  });
}
