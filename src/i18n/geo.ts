import { defaultLocale, type Locale } from "./routing";

/** ISO 3166-1 alpha-2 → site locale */
const countryLocaleMap: Record<string, Locale> = {
  // Portuguese
  BR: "pt",
  PT: "pt",
  AO: "pt",
  MZ: "pt",

  // Spanish
  AR: "es",
  BO: "es",
  CL: "es",
  CO: "es",
  CR: "es",
  CU: "es",
  DO: "es",
  EC: "es",
  SV: "es",
  GT: "es",
  HN: "es",
  MX: "es",
  NI: "es",
  PA: "es",
  PY: "es",
  PE: "es",
  PR: "es",
  ES: "es",
  UY: "es",
  VE: "es",

  // English (primary markets)
  US: "en",
  GB: "en",
  CA: "en",
  AU: "en",
  NZ: "en",
  IE: "en",
  IN: "en",
  SG: "en",
  ZA: "en",
  PH: "en",
  NG: "en",
  KE: "en",
  HK: "en",
};

export function localeFromCountry(country: string | null | undefined): Locale {
  if (!country) return defaultLocale;
  return countryLocaleMap[country.toUpperCase()] ?? defaultLocale;
}

export function localeFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  const lower = header.toLowerCase();
  if (lower.includes("pt")) return "pt";
  if (lower.includes("en")) return "en";
  if (lower.includes("es")) return "es";
  return null;
}
