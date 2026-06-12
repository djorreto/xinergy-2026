"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { contactHref } from "@/lib/contact-context";

type CaseStudy = {
  slug: string;
  title: string;
  industry: string;
  service: string;
  challenge: string;
  approach: string;
  results: readonly string[];
  highlight: string;
  highlightLabel: string;
};

type CaseStudyCardProps = {
  caseStudy: CaseStudy;
  variant?: "full" | "compact" | "carousel";
};

export function CaseStudyCard({ caseStudy: c, variant = "full" }: CaseStudyCardProps) {
  const t = useTranslations("ui.cases");

  if (variant === "carousel") {
    return (
      <article className="flex h-full flex-col rounded-xl border border-xinergy-charcoal/10 bg-white p-5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-xinergy-beige">
          {c.industry}
        </span>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="brand-phrase text-xl leading-none text-xinergy-orange">{c.highlight}</span>
          <span className="line-clamp-1 text-[10px] leading-tight text-xinergy-slate">
            {c.highlightLabel}
          </span>
        </div>
        <h3 className="mt-3 text-sm font-semibold leading-snug text-xinergy-charcoal">{c.title}</h3>
        <p className="mt-2 flex-1 line-clamp-2 text-xs leading-relaxed text-xinergy-slate">
          {c.challenge}
        </p>
        <Link
          href={`/casos/${c.slug}`}
          className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-xinergy-orange hover:underline"
        >
          {t("moreInfo")}
        </Link>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="card-premium flex overflow-hidden">
        <div className="flex w-20 flex-shrink-0 flex-col justify-center border-r border-xinergy-charcoal/8 bg-xinergy-charcoal px-3 py-5 text-center">
          <span className="brand-phrase text-xl text-xinergy-orange">{c.highlight}</span>
          <span className="mt-1 text-[8px] uppercase leading-tight text-white/45">
            {c.highlightLabel}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <span className="text-[10px] uppercase tracking-wider text-xinergy-beige">
            {c.industry} · {c.service}
          </span>
          <h3 className="mt-1.5 font-semibold text-xinergy-charcoal">{c.title}</h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-xinergy-slate">
            {c.challenge}
          </p>
          <Button
            href={`/casos/${c.slug}`}
            variant="secondary"
            className="mt-4 !px-4 !py-2 !text-[10px]"
          >
            {t("moreInfoShort")}
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-2xl border border-xinergy-charcoal/10 bg-white p-8 lg:p-10">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-xinergy-beige">
            {c.industry} · {c.service}
          </span>
          <h2 className="mt-2 text-2xl font-bold text-xinergy-charcoal lg:text-[1.65rem]">
            {c.title}
          </h2>
        </div>
        <div className="text-right">
          <span className="brand-phrase text-3xl text-xinergy-orange lg:text-4xl">
            {c.highlight}
          </span>
          <p className="mt-1 text-xs text-xinergy-slate">{c.highlightLabel}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-xinergy-orange">
            {t("challenge")}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-xinergy-slate">{c.challenge}</p>
        </div>
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-xinergy-orange">
            {t("approach")}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-xinergy-slate">{c.approach}</p>
        </div>
      </div>

      <div className="mt-8 border-t border-xinergy-charcoal/8 pt-8">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-xinergy-orange">
          {t("results")}
        </h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {c.results.map((result) => (
            <li key={result} className="flex gap-2 text-sm leading-relaxed text-xinergy-charcoal">
              <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-xinergy-orange" />
              {result}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-xinergy-charcoal/8 pt-8">
        <p className="max-w-md text-xs text-xinergy-slate">{t("similarCase")}</p>
        <Button href={contactHref("casos")} variant="primary" className="!px-6 !py-3 !text-xs">
          {t("letsTalk")}
        </Button>
      </div>
    </article>
  );
}
