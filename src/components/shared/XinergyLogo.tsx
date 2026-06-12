import Image from "next/image";
import { Link } from "@/i18n/navigation";

/** Variantes oficiales Xinergy — PNG con alpha en /public/brand/ */
type Variant = "white" | "color" | "black";

const src: Record<Variant, string> = {
  white: "/brand/logo-white.png",
  color: "/brand/logo-color.png",
  black: "/brand/logo-black.png",
};

export function XinergyLogo({
  variant = "white",
  className = "",
  priority = false,
}: {
  /** white = header/footer oscuro; color/black = fondos claros */
  variant?: Variant;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link href="/" className={`relative block ${className}`} aria-label="Xinergy inicio">
      <Image
        src={src[variant]}
        alt="Xinergy"
        width={200}
        height={24}
        priority={priority}
        className="h-[1.375rem] max-w-[6.75rem] w-auto object-contain object-left sm:h-6 sm:max-w-none lg:h-8"
      />
    </Link>
  );
}
