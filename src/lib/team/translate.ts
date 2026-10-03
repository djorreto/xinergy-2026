import { localeLabels } from "@/i18n/routing";

export async function translateRoleFromSpanish(role: string): Promise<{ en: string; pt: string }> {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) throw new Error("missing_key");
  const source = role.trim();
  if (source.length < 2) throw new Error("empty_source");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "User-Agent": "xinergy-insights/1.0",
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      temperature: 0.2,
      max_completion_tokens: 400,
      reasoning_effort: "low",
      reasoning_format: "hidden",
      messages: [
        {
          role: "system",
          content: "Traduces cargos de una consultora. Responde solo JSON con en y pt. Portugués de Brasil. No agregues notas.",
        },
        {
          role: "user",
          content: `El idioma de origen es ${localeLabels.es}. Traduce este cargo.\n${JSON.stringify({ es: source })}`,
        },
      ],
    }),
  });
  if (!response.ok) throw new Error("groq_failed");
  const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = payload.choices?.[0]?.message?.content ?? "";
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("incomplete");
  const parsed = JSON.parse(match[0]) as { en?: string; pt?: string };
  return {
    en: typeof parsed.en === "string" ? parsed.en.trim().slice(0, 120) : "",
    pt: typeof parsed.pt === "string" ? parsed.pt.trim().slice(0, 120) : "",
  };
}
