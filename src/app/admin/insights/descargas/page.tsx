import Link from "next/link";
import { setDownloadHidden } from "@/app/admin/insights/descargas/actions";
import { adminHref } from "@/lib/auth/admin-path";
import {
  DOWNLOAD_LIST_COLUMNS,
  downloadArrival,
  downloadCountry,
  downloadDocument,
  downloadWhen,
  type DownloadListRow,
} from "@/lib/insights/download-table";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function InsightDownloadsPage({
  searchParams,
}: {
  searchParams: Promise<{ ocultos?: string }>;
}) {
  const { ocultos } = await searchParams;
  const showingHidden = ocultos === "1";
  const admin = await createAdminClient();
  const visible = admin
    .from("web_insight_downloads")
    .select(DOWNLOAD_LIST_COLUMNS, { count: "exact" })
    .not("validated_at", "is", null)
    .is("hidden_at", null)
    .order("created_at", { ascending: false })
    .limit(500);
  const hidden = admin
    .from("web_insight_downloads")
    .select(DOWNLOAD_LIST_COLUMNS, { count: "exact" })
    .not("validated_at", "is", null)
    .not("hidden_at", "is", null)
    .order("created_at", { ascending: false })
    .limit(500);
  const [visibleResult, hiddenResult] = await Promise.all([visible, hidden]);
  const rows = ((showingHidden ? hiddenResult.data : visibleResult.data) ?? []) as unknown as DownloadListRow[];
  const hiddenTotal = hiddenResult.count ?? 0;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Base de datos de descarga de insights</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-xinergy-slate">
            Cada fila es una descarga hecha desde el formulario. La hora es de Chile. El país y el origen aparecen cuando el navegador o la visita los traen.
            {showingHidden ? " Estas filas siguen guardadas. Mostrar las devuelve a la base." : " El Excel incluye solo las descargas visibles."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a className="btn-secondary" href="/api/admin/insights/downloads/export">Exportar Excel</a>
          <Link className="btn-secondary" href={adminHref(showingHidden ? "/insights/descargas" : "/insights/descargas?ocultos=1")}>
            {showingHidden ? "Ver visibles" : `Ver ocultos${hiddenTotal ? ` (${hiddenTotal})` : ""}`}
          </Link>
        </div>
      </div>

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
              <th className="px-3 py-3 font-semibold">Registro</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-xinergy-charcoal/10 last:border-0">
                <td className="whitespace-nowrap px-3 py-3">{downloadWhen(row)}</td>
                <td className="px-3 py-3 uppercase">{row.locale}</td>
                <td className="px-3 py-3">{downloadCountry(row.country_code)}</td>
                <td className="px-3 py-3">{downloadDocument(row)}</td>
                <td className="max-w-xs px-3 py-3 text-xinergy-slate">{downloadArrival(row)}</td>
                <td className="whitespace-nowrap px-3 py-3">
                  {row.first_name} {row.last_name}
                  {row.is_competitor ? <span className="ml-2 text-xs text-xinergy-orange">Competidor</span> : null}
                </td>
                <td className="px-3 py-3">{row.email}</td>
                <td className="px-3 py-3">
                  <form action={setDownloadHidden}>
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="hidden" value={showingHidden ? "0" : "1"} />
                    <input type="hidden" name="view" value={showingHidden ? "ocultos" : ""} />
                    <button type="submit" className="text-xs font-semibold text-xinergy-slate underline decoration-xinergy-orange underline-offset-4">
                      {showingHidden ? "Mostrar" : "Ocultar"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-xinergy-slate">
                  {showingHidden ? "No hay descargas ocultas." : hiddenTotal ? "No hay descargas visibles. Las ocultas siguen guardadas." : "Todavía no hay descargas."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
