"use client";

import { useTranslations } from "next-intl";

/** Leyenda del gráfico narrativo — superpuesta al chart animado */
export function HeroChartCaption({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const t = useTranslations("ui.chart");

  return (
    <p
      className={`max-w-2xl border-l-2 border-xinergy-orange/80 pl-4 text-sm leading-relaxed sm:text-[0.9375rem] ${
        dark ? "text-white/60" : "text-xinergy-slate"
      } ${className}`}
    >
      {t("caption")}
    </p>
  );
}
