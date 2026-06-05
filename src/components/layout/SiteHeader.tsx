"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { nav } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { XinergyLogo } from "@/components/shared/XinergyLogo";
import { ExpertiseNavMenu } from "@/components/layout/ExpertiseNavMenu";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isOverlayHero =
    pathname === "/" || pathname === "/diagnostico";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // En home/diagnóstico: header oscuro transparente hasta hacer scroll
  const useSolidHeader = scrolled || !isOverlayHero;

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        useSolidHeader
          ? "border-b border-xinergy-charcoal/8 bg-white/95 shadow-sm backdrop-blur-md"
          : "border-b border-white/10 bg-xinergy-charcoal/40 backdrop-blur-sm"
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
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3.5 py-2 text-[13px] font-medium tracking-wide transition ${
                useSolidHeader
                  ? "text-xinergy-slate hover:text-xinergy-charcoal"
                  : "text-white/80 hover:text-white"
              } ${
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? useSolidHeader
                    ? "!text-xinergy-charcoal"
                    : "!text-white"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
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
          className={`lg:hidden ${useSolidHeader ? "text-xinergy-charcoal" : "text-white"}`}
          onClick={() => setOpen(!open)}
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

      {open && (
        <div className="border-t border-xinergy-charcoal/10 bg-white px-6 py-6 lg:hidden">
          <ExpertiseNavMenu
            useSolidHeader
            variant="mobile"
            onNavigate={() => setOpen(false)}
          />
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2.5 text-sm font-medium text-xinergy-charcoal"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-3">
            <Button href="/contacto" variant="primary">
              Contacto
            </Button>
            <Button href="/diagnostico" variant="secondary">
              Calcular eficiencias
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
