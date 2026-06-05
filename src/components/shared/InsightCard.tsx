import Link from "next/link";
import { InsightIcon, type InsightIconKey } from "@/components/shared/InsightIcon";

type InsightItem = {
  slug: string;
  type: string;
  title: string;
  excerpt: string;
  tag: string;
  icon: InsightIconKey;
};

type InsightCardProps = {
  item: InsightItem;
  compact?: boolean;
};

export function InsightCard({ item, compact = false }: InsightCardProps) {
  return (
    <Link
      href={`/insights/${item.slug}`}
      className="card-hover group flex w-full flex-col gap-4 rounded-2xl border border-xinergy-charcoal/10 bg-white p-5 transition sm:flex-row sm:gap-6 sm:p-6 lg:gap-8 lg:p-8"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-xinergy-cream sm:h-20 sm:w-20 lg:h-24 lg:w-24">
        <InsightIcon
          icon={item.icon}
          className="h-7 w-7 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
        />
      </div>

      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-xinergy-orange sm:text-xs">
          {item.type}
        </span>
        <h2
          className={`mt-2 font-semibold leading-snug text-balance text-xinergy-charcoal group-hover:text-xinergy-orange ${
            compact ? "text-base sm:text-lg" : "text-lg sm:text-xl lg:text-2xl"
          }`}
        >
          {item.title}
          <span className="ml-1 inline text-xinergy-orange sm:hidden" aria-hidden>
            →
          </span>
        </h2>
        {!compact && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-xinergy-slate lg:mt-3 lg:text-base">
            {item.excerpt}
          </p>
        )}
        <span className="mt-3 inline-block rounded-full bg-xinergy-ivory px-2.5 py-1 text-[10px] text-xinergy-slate sm:text-xs">
          {item.tag}
        </span>
      </div>

      <div className="hidden shrink-0 items-center self-center text-xinergy-charcoal/25 transition group-hover:text-xinergy-orange sm:flex">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
