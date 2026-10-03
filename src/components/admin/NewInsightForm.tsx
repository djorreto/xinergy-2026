"use client";

import { useState, type FormEvent } from "react";
import { createNewsInsight } from "@/app/admin/insights/actions";

function LanguageChecks() {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-xinergy-charcoal">Idiomas del documento adjunto</legend>
      <p className="text-sm text-xinergy-slate">Puede ser uno o los tres. La página de Xinergy se publica igual en español, inglés y portugués.</p>
      {(
        [
          ["es", "Español"],
          ["en", "Inglés"],
          ["pt", "Portugués"],
        ] as const
      ).map(([value, label]) => (
        <label key={value} className="flex items-center gap-2 text-sm text-xinergy-charcoal">
          <input type="checkbox" name="languages" value={value} />
          {label}
        </label>
      ))}
    </fieldset>
  );
}

export function NewInsightForm() {
  const [kind, setKind] = useState<"noticia" | "documento" | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const chosen = new FormData(event.currentTarget).getAll("languages");
    if (!chosen.length) {
      setError("Marca al menos un idioma.");
      return;
    }
    setError(null);
    setPending(true);
    const response = await fetch("/api/admin/insights/from-pdf", {
      method: "POST",
      body: new FormData(event.currentTarget),
    });
    window.location.assign(response.url);
  }

  if (!kind) {
    return (
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setKind("noticia")}
          className="border border-xinergy-charcoal/15 bg-white p-5 text-left hover:border-xinergy-orange"
        >
          <span className="block font-semibold text-xinergy-charcoal">Noticia</span>
          <span className="mt-2 block text-sm text-xinergy-slate">Nota con imágenes, logos y texto. Sin PDF.</span>
        </button>
        <button
          type="button"
          onClick={() => setKind("documento")}
          className="border border-xinergy-charcoal/15 bg-white p-5 text-left hover:border-xinergy-orange"
        >
          <span className="block font-semibold text-xinergy-charcoal">Newsletter / Documento</span>
          <span className="mt-2 block text-sm text-xinergy-slate">Point of View con PDF. La imagen se puede ajustar después.</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button type="button" onClick={() => setKind(null)} className="text-sm text-xinergy-slate hover:text-xinergy-charcoal">
        ← Elegir otro tipo
      </button>
      {kind === "noticia" ? (
        <form action={createNewsInsight} className="mt-4 space-y-4">
          <p className="text-sm text-xinergy-slate">
            Después podrás cargar la imagen principal, logos y el texto. Si la nota salió en un diario, el enlace se agrega al editar.
          </p>
          <button type="submit" className="bg-xinergy-orange px-5 py-3 text-sm font-semibold text-white">
            Continuar
          </button>
        </form>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <p className="text-sm text-xinergy-slate">
            Sube el PDF y marca en qué idiomas está. Groq completa los textos. La imagen del insight se ajusta en el paso siguiente.
          </p>
          <LanguageChecks />
          <label className="block text-sm font-medium text-xinergy-charcoal">
            PDF
            <input
              type="file"
              name="pdf"
              accept="application/pdf,.pdf"
              required
              className="mt-2 block w-full text-sm text-xinergy-slate file:mr-4 file:border-0 file:bg-xinergy-charcoal file:px-4 file:py-2 file:text-sm file:text-white"
            />
          </label>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="bg-xinergy-orange px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Leyendo el PDF…" : "Continuar"}
          </button>
        </form>
      )}
    </div>
  );
}
