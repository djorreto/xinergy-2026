import type { Locale } from "@/i18n/routing";

type LocaleFlagProps = {
  locale: Locale;
  className?: string;
};

/** Bandera cuadrada SVG — sin emoji, proporción 1:1 */
export function LocaleFlag({ locale, className = "h-5 w-5" }: LocaleFlagProps) {
  const shared = `${className} shrink-0 overflow-hidden rounded-[2px] shadow-sm ring-1 ring-black/10`;

  if (locale === "es") {
    return (
      <svg viewBox="0 0 24 24" className={shared} aria-hidden>
        <rect width="24" height="24" fill="#AA151B" />
        <rect y="6" width="24" height="12" fill="#F1BF00" />
      </svg>
    );
  }

  if (locale === "en") {
    return (
      <svg viewBox="0 0 24 24" className={shared} aria-hidden>
        <rect width="24" height="24" fill="#B22234" />
        <rect y="2" width="24" height="2" fill="#fff" />
        <rect y="6" width="24" height="2" fill="#fff" />
        <rect y="10" width="24" height="2" fill="#fff" />
        <rect y="14" width="24" height="2" fill="#fff" />
        <rect y="18" width="24" height="2" fill="#fff" />
        <rect y="22" width="24" height="2" fill="#fff" />
        <rect width="10" height="11" fill="#3C3B6E" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={shared} aria-hidden>
      <rect width="24" height="24" fill="#009B3A" />
      <polygon points="12,2 22,12 12,22 2,12" fill="#FEDF00" />
      <circle cx="12" cy="12" r="5" fill="#002776" />
    </svg>
  );
}
