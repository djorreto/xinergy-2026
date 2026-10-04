import { EXECUTIVE_THEMES, type ExecutiveThemeId, type StoredBrief } from "@/lib/surveys/executive";

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

export async function writeExecutiveBrief(
  facts: unknown,
  options?: { asks?: { id: ExecutiveThemeId; ask: string }[]; extra?: string[] },
): Promise<Pick<StoredBrief, "context" | "themes">> {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) throw new Error("missing_key");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.4,
      max_completion_tokens: 3500,
      reasoning_effort: "low",
      reasoning_format: "hidden",
      messages: [
        {
          role: "system",
          content: [
            "Eres el editor del Radar de Compras LatAm 2027 de Xinergy.",
            "Xinergy trabaja con CEOs, CFOs y líderes de compras para que las eficiencias se vean en ahorro, EBITDA y caja.",
            "Escribes el análisis preliminar que lee primero el CEO de Xinergy. Ese mismo texto es el esqueleto de lo que después se les va a contar a quienes respondieron.",
            "Reglas:",
            "- Español de negocios, concreto, sin adjetivos vacíos y sin viñetas.",
            "- Usa solo las cifras del JSON. No inventes porcentajes, países, empresas, nombres ni citas.",
            "- No menciones personas ni compañías.",
            "- Si hay menos de 5 respuestas, habla de 'esta respuesta' o 'quien respondió'. No digas 'los líderes', 'el mercado' ni 'América Latina ya muestra'.",
            "- Una nota de 1 a 5 no es un porcentaje. Tradúcela con el texto de la escala, por ejemplo 'en desacuerdo' o 'insatisfecho'. No la conviertas en un %.",
            "- Si el dato es un rango, cita el rango tal cual. No elijas un número dentro del rango.",
            "- No repitas la tabla: interpreta qué significa.",
            "- Devuelve solo JSON, sin markdown.",
            '- Forma: {"context":"...","themes":[{"id":"atencion","body":"..."},{"id":"resultado","body":"..."},{"id":"relato","body":"..."}]}',
            "- context: 70 a 110 palabras, sobre el estado de la muestra.",
            "- Cada body: 90 a 140 palabras, en uno o dos párrafos separados por una línea en blanco.",
            "- Escribe los porcentajes con coma decimal.",
          ].join("\n"),
        },
        {
          role: "user",
          content: [
            "Si respuestas es 1, el sujeto de todo el texto es 'quien respondió'. Prohibido: 'los líderes', 'los ejecutivos', 'el mercado', 'la función de compras en América Latina'.",
            "context debe decir cuántas respuestas hay, de qué países y roles, qué países del radar todavía no aparecen, y si hoy alcanza para un análisis confiable. El umbral para publicar un corte es 5.",
            ...(options?.extra ?? []),
            ...(options?.asks ?? EXECUTIVE_THEMES).map((theme) => `${theme.id}: ${theme.ask}`),
            "Cifras:",
            JSON.stringify(facts),
          ].join("\n\n"),
        },
      ],
    }),
  });

  const payload = (await response.json().catch(() => null)) as {
    choices?: { message?: { content?: string | null } }[];
    error?: { message?: string };
  } | null;
  if (!response.ok) throw new Error(payload?.error?.message || "groq_failed");

  const parsed = extractJson(payload?.choices?.[0]?.message?.content ?? "") as {
    context?: unknown;
    themes?: { id?: string; body?: unknown }[];
  };
  const context = clip(parsed.context, 1600);
  if (context.length < 40) throw new Error("brief_short");
  const themes = EXECUTIVE_THEMES.map((theme) => {
    const found = parsed.themes?.find((item) => item.id === theme.id);
    const body = clip(found?.body, 2400);
    if (body.length < 40) throw new Error("theme_short");
    return { id: theme.id as ExecutiveThemeId, title: theme.title, body };
  });
  return { context, themes };
}
