"use client";

import { useState } from "react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { ttForsDisplay } from "@/lib/fonts";

type HeroStatsGridProps = {
  variant?: "hero" | "band";
  className?: string;
};

const popDelays = ["stat-pop-delay-0", "stat-pop-delay-1", "stat-pop-delay-2", "stat-pop-delay-3", "stat-pop-delay-4"];

function StatCard({
  value,
  label,
  detail,
  index,
  size,
}: {
  value: string;
  label: string;
  detail?: string;
  index: number;
  size: "band" | "hero";
}) {
  const [open, setOpen] = useState(false);

  const numberClass =
    size === "hero"
      ? "text-4xl sm:text-5xl lg:text-5xl xl:text-6xl"
      : "text-4xl sm:text-[2.75rem]";

  return (
    <div
      role="listitem"
      tabIndex={0}
      aria-expanded={open}
      className={`stat-card group ${open ? "is-active" : ""}`}
      onClick={() => setOpen((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((v) => !v);
        }
      }}
    >
      <p
        className={`${ttForsDisplay.className} brand-phrase stat-pop leading-none text-xinergy-orange ${popDelays[index]} ${numberClass}`}
      >
        {value}
      </p>
      <p className="mt-2 text-[0.8125rem] leading-snug text-white/62 sm:mt-2.5 lg:text-xs xl:text-[0.8125rem]">
        {label}
      </p>
      {detail && <p className="stat-card-detail text-xs leading-relaxed text-white/48">{detail}</p>}
    </div>
  );
}

export function HeroStatsGrid({ variant = "hero", className = "" }: HeroStatsGridProps) {
  const { heroStats } = useSiteContent();
  const isBand = variant === "band";

  if (isBand) {
    return (
      <div
        className={`grid grid-cols-2 gap-3 sm:gap-4 [&>div:last-child:nth-child(odd)]:col-span-2 ${className}`}
        role="list"
      >
        {heroStats.map((s, i) => (
          <StatCard
            key={s.label}
            value={s.value}
            label={s.label}
            detail={s.detail}
            index={i}
            size="band"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`mt-10 hidden w-full border-t border-white/10 pt-6 lg:mt-8 lg:grid lg:grid-cols-5 lg:gap-3 lg:pt-6 xl:gap-4 ${className}`}
      role="list"
    >
      {heroStats.map((s, i) => (
        <StatCard
          key={s.label}
          value={s.value}
          label={s.label}
          detail={s.detail}
          index={i}
          size="hero"
        />
      ))}
    </div>
  );
}
