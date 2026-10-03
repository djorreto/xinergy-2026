import Link from "next/link";
import { NewInsightForm } from "@/components/admin/NewInsightForm";
import { adminHref } from "@/lib/auth/admin-path";

const errors: Record<string, string> = {
  file: "Sube un PDF.",
  size: "El PDF puede pesar hasta 20 MB.",
  save: "No se pudo guardar el documento. Inténtalo de nuevo.",
  languages: "Marca al menos un idioma: español, inglés o portugués.",
};

export default async function NewInsightPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="max-w-xl">
      <Link href={adminHref("/insights")} className="text-sm text-xinergy-slate hover:text-xinergy-charcoal">
        ← Insights
      </Link>
      <h1 className="mt-6 font-display text-3xl text-xinergy-charcoal">Nuevo insight</h1>
      <p className="mt-2 text-sm text-xinergy-slate">
        Primero elige el tipo. Noticia es una nota con imágenes. Newsletter es un documento con PDF. Si la
        carga no termina, el avance queda como borrador incompleto.
      </p>
      {error && errors[error] ? <p className="mt-4 text-sm text-red-700">{errors[error]}</p> : null}
      <NewInsightForm />
    </div>
  );
}
