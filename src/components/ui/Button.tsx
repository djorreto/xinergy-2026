import { Link } from "@/i18n/navigation";

type Variant = "primary" | "secondary" | "light" | "ghost";

const styles: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  light: "btn-light",
  ghost:
    "inline-flex items-center text-sm font-semibold uppercase tracking-wide text-xinergy-orange hover:text-xinergy-orange-dark",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  gaCta,
  gaLocation,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  /** Nombre del CTA en GA4 (evento cta_click). Por defecto usa el texto del botón. */
  gaCta?: string;
  /** Ubicación del CTA en la página (hero, header, footer, etc.). */
  gaLocation?: string;
}) {
  return (
    <Link
      href={href}
      className={`${styles[variant]} ${className}`}
      data-ga-cta={gaCta ?? ""}
      data-ga-location={gaLocation}
    >
      {children}
    </Link>
  );
}
