"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setInsightVisibility } from "@/app/admin/insights/actions";
import { localeLabels, locales, type Locale } from "@/i18n/routing";
import { chileLocalToDate, formatChileDateTime, toChileInputValue } from "@/lib/insights/schedule";

type Visibility = "draft" | "now" | "schedule";

export type InsightListItem = {
  id: string;
  slug: string;
  kind: "noticia" | "documento";
  status: "draft" | "published";
  intakeComplete: boolean;
  createdBy: string | null;
  availableAt: string | null;
  createdAt: string;
  publishedAt: string | null;
  downloads: number;
  titles: Record<Locale, string>;
};

const choices: { id: Visibility; label: string }[] = [
  { id: "draft", label: "Borrador" },
  { id: "now", label: "Publicado" },
  { id: "schedule", label: "Programado" },
];

function currentVisibility(item: InsightListItem): Visibility {
  if (item.status !== "published") return "draft";
  if (item.availableAt && new Date(item.availableAt).getTime() > Date.now()) return "schedule";
  return "now";
}

function publishLine(item: InsightListItem): string {
  const visibility = currentVisibility(item);
  if (visibility === "schedule" && item.availableAt) {
    return `Se publica el ${formatChileDateTime(item.availableAt)}`;
  }
  if (item.publishedAt) return `Publicado el ${formatChileDateTime(item.publishedAt)}`;
  return "Sin publicar";
}

function InsightRow({ item, locale, number, base }: { item: InsightListItem; locale: Locale; number: number; base: string }) {
  const router = useRouter();
  const savedChoice = currentVisibility(item);
  const [choice, setChoice] = useState<Visibility>(savedChoice);
  const [when, setWhen] = useState(toChileInputValue(item.availableAt));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const title = item.titles[locale].trim();
  const scheduled = choice === "schedule";

  async function apply(next: Visibility, nextWhen = when) {
    if (next === "schedule") {
      const parsed = chileLocalToDate(nextWhen);
      if (!parsed || parsed.getTime() <= Date.now()) {
        setChoice("schedule");
        setError(parsed ? "Esa hora de Chile ya pasó." : "Elige la fecha y la hora.");
        return;
      }
    }
    setChoice(next);
    setSaving(true);
    setError(null);
    const result = await setInsightVisibility({ id: item.id, visibility: next, availableAt: nextWhen });
    setSaving(false);
    if (!result.ok) {
      setChoice(savedChoice);
      setWhen(toChileInputValue(item.availableAt));
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <li className="flex flex-col gap-4 px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href={`${base}/insights/${item.id}`} className="font-semibold hover:text-xinergy-orange">
            <span className="mr-2 tabular-nums text-xinergy-slate">{number}.</span>
            {title || `Sin título en ${localeLabels[locale].toLowerCase()}`}
          </Link>
          <p className="mt-1 text-xs text-xinergy-slate">
            {savedChoice === "schedule"
              ? "Programado"
              : item.status === "published"
                ? "Publicado"
                : item.intakeComplete
                  ? "Borrador"
                  : "Borrador incompleto"}{" "}
            · Subido el {formatChileDateTime(item.createdAt)}
            {item.kind === "noticia" ? " · Noticia" : " · Newsletter"}
            {item.createdBy ? ` · Cargado por ${item.createdBy}` : ""} · {publishLine(item)}
            {item.kind === "documento"
              ? ` · ${item.downloads} ${item.downloads === 1 ? "descarga" : "descargas"}`
              : ""}
          </p>
        </div>
        <div className="flex gap-4">
          <a href={`/es/insights/${item.slug}?preview=1`} target="_blank" rel="noreferrer" className="text-sm text-xinergy-orange">
            Vista previa
          </a>
          <Link href={`${base}/insights/${item.id}`} className="text-sm text-xinergy-orange">
            Editar
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {choices.map((option) => (
          <button
            key={option.id}
            type="button"
            disabled={saving}
            onClick={() => {
              if (option.id === savedChoice && option.id !== "schedule") return;
              if (option.id === "schedule") {
                setChoice("schedule");
                const parsed = chileLocalToDate(when);
                if (!parsed || parsed.getTime() <= Date.now()) {
                  setError("Elige la fecha y la hora. Queda guardado al elegirla.");
                  return;
                }
                if (savedChoice === "schedule" && when === toChileInputValue(item.availableAt)) return;
              }
              void apply(option.id);
            }}
            className={`px-3 py-2 text-xs font-semibold disabled:opacity-60 ${
              choice === option.id
                ? "bg-xinergy-charcoal text-white"
                : "border border-xinergy-charcoal/15 text-xinergy-slate"
            }`}
          >
            {option.label}
          </button>
        ))}
        {scheduled ? (
          <label className="flex w-full min-w-0 flex-col gap-1 text-xs text-xinergy-slate sm:w-auto sm:flex-row sm:items-center">
            Fecha y hora de Chile
            <input
              type="datetime-local"
              value={when}
              disabled={saving}
              onChange={(event) => {
                const value = event.target.value;
                setWhen(value);
                if (chileLocalToDate(value)) void apply("schedule", value);
              }}
              className="w-full max-w-full border border-xinergy-charcoal/15 bg-white px-2 py-1.5 text-sm text-xinergy-charcoal outline-none focus:border-xinergy-orange sm:ml-2 sm:w-auto"
            />
          </label>
        ) : null}
        {saving ? <span className="text-xs text-xinergy-slate">Guardando…</span> : null}
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </li>
  );
}

const kinds = [
  { id: "all", label: "Todos" },
  { id: "noticia", label: "Noticia" },
  { id: "documento", label: "Newsletter" },
] as const;

export function InsightAdminList({ items, base }: { items: InsightListItem[]; base: string }) {
  const [locale, setLocale] = useState<Locale>("es");
  const [kind, setKind] = useState<(typeof kinds)[number]["id"]>("all");
  const visible = kind === "all" ? items : items.filter((item) => item.kind === kind);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {kinds.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setKind(option.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              kind === option.id ? "bg-xinergy-charcoal text-white" : "border border-xinergy-charcoal/15 text-xinergy-slate"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        {locales.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLocale(item)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
              locale === item ? "bg-xinergy-orange text-xinergy-charcoal" : "border border-xinergy-charcoal/15 text-xinergy-slate"
            }`}
          >
            {localeLabels[item]}
          </button>
        ))}
      </div>
      <ul className="divide-y divide-xinergy-charcoal/10 border border-xinergy-charcoal/10 bg-white">
        {visible.map((item, index) => (
          <InsightRow
            key={`${item.id}-${item.status}-${item.availableAt ?? ""}-${item.publishedAt ?? ""}`}
            item={item}
            locale={locale}
            number={index + 1}
            base={base}
          />
        ))}
        {!visible.length ? <li className="px-4 py-6 text-sm text-xinergy-slate">No hay insights de este tipo.</li> : null}
      </ul>
    </div>
  );
}
