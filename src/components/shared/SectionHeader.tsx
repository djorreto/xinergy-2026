type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
  titleClassName?: string;
};

/** Eyebrow (línea naranja + caps) → título → intro — patrón editorial sitewide */
export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = "left",
  dark = false,
  className = "",
  titleClassName = "",
}: SectionHeaderProps) {
  const centered = align === "center";
  const labelClass = dark ? "label-editorial-light" : "label-editorial";

  return (
    <header
      className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      <p
        className={`${labelClass} ${centered ? "inline-flex items-center justify-center" : ""}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-display mt-3 text-balance leading-tight ${
          dark ? "text-white" : "text-xinergy-charcoal"
        } ${centered ? "mx-auto" : ""} ${titleClassName || "text-[length:var(--type-section)]"}`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`type-body mt-4 ${
            dark ? "text-white/65" : "text-xinergy-slate"
          } ${centered ? "mx-auto max-w-md" : "max-w-xl"}`}
        >
          {intro}
        </p>
      )}
    </header>
  );
}
