export const DOWNLOAD_LIST_COLUMNS =
  "id, locale, first_name, last_name, email, is_competitor, utm_source, utm_medium, utm_campaign, referrer, country_code, created_at, web_insights(slug, web_insight_locales(locale, title))";

type LocaleCopy = { locale: string; title: string };

export type DownloadListRow = {
  id: string;
  locale: string;
  first_name: string;
  last_name: string;
  email: string;
  is_competitor: boolean;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  country_code: string | null;
  created_at: string;
  web_insights:
    | { slug: string; web_insight_locales: LocaleCopy[] }
    | { slug: string; web_insight_locales: LocaleCopy[] }[]
    | null;
};

const chileTime = new Intl.DateTimeFormat("es-CL", {
  timeZone: "America/Santiago",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const countryNames = new Intl.DisplayNames(["es"], { type: "region" });

function insightOf(row: DownloadListRow) {
  if (Array.isArray(row.web_insights)) return row.web_insights[0] ?? null;
  return row.web_insights;
}

export function downloadWhen(row: DownloadListRow) {
  return chileTime.format(new Date(row.created_at));
}

export function downloadCountry(code: string | null) {
  if (!code) return "—";
  try {
    return countryNames.of(code) || code;
  } catch {
    return code;
  }
}

export function downloadDocument(row: DownloadListRow) {
  const insight = insightOf(row);
  const locales = insight?.web_insight_locales ?? [];
  return (
    locales.find((item) => item.locale === "es" && item.title.trim())?.title ||
    locales.find((item) => item.title.trim())?.title ||
    insight?.slug ||
    "Point of View"
  );
}

export function downloadArrival(row: DownloadListRow) {
  const campaign = [row.utm_source, row.utm_medium, row.utm_campaign].filter(Boolean).join(" · ");
  let host = "";
  if (row.referrer) {
    try {
      host = new URL(row.referrer).hostname.replace(/^www\./, "");
    } catch {
      host = row.referrer;
    }
  }
  if (campaign && host) return `${campaign} · ${host}`;
  return campaign || host || "Directo";
}

export function downloadSheet(rows: DownloadListRow[]) {
  return [
    ["Fecha y hora", "Idioma", "País", "Documento", "Llegó por", "Nombre", "Correo", "Competidor"],
    ...rows.map((row) => [
      downloadWhen(row),
      row.locale.toUpperCase(),
      downloadCountry(row.country_code) === "—" ? "" : downloadCountry(row.country_code),
      downloadDocument(row),
      downloadArrival(row),
      `${row.first_name} ${row.last_name}`.trim(),
      row.email,
      row.is_competitor ? "Sí" : "No",
    ]),
  ];
}
