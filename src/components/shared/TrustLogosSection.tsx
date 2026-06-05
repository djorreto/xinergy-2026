"use client";

import { useState } from "react";
import { clientLogos } from "@/lib/clients";
import { partnerLogos } from "@/lib/partners";
import { LogoMarqueeStrip } from "@/components/shared/LogoMarqueeStrip";
import { SectionHeader } from "@/components/shared/SectionHeader";

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
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            key={current.id}
            eyebrow={current.label}
            title={current.title}
            className="max-w-lg"
            titleClassName="text-2xl sm:text-3xl lg:text-4xl"
          />
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
                className={`rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-wider transition max-lg:min-h-11 ${
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
