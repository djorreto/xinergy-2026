import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { ttForsDisplay } from "@/lib/fonts";

export function PageHero({
  eyebrow,
  title,
  description,
  dark = false,
  brandTitle = false,
  titleClassName = "",
  visual,
  after,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  dark?: boolean;
  /** Usa TT Fors Display (claim, titulares de marca) */
  brandTitle?: boolean;
  titleClassName?: string;
  /** Ilustración o animación en el lateral (desktop) */
  visual?: ReactNode;
  /** Contenido debajo del hero, en el mismo bloque oscuro */
  after?: ReactNode;
}) {
  const hasVisual = Boolean(visual);
  const hasAfter = Boolean(after);

  return (
    <section
      className={
        dark
          ? `gradient-hero hero-offset relative overflow-hidden text-white ${hasVisual ? "min-h-[20rem] lg:min-h-[26rem]" : hasAfter ? "" : "min-h-[18rem] lg:min-h-[22rem]"}`
          : "page-offset border-b border-xinergy-charcoal/8 bg-xinergy-cream"
      }
    >
      {dark && !hasVisual && <div className="hero-motion hero-motion--static" aria-hidden />}
      <Container
        className={`relative z-10 ${hasAfter ? "pb-6 pt-12 sm:pb-8 sm:pt-16 lg:pb-10 lg:pt-20" : "py-12 sm:py-16 lg:py-20 xl:py-24"} ${hasVisual ? "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,42%)] lg:items-center lg:gap-10 xl:gap-14" : ""}`}
      >
        <div className={hasVisual ? "relative z-10" : undefined}>
          {eyebrow && (
            <p className={dark ? "label-editorial-light" : "label-editorial"}>{eyebrow}</p>
          )}
          <h1
            className={`${brandTitle ? ttForsDisplay.className : "font-display"} mt-3 max-w-3xl text-balance leading-[1.12] tracking-tight sm:mt-4 ${
              dark ? "text-white" : "text-xinergy-charcoal"
            } ${titleClassName || "text-[length:var(--type-hero)]"}`}
          >
            {title}
          </h1>
          {description && (
            <p
              className={`type-lead mt-5 max-w-2xl ${dark ? "text-white/70" : "text-xinergy-slate"}`}
            >
              {description}
            </p>
          )}
        </div>
        {hasVisual && (
          <div className="page-hero-visual mt-8 lg:mt-0">{visual}</div>
        )}
        {hasAfter && <div className="col-span-full">{after}</div>}
      </Container>
    </section>
  );
}
