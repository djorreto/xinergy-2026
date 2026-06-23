"use client";

import { useTranslations } from "next-intl";

const PEAK = { x: 80, y: 32 };
const MOUNTAIN_BACK = "M8 168 L52 88 L96 168 Z";
const MOUNTAIN =
  "M0 168 L0 118 Q18 100 38 72 L58 48 Q68 38 80 32 Q92 38 102 48 L122 72 Q142 100 160 118 L160 168 Z";
const RIDGE = "M38 72 L58 48 Q68 38 80 32 Q92 38 102 48 L122 72";
const SNOW =
  "M52 52 Q68 36 80 32 Q92 36 108 52 L96 58 Q80 44 64 58 Z";
const SNOW_HIGHLIGHT = "M68 40 Q80 34 92 40 L80 36 Z";
const TRAIL =
  "M14 158 C 32 138 48 118 58 98 C 66 82 72 58 80 32";
const TRAIL_ALONE =
  "M14 158 C 30 142 42 128 52 118";

type PanelMode = "alone" | "together";

function JourneyPanel({
  mode,
  label,
  caption,
}: {
  mode: PanelMode;
  label: string;
  caption: string;
}) {
  const id = `fj-${mode}`;

  return (
    <article className="fitness-journey__panel" data-mode={mode}>
      <p className="fitness-journey__label">{label}</p>

      <svg
        viewBox="0 0 160 168"
        className="fitness-journey__svg"
        aria-hidden
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id={`${id}-clip`}>
            <path d={MOUNTAIN} />
          </clipPath>
          <linearGradient id={`${id}-sky`} x1="80" y1="0" x2="80" y2="168">
            <stop offset="0%" stopColor="#3d3650" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2a2438" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-back`} x1="52" y1="88" x2="52" y2="168">
            <stop offset="0%" stopColor="#5a5470" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#3a3548" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id={`${id}-face-l`} x1="20" y1="40" x2="80" y2="168">
            <stop offset="0%" stopColor="#7a7488" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#4a4558" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id={`${id}-face-r`} x1="140" y1="40" x2="80" y2="168">
            <stop offset="0%" stopColor="#5c5668" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#353040" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id={`${id}-snow`} x1="80" y1="28" x2="80" y2="62">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#e8ecf4" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#c8ced8" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id={`${id}-rise`} x1="14" y1="158" x2="80" y2="32">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="50%" stopColor="#fca100" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fca100" />
          </linearGradient>
          <linearGradient id={`${id}-load`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e87060" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#e87060" stopOpacity="0.04" />
          </linearGradient>
          <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="160" height="168" fill={`url(#${id}-sky)`} />

        <path d={MOUNTAIN_BACK} fill={`url(#${id}-back)`} opacity="0.85" />
        <path d={`M0 168 L80 32 L160 168 Z`} fill={`url(#${id}-face-r)`} opacity="0.55" />
        <path d={`M0 168 L80 32 L0 118 Z`} fill={`url(#${id}-face-l)`} />
        <path d={MOUNTAIN} fill={`url(#${id}-face-l)`} opacity="0.15" />

        <g clipPath={`url(#${id}-clip)`}>
          <path d={SNOW} fill={`url(#${id}-snow)`} />
          <path d={SNOW_HIGHLIGHT} fill="rgba(255,255,255,0.55)" />
          <path
            d="M44 62 Q56 54 68 58 L64 64 Q54 60 44 62 Z"
            fill="rgba(255,255,255,0.18)"
          />
        </g>

        <path d={RIDGE} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75" />

        {mode === "alone" && (
          <path
            d="M14 158 C 30 142 42 128 52 118 L 14 158 Z"
            fill={`url(#${id}-load)`}
            className="fj-load fj-load--heavy"
          />
        )}

        <path
          d={TRAIL}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.25"
          strokeLinecap="round"
        />

        {mode === "alone" && (
          <>
            <path
              d={TRAIL_ALONE}
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeLinecap="round"
              pathLength={100}
              className="fj-path fj-path--slow"
            />
            <circle
              cx="48"
              cy="122"
              r="3"
              fill="rgba(255,200,190,0.95)"
              className="fj-client-wobble"
            />
          </>
        )}

        {mode === "together" && (
          <>
            <path
              d={TRAIL}
              fill="none"
              stroke={`url(#${id}-rise)`}
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength={100}
              className="fj-path fj-path--fast"
              filter={`url(#${id}-glow)`}
            />
            <circle
              cx={PEAK.x}
              cy={PEAK.y}
              r="14"
              fill="rgba(252,161,0,0.12)"
              className="fj-summit-glow"
            />
            <line
              x1={PEAK.x}
              y1={PEAK.y}
              x2={PEAK.x}
              y2="18"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="1.25"
            />
            <path
              d={`M${PEAK.x} 14 L${PEAK.x + 11} 19 L${PEAK.x} 24 L${PEAK.x - 11} 19 Z`}
              fill="#fca100"
            />
            <g className="fj-climb-pair">
              <circle r="2.75" fill="rgba(255,255,255,0.9)">
                <animateMotion
                  dur="5s"
                  repeatCount="indefinite"
                  path={TRAIL}
                  keyPoints="0;0.55;0.72;0.88;1"
                  keyTimes="0;0.35;0.55;0.75;1"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1"
                />
              </circle>
              <circle r="2.75" fill="#fca100">
                <animateMotion
                  dur="5s"
                  repeatCount="indefinite"
                  path={TRAIL}
                  keyPoints="0;0.48;0.65;0.82;0.95"
                  keyTimes="0;0.35;0.55;0.75;1"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1"
                />
              </circle>
            </g>
          </>
        )}
      </svg>

      <p className="fitness-journey__caption">{caption}</p>
    </article>
  );
}

export function FitnessJourneyPanels() {
  const t = useTranslations("ui.nosotros.fitnessJourney");

  return (
    <div className="fitness-journey" role="img" aria-label={t("ariaLabel")}>
      <JourneyPanel mode="alone" label={t("panel1Label")} caption={t("panel1Caption")} />
      <JourneyPanel mode="together" label={t("panel2Label")} caption={t("panel2Caption")} />
    </div>
  );
}
