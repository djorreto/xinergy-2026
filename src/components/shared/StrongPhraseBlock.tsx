"use client";

import { useTranslations } from "next-intl";
import { useSiteContent } from "@/hooks/useSiteContent";
import { ttForsDisplay } from "@/lib/fonts";

export function StrongPhraseBlock({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { brand } = useSiteContent();

  const emphasisClass = compact
    ? "text-2xl sm:text-3xl lg:text-[1.75rem] xl:text-[2rem]"
    : "text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-[3.25rem]";

  const bodyClass = compact
    ? "text-base sm:text-2xl lg:text-lg xl:text-xl"
    : "text-lg sm:text-2xl lg:text-[1.625rem] xl:text-[1.875rem]";

  return (
    <blockquote
      className={`max-w-3xl border-l-2 border-dotted border-xinergy-orange pl-4 sm:pl-8 ${className}`}
    >
      <p className={`${ttForsDisplay.className} brand-phrase leading-snug break-words`}>
        <span
          className={`block font-bold text-xinergy-orange ${emphasisClass}`}
        >
          {brand.strongPhrase.emphasis}
        </span>
        <span className={`mt-2 block font-normal text-white/90 ${bodyClass}`}>
          {brand.strongPhrase.body.charAt(0).toUpperCase()}
          {brand.strongPhrase.body.slice(1)}
        </span>
      </p>
    </blockquote>
  );
}
