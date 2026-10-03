import { extractText } from "unpdf";
import type { Locale } from "@/i18n/routing";
import type { InsightLocaleFields } from "@/lib/insights/types";

const LOCALES: Locale[] = ["es", "en", "pt"];

type Draft = Record<Locale, InsightLocaleFields>;

function clip(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function clipBody(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

function dateOrEmpty(value: unknown): string {
  const text = clip(value, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : "";
}

function samplePages(pages: string[]): string {
  const count = pages.length;
  const third = Math.max(1, Math.ceil(count / 3));
  const picks = new Set<number>();
  for (const start of [0, third, third * 2]) {
    for (let index = start; index < Math.min(start + 2, count); index += 1) picks.add(index);
  }
  const chunks = [...picks]
    .sort((a, b) => a - b)
    .map((index) => `--- Página ${index + 1} de ${count} ---\n${pages[index] ?? ""}`);
  return chunks.join("\n\n").slice(0, 14000);
}

function readLocale(value: unknown): InsightLocaleFields {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    title: clip(row.title, 300),
    excerpt: clip(row.excerpt, 2000),
    body: clipBody(row.body, 12000),
    typeLabel: clip(row.typeLabel, 80) || "Point of View",
    tag: clip(row.tag, 80),
    author: clip(row.author, 160),
    publishedOn: dateOrEmpty(row.publishedOn),
  };
}

export async function draftInsightFromPdf(bytes: Uint8Array): Promise<Draft> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("missing_key");

  const extracted = await extractText(bytes, { mergePages: false });
  const pages = (Array.isArray(extracted.text) ? extracted.text : [extracted.text]).map((page) => page.trim());
  const sample = samplePages(pages);
  if (sample.replace(/---[\s\S]*?---/g, "").trim().length < 40) throw new Error("empty_pdf");

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
      max_completion_tokens: 6000,
      reasoning_effort: "low",
      reasoning_format: "hidden",
      messages: [
        {
          role: "system",
          content:
            "Completas la ficha pública de un insight de Xinergy a partir del texto de un PDF. Responde solo JSON.",
        },
        {
          role: "user",
          content: `El idioma oficial es el español. Si el PDF trae español, usa solo esas páginas como fuente y traduce a inglés y portugués. No armes el español desde el inglés ni el portugués. Si no hay español, usa el idioma que sí venga y traduce el resto desde ahí.

Devuelve JSON con es, en y pt. Cada idioma tiene:
- title: solo el título de la portada, en oración, máximo 90 caracteres. Sin punto final ni subtítulo. Conserva el artículo inicial (La, El, A, O, The) cuando la portada lo usa.
- excerpt: dos frases que resumen el documento, entre 120 y 320 caracteres.
- body: el brief público, tres párrafos separados por un salto de línea, sin copiar el PDF entero.
- typeLabel: categoría corta. Si el documento es un point of view, usa "Point of View".
- tag: tema corto, dos o tres palabras.
- author: nombres de la portada, unidos con "y". Vacío si no aparecen.
- publishedOn: fecha del documento en YYYY-MM-DD, o cadena vacía si no hay fecha.

No inventes autores, cifras ni clientes que no estén en el texto.

${sample}`,
        },
      ],
    }),
  });

  if (!response.ok) throw new Error("groq_failed");
  const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = payload.choices?.[0]?.message?.content ?? "";
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("incomplete");
  const parsed = JSON.parse(match[0]) as Record<string, unknown>;
  return Object.fromEntries(LOCALES.map((locale) => [locale, readLocale(parsed[locale])])) as Draft;
}
