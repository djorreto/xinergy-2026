import Link from "next/link";

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
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={`${styles[variant]} ${className}`}>
      {children}
    </Link>
  );
}
