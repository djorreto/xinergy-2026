"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useState } from "react";

type CaseStudy = {
  slug: string;
  title: string;
  industry: string;
  challenge: string;
  approach: string;
  highlight: string;
  highlightLabel: string;
};

const popDelays = ["stat-pop-delay-0", "stat-pop-delay-1", "stat-pop-delay-2", "stat-pop-delay-3", "stat-pop-delay-4"];

type CaseStudyCarouselCardProps = {
  caseStudy: CaseStudy;
  index?: number;
};

export function CaseStudyCarouselCard({ caseStudy: c, index = 0 }: CaseStudyCarouselCardProps) {
  const t = useTranslations("ui.cases");
  const [open, setOpen] = useState(false);

  return (
    <article
      role="button"
      tabIndex={0}
      aria-expanded={open}
      className={`case-carousel-card group flex h-full min-h-[15.5rem] flex-col rounded-xl border border-xinergy-charcoal/10 bg-white p-5 sm:min-h-[16.5rem] sm:p-6 ${open ? "is-open relative z-10" : ""}`}
      onClick={() => setOpen((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((v) => !v);
        }
      }}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider text-xinergy-beige">
        {c.industry}
      </span>

      <div className="mt-3 flex flex-wrap items-end gap-x-2 gap-y-1">
        <span className={`brand-phrase stat-pop leading-none text-xinergy-orange text-3xl sm:text-4xl ${popDelays[index % popDelays.length]}`}>
          {c.highlight}
        </span>
        <span className="pb-0.5 text-[10px] leading-tight text-xinergy-slate sm:text-[11px]">
          {c.highlightLabel}
        </span>
      </div>

      <h3 className="mt-3 text-sm font-semibold leading-snug text-xinergy-charcoal sm:text-[0.9375rem]">
        {c.title}
      </h3>

      <p className="case-carousel-teaser mt-2 flex-1 text-xs leading-relaxed text-xinergy-slate sm:text-[0.8125rem]">
        {c.challenge}
      </p>

      <p className="case-carousel-extra mt-2 text-xs leading-relaxed text-xinergy-slate/85 sm:text-[0.8125rem]">
        <span className="font-semibold text-xinergy-orange">{t("approachLabel")}</span>
        {c.approach}
      </p>

      <Link
        href={`/casos/${c.slug}`}
        onClick={(e) => e.stopPropagation()}
        className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-xinergy-orange hover:underline"
      >
        {t("moreInfo")}
      </Link>
    </article>
  );
}
