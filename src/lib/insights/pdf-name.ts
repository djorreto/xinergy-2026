/** Nombre con el que el navegador guarda el PDF. Vacío usa el slug. */
export function pdfDownloadName(value: string | null | undefined, fallbackSlug: string) {
  const raw = (value ?? "").trim().replace(/\\/g, "/").split("/").pop() ?? "";
  const stem = raw.replace(/\.pdf$/i, "");
  const clean = stem.replace(/[^\p{L}\p{N} ._()\-]+/gu, "").replace(/\s+/g, " ").trim().slice(0, 120);
  return `${clean || fallbackSlug || "xinergy"}.pdf`;
}
