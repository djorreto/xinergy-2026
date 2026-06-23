"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function parseStatValue(value: string) {
  const match = value.match(/^([\d.]+)(.*)$/);
  if (!match) return null;
  const raw = match[1];
  return {
    target: parseFloat(raw),
    suffix: match[2],
    decimals: raw.includes(".") ? raw.split(".")[1].length : 0,
  };
}

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function AnimatedStatNumber({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const parsed = useMemo(() => parseStatValue(value), [value]);
  const [display, setDisplay] = useState(() =>
    parsed ? `${parsed.decimals > 0 ? "0.0" : "0"}${parsed.suffix}` : value,
  );
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!parsed || !ref.current) {
      setDisplay(value);
      return;
    }

    const el = ref.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const duration = 1600;
        const start = performance.now();
        const { target, suffix, decimals } = parsed;

        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const current = easeOutExpo(t) * target;
          const formatted =
            decimals > 0 ? current.toFixed(decimals) : String(Math.round(current));
          setDisplay(`${formatted}${suffix}`);
          if (t < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [parsed, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
