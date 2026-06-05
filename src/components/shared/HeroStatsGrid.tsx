import { heroStats } from "@/lib/content";
import { ttForsDisplay } from "@/lib/fonts";

type HeroStatsGridProps = {
  variant?: "hero" | "band";
  className?: string;
};

export function HeroStatsGrid({ variant = "hero", className = "" }: HeroStatsGridProps) {
  const isBand = variant === "band";

  if (isBand) {
    return (
      <dl className={`divide-y divide-white/10 ${className}`}>
        {heroStats.map((s) => (
          <div key={s.label} className="flex items-start gap-4 py-3.5 first:pt-0 last:pb-0">
            <dt
              className={`${ttForsDisplay.className} brand-phrase w-[3.25rem] shrink-0 text-xl leading-none text-xinergy-orange`}
            >
              {s.value}
            </dt>
            <dd className="min-w-0 pt-0.5 text-[0.8125rem] leading-snug text-white/58">
              {s.label}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <dl
      className={`mt-10 hidden grid-cols-2 gap-x-4 gap-y-6 border-t border-white/10 pt-6 sm:mt-12 sm:gap-x-14 sm:gap-y-6 sm:pt-8 lg:mt-10 lg:flex lg:flex-wrap lg:pt-8 ${className}`}
    >
      {heroStats.map((s) => (
        <div key={s.label} className="min-w-0">
          <dt
            className={`${ttForsDisplay.className} brand-phrase text-2xl leading-none text-xinergy-orange sm:text-4xl lg:text-5xl xl:text-[3.25rem]`}
          >
            {s.value}
          </dt>
          <dd className="mt-1.5 max-w-[10rem] text-xs leading-snug text-white/55 sm:mt-2 sm:max-w-[12rem] sm:text-xs sm:text-white/50 lg:max-w-[13rem]">
            {s.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}
