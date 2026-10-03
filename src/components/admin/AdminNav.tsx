import Link from "next/link";

export function AdminNav({ email }: { email: string }) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-xinergy-charcoal/10 pb-4">
      <div>
        <p className="label-editorial">Xinergy</p>
        <p className="mt-1 text-sm text-xinergy-slate">{email}</p>
      </div>
      <nav className="flex flex-wrap items-center gap-4 text-sm">
        <Link href="/admin/insights" className="text-xinergy-slate hover:text-xinergy-charcoal">
          Insights
        </Link>
        <Link href="/admin/equipo" className="text-xinergy-slate hover:text-xinergy-charcoal">
          Equipo
        </Link>
        <Link href="/admin/insights/descargas" className="text-xinergy-slate hover:text-xinergy-charcoal">
          Descargas
        </Link>
        <form action="/api/admin/logout" method="post">
          <button type="submit" className="text-sm text-xinergy-slate hover:text-xinergy-charcoal">
            Salir
          </button>
        </form>
      </nav>
    </header>
  );
}
