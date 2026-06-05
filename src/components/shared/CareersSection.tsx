"use client";

import { useState } from "react";
import { brand, home } from "@/lib/content";
import { Container } from "@/components/ui/Container";

export function CareersSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="section-pad bg-white">
      <Container>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            className="btn-secondary"
          >
            {open ? "Cerrar" : home.careers.title}
          </button>
        </div>

        {open && (
          <div className="mt-10 grid items-center gap-10 border-t border-xinergy-charcoal/8 pt-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="label-editorial">Equipo</p>
              <h2 className="font-display mt-3 text-3xl text-xinergy-charcoal lg:text-4xl">
                {home.careers.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-xinergy-slate lg:text-base">
                {home.careers.intro}
              </p>
            </div>
            <div className="lg:text-right">
              <p className="text-sm text-xinergy-slate">{home.careers.emailLabel}</p>
              <a
                href={`mailto:${brand.careersEmail}`}
                className="mt-2 inline-block text-xl font-semibold text-xinergy-orange hover:underline sm:text-2xl"
              >
                {brand.careersEmail}
              </a>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
