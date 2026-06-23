"use client";

import { useSiteContent } from "@/hooks/useSiteContent";
import { ttForsDisplay } from "@/lib/fonts";

export function MessagingFramework({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const { messaging } = useSiteContent();
  const isDark = variant === "dark";

  return (
    <div
      className={`grid gap-5 lg:grid-cols-3 lg:grid-rows-[auto_auto] ${className}`}
    >
      {(["why", "what", "how"] as const).map((key) => {
        const block = messaging[key];
        return (
          <article
            key={key}
            className={`grid gap-4 rounded-2xl border p-6 lg:row-span-2 lg:grid-rows-subgrid ${
              isDark
                ? "border-white/10 bg-white/[0.04]"
                : "border-xinergy-charcoal/10 bg-white"
            }`}
          >
            <div className="flex flex-col">
              <h3
                className={`${ttForsDisplay.className} text-2xl font-semibold leading-tight lg:text-[1.75rem] ${
                  isDark ? "text-white" : "text-xinergy-charcoal"
                }`}
              >
                {block.title}
              </h3>
              <p
                className={`mt-3 type-body leading-relaxed ${
                  isDark ? "text-white/60" : "text-xinergy-slate"
                }`}
              >
                {block.intro}
              </p>
            </div>
            <ul
              className={`space-y-2.5 border-t pt-4 ${
                isDark ? "border-white/10" : "border-xinergy-charcoal/8"
              }`}
            >
              {block.points.map((point, i) => (
                <li
                  key={point}
                  className={`flex gap-3 type-body-sm leading-snug ${
                    isDark ? "text-white/72" : "text-xinergy-slate"
                  }`}
                >
                  <span
                    className={`${ttForsDisplay.className} w-7 flex-shrink-0 text-sm font-medium text-xinergy-orange`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
