"use client";

import { ttForsDisplay } from "@/lib/fonts";

const LETTERS = ["X", "I", "N", "E", "R", "G", "Y"] as const;

/** Una letra = un glifo de TT Fors Display. La E naranja sale volando; el 5 entra después. */
export function AnniversaryWord({ onEncore }: { onEncore?: () => void }) {
  return (
    <button type="button" className="anniv-word-btn" onClick={onEncore} aria-label="Xinergy">
      <span className={`anniv-word ${ttForsDisplay.className}`}>
        {LETTERS.map((letter) =>
          letter === "E" ? (
            <span key="slot" className="anniv-slot">
              <span className="anniv-letter l-e">E</span>
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
