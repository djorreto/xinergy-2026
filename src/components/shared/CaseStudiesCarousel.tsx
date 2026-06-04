"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { cases } from "@/lib/content";
import { CaseStudyCard } from "@/components/shared/CaseStudyCard";

const INTERVAL_MS = 10_000;

function chunkCases<T>(items: readonly T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push([...items.slice(i, i + size)]);
  }
  return chunks;
}

type CarouselTrackProps = {
  slides: (typeof cases)[number][][];
  columns: 1 | 2 | 3;
  className?: string;
};

function CarouselTrack({ slides, columns, className }: CarouselTrackProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (target: number) => {
      setIndex(((target % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = window.setInterval(next, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [next, paused, slides.length]);

  const slideGridClass =
    columns === 3
      ? "grid w-full shrink-0 grid-cols-3 gap-4"
      : columns === 2
        ? "grid w-full shrink-0 grid-cols-2 gap-4"
        : "grid w-full shrink-0 grid-cols-1 gap-4";

  return (
    <div
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
          aria-live="polite"
        >
          {slides.map((group, slideIndex) => (
            <div key={slideIndex} className={slideGridClass}>
              {group.map((caseStudy) => (
                <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} variant="carousel" />
              ))}
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-xinergy-charcoal/15 text-xinergy-charcoal transition hover:border-xinergy-orange hover:text-xinergy-orange"
            aria-label="Casos anteriores"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2" role="tablist" aria-label="Casos de éxito">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Grupo de casos ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-5 bg-xinergy-orange"
                    : "w-1.5 bg-xinergy-charcoal/20 hover:bg-xinergy-charcoal/35"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-xinergy-charcoal/15 text-xinergy-charcoal transition hover:border-xinergy-orange hover:text-xinergy-orange"
            aria-label="Siguientes casos"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export function CaseStudiesCarousel() {
  const desktopSlides = useMemo(() => chunkCases(cases, 3), []);
  const tabletSlides = useMemo(() => chunkCases(cases, 2), []);
  const mobileSlides = useMemo(() => chunkCases(cases, 1), []);

  return (
    <>
      <CarouselTrack slides={desktopSlides} columns={3} className="hidden lg:block" />
      <CarouselTrack slides={tabletSlides} columns={2} className="hidden sm:block lg:hidden" />
      <CarouselTrack slides={mobileSlides} columns={1} className="sm:hidden" />
    </>
  );
}
