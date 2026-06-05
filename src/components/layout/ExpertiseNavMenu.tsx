"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { capabilities, home } from "@/lib/content";
import { ttForsDisplay } from "@/lib/fonts";

type ExpertiseNavMenuProps = {
  useSolidHeader: boolean;
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
};

export function ExpertiseNavMenu({
  useSolidHeader,
  onNavigate,
  variant = "desktop",
}: ExpertiseNavMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || variant === "mobile") return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open, variant]);

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  const triggerClass =
    variant === "desktop"
      ? `inline-flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium tracking-wide transition ${
          useSolidHeader
            ? "text-xinergy-slate hover:text-xinergy-charcoal"
            : "text-white/80 hover:text-white"
        } ${open ? (useSolidHeader ? "!text-xinergy-charcoal" : "!text-white") : ""}`
      : "flex w-full min-h-11 items-center justify-between py-3 text-sm font-semibold text-xinergy-charcoal";

  if (variant === "mobile") {
    return (
      <div ref={rootRef} className="mb-2 border-b border-xinergy-charcoal/8 pb-3">
        <button
          type="button"
          className={triggerClass}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          Expertise
          <svg
            className={`h-4 w-4 shrink-0 transition ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="mt-2 space-y-1 rounded-xl bg-xinergy-cream px-2 py-3">
              {capabilities.map((cap, i) => (
                <Link
                  key={cap.title}
                  href={cap.href}
                  className="flex gap-3 rounded-lg px-3 py-3 active:bg-white"
                  onClick={close}
                >
                  <span
                    className={`${ttForsDisplay.className} brand-phrase w-7 shrink-0 text-lg text-xinergy-orange`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="text-sm font-medium leading-snug text-xinergy-charcoal">
                      {cap.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-xinergy-slate">
                      {cap.description}
                    </span>
                  </span>
                </Link>
              ))}
              <Link
                href="/servicios"
                className="mt-1 block rounded-lg px-3 py-3 text-xs font-semibold uppercase tracking-wider text-xinergy-orange active:bg-white"
                onClick={close}
              >
                Ver todas las líneas →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        Expertise
        <svg
          className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute left-1/2 top-full z-50 mt-3 w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-xinergy-charcoal/10 bg-white p-6 shadow-xl shadow-xinergy-charcoal/10"
          role="menu"
        >
          <div className="mb-4 border-b border-xinergy-charcoal/8 pb-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-xinergy-beige">
              {home.capabilities.title}
            </p>
            <p className="mt-1 text-sm font-semibold text-xinergy-charcoal">
              {home.capabilities.headline}
            </p>
            <p className="mt-1 text-xs text-xinergy-slate">{home.capabilities.intro}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {capabilities.map((cap, i) => (
              <Link
                key={cap.title}
                href={cap.href}
                role="menuitem"
                className="group flex gap-3 rounded-xl border border-transparent p-3 transition hover:border-xinergy-charcoal/10 hover:bg-xinergy-cream"
                onClick={close}
              >
                <span
                  className={`${ttForsDisplay.className} brand-phrase w-8 flex-shrink-0 text-xl text-xinergy-orange`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="text-sm font-semibold leading-snug text-xinergy-charcoal group-hover:text-xinergy-orange">
                    {cap.title}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-xinergy-slate">
                    {cap.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-xinergy-charcoal/8 pt-4">
            <Link
              href="/#expertise"
              className="text-xs text-xinergy-slate hover:text-xinergy-charcoal"
              onClick={close}
            >
              Ver en la portada
            </Link>
            <Link
              href="/servicios"
              className="text-xs font-semibold uppercase tracking-wider text-xinergy-orange hover:underline"
              onClick={close}
            >
              Todas las líneas →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
