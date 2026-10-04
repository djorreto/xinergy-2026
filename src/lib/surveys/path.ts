export function isSurveyPath(pathname: string) {
  return (
    pathname === "/radar-compras-2027" ||
    pathname.startsWith("/radar-compras-2027/") ||
    /^\/(es|en|pt)\/radar-compras-2027(\/|$)/.test(pathname)
  );
}
