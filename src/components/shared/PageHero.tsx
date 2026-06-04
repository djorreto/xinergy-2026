import { Container } from "@/components/ui/Container";
import { HeroMotion } from "@/components/shared/HeroMotion";
import { ttForsDisplay } from "@/lib/fonts";

export function PageHero({
  eyebrow,
  title,
  description,
  dark = false,
  brandTitle = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  dark?: boolean;
  /** Usa TT Fors Display (claim, titulares de marca) */
  brandTitle?: boolean;
}) {
  return (
    <section
      className={
        dark
          ? "gradient-hero hero-offset relative min-h-[18rem] overflow-hidden text-white lg:min-h-[22rem]"
          : "page-offset border-b border-xinergy-charcoal/8 bg-xinergy-cream"
      }
    >
      {dark && <HeroMotion />}
      <Container className="relative z-10 py-12 sm:py-16 lg:py-24">
        {eyebrow && (
          <p className={dark ? "label-editorial-light" : "label-editorial"}>{eyebrow}</p>
        )}
        <h1
          className={`${brandTitle ? ttForsDisplay.className : "font-display"} mt-3 max-w-3xl text-[1.75rem] leading-[1.12] tracking-tight sm:mt-4 sm:text-3xl lg:text-5xl ${dark ? "text-white" : "text-xinergy-charcoal"}`}
        >
          {title}
        </h1>
        {description && (
          <p
            className={`mt-5 max-w-2xl text-base leading-relaxed ${dark ? "text-white/65" : "text-xinergy-slate"}`}
          >
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
