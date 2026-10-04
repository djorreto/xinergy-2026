"use client";

import { useState } from "react";
import { StudyDownload } from "@/components/admin/StudyDownload";
import { CAPABILITIES } from "@/lib/surveys/radar-c/instrument";
import { countryNames, type BenchmarkC, type PersonC } from "@/lib/surveys/radar-c/report";
import { formatPercent } from "@/lib/surveys/ahp";

const dateFormat = new Intl.DateTimeFormat("es-CL", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Santiago" });

export function RadarDeskC({ people, benchmark, publicUrl, verified }: { people: PersonC[]; benchmark: BenchmarkC; publicUrl: string; verified: boolean }) {
  const [copied, setCopied] = useState(false);
  const included = people.filter((person) => person.included);
  return (
    <div>
      <p className="label-editorial">Versión C</p>
      <h1 className="mt-2 font-display text-3xl text-xinergy-charcoal">Radar Compras 2027</h1>
      <p className="mt-2 max-w-3xl text-xinergy-slate">Prioridades, capacidades y agenda. El benchmark toma una respuesta de Compras por empresa. Finanzas y dirección quedan aparte.</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-secondary" onClick={() => { void navigator.clipboard.writeText(publicUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); }}>{copied ? "Copiado" : "Copiar enlace"}</button>
        <a className="btn-secondary" href="/api/admin/surveys/radar-compras-2027-c/export">Exportar Excel</a>
        <StudyDownload href="/api/admin/surveys/radar-compras-2027-c/informe" />
        <span className="text-sm text-xinergy-slate">{verified ? "Motor verificado" : "El motor no pasó la verificación"}</span>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Card label="Respuestas incluidas" value={String(included.length)} />
        <Card label="Empresas en el benchmark" value={String(benchmark.companies)} />
        <Card label="Perfil principal" value={String(benchmark.priorityIds.length)} />
      </div>
      {benchmark.duplicates.length ? <p className="mt-4 text-sm text-red-700">{benchmark.duplicates.length} empresas tienen dos respuestas del mismo rol y no entran al benchmark hasta consolidarlas.</p> : null}
      {benchmark.aip ? (
        <div className="mt-6 border border-xinergy-charcoal/10 bg-white p-4">
          <h2 className="font-display text-xl">Prioridades, promedio por empresa</h2>
          <ul className="mt-3 grid gap-1 text-sm">
            {CAPABILITIES.map((item, index) => <li key={item.id}>{item.short.es}: {formatPercent(benchmark.aip?.[index] ?? 0)}</li>)}
          </ul>
        </div>
      ) : <p className="mt-6 text-sm text-xinergy-slate">El perfil aparece cuando hay una respuesta de Compras con consistencia de hasta 0,10.</p>}
      <div className="mt-6 overflow-x-auto border border-xinergy-charcoal/10 bg-white">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-xinergy-slate">
            <tr><th className="p-3">Fecha</th><th className="p-3">Empresa</th><th className="p-3">Rol</th><th className="p-3">Países</th><th className="p-3">Devolución</th></tr>
          </thead>
          <tbody>
            {[...people].sort((left, right) => right.createdAt.localeCompare(left.createdAt)).map((person) => (
              <tr key={person.id} className="border-t border-xinergy-charcoal/10">
                <td className="p-3 whitespace-nowrap">{dateFormat.format(new Date(person.createdAt))}</td>
                <td className="p-3">{person.empresa}<span className="mt-0.5 block text-xinergy-slate">{person.email}</span></td>
                <td className="p-3">{person.rol}{person.operational ? "" : " · ejecutiva"}</td>
                <td className="p-3">{countryNames(person.paises)}</td>
                <td className="p-3"><a className="font-semibold underline decoration-xinergy-orange" href={`/api/admin/surveys/radar-compras-2027-c/devolucion?id=${person.id}`}>Descargar</a></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!people.length ? <p className="p-4 text-sm text-xinergy-slate">Todavía no hay respuestas.</p> : null}
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return <div className="border border-xinergy-charcoal/10 bg-white p-4"><p className="text-sm text-xinergy-slate">{label}</p><p className="mt-1 font-display text-3xl">{value}</p></div>;
}
