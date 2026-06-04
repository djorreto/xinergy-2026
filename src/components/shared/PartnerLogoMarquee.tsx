import Image from "next/image";
import { partnerLogos, type PartnerLogo } from "@/lib/partners";

function LogoGroup({ logos }: { logos: readonly PartnerLogo[] }) {
  return (
    <>
      {logos.map((logo) => (
        <li
          key={logo.src}
          className="flex h-14 w-36 flex-shrink-0 items-center justify-center sm:h-16 sm:w-40"
        >
          <Image
            src={logo.src}
            alt={logo.name}
            width={200}
            height={72}
            unoptimized
            className="logo-client-tile h-11 w-auto max-w-[10rem] object-contain sm:h-12"
          />
        </li>
      ))}
    </>
  );
}

function LogoStrip({
  logos,
  reverse = false,
  duration = 110,
}: {
  logos: readonly PartnerLogo[];
  reverse?: boolean;
  duration?: number;
}) {
  return (
    <div className="logo-marquee relative overflow-hidden">
      <div
        className={`logo-marquee-runner flex ${reverse ? "logo-marquee-reverse" : ""}`}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <ul className="logo-marquee-group flex list-none items-center gap-12 pr-12 sm:gap-16 sm:pr-16">
          <LogoGroup logos={logos} />
        </ul>
        <ul
          className="logo-marquee-group flex list-none items-center gap-12 pr-12 sm:gap-16 sm:pr-16"
          aria-hidden
        >
          <LogoGroup logos={logos} />
        </ul>
      </div>
    </div>
  );
}

export function PartnerLogoMarquee() {
  const half = Math.ceil(partnerLogos.length / 2);
  const rowA = partnerLogos.slice(0, half);
  const rowB = partnerLogos.slice(half);

  return (
    <section className="border-y border-xinergy-charcoal/8 bg-white py-14 lg:py-20 [--logo-fade:#ffffff]">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-10">
        <p className="label-editorial">Partners</p>
        <h2 className="font-display mt-3 text-2xl text-xinergy-charcoal lg:text-3xl">
          Aliados tecnológicos y de consultoría
        </h2>
      </div>
      <div className="mt-10 space-y-8">
        <LogoStrip logos={rowA} duration={125} />
        <LogoStrip logos={rowB} reverse duration={140} />
      </div>
    </section>
  );
}
