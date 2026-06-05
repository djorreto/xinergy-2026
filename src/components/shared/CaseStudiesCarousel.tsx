"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cases } from "@/lib/content";
import { CaseStudyCarouselCard } from "@/components/shared/CaseStudyCarouselCard";

const INTERVAL_MS = 10_000;
const SWIPE_THRESHOLD = 48;

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
  const touchStartX = useRef<number | null>(null);

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

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    setPaused(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX;
    if (endX === undefined) return;
    const delta = endX - touchStartX.current;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      goTo(index + (delta < 0 ? 1 : -1));
    }
    touchStartX.current = null;
    setPaused(false);
  };

  return (
    <div
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="overflow-hidden touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
          aria-live="polite"
        >
          {slides.map((group, slideIndex) => (
            <div key={slideIndex} className={slideGridClass}>
              {group.map((caseStudy) => (
                <CaseStudyCarouselCard key={caseStudy.slug} caseStudy={caseStudy} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-xinergy-charcoal/15 text-xinergy-charcoal transition hover:border-xinergy-orange hover:text-xinergy-orange"
            aria-label="Casos anteriores"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-1" role="tablist" aria-label="Casos de éxito">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Grupo de casos ${i + 1}`}
                onClick={() => goTo(i)}
                className="flex min-h-11 min-w-11 items-center justify-center p-3"
              >
                <span
                  className={`block rounded-full transition-all ${
                    i === index
                      ? "h-2 w-5 bg-xinergy-orange"
                      : "h-2 w-2 bg-xinergy-charcoal/20"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-xinergy-charcoal/15 text-xinergy-charcoal transition hover:border-xinergy-orange hover:text-xinergy-orange"
            aria-label="Siguientes casos"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
