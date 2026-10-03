import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { adminHref, adminPathKey } from "./lib/auth/admin-path";
import { INSIGHTS_SESSION_COOKIE, readSessionToken } from "./lib/auth/insights-session";
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

function noindex(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

function internalAdminPath(pathname: string): string | null {
  const key = adminPathKey();
  if (!key) return null;
  if (pathname === `/${key}`) return "/admin";
  if (pathname.startsWith(`/${key}/`)) return `/admin${pathname.slice(key.length + 1)}`;
  return null;
}

async function adminMiddleware(request: NextRequest, internalPath: string) {
  const email = await readSessionToken(request.cookies.get(INSIGHTS_SESSION_COOKIE)?.value);
  const isLogin = internalPath === "/admin/login" || internalPath.startsWith("/admin/login/");

  if (isLogin && email) {
    const url = request.nextUrl.clone();
    url.pathname = adminHref("/insights");
    url.search = "";
    return noindex(NextResponse.redirect(url));
  }

  if (!isLogin && !email) {
    const url = request.nextUrl.clone();
    url.pathname = adminHref("/login");
    url.search = "";
    url.searchParams.set("from", request.nextUrl.pathname);
    return noindex(NextResponse.redirect(url));
  }

  const url = request.nextUrl.clone();
  url.pathname = internalPath;
  const headers = new Headers(request.headers);
  headers.set("x-xinergy-admin", "1");
  return noindex(NextResponse.rewrite(url, { request: { headers } }));
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const internalAdmin = internalAdminPath(pathname);
  if (internalAdmin) return adminMiddleware(request, internalAdmin);
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (request.headers.get("x-xinergy-admin") === "1") return noindex(NextResponse.next());
    return new NextResponse("Not Found", { status: 404, headers: { "X-Robots-Tag": "noindex, nofollow" } });
  }

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
