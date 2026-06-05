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
      className={`mt-10 hidden w-full border-t border-white/10 pt-6 lg:mt-8 lg:grid lg:grid-cols-5 lg:gap-4 lg:pt-6 xl:gap-6 ${className}`}
    >
      {heroStats.map((s) => (
        <div key={s.label} className="min-w-0">
          <dt
            className={`${ttForsDisplay.className} brand-phrase text-2xl leading-none text-xinergy-orange lg:text-3xl xl:text-4xl`}
          >
            {s.value}
          </dt>
          <dd className="mt-1.5 max-w-[10rem] text-xs leading-snug text-white/55 lg:mt-2 lg:max-w-none lg:pr-1 lg:text-[0.6875rem] xl:text-xs">
            {s.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}
