"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { localeLabels, locales, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LocaleFlag } from "@/components/ui/LocaleFlag";

export function LanguageSwitcher({ useSolidHeader }: { useSolidHeader: boolean }) {
  const t = useTranslations("ui.header");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const switchLocale = (next: Locale) => {
    setOpen(false);
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
    router.replace(pathname, { locale: next });
  };

  const panelClass = useSolidHeader
    ? "border-xinergy-charcoal/15 bg-white"
    : "border-white/20 bg-xinergy-charcoal/90 backdrop-blur-md";

  const chevronClass = useSolidHeader ? "text-xinergy-charcoal" : "text-white/70";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-sm p-1 transition hover:opacity-85 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-xinergy-orange"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${t("language")}: ${localeLabels[locale]}`}
      >
        <LocaleFlag locale={locale} className="h-5 w-5" />
        <svg
          className={`h-3 w-3 ${chevronClass}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("language")}
          className={`absolute right-0 top-[calc(100%+0.35rem)] z-[220] min-w-[10rem] overflow-hidden rounded-lg border py-1 shadow-lg ${panelClass}`}
        >
          {locales.map((code) => (
            <li key={code} role="option" aria-selected={code === locale}>
              <button
                type="button"
                onClick={() => switchLocale(code)}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition hover:bg-xinergy-orange/10 ${
                  code === locale
                    ? "font-semibold text-xinergy-orange"
                    : useSolidHeader
                      ? "text-xinergy-charcoal"
                      : "text-white/90"
                }`}
              >
                <LocaleFlag locale={code} className="h-4 w-4" />
                <span>{localeLabels[code]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
