import { brand } from "@/lib/content";

/** Leyenda del gráfico narrativo — debajo de la banda, en sección crema */
export function HeroChartCaption({ className = "" }: { className?: string }) {
  return (
    <p
      className={`max-w-lg border-l-2 border-xinergy-orange/80 pl-4 text-sm leading-relaxed text-xinergy-slate sm:text-[0.9375rem] ${className}`}
    >
      Aun con{" "}
      <span className="font-medium text-[#c45a48]">presión de mercado</span> o{" "}
      <span className="font-medium text-[#c45a48]">choques globales</span>,{" "}
      <span className="font-semibold text-xinergy-orange">Xinergy</span> lleva{" "}
      <span className="font-medium text-[#2d8a55]">{brand.claim}</span> a sus clientes: el{" "}
      <span className="font-medium text-[#4a7ab8]">SLA</span> y los resultados se sostienen — o
      mejoran — mientras el gasto se optimiza.
    </p>
  );
}
