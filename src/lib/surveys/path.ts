const SURVEY_SLUGS = ["radar-compras-2027", "radar-compras-2027-b"];

export function isSurveyPath(pathname: string) {
  return SURVEY_SLUGS.some(
    (slug) => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`) || new RegExp(`^/(es|en|pt)/${slug}(/|$)`).test(pathname),
  );
}
