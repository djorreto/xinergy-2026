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
          ? "gradient-hero relative -mt-[4.25rem] min-h-[18rem] overflow-hidden pt-[4.25rem] text-white lg:min-h-[22rem]"
          : "border-b border-xinergy-charcoal/8 bg-xinergy-cream pt-[4.25rem]"
      }
    >
      {dark && <HeroMotion />}
      <Container className="relative z-10 py-16 lg:py-24">
        {eyebrow && (
          <p className={dark ? "label-editorial-light" : "label-editorial"}>{eyebrow}</p>
        )}
        <h1
          className={`${brandTitle ? ttForsDisplay.className : "font-display"} mt-4 max-w-3xl text-3xl leading-tight tracking-tight lg:text-5xl ${dark ? "text-white" : "text-xinergy-charcoal"}`}
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
