"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { locales, localeLabels, type Locale } from "@/i18n/routing";
import { saveInsight, translateInsightLocales } from "@/app/admin/insights/actions";
import type { ImageSize } from "@/lib/insights/types";
import type { MediaLinks } from "@/lib/insights/languages";
import { insightAvailabilityLabel, toChileInputValue } from "@/lib/insights/schedule";
import type { InsightLocaleFields } from "@/lib/insights/types";
import { createClient } from "@/lib/supabase/client";

const fieldClass =
  "mt-2 w-full border border-xinergy-charcoal/15 bg-white px-3 py-2.5 text-sm text-xinergy-charcoal outline-none focus:border-xinergy-orange";

type DownloadRow = {
  email: string;
  validatedAt: string | null;
  createdAt: string;
  competitor: boolean;
};

type Props = {
  id: string;
  slug: string;
  kind: "noticia" | "documento";
  status: "draft" | "published";
  availableAt: string | null;
  coverUrl: string | null;
  imageSize: ImageSize;
  languages: Locale[];
  mediaLinks: MediaLinks;
  galleryUrls: string[];
  sourceUrl: string;
  hasPdf: boolean;
  locales: Record<Locale, InsightLocaleFields>;
  downloads: DownloadRow[];
};

function LayoutReference({ size, coverUrl }: { size: ImageSize; coverUrl: string | null }) {
  const photo = coverUrl ? (
    <img src={coverUrl} alt="" className="h-full w-full object-cover" />
  ) : (
    <div className="h-full w-full bg-xinergy-orange/30" />
  );
  const lines = (
    <div className="space-y-1.5 pt-1">
      <div className="h-1.5 w-full rounded bg-xinergy-charcoal/15" />
      <div className="h-1.5 w-5/6 rounded bg-xinergy-charcoal/10" />
      <div className="h-1.5 w-4/6 rounded bg-xinergy-charcoal/10" />
    </div>
  );
  const note =
    size === "sm"
      ? "La foto queda a la derecha de Point of View. El texto sigue abajo, a todo el ancho."
      : size === "md"
        ? "La foto queda a la izquierda y el texto a la derecha."
        : "La foto queda al medio, completa, y el texto debajo.";

  return (
    <div className="mt-3">
      <div className="rounded-xl border border-xinergy-charcoal/10 bg-xinergy-cream p-3">
        {size === "lg" ? (
          <>
            <div className="mx-auto aspect-[3/4] w-24 overflow-hidden rounded-lg">{photo}</div>
            <div className="mt-3">{lines}</div>
          </>
        ) : null}
        {size === "md" ? (
          <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-start gap-3">
            <div className="aspect-[3/4] overflow-hidden rounded-lg">{photo}</div>
            {lines}
          </div>
        ) : null}
        {size === "sm" ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-xinergy-orange">Point of View</p>
              <div className="h-10 w-8 overflow-hidden rounded">{photo}</div>
            </div>
            <div className="mt-3">{lines}</div>
          </>
        ) : null}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-xinergy-slate">{note}</p>
    </div>
  );
}

const emptyLocale = (): InsightLocaleFields => ({
  title: "",
  excerpt: "",
  body: "",
  typeLabel: "Point of View",
  tag: "",
  author: "",
  publishedOn: "",
});

export function InsightEditor({
  id,
  slug: initialSlug,
  kind,
  status,
  availableAt,
  coverUrl,
  imageSize: initialImageSize,
  languages: initialLanguages,
  mediaLinks: initialMediaLinks,
  galleryUrls,
  sourceUrl: initialSourceUrl,
  hasPdf,
  locales: initialLocales,
  downloads,
}: Props) {
  const router = useRouter();
  const [slug, setSlug] = useState(initialSlug);
  const [sourceUrl, setSourceUrl] = useState(initialSourceUrl);
  const [imageSize, setImageSize] = useState<ImageSize>(initialImageSize);
  const [languages, setLanguages] = useState<Locale[]>(initialLanguages);
  const [mediaLinks, setMediaLinks] = useState<MediaLinks>(initialMediaLinks);
  const [active, setActive] = useState<Locale>("es");
  const [copy, setCopy] = useState(initialLocales);
  const [visibility, setVisibility] = useState<"draft" | "now" | "schedule">(() => {
    if (status !== "published") return "draft";
    if (availableAt && new Date(availableAt).getTime() > Date.now()) return "schedule";
    return "now";
  });
  const [when, setWhen] = useState(toChileInputValue(availableAt));
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [uploading, setUploading] = useState<"cover" | "pdf" | "gallery" | null>(null);
  const current = copy[active] ?? emptyLocale();
  const validated = downloads.filter((row) => row.validatedAt).length;

  async function translateFromActive() {
    setTranslating(true);
    setError(null);
    setMessage(null);
    const filledLocales = locales.filter((locale) => locale !== "es" && copy[locale]?.title.trim());
    const result = await translateInsightLocales({ source: "es", fields: copy.es, filledLocales });
    setTranslating(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCopy((previous) => {
      const next = { ...previous };
      for (const locale of locales) {
        const translated = result.translations[locale];
        if (!translated) continue;
        next[locale] = {
          ...previous[locale],
          ...translated,
          author: current.author,
          publishedOn: current.publishedOn,
        };
      }
      return next;
    });
    const names = locales
      .filter((locale) => result.translations[locale])
      .map((locale) => localeLabels[locale])
      .join(" y ");
    setMessage(`Traduje a ${names}. Revísalo en esas pestañas antes de publicar.`);
  }

  function updateLocale(patch: Partial<InsightLocaleFields>) {
    setCopy((previous) => ({ ...previous, [active]: { ...previous[active], ...patch } }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    setMessage(null);
    const result = await saveInsight({
      id,
      slug,
      intent: visibility === "draft" ? "unpublish" : "publish",
      availability: visibility === "schedule" ? "schedule" : "now",
      availableAt: when,
      sourceUrl,
      imageSize,
      languages,
      mediaLinks,
      locales: copy,
    });
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMessage(
      visibility === "draft"
        ? "Guardado. Quedó como borrador y no aparece en Insights."
        : visibility === "schedule"
          ? "Guardado. Aparece en Insights desde esa hora de Chile."
          : "Guardado. Ya está visible en Insights.",
    );
    router.refresh();
  }

  async function upload(fileKind: "cover" | "pdf" | "gallery", file: File) {
    const max = fileKind === "pdf" ? 20 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > max) {
      setError(fileKind === "pdf" ? "El PDF no puede pesar más de 20 MB." : "La imagen no puede pesar más de 5 MB.");
      return;
    }
    setUploading(fileKind);
    setError(null);
    try {
      const signed = await fetch("/api/admin/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ insightId: id, kind: fileKind, filename: file.name, contentType: file.type }),
      });
      const payload = (await signed.json()) as { ok?: boolean; path?: string; token?: string; bucket?: string; error?: string };
      if (!signed.ok || !payload.path || !payload.token || !payload.bucket) {
        setError("No se pudo preparar la subida.");
        return;
      }
      const supabase = createClient();
      const uploaded = await supabase.storage.from(payload.bucket).uploadToSignedUrl(payload.path, payload.token, file, {
        contentType: file.type,
      });
      if (uploaded.error) {
        setError("No se pudo subir el archivo.");
        return;
      }
      const done = await fetch("/api/admin/uploads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ insightId: id, kind: fileKind, path: payload.path }),
      });
      if (!done.ok) {
        setError("El archivo se subió, pero no quedó asociado.");
        return;
      }
      setMessage(fileKind === "pdf" ? "PDF actualizado." : fileKind === "gallery" ? "Imagen agregada." : "Imagen actualizada.");
      router.refresh();
    } finally {
      setUploading(null);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-xinergy-cream px-3 py-1 text-xs font-semibold uppercase tracking-wider text-xinergy-slate">
            {insightAvailabilityLabel(status, availableAt)}
          </span>
          {kind === "documento" ? (
            <span className="text-sm text-xinergy-slate">
              {validated} descarga{validated === 1 ? "" : "s"} validada{validated === 1 ? "" : "s"}
            </span>
          ) : null}
        </div>

        <label className="block text-sm text-xinergy-charcoal">
          Slug
          <input value={slug} onChange={(event) => setSlug(event.target.value)} className={fieldClass} />
        </label>
        {kind === "noticia" ? (
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-xinergy-charcoal">Enlaces en medios</legend>
            <p className="text-sm text-xinergy-slate">
              La página de Xinergy se publica siempre en español, inglés y portugués. Estos campos son solo si la nota salió en un diario u otro medio. El nombre del idioma queda como enlace.
            </p>
            {(
              [
                ["es", "Español"],
                ["en", "Inglés"],
                ["pt", "Portugués"],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="block text-sm text-xinergy-charcoal">
                {label}
                <input
                  value={mediaLinks[value] ?? ""}
                  onChange={(event) => setMediaLinks((current) => ({ ...current, [value]: event.target.value }))}
                  placeholder="https://diario.com/nota"
                  className={fieldClass}
                />
              </label>
            ))}
            <label className="block text-sm font-medium text-xinergy-charcoal">
              Publicado originalmente en xinergy.cl
              <input value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="https://xinergy.cl/..." className={fieldClass} />
            </label>
          </fieldset>
        ) : (
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-xinergy-charcoal">Idiomas del documento adjunto</legend>
            <p className="text-sm text-xinergy-slate">
              Marca en qué idiomas está el PDF. Puede ser uno o los tres. La página de Xinergy se publica igual en los tres idiomas.
            </p>
            {(
              [
                ["es", "Español"],
                ["en", "Inglés"],
                ["pt", "Portugués"],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-sm text-xinergy-charcoal">
                <input
                  type="checkbox"
                  checked={languages.includes(value)}
                  onChange={(event) =>
                    setLanguages((current) =>
                      event.target.checked ? [...current, value] : current.filter((item) => item !== value),
                    )
                  }
                />
                {label}
              </label>
            ))}
          </fieldset>
        )}

        <div className="flex gap-2">
          {locales.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => setActive(locale)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                active === locale ? "bg-xinergy-orange text-xinergy-charcoal" : "border border-xinergy-charcoal/15 text-xinergy-slate"
              }`}
            >
              {localeLabels[locale]}
              {copy[locale]?.title.trim() ? "" : " · vacío"}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-xinergy-slate">La traducción sale del texto en español. Si dejas un título vacío, ese idioma no se publica.</p>
          <button
            type="button"
            disabled={translating || saving}
            onClick={() => void translateFromActive()}
            className="border border-xinergy-charcoal/20 px-3 py-2 text-sm font-semibold disabled:opacity-60"
          >
            {translating ? "Traduciendo…" : "Traducir con IA"}
          </button>
        </div>

        <label className="block text-sm text-xinergy-charcoal">
          Título
          <input value={current.title} onChange={(event) => updateLocale({ title: event.target.value })} className={fieldClass} />
        </label>
        <label className="block text-sm text-xinergy-charcoal">
          Resumen
          <textarea value={current.excerpt} onChange={(event) => updateLocale({ excerpt: event.target.value })} rows={3} className={fieldClass} />
        </label>
        <label className="block text-sm text-xinergy-charcoal">
          Brief
          <textarea value={current.body} onChange={(event) => updateLocale({ body: event.target.value })} rows={12} className={fieldClass} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-xinergy-charcoal">
            Categoría
            <input value={current.typeLabel} onChange={(event) => updateLocale({ typeLabel: event.target.value })} className={fieldClass} />
          </label>
          <label className="block text-sm text-xinergy-charcoal">
            Etiqueta
            <input value={current.tag} onChange={(event) => updateLocale({ tag: event.target.value })} className={fieldClass} />
          </label>
          <label className="block text-sm text-xinergy-charcoal">
            Autores
            <input value={current.author} onChange={(event) => updateLocale({ author: event.target.value })} className={fieldClass} />
          </label>
          <label className="block text-sm text-xinergy-charcoal">
            Fecha
            <input type="date" value={current.publishedOn} onChange={(event) => updateLocale({ publishedOn: event.target.value })} className={fieldClass} />
          </label>
        </div>

        <fieldset className="space-y-3 border border-xinergy-charcoal/10 p-4">
          <legend className="px-1 text-sm font-semibold text-xinergy-charcoal">Visibilidad</legend>
          <label className="flex items-center gap-2 text-sm text-xinergy-charcoal">
            <input type="radio" name="visibility" checked={visibility === "draft"} onChange={() => setVisibility("draft")} />
            Borrador
          </label>
          <label className="flex items-center gap-2 text-sm text-xinergy-charcoal">
            <input type="radio" name="visibility" checked={visibility === "now"} onChange={() => setVisibility("now")} />
            Visible ahora
          </label>
          <label className="flex items-center gap-2 text-sm text-xinergy-charcoal">
            <input type="radio" name="visibility" checked={visibility === "schedule"} onChange={() => setVisibility("schedule")} />
            Visible desde una fecha y hora
          </label>
          {visibility === "schedule" ? (
            <label className="block pl-6 text-sm text-xinergy-charcoal">
              Hora de Chile
              <input type="datetime-local" value={when} onChange={(event) => setWhen(event.target.value)} className={fieldClass} />
            </label>
          ) : null}
        </fieldset>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {message ? <p className="text-sm text-xinergy-charcoal">{message}</p> : null}

        <button
          type="button"
          disabled={saving}
          onClick={() => save()}
          className="bg-xinergy-orange px-4 py-2.5 text-sm font-semibold text-xinergy-charcoal disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Guardar"}
        </button>
      </div>

      <aside className="space-y-6">
        <section className="border border-xinergy-charcoal/10 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-xinergy-slate">
            {kind === "noticia" ? "Imagen principal" : "Imagen del insight"}
          </p>
          {kind === "documento" ? (
            <p className="mt-2 text-sm text-xinergy-slate">Puedes ajustarla cuando quieras. Es la que se ve en la web.</p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["sm", "Pequeña"],
                ["md", "Mediana"],
                ["lg", "Grande"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setImageSize(value)}
                className={`border px-2.5 py-1 text-xs font-semibold ${
                  imageSize === value ? "border-xinergy-charcoal bg-xinergy-charcoal text-white" : "border-xinergy-charcoal/15 text-xinergy-slate"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <LayoutReference size={imageSize} coverUrl={coverUrl} />
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="mt-3 block w-full text-sm"
            disabled={uploading !== null}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload("cover", file);
            }}
          />
        </section>
        {kind === "noticia" ? (
          <section className="border border-xinergy-charcoal/10 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-xinergy-slate">Imágenes y logos</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {galleryUrls.map((url) => (
                <img key={url} src={url} alt="" className="h-16 w-auto rounded bg-xinergy-cream object-contain" />
              ))}
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="mt-3 block w-full text-sm"
              disabled={uploading !== null}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload("gallery", file);
              }}
            />
          </section>
        ) : (
          <section className="border border-xinergy-charcoal/10 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-xinergy-slate">PDF</p>
            <p className="mt-3 text-sm text-xinergy-slate">{hasPdf ? "PDF cargado" : "Sin PDF"}</p>
            <input
              type="file"
              accept="application/pdf"
              className="mt-3 block w-full text-sm"
              disabled={uploading !== null}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload("pdf", file);
              }}
            />
          </section>
        )}
        {uploading ? <p className="text-xs text-xinergy-slate">Subiendo…</p> : null}
        {kind === "documento" ? (
        <section className="border border-xinergy-charcoal/10 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-xinergy-slate">Descargas</p>
          <ul className="mt-3 space-y-2 text-sm">
            {downloads.slice(0, 8).map((row) => (
              <li key={`${row.email}-${row.createdAt}`}>
                <span className="text-xinergy-charcoal">{row.email}</span>
                <span className="mt-0.5 block text-xs text-xinergy-slate">
                  {row.validatedAt ? "Validada" : "Pendiente"}
                  {row.competitor ? " · Competidor" : ""}
                </span>
              </li>
            ))}
            {!downloads.length ? <li className="text-xinergy-slate">Todavía no hay solicitudes.</li> : null}
          </ul>
        </section>
        ) : null}
      </aside>
    </div>
  );
}
