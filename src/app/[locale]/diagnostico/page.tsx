import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { EfficiencyCalculator } from "@/components/calculator/EfficiencyCalculator";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Container } from "@/components/ui/Container";
import { getContent } from "@/lib/content";
import { contactHref } from "@/lib/contact-context";
import { ttForsDisplay } from "@/lib/fonts";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ui.diagnostico" });
  return {
    title: "Diagnóstico de eficiencia",
    description: t("metaDescription"),
  };
}

export default async function DiagnosticoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { brand } = getContent(locale);
  const t = await getTranslations("ui.diagnostico");
  const tHome = await getTranslations("ui.home");

  return (
    <>
      <section className="gradient-hero hero-below-header relative overflow-hidden text-white lg:hero-offset">
        <div className="hero-motion hero-motion--static" aria-hidden />
        <Container className="relative z-10 py-8 sm:py-16 lg:py-24">
          <p className="hero-mobile-eyebrow label-editorial-light max-lg:before:hidden">
            {t("eyebrow")}
          </p>
          <p
            className={`${ttForsDisplay.className} hero-mobile-accent mt-3 max-lg:text-lg max-lg:leading-snug lg:hidden`}
          >
            {brand.tagline}
          </p>
          <h1
            className={`${ttForsDisplay.className} mt-2 max-w-3xl text-[1.75rem] leading-[1.08] text-balance max-lg:mt-3 max-lg:text-[2.125rem] sm:mt-4 sm:text-4xl sm:leading-[1.1] lg:mt-4 lg:text-[3.25rem]`}
          >
            {tHome("efficiencyQuestion")}
          </h1>
          <p className={`${ttForsDisplay.className} mt-2 hidden text-base text-white/80 sm:mt-3 sm:text-lg lg:block`}>
            {brand.tagline}
          </p>
          <p className="hero-mobile-body mt-4 max-w-xl sm:mt-6 lg:text-lg">
            {t("subtitle")}
          </p>
        </Container>
      </section>

      <section className="relative z-20 -mt-4 pb-16 sm:-mt-6 sm:pb-20 lg:-mt-12 lg:pb-28">
        <Container>
          <EfficiencyCalculator />
        </Container>
      </section>

      <section className="border-t border-xinergy-charcoal/8 bg-white section-pad">
        <Container>
          <SectionHeader
            align="center"
            eyebrow={t("cashNeutralEyebrow")}
            title={t("cashNeutralTitle")}
            intro={t("cashNeutralIntro")}
            titleClassName="text-2xl sm:text-3xl"
          />
          <p className="mt-10 text-center text-sm text-xinergy-slate">
            {t("preferTalk")}{" "}
            <Link href={contactHref("diagnostico")} className="font-semibold text-xinergy-orange hover:underline">
              {t("scheduleConversation")}
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
