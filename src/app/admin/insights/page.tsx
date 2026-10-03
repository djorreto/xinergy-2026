import Link from "next/link";
import { addCompetitorDomain, addInsightAdmin, removeCompetitorDomain, removeInsightAdmin } from "@/app/admin/insights/actions";
import { InsightAdminList, type InsightListItem } from "@/components/admin/InsightAdminList";
import { locales, type Locale } from "@/i18n/routing";
import { createAdminClient } from "@/lib/supabase/admin";

type LocaleRow = { locale: string; title: string };
type InsightRow = {
  id: string;
  slug: string;
  kind: "noticia" | "documento" | null;
  status: "draft" | "published";
  intake_complete: boolean;
  created_by: string | null;
  available_at: string | null;
  created_at: string;
  published_at: string | null;
  web_insight_locales: LocaleRow[];
};

const fieldClass =
  "w-full border border-xinergy-charcoal/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-xinergy-orange";

export default async function AdminInsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const admin = await createAdminClient();
  const [{ data: insights }, { data: downloads }, { data: domains }, { data: admins }] = await Promise.all([
    admin
      .from("web_insights")
      .select("id, slug, kind, status, intake_complete, created_by, available_at, created_at, published_at, web_insight_locales(locale, title)"),
    admin.from("web_insight_downloads").select("insight_id, validated_at"),
    admin.from("web_insight_competitor_domains").select("domain").order("domain"),
    admin.from("web_insight_admins").select("email, enabled").order("email"),
  ]);

  const counts = new Map<string, number>();
  for (const row of downloads ?? []) {
    if (!row.validated_at) continue;
    counts.set(row.insight_id, (counts.get(row.insight_id) ?? 0) + 1);
  }

  const errorText =
    error === "domain"
      ? "Ese dominio no es válido."
      : error === "freemail"
        ? "Gmail, Outlook, iCloud, Yahoo y otros correos personales no se marcan como competencia."
        : error === "admin_domain"
          ? "Solo se pueden habilitar correos @xinergy.cl, @duxpartners.com o @opticks.cl."
          : error === "admin_self"
            ? "No puedes quitar tu propio acceso."
            : error === "admin_save"
              ? "No se pudo guardar ese acceso."
              : null;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Insights</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-xinergy-slate">
            Los textos publicados aquí aparecen en la sección pública. Los insights que ya están en el sitio siguen donde están.
          </p>
        </div>
        <Link href="/admin/insights/new" className="bg-xinergy-orange px-4 py-2.5 text-sm font-semibold text-xinergy-charcoal">
          Nuevo insight
        </Link>
      </div>

      <InsightAdminList
        items={[...((insights ?? []) as InsightRow[])]
          .sort((a, b) => {
            const time = (row: InsightRow) => new Date(row.published_at || row.created_at).getTime();
            return time(b) - time(a) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          })
          .map((insight): InsightListItem => {
          const titles = Object.fromEntries(locales.map((locale) => [locale, ""])) as Record<Locale, string>;
          for (const row of insight.web_insight_locales) {
            if (row.locale === "es" || row.locale === "en" || row.locale === "pt") titles[row.locale] = row.title;
          }
          return {
            id: insight.id,
            slug: insight.slug,
            kind: insight.kind === "noticia" ? "noticia" : "documento",
            status: insight.status,
            intakeComplete: insight.intake_complete,
            createdBy: insight.created_by,
            availableAt: insight.available_at,
            createdAt: insight.created_at,
            publishedAt: insight.published_at,
            downloads: counts.get(insight.id) ?? 0,
            titles,
          };
        })}
      />

      <section className="border border-xinergy-charcoal/10 bg-white p-5">
        <h2 className="font-display text-2xl">Quién puede entrar</h2>
        <p className="mt-2 text-sm leading-relaxed text-xinergy-slate">
          Esta lista es solo de Insights. No abre ni cierra acceso en Reporte Comercial.
        </p>
        <form action={addInsightAdmin} className="mt-4 flex flex-wrap gap-3">
          <input name="email" type="email" placeholder="nombre@xinergy.cl" className={`${fieldClass} max-w-xs`} />
          <button type="submit" className="bg-xinergy-charcoal px-4 py-2.5 text-sm font-semibold text-white">
            Habilitar
          </button>
        </form>
        <ul className="mt-4 space-y-2 text-sm">
          {(admins ?? []).map((row) => (
            <li key={row.email} className="flex items-center justify-between gap-3">
              <span>{row.email}</span>
              <form action={removeInsightAdmin}>
                <input type="hidden" name="email" value={row.email} />
                <button type="submit" className="text-xinergy-slate hover:text-xinergy-charcoal">
                  Quitar
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <section className="border border-xinergy-charcoal/10 bg-white p-5">
        <h2 className="font-display text-2xl">Dominios de competencia</h2>
        <p className="mt-2 text-sm leading-relaxed text-xinergy-slate">
          Si alguien descarga con uno de estos dominios, el registro en Monday queda marcado como competidor. No se bloquea la descarga.
        </p>
        {errorText ? <p className="mt-3 text-sm text-red-700">{errorText}</p> : null}
        <form action={addCompetitorDomain} className="mt-4 flex flex-wrap gap-3">
          <input name="domain" placeholder="empresa.com" className={`${fieldClass} max-w-xs`} />
          <button type="submit" className="bg-xinergy-charcoal px-4 py-2.5 text-sm font-semibold text-white">
            Agregar
          </button>
        </form>
        <ul className="mt-4 space-y-2 text-sm">
          {(domains ?? []).map((row) => (
            <li key={row.domain} className="flex items-center justify-between gap-3">
              <span>{row.domain}</span>
              <form action={removeCompetitorDomain}>
                <input type="hidden" name="domain" value={row.domain} />
                <button type="submit" className="text-xinergy-slate hover:text-xinergy-charcoal">
                  Quitar
                </button>
              </form>
            </li>
          ))}
          {!domains?.length ? <li className="text-xinergy-slate">Ninguno cargado.</li> : null}
        </ul>
      </section>
    </div>
  );
}
