"use client";

import { useState } from "react";
import { brand, home } from "@/lib/content";

/** Carreras — enlace discreto en footer (estándar industria) */
export function CareersFooterLink() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-white/10 pt-5">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="text-xs font-medium text-white/45 transition hover:text-xinergy-orange"
      >
        {open ? "Cerrar · " : ""}
        {home.careers.title}
      </button>

      {open && (
        <div className="mt-4 max-w-md space-y-3 text-left">
          <p className="text-xs leading-relaxed text-white/55">{home.careers.intro}</p>
          <p className="text-xs text-white/45">
            {home.careers.emailLabel}{" "}
            <a
              href={`mailto:${brand.careersEmail}`}
              className="font-medium text-xinergy-orange hover:underline"
            >
              {brand.careersEmail}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
