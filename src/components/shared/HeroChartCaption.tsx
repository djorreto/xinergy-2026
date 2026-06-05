import { brand } from "@/lib/content";

/** Leyenda del gráfico narrativo — debajo del chart, en banda morada */
export function HeroChartCaption({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <p
      className={`max-w-2xl border-l-2 border-xinergy-orange/80 pl-4 text-sm leading-relaxed sm:text-[0.9375rem] ${
        dark ? "text-white/60" : "text-xinergy-slate"
      } ${className}`}
    >
      Aun con{" "}
      <span className={`font-medium ${dark ? "text-[#f09080]" : "text-[#c45a48]"}`}>
        presión de mercado
      </span>{" "}
      o{" "}
      <span className={`font-medium ${dark ? "text-[#f09080]" : "text-[#c45a48]"}`}>
        choques globales
      </span>
      , <span className="font-semibold text-xinergy-orange">Xinergy</span> lleva{" "}
      <span className={`font-medium ${dark ? "text-[#8de0b0]" : "text-[#2d8a55]"}`}>
        {brand.claim}
      </span>{" "}
      a sus clientes: el{" "}
      <span className={`font-medium ${dark ? "text-[#aad4ff]" : "text-[#4a7ab8]"}`}>SLA</span> y
      los resultados se sostienen — o mejoran — mientras el gasto se optimiza.
    </p>
  );
}
