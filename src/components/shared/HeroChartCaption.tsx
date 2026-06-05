import { brand } from "@/lib/content";

/** Leyenda del gráfico narrativo — solo banda CTA en home */
export function HeroChartCaption() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-xinergy-cream via-xinergy-cream/80 to-transparent px-5 pb-4 pt-16 sm:px-6 sm:pb-5 lg:px-10 lg:pb-6 lg:pt-20"
      aria-hidden
    >
      <p className="mx-auto max-w-xl text-center text-[0.6875rem] leading-relaxed text-xinergy-slate sm:max-w-2xl sm:text-xs lg:mx-0 lg:max-w-md lg:text-left lg:text-sm lg:leading-relaxed">
        Aun con{" "}
        <span className="font-medium text-[#c45a48]">presión de mercado</span> o{" "}
        <span className="font-medium text-[#c45a48]">choques globales</span>,{" "}
        <span className="font-semibold text-xinergy-orange">Xinergy</span> lleva{" "}
        <span className="font-medium text-[#2d8a55]">{brand.claim}</span> a
        sus clientes: el{" "}
        <span className="font-medium text-[#4a7ab8]">SLA</span> y los resultados se
        sostienen — o mejoran — mientras el gasto se optimiza.
      </p>
    </div>
  );
}
