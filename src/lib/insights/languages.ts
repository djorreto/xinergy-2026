import type { Locale } from "@/i18n/routing";

const ORDER: Locale[] = ["es", "en", "pt"];

const names: Record<Locale, Record<Locale, string>> = {
  es: { es: "español", en: "inglés", pt: "portugués" },
  en: { es: "Spanish", en: "English", pt: "Portuguese" },
  pt: { es: "espanhol", en: "inglês", pt: "português" },
};

const prefix: Record<Locale, string> = {
  es: "Disponible en",
  en: "Available in",
  pt: "Disponível em",
};

const conjunction: Record<Locale, string> = {
  es: "y",
  en: "and",
  pt: "e",
};

export type MediaLinks = Partial<Record<Locale, string>>;

export type AvailabilityItem = {
  label: string;
  href?: string;
};

export type AvailabilityNote = {
  prefix: string;
  conjunction: string;
  items: AvailabilityItem[];
};

export function normalizeLanguages(value: unknown): Locale[] {
  const raw = Array.isArray(value) ? value : [];
  return ORDER.filter((locale) => raw.includes(locale));
}

export function normalizeMediaLinks(value: unknown): MediaLinks {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const links: MediaLinks = {};
  for (const locale of ORDER) {
    const href = (value as Record<string, unknown>)[locale];
    if (typeof href === "string" && href.trim()) links[locale] = href.trim();
  }
  return links;
}

export function availabilityNote(languages: Locale[], page: Locale, links?: MediaLinks): AvailabilityNote | null {
  const selected = normalizeLanguages(languages);
  if (!selected.length) return null;
  return {
    prefix: prefix[page],
    conjunction: conjunction[page],
    items: selected.map((locale) => ({
      label: names[page][locale],
      href: links?.[locale],
    })),
  };
}

export function availabilityLine(languages: Locale[], page: Locale): string {
  const note = availabilityNote(languages, page);
  if (!note) return "";
  return `${note.prefix} ${joinLabels(note.items.map((item) => item.label), note.conjunction)}.`;
}

function joinLabels(words: string[], joinWord: string): string {
  if (words.length <= 1) return words[0] ?? "";
  const last = words[words.length - 1];
  return `${words.slice(0, -1).join(", ")} ${joinWord} ${last}`;
}
