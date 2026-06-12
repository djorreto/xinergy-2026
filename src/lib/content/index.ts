import type * as EsContent from "./es";
import * as es from "./es";
import * as en from "./en";
import * as pt from "./pt";
import { type Locale, defaultLocale, locales } from "@/i18n/routing";

export type SiteContent = typeof es;
export type { FAQ } from "./es";
export type { Locale };
export { defaultLocale, locales };

const contentByLocale = { es, en, pt } as unknown as Record<Locale, SiteContent>;

export function getContent(locale: string): SiteContent {
  if (locale in contentByLocale) {
    return contentByLocale[locale as Locale];
  }
  return contentByLocale[defaultLocale];
}

/** @deprecated Use getContent(locale) in server components */
export const brand = es.brand;
