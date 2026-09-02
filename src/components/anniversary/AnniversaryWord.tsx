"use client";

import { ttForsDisplay } from "@/lib/fonts";

const LETTERS = ["X", "I", "N", "E", "R", "G", "Y"] as const;

/** E oficial Xinergy: tres barritas. Vuelan, entra el 5, y al final las barritas vuelven. */
function XinergyEBars() {
  return (
    <svg className="anniv-e-bars" viewBox="0 0 72 84" aria-hidden>
      <rect width="72" height="12" rx="1" />
      <rect y="36" width="72" height="12" rx="1" />
      <rect y="72" width="72" height="12" rx="1" />
    </svg>
  );
}

export function AnniversaryWord({ onEncore }: { onEncore?: () => void }) {
  return (
    <button type="button" className="anniv-word-btn" onClick={onEncore} aria-label="Xinergy">
      <span className={`anniv-word ${ttForsDisplay.className}`}>
        {LETTERS.map((letter) =>
          letter === "E" ? (
            <span key="slot" className="anniv-slot">
              <span className="anniv-letter l-e">
                <XinergyEBars />
              </span>
              <span className="anniv-letter l-five">5</span>
            </span>
          ) : (
            <span key={letter} className={`anniv-letter l-${letter.toLowerCase()}`}>
              {letter}
            </span>
          ),
        )}
      </span>
    </button>
  );
}
