const REQUIRED = ["es", "en", "pt"] as const;

type IntakeFields = {
  locale: string;
  title: string;
  excerpt: string;
  body: string;
};

export function intakeIsComplete(rows: IntakeFields[], hasPdf: boolean, kind: "noticia" | "documento" = "documento"): boolean {
  const texts = REQUIRED.every((locale) => {
    const row = rows.find((item) => item.locale === locale);
    if (!row) return false;
    return row.title.trim().length >= 3 && row.excerpt.trim().length >= 40 && row.body.trim().length >= 80;
  });
  if (kind === "noticia") return texts;
  return hasPdf && texts;
}
