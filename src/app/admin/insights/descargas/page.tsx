import { createAdminClient } from "@/lib/supabase/admin";

type LocaleCopy = { locale: string; title: string };
type DownloadRow = {
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
  web_insights: { slug: string; web_insight_locales: LocaleCopy[] } | null;
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

function documentTitle(row: DownloadRow): string {
  const locales = row.web_insights?.web_insight_locales ?? [];
  return (
    locales.find((item) => item.locale === "es" && item.title.trim())?.title ||
    locales.find((item) => item.title.trim())?.title ||
    row.web_insights?.slug ||
    "Point of View"
  );
}

function countryLabel(code: string | null): string {
  if (!code) return "—";
  try {
    return countryNames.of(code) || code;
  } catch {
    return code;
  }
}

function arrivalLabel(row: DownloadRow): string {
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

export default async function InsightDownloadsPage() {
  const admin = await createAdminClient();
  const { data } = await admin
    .from("web_insight_downloads")
    .select(
      "id, locale, first_name, last_name, email, is_competitor, utm_source, utm_medium, utm_campaign, referrer, country_code, created_at, web_insights(slug, web_insight_locales(locale, title))",
    )
    .not("validated_at", "is", null)
    .order("created_at", { ascending: false })
    .limit(500);

  const rows = (data ?? []) as DownloadRow[];

  return (
    <div>
      <h1 className="font-display text-3xl">Base de datos de descarga de insights</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-xinergy-slate">
        Cada fila es una descarga hecha desde el formulario. La hora es de Chile. El país y el origen aparecen cuando el navegador o la visita los traen.
      </p>

      <div className="mt-6 overflow-x-auto border border-xinergy-charcoal/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-xinergy-charcoal/10 text-xs uppercase tracking-wider text-xinergy-slate">
            <tr>
              <th className="px-3 py-3 font-semibold">Fecha y hora</th>
              <th className="px-3 py-3 font-semibold">Idioma</th>
              <th className="px-3 py-3 font-semibold">País</th>
              <th className="px-3 py-3 font-semibold">Documento</th>
              <th className="px-3 py-3 font-semibold">Llegó por</th>
              <th className="px-3 py-3 font-semibold">Nombre</th>
              <th className="px-3 py-3 font-semibold">Correo</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-xinergy-charcoal/10 last:border-0">
                <td className="whitespace-nowrap px-3 py-3">{chileTime.format(new Date(row.created_at))}</td>
                <td className="px-3 py-3 uppercase">{row.locale}</td>
                <td className="px-3 py-3">{countryLabel(row.country_code)}</td>
                <td className="px-3 py-3">{documentTitle(row)}</td>
                <td className="max-w-xs px-3 py-3 text-xinergy-slate">{arrivalLabel(row)}</td>
                <td className="whitespace-nowrap px-3 py-3">
                  {row.first_name} {row.last_name}
                  {row.is_competitor ? <span className="ml-2 text-xs text-xinergy-orange">Competidor</span> : null}
                </td>
                <td className="px-3 py-3">{row.email}</td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-xinergy-slate">
                  Todavía no hay descargas.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
