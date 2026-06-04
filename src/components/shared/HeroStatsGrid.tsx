import { heroStats } from "@/lib/content";
import { ttForsDisplay } from "@/lib/fonts";

type HeroStatsGridProps = {
  variant?: "hero" | "band";
  className?: string;
};

export function HeroStatsGrid({ variant = "hero", className = "" }: HeroStatsGridProps) {
  const isBand = variant === "band";

  return (
    <dl
      className={
        isBand
          ? `grid grid-cols-2 gap-x-3 gap-y-5 ${className}`
          : `mt-10 hidden grid-cols-2 gap-x-4 gap-y-6 border-t border-white/10 pt-6 sm:mt-16 sm:gap-x-14 sm:gap-y-6 sm:pt-10 lg:mt-16 lg:flex lg:flex-wrap lg:pt-10 ${className}`
      }
    >
      {heroStats.map((s) => (
        <div key={s.label} className="min-w-0">
          <dt
            className={`${ttForsDisplay.className} brand-phrase text-lg text-xinergy-orange sm:text-3xl lg:text-4xl`}
          >
            {s.value}
          </dt>
          <dd
            className={`mt-1.5 leading-snug text-white/55 sm:mt-2 sm:text-xs sm:text-white/50 ${
              isBand ? "text-[0.6875rem] leading-snug" : "max-w-[10rem] text-xs sm:max-w-[12rem] lg:max-w-[13rem]"
            }`}
          >
            {s.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}
