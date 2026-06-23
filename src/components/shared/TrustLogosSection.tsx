"use client";

import { useTranslations } from "next-intl";
import { clientLogos } from "@/lib/clients";
import { LogoMarqueeStrip } from "@/components/shared/LogoMarqueeStrip";
import { SectionHeader } from "@/components/shared/SectionHeader";

export function TrustLogosSection() {
  const t = useTranslations("ui.trust");
  const half = Math.ceil(clientLogos.length / 2);
  const rowA = clientLogos.slice(0, half);
  const rowB = clientLogos.slice(half);
  const duration = 130;

  return (
    <section className="border-y border-xinergy-charcoal/8 bg-xinergy-ivory py-12 lg:py-16 [--logo-fade:var(--xinergy-ivory)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeader
          eyebrow={t("clients")}
          title={t("clientsTitle")}
          className="max-w-lg"
          titleClassName="text-2xl sm:text-[length:var(--type-section)] lg:text-4xl"
        />
      </div>
      <div className="mt-8 space-y-6 sm:space-y-8">
        <LogoMarqueeStrip logos={rowA} duration={duration} />
        <LogoMarqueeStrip logos={rowB} reverse duration={duration} />
      </div>
    </section>
  );
}
