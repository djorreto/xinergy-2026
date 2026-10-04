"use client";

import { useState } from "react";
import { EXECUTIVE_THEMES, briefIsStale, type StoredBrief } from "@/lib/surveys/executive";

const dateFormat = new Intl.DateTimeFormat("es-CL", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Santiago",
});

export function ExecutiveBriefPanel({ initial, responses }: { initial: StoredBrief | null; responses: { createdAt: string }[] }) {
  const [brief, setBrief] = useState<StoredBrief | null>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const stale = briefIsStale(brief, responses);
  const canWrite = responses.length > 0 && stale;

  async function generate() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/surveys/radar-compras-2027/brief", { method: "POST" });
      const payload = (await response.json()) as { ok?: boolean; brief?: StoredBrief };
      if (!response.ok || !payload.brief) {
        setError("No se pudo generar el análisis. Intenta otra vez.");
        setBusy(false);
        return;
      }
      setBrief(payload.brief);
    } catch {
      setError("No se pudo generar el análisis. Intenta otra vez.");
    }
    setBusy(false);
  }

  return (
    <section className="border border-xinergy-charcoal/10 bg-white p-5 sm:p-7">
      <p className="label-editorial">Vista ejecutiva · preliminar</p>
      <h2 className="mt-2 font-display text-2xl text-xinergy-charcoal">Lo que diríamos hoy</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-xinergy-slate">
        Esta es la lectura para el CEO de Xinergy y el esqueleto de lo que después se les cuenta a quienes respondieron. Las cifras de más abajo son el cálculo. Este texto se escribe una vez y se mantiene hasta que llegue una respuesta nueva.
      </p>

      {canWrite ? (
        <button type="button" className="btn-primary mt-5" onClick={generate} disabled={busy}>
          {busy ? "Generando el análisis…" : brief ? "Regenerar análisis preliminar con AI" : "Generar análisis preliminar con AI"}
        </button>
      ) : brief ? (
        <p className="mt-4 text-sm text-xinergy-slate">
          Generado el {dateFormat.format(new Date(brief.generatedAt))}. No hay respuestas nuevas, así que este análisis se mantiene.
        </p>
      ) : (
        <p className="mt-4 text-sm text-xinergy-slate">Cuando llegue la primera respuesta se puede generar el análisis preliminar.</p>
      )}
      {brief && stale && responses.length > 0 ? (
        <p className="mt-3 text-sm text-xinergy-charcoal">Llegó una respuesta nueva desde este análisis. Regenerarlo usa la muestra de ahora.</p>
      ) : null}
      {error ? <p className="mt-3 text-sm font-medium text-red-700">{error}</p> : null}

      <div className="mt-6 border-t-2 border-xinergy-orange pt-4">
        <h3 className="font-display text-lg text-xinergy-charcoal">La muestra, hasta ahora</h3>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-xinergy-slate">
          {brief?.context || "Aquí va el contexto de la muestra: cuántas respuestas hay, qué países faltan y si ya se puede hablar con confianza."}
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {EXECUTIVE_THEMES.map((theme) => {
          const body = brief?.themes.find((item) => item.id === theme.id)?.body;
          return (
            <article key={theme.id} className="border border-xinergy-charcoal/10 bg-xinergy-ivory p-4">
              <h3 className="font-display text-lg leading-snug text-xinergy-charcoal">{theme.title}</h3>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-xinergy-slate">
                {body || "Esta caja se llena con el análisis preliminar."}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
