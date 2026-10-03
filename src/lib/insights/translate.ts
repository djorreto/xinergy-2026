import { localeLabels, type Locale } from "@/i18n/routing";
import type { InsightLocaleFields } from "@/lib/insights/types";

const MODEL = process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b";

export type TranslatedFields = Pick<InsightLocaleFields, "title" | "excerpt" | "body" | "typeLabel" | "tag">;

const LIMITS = { title: 300, excerpt: 2000, body: 12000, typeLabel: 80, tag: 80 };

function clip(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("sin json");
  return JSON.parse(text.slice(start, end + 1));
}

export async function translateInsightFields(
  source: Locale,
  fields: InsightLocaleFields,
  targets: Locale[],
): Promise<Record<Locale, TranslatedFields>> {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) throw new Error("missing_key");
  if (!targets.length) throw new Error("no_targets");

  const sourceText = {
    title: clip(fields.title, LIMITS.title),
    excerpt: clip(fields.excerpt, LIMITS.excerpt),
    body: clip(fields.body, LIMITS.body),
    typeLabel: clip(fields.typeLabel, LIMITS.typeLabel),
    tag: clip(fields.tag, LIMITS.tag),
  };
  if (sourceText.title.length < 3) throw new Error("empty_source");

  const shape = Object.fromEntries(targets.map((locale) => [locale, sourceText]));
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.2,
      max_completion_tokens: 4000,
      reasoning_effort: "low",
      reasoning_format: "hidden",
      messages: [
        {
          role: "system",
          content:
            "You translate Xinergy insight copy for a B2B procurement audience. Return only JSON, with the same keys you were given. Keep company names, product names, numbers, and paragraph breaks. Do not add notes.",
        },
        {
          role: "user",
          content: [
            `Source language: ${localeLabels[source]}.`,
            `Translate into: ${targets.map((locale) => `${locale} = ${localeLabels[locale]}`).join(", ")}.`,
            "Portuguese must be Brazilian Portuguese.",
            "JSON shape:",
            JSON.stringify(shape),
            "Source text:",
            JSON.stringify(sourceText),
          ].join("\n"),
        },
      ],
    }),
  });

  const payload = (await response.json().catch(() => null)) as {
    choices?: { message?: { content?: string | null } }[];
    error?: { message?: string };
  } | null;
  if (!response.ok) throw new Error(payload?.error?.message || "groq_failed");

  const content = payload?.choices?.[0]?.message?.content ?? "";
  const parsed = extractJson(content) as Record<string, Partial<TranslatedFields>>;
  const result = {} as Record<Locale, TranslatedFields>;
  for (const locale of targets) {
    const item = parsed[locale];
    const title = clip(item?.title, LIMITS.title);
    if (title.length < 3) throw new Error("incomplete");
    result[locale] = {
      title,
      excerpt: clip(item?.excerpt, LIMITS.excerpt),
      body: clip(item?.body, LIMITS.body),
      typeLabel: clip(item?.typeLabel, LIMITS.typeLabel) || sourceText.typeLabel || "Point of View",
      tag: clip(item?.tag, LIMITS.tag),
    };
  }
  return result;
}
