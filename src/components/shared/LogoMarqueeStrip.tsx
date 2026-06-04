import Image from "next/image";

export type MarqueeLogo = { name: string; src: string };

function LogoGroup({ logos }: { logos: readonly MarqueeLogo[] }) {
  return (
    <>
      {logos.map((logo) => (
        <li
          key={logo.src}
          className="flex h-12 w-32 flex-shrink-0 items-center justify-center sm:h-14 sm:w-36"
        >
          <Image
            src={logo.src}
            alt={logo.name}
            width={200}
            height={72}
            unoptimized
            className="logo-client-tile h-9 w-auto max-w-[8.5rem] object-contain sm:h-11 sm:max-w-[10rem]"
          />
        </li>
      ))}
    </>
  );
}

export function LogoMarqueeStrip({
  logos,
  reverse = false,
  duration = 110,
}: {
  logos: readonly MarqueeLogo[];
  reverse?: boolean;
  duration?: number;
}) {
  return (
    <div className="logo-marquee relative overflow-hidden">
      <div
        className={`logo-marquee-runner flex ${reverse ? "logo-marquee-reverse" : ""}`}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <ul className="logo-marquee-group flex list-none items-center gap-10 pr-10 sm:gap-14 sm:pr-14">
          <LogoGroup logos={logos} />
        </ul>
        <ul
          className="logo-marquee-group flex list-none items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
          aria-hidden
        >
          <LogoGroup logos={logos} />
        </ul>
      </div>
    </div>
  );
}
