"use client";

import { useState } from "react";

export function StudyDownload({ href }: { href: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function download() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(href);
      if (!response.ok) {
        setError("No se pudo generar el informe. Intenta otra vez en un momento.");
        setBusy(false);
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const named = response.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/);
      link.download = named?.[1] || "informe-preliminar.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("No se pudo generar el informe. Intenta otra vez en un momento.");
    }
    setBusy(false);
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <button type="button" className="btn-secondary" onClick={download} disabled={busy}>
        {busy ? "Generando el informe…" : "Informe y estudio preliminar"}
      </button>
      {error ? <span className="text-sm font-medium text-red-700">{error}</span> : null}
    </span>
  );
}
