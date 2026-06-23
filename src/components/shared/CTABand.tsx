"use client";

import { useTranslations } from "next-intl";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ttForsDisplay } from "@/lib/fonts";

export function CTABand() {
  const t = useTranslations("ui.cta");
  const tHeader = useTranslations("ui.header");
  const { brand } = useSiteContent();

  return (
    <section className="border-t border-xinergy-charcoal/8 bg-xinergy-charcoal py-14 text-white">
      <Container className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
        <div>
          <h2
            className={`${ttForsDisplay.className} text-xl text-balance sm:text-2xl`}
          >
            <span className="text-xinergy-orange">{brand.strongPhrase.emphasis}</span>
            {". "}
            <span className="text-white/90">{t("measureExecute")}</span>
          </h2>
          <p className="mt-2 text-sm text-white/55">{t("tagline")}</p>
        </div>
        <div className="cta-band-actions flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
          <Button href="/diagnostico" variant="primary" className="max-lg:w-full max-lg:justify-center">
            {tHeader("calculateEfficiencies")}
          </Button>
          <Button href="/contacto" variant="light" className="max-lg:w-full max-lg:justify-center">
            {brand.cta}
          </Button>
        </div>
      </Container>
    </section>
  );
}
