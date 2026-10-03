const RESERVED = new Set(["admin", "api", "es", "en", "pt", "_next", "_vercel"]);

export function adminPathKey(): string {
  const key = process.env.ADMIN_PATH_KEY?.trim().toLowerCase() ?? "";
  if (!/^[a-z0-9]{16,64}$/.test(key) || RESERVED.has(key)) return "";
  return key;
}

export function adminHref(path = ""): string {
  const key = adminPathKey();
  const raw = path.startsWith("/admin") ? path.slice("/admin".length) : path;
  const queryAt = raw.indexOf("?");
  const pathname = queryAt === -1 ? raw : raw.slice(0, queryAt);
  const query = queryAt === -1 ? "" : raw.slice(queryAt);
  const suffix = pathname ? (pathname.startsWith("/") ? pathname : `/${pathname}`) : "";
  const base = key ? `/${key}${suffix}` : `/admin${suffix}`;
  return `${base}${query}`;
}
