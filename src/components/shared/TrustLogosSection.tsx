"use client";

import { useTranslations } from "next-intl";
import { clientLogos } from "@/lib/clients";
import { LogoMarqueeStrip } from "@/components/shared/LogoMarqueeStrip";
import { SectionHeader } from "@/components/shared/SectionHeader";

export function TrustLogosSection() {
  const t = useTranslations("ui.trust");

  return (
    <section className="border-y border-xinergy-charcoal/8 bg-xinergy-ivory py-12 lg:py-16 [--logo-fade:var(--xinergy-ivory)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeader
          eyebrow={t("clients")}
          title={t("clientsTitle")}
          className="max-w-lg"
          titleClassName="text-2xl sm:text-3xl lg:text-4xl"
        />
      </div>
      <div className="mt-8">
        <LogoMarqueeStrip logos={clientLogos} duration={130} />
      </div>
    </section>
  );
}
