"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import type { FAQ } from "@/lib/content";

export function FAQSection({
  items,
  title = "Preguntas frecuentes",
  subtitle = "Respuestas concisas para equipos de compras y finanzas",
}: {
  items: readonly FAQ[];
  title?: string;
  subtitle?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section-pad bg-xinergy-ivory">
      <Container>
        <p className="label-editorial">{title}</p>
        <h2 className="font-display mt-3 max-w-xl text-3xl text-xinergy-charcoal lg:text-4xl">
          {subtitle}
        </h2>
        <div className="mt-12 divide-y divide-xinergy-charcoal/10 border border-xinergy-charcoal/10 bg-white">
          {items.map((item, i) => (
            <div key={item.q}>
              <button
                type="button"
                className="flex w-full items-start justify-between gap-6 px-6 py-5 text-left transition hover:bg-xinergy-cream/50 lg:px-8"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="text-sm font-semibold text-xinergy-charcoal lg:text-base">
                  {item.q}
                </span>
                <span
                  className={`mt-1 flex-shrink-0 text-xl leading-none text-xinergy-orange transition ${
                    open === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              {open === i && (
                <p className="border-t border-xinergy-charcoal/6 px-6 pb-6 text-sm leading-relaxed text-xinergy-slate lg:px-8">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
