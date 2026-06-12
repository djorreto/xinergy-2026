import { getContent } from "@/lib/content";

export type ContactFrom = "casos" | "diagnostico" | "insights";

export function getContactContext(from?: string | null, locale?: string) {
  const { contactContexts } = getContent(locale ?? "es");
  if (from && from in contactContexts && from !== "default") {
    return contactContexts[from as ContactFrom];
  }
  return contactContexts.default;
}

export function contactHref(from?: ContactFrom): string {
  return from ? `/contacto?from=${from}` : "/contacto";
}
