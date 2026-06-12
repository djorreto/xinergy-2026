import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { localeFromCountry } from "./i18n/geo";
import { routing, type Locale } from "./i18n/routing";

const LOCALE_COOKIE = "NEXT_LOCALE";

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: false,
});

function isLocale(value: string | undefined): value is Locale {
  return value === "es" || value === "en" || value === "pt";
}

function detectLocale(request: NextRequest): Locale {
  // Solo si el usuario eligió idioma manualmente (bandera)
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) return cookie;

  // Geo automático solo en producción (Vercel). En local → siempre español.
  const isProduction = process.env.VERCEL_ENV === "production";
  if (isProduction) {
    const country =
      request.headers.get("x-vercel-ip-country") ??
      request.headers.get("cf-ipcountry") ??
      undefined;

    if (country) {
      return localeFromCountry(country);
    }
  }

  return routing.defaultLocale;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const hasLocalePrefix = routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (!hasLocalePrefix) {
    const locale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
