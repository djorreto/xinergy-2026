"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { nav } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { XinergyLogo } from "@/components/shared/XinergyLogo";
import { ExpertiseNavMenu } from "@/components/layout/ExpertiseNavMenu";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isOverlayHero =
    pathname === "/" || pathname === "/diagnostico";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // En home/diagnóstico: header oscuro transparente hasta hacer scroll
  const useSolidHeader = scrolled || !isOverlayHero;

  const mobileMenu =
    open && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[200] lg:hidden">
            <button
              type="button"
              className="absolute inset-x-0 bottom-0 top-[calc(var(--site-header-height,3.5rem)+env(safe-area-inset-top,0px))] bg-xinergy-charcoal/60"
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
            />
            <nav
              className="absolute inset-x-0 bottom-0 top-[calc(var(--site-header-height,3.5rem)+env(safe-area-inset-top,0px))] flex max-h-[calc(100dvh-var(--site-header-height,3.5rem)-env(safe-area-inset-top,0px))] flex-col overflow-y-auto overscroll-contain border-t border-xinergy-charcoal/10 bg-white px-6 py-5 shadow-2xl"
              aria-label="Navegación móvil"
            >
              <ExpertiseNavMenu
                useSolidHeader
                variant="mobile"
                onNavigate={() => setOpen(false)}
              />
              {nav.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-xinergy-orange ${
                      isActive
                        ? "text-xinergy-charcoal ring-1 ring-xinergy-orange"
                        : "text-xinergy-charcoal"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-auto flex flex-col gap-3 border-t border-xinergy-charcoal/8 pt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <Button href="/contacto" variant="primary" className="w-full justify-center">
                  Contacto
                </Button>
                <Button href="/diagnostico" variant="secondary" className="w-full justify-center">
                  Calcular eficiencias
                </Button>
              </div>
            </nav>
          </div>,
          document.body,
        )
      : null;

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 transition-all duration-300 ${
        open ? "z-[210]" : "z-50"
      } ${
        useSolidHeader
          ? "border-b border-xinergy-charcoal/8 bg-white/95 shadow-sm backdrop-blur-md"
          : "border-b border-white/10 bg-xinergy-charcoal/95 backdrop-blur-md max-lg:shadow-sm lg:bg-xinergy-charcoal/40"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex h-[var(--site-header-height,3.5rem)] max-w-7xl items-center justify-between px-5 sm:h-[4.25rem] sm:px-6 lg:px-10">
        <XinergyLogo
          variant={useSolidHeader ? "color" : "white"}
          className="relative z-10"
          priority
        />

        <nav className="hidden items-center lg:flex">
          <ExpertiseNavMenu useSolidHeader={useSolidHeader} />
          {nav.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded px-3.5 py-2 text-[13px] font-medium tracking-wide transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-xinergy-orange ${
                useSolidHeader
                  ? "text-xinergy-slate hover:text-xinergy-charcoal"
                  : "text-white/80 hover:text-white"
              } ${
                isActive
                  ? useSolidHeader
                    ? "ring-1 ring-xinergy-orange !text-xinergy-charcoal"
                    : "ring-1 ring-xinergy-orange !text-white"
                  : ""
              }`}
            >
              {item.label}
            </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            href="/diagnostico"
            variant={useSolidHeader ? "secondary" : "light"}
            className="!px-4 !py-2.5 !text-[11px]"
          >
            Calcular eficiencias
          </Button>
          <Button href="/contacto" variant="primary" className="!px-5 !py-2.5 !text-[11px]">
            Contacto
          </Button>
        </div>

        <button
          type="button"
          className={`flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2.5 -mr-1 lg:hidden ${
            useSolidHeader ? "text-xinergy-charcoal" : "text-white"
          }`}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Menú"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileMenu}
    </header>
  );
}
