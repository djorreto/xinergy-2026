"use client";

import { useTranslations } from "next-intl";

function CartoonDuck() {
  return (
    <svg className="anniv-duck__svg" viewBox="0 0 200 180" aria-hidden>
      <ellipse className="anniv-duck__shadow" cx="100" cy="168" rx="46" ry="8" />
      <g className="anniv-duck__body">
        <ellipse cx="72" cy="148" rx="18" ry="7" fill="#fca100" />
        <ellipse cx="112" cy="148" rx="18" ry="7" fill="#fca100" />
        <path d="M58 148h28l-6 10c-8 2-20-2-22-10z" fill="#e88900" />
        <path d="M98 148h28l-6 10c-8 2-20-2-22-10z" fill="#e88900" />

        <ellipse cx="94" cy="112" rx="52" ry="40" fill="#ffd54f" />
        <ellipse cx="78" cy="118" rx="18" ry="14" fill="#ffe27a" opacity="0.7" />

        <g className="anniv-duck__wing">
          <ellipse cx="52" cy="108" rx="22" ry="14" fill="#f5c431" transform="rotate(-18 52 108)" />
        </g>

        <circle cx="118" cy="62" r="34" fill="#ffe27a" />
        <circle cx="108" cy="78" r="10" fill="#ffd54f" />

        <ellipse cx="102" cy="78" rx="7" ry="4" fill="#ffb4c8" opacity="0.85" />
        <ellipse cx="138" cy="78" rx="7" ry="4" fill="#ffb4c8" opacity="0.85" />

        <g className="anniv-duck__eye">
          <ellipse cx="126" cy="54" rx="10" ry="11" fill="#fff" />
          <circle cx="129" cy="55" r="5" fill="#1b1408" />
          <circle cx="131" cy="53" r="1.6" fill="#fff" />
        </g>
        <path d="M116 42c6-8 18-8 22 0" fill="none" stroke="#1b1408" strokeWidth="3" strokeLinecap="round" />

        <g className="anniv-duck__beak">
          <ellipse cx="154" cy="68" rx="20" ry="9" fill="#fca100" />
          <ellipse cx="156" cy="66" rx="16" ry="4" fill="#ffb84a" />
          <path d="M138 68h32" stroke="#e88900" strokeWidth="1.6" />
        </g>

        <path d="M108 34c-2-16 10-28 26-22" fill="none" stroke="#fca100" strokeWidth="5" strokeLinecap="round" />
        <circle cx="136" cy="12" r="6" fill="#fca100" />
      </g>
    </svg>
  );
}

export function AnniversaryClosedDuck() {
  const t = useTranslations("ui.aniversario.closed");

  return (
    <aside className="anniv-closed" aria-live="polite">
      <div className="anniv-duck-stage">
        <p className="anniv-duck__bubble font-display">{t("cueck")}</p>
        <div className="anniv-duck">
          <CartoonDuck />
        </div>
      </div>
      <p className="anniv-closed__eyebrow">{t("eyebrow")}</p>
      <h2 className="anniv-closed__title font-display">{t("title")}</h2>
      <p className="anniv-closed__lead">{t("lead")}</p>
    </aside>
  );
}
