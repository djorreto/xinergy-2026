import Image from "next/image";

type Props = {
  caption: string;
  /** Mostrar logo Karai (almuerzo). En streaming solo Hotel W. */
  showKarai?: boolean;
};

/** Marca del venue: W Hotels (+ Karai en almuerzo). Optimizado para iPhone. */
export function InviteVenueBrands({ caption, showKarai = false }: Props) {
  return (
    <div className="overflow-hidden border border-white/12 bg-white/[0.03]">
      <div className="border-b border-white/10 px-4 py-2.5 sm:px-5 sm:py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-xinergy-orange sm:text-[11px] sm:tracking-[0.18em]">
          {caption}
        </p>
      </div>
      <div className={`grid bg-white ${showKarai ? "grid-cols-2" : "grid-cols-1"}`}>
        <div className="flex min-h-[5.5rem] items-center justify-center px-3 py-4 sm:min-h-[7.5rem] sm:px-6 sm:py-6">
          <Image
            src="/invites/w-hotels.png"
            alt="W Hotels"
            width={160}
            height={135}
            className="h-12 w-auto object-contain sm:h-16 lg:h-[4.5rem]"
            priority
          />
        </div>
        {showKarai && (
          <div className="flex min-h-[5.5rem] items-center justify-center border-l border-xinergy-charcoal/10 px-3 py-4 sm:min-h-[7.5rem] sm:px-6 sm:py-6">
            <Image
              src="/invites/karai-logo.jpg"
              alt="Karai by Mitsuharu"
              width={280}
              height={120}
              className="h-10 w-auto max-w-full object-contain sm:h-14 lg:h-16"
              priority
            />
          </div>
        )}
      </div>
    </div>
  );
}
