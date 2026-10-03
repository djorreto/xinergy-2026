import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import type { AvailabilityNote } from "@/lib/insights/languages";
import type { ImageSize } from "@/lib/insights/types";

export function InsightCoverLayout({
  eyebrow,
  title,
  description,
  coverUrl,
  imageSize,
  availability,
  after,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  coverUrl: string | null;
  imageSize: ImageSize;
  availability?: AvailabilityNote | null;
  after?: ReactNode;
  children: ReactNode;
}) {
  const smallCover = imageSize === "sm" && coverUrl;

  return (
    <>
      <section className="page-offset border-b border-xinergy-charcoal/8 bg-xinergy-cream">
        <Container className="max-w-3xl py-12 sm:py-16 lg:py-20">
          <div className="flex items-start justify-between gap-4">
            {eyebrow ? <p className="label-editorial">{eyebrow}</p> : <span />}
            {smallCover ? (
              <img src={coverUrl} alt="" className="h-16 w-12 shrink-0 rounded-lg object-cover shadow-sm sm:h-20 sm:w-16" />
            ) : null}
          </div>
          <h1 className="font-display mt-3 max-w-3xl text-balance text-[length:var(--type-hero)] leading-[1.12] tracking-tight text-xinergy-charcoal sm:mt-4">
            {title}
          </h1>
          {description ? <p className="type-lead mt-5 max-w-2xl text-xinergy-slate">{description}</p> : null}
          {availability?.items.length ? (
            <p className="mt-5 inline-block max-w-full border border-xinergy-charcoal/15 bg-white px-3 py-2 text-sm font-semibold text-xinergy-charcoal">
              {availability.prefix}{" "}
              {availability.items.map((item, index) => {
                const last = index === availability.items.length - 1;
                const lead = index === 0 ? "" : last ? ` ${availability.conjunction} ` : ", ";
                return (
                  <span key={item.label}>
                    {lead}
                    {item.href ? (
                      <a href={item.href} className="underline decoration-xinergy-orange underline-offset-2" target="_blank" rel="noopener noreferrer">
                        {item.label}
                      </a>
                    ) : (
                      item.label
                    )}
                  </span>
                );
              })}
              .
            </p>
          ) : null}
        </Container>
      </section>
      <section className="py-10 sm:py-16">
        <Container className={imageSize === "md" && coverUrl ? "max-w-5xl" : "max-w-3xl"}>
          {imageSize === "md" && coverUrl ? (
            <div className="grid items-start gap-8 md:grid-cols-[minmax(11rem,18rem)_minmax(0,1fr)] md:gap-10">
              <img src={coverUrl} alt="" className="mx-auto w-full max-w-sm rounded-2xl md:max-w-none" />
              <div className="text-lg leading-relaxed md:text-xl md:leading-8">{children}</div>
            </div>
          ) : (
            <div className="text-lg leading-relaxed">
              {imageSize === "lg" && coverUrl ? <img src={coverUrl} alt="" className="mb-8 w-full rounded-2xl" /> : null}
              {children}
            </div>
          )}
          {after ? <div className="mx-auto mt-14 w-full">{after}</div> : null}
        </Container>
      </section>
    </>
  );
}
