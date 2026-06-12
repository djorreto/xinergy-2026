import { defineRouting } from "next-intl/routing";

export const locales = ["es", "en", "pt"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export const localeLabels: Record<Locale, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});
