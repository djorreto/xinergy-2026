import Image from "next/image";

/** Logos de organizadores del LTC — Xinergy solo extiende la invitación como partner. */
export function InvitePartnerLogos({ caption }: { caption: string }) {
  return (
    <div className="border-t border-white/10 pt-4 sm:pt-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45 sm:text-[11px] sm:tracking-[0.18em]">
        {caption}
      </p>
      <div className="mt-3 flex w-full flex-wrap items-center justify-center gap-6 rounded-sm bg-white px-4 py-3.5 sm:mt-4 sm:inline-flex sm:w-auto sm:justify-start sm:gap-8 sm:px-5">
        <Image
          src="/partners/digevo.png"
          alt="DIGEVO"
          width={140}
          height={40}
          className="h-7 w-auto object-contain sm:h-8"
        />
        <Image
          src="/partners/nvidia.svg"
          alt="NVIDIA"
          width={120}
          height={40}
          className="h-6 w-auto object-contain sm:h-7"
        />
      </div>
    </div>
  );
}
