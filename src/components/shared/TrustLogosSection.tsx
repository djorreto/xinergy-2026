"use client";

import { useState } from "react";
import { clientLogos } from "@/lib/clients";
import { partnerLogos } from "@/lib/partners";
import { LogoMarqueeStrip } from "@/components/shared/LogoMarqueeStrip";

const tabs = [
  {
    id: "clients" as const,
    label: "Clientes",
    title: "Organizaciones líderes en Latinoamérica.",
    logos: clientLogos,
    duration: 130,
  },
  {
    id: "partners" as const,
    label: "Partners",
    title: "Plataformas y partners con los que integramos e implementamos soluciones.",
    logos: partnerLogos,
    duration: 115,
  },
];

export function TrustLogosSection() {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("clients");
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <section className="border-y border-xinergy-charcoal/8 bg-xinergy-ivory py-12 lg:py-16 [--logo-fade:var(--xinergy-ivory)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex max-w-lg items-start gap-3 text-left text-sm leading-snug text-xinergy-charcoal sm:text-base">
            <span className="mt-2.5 h-px w-6 flex-shrink-0 bg-xinergy-orange" aria-hidden />
            {current.title}
          </p>
          <div
            className="inline-flex rounded-full border border-xinergy-charcoal/10 bg-white p-1"
            role="tablist"
            aria-label="Tipo de logos"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active === tab.id}
                onClick={() => setActive(tab.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  active === tab.id
                    ? "bg-xinergy-charcoal text-white"
                    : "text-xinergy-slate hover:text-xinergy-charcoal"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8" key={current.id}>
        <LogoMarqueeStrip logos={current.logos} duration={current.duration} />
      </div>
    </section>
  );
}
