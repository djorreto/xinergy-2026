"use client";

import { useEffect, useState } from "react";
import { ANNIVERSARY_START_ISO } from "@/lib/anniversary";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function diffTo(targetMs: number): Parts | null {
  const delta = targetMs - Date.now();
  if (delta <= 0) return null;
  const total = Math.floor(delta / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export function AnniversaryCountdown({
  daysLabel,
  hoursLabel,
  minutesLabel,
  secondsLabel,
  liveLabel,
}: {
  daysLabel: string;
  hoursLabel: string;
  minutesLabel: string;
  secondsLabel: string;
  liveLabel: string;
}) {
  const targetMs = Date.parse(ANNIVERSARY_START_ISO);
  const [parts, setParts] = useState<Parts | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const tick = () => setParts(diffTo(targetMs));
    tick();
    setReady(true);
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  if (!ready) {
    return (
      <div className="anniv-count" aria-hidden>
        {["—", "—", "—", "—"].map((value, i) => (
          <div key={i} className="anniv-tick">
            <span className="anniv-tick__value font-display">{value}</span>
            <span className="anniv-tick__label">&nbsp;</span>
          </div>
        ))}
      </div>
    );
  }

  if (!parts) {
    return (
      <p className="anniv-live font-display text-xl text-xinergy-orange sm:text-2xl">
        {liveLabel}
      </p>
    );
  }

  const units = [
    { value: pad(parts.days), label: daysLabel },
    { value: pad(parts.hours), label: hoursLabel },
    { value: pad(parts.minutes), label: minutesLabel },
    { value: pad(parts.seconds), label: secondsLabel },
  ];

  return (
    <div className="anniv-count" role="timer" aria-live="polite">
      {units.map((unit) => (
        <div key={unit.label} className="anniv-tick">
          <span className="anniv-tick__value font-display">{unit.value}</span>
          <span className="anniv-tick__label">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
