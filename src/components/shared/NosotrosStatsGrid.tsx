"use client";

import { useSiteContent } from "@/hooks/useSiteContent";
import { ttForsDisplay } from "@/lib/fonts";
import { AnimatedStatNumber } from "@/components/shared/AnimatedStatNumber";

const popDelays = ["stat-pop-delay-0", "stat-pop-delay-1", "stat-pop-delay-2", "stat-pop-delay-3", "stat-pop-delay-4"];

export function NosotrosStatsGrid() {
  const { stats } = useSiteContent();

  return (
    <dl className="grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="rounded-2xl border border-xinergy-charcoal/10 bg-xinergy-cream p-5 sm:p-6 lg:p-7"
        >
          <dt
            className={`${ttForsDisplay.className} brand-phrase stat-pop leading-none text-xinergy-orange ${popDelays[i % popDelays.length]} text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl`}
          >
            <AnimatedStatNumber value={s.value} />
          </dt>
          <dd className="type-body-sm mt-2.5 leading-snug text-xinergy-slate sm:mt-3 lg:leading-relaxed">
            {s.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}
