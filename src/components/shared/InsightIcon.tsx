type InsightIconKey =
  | "partnership"
  | "technology"
  | "carbon-neutral"
  | "supply-chain"
  | "renewables";

type InsightIconProps = {
  icon: InsightIconKey;
  className?: string;
};

export function InsightIcon({ icon, className = "h-10 w-10" }: InsightIconProps) {
  const shared = `${className} text-xinergy-orange`;

  switch (icon) {
    case "partnership":
      return (
        <svg className={shared} viewBox="0 0 48 48" fill="none" aria-hidden>
          <path
            d="M16 22a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm16 0a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM8 38v-2a8 8 0 0 1 8-8h2M30 28h2a8 8 0 0 1 8 8v2M22 30h4v8h-4v-8Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "technology":
      return (
        <svg className={shared} viewBox="0 0 48 48" fill="none" aria-hidden>
          <rect x="8" y="10" width="32" height="22" rx="3" stroke="currentColor" strokeWidth="2.5" />
          <path d="M18 38h12M24 32v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path
            d="M16 20h6l2 4h8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="16" r="2" fill="currentColor" />
        </svg>
      );
    case "carbon-neutral":
      return (
        <svg className={shared} viewBox="0 0 48 48" fill="none" aria-hidden>
          <path
            d="M24 8c-8 6-14 12-14 20a14 14 0 0 0 28 0c0-8-6-14-14-20Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M18 26l4 4 8-10"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "supply-chain":
      return (
        <svg className={shared} viewBox="0 0 48 48" fill="none" aria-hidden>
          <circle cx="12" cy="24" r="5" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="36" cy="12" r="5" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="36" cy="36" r="5" stroke="currentColor" strokeWidth="2.5" />
          <path
            d="M17 22l14-8M17 26l14 8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "renewables":
      return (
        <svg className={shared} viewBox="0 0 48 48" fill="none" aria-hidden>
          <circle cx="24" cy="24" r="5" stroke="currentColor" strokeWidth="2.5" />
          <path
            d="M24 8v6M24 34v6M8 24h6M34 24h6M13 13l4.5 4.5M30.5 30.5 35 35M13 35l4.5-4.5M30.5 17.5 35 13"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M24 19v-3l4 2-4 2v-1Z"
            fill="currentColor"
          />
        </svg>
      );
  }
}

export type { InsightIconKey };
