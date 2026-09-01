"use client";

type Props = {
  className?: string;
  ready?: boolean;
  isFive?: boolean;
  onReplay?: () => void;
};

/**
 * Wordmark Xinergy. La E naranja (≡) se cierra y se vuelve un 5.
 * El timing lo dirige la experiencia, no el mark.
 */
export function XinergyFiveMark({
  className = "",
  ready = true,
  isFive = false,
  onReplay,
}: Props) {
  return (
    <button
      type="button"
      className={`x5-mark-btn ${className}`}
      onClick={onReplay}
      aria-label="Xinergy 5"
    >
      <svg
        className={`x5-mark ${ready ? "is-ready" : ""} ${isFive ? "is-five" : ""}`}
        viewBox="0 0 760 120"
        role="img"
        aria-hidden
      >
        <title>Xinergy 5</title>
        <g fill="currentColor">
          <polygon points="22,18 36,18 58,52 50,52" />
          <polygon points="64,68 72,68 94,102 80,102" />
          <polygon points="80,18 94,18 58,68 50,68" />
          <polygon points="22,102 36,102 50,80 42,80" />
          <rect x="122" y="18" width="12" height="84" />
          <rect x="158" y="18" width="12" height="84" />
          <polygon points="176,24 188,24 232,96 220,96" />
          <rect x="230" y="18" width="12" height="84" />
        </g>
        <g className="x5-accent" fill="#fca100">
          <rect className="x5-bar" x="270" y="18" width="72" height="12" rx="1" />
          <rect className="x5-bar" x="270" y="54" width="72" height="12" rx="1" />
          <rect className="x5-bar" x="270" y="90" width="72" height="12" rx="1" />
          <rect className="x5-stem x5-stem-left" x="270" y="18" width="12" height="48" rx="1" />
          <rect className="x5-stem x5-stem-right" x="330" y="54" width="12" height="48" rx="1" />
        </g>
        <g fill="currentColor">
          <rect x="368" y="18" width="12" height="84" />
          <path d="M388 18 H424 A22 22 0 0 1 424 62 H388 V50 H418 A10 10 0 0 0 418 30 H388 Z" />
          <polygon points="412,62 426,62 456,102 440,102" />
          <path d="M548 22c-27.6 0-50 22.4-50 50s22.4 50 50 50c14.8 0 28.1-6.4 37.2-16.6l-9.2-7.7C569.4 105 559.3 110 548 110c-21 0-38-17-38-38s17-38 38-38c11.3 0 21.4 5 28 12.3l9.2-7.7C576.1 28.4 562.8 22 548 22z" />
          <rect x="548" y="54" width="26" height="12" />
          <polygon points="604,18 618,18 640,54 632,54" />
          <polygon points="662,18 676,18 640,68 628,68" />
          <rect x="634" y="62" width="12" height="40" />
        </g>
      </svg>
    </button>
  );
}
