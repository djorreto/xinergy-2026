import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { FitnessJourneyPanels } from "@/components/shared/FitnessJourneyPanels";
import { NosotrosStatsGrid } from "@/components/shared/NosotrosStatsGrid";
import { PageHero } from "@/components/shared/PageHero";
import { CTABand } from "@/components/shared/CTABand";
import { Container } from "@/components/ui/Container";
import { StrongPhraseBlock } from "@/components/shared/StrongPhraseBlock";
import { TeamGrid } from "@/components/shared/TeamGrid";
import { getContent } from "@/lib/content";
import { ttForsDisplay } from "@/lib/fonts";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { brand, nosotrosPage } = getContent(locale);
  return {
    title: nosotrosPage.metaTitle,
    description: brand.pitchLine,
  };
}

export default async function NosotrosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { brand, cultureValues, teamMembers, teamOffsite, nosotrosPage } = getContent(locale);
  const t = await getTranslations("ui.nosotros");

  return (
    <>
      <PageHero
        dark
        brandTitle
        eyebrow={nosotrosPage.eyebrow}
        title={brand.claim}
        description={brand.promise}
        after={
          <>
            <div className="mt-5 sm:mt-6">
              <FitnessJourneyPanels />
            </div>
            <div className="mt-5 sm:mt-6">
              <StrongPhraseBlock compact />
            </div>
          </>
        }
      />

      <section className="border-t border-xinergy-charcoal/8 bg-xinergy-ivory pt-12 pb-8 sm:pt-16 sm:pb-10 lg:pt-20 lg:pb-12">
        <Container>
          <p className="label-editorial">{t("culture")}</p>
          <h2 className="font-display mt-3 max-w-lg text-[length:var(--type-section)] text-xinergy-charcoal">
            {t("howWeWork")}
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:gap-8">
            {cultureValues.map((value) => (
              <article
                key={value.title}
                className="rounded-2xl border border-xinergy-charcoal/10 bg-white p-6 sm:p-7 lg:p-8"
              >
                <h3 className="brand-phrase text-xl text-xinergy-orange sm:text-2xl">{value.title}</h3>
                <p className="type-body mt-3 text-xinergy-slate sm:mt-4">
                  {value.summary}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="pt-6 pb-14 sm:pt-8 sm:pb-16 lg:pt-10 lg:pb-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
            <div>
              <h2 className="brand-phrase text-2xl text-xinergy-charcoal sm:text-3xl lg:text-4xl">
                {brand.claim}
              </h2>
              <p className="type-body mt-5 sm:text-[length:var(--type-lead)] lg:mt-6">
                {brand.pitchLine} {nosotrosPage.aboutBody1}
              </p>
              <p className="type-body mt-4 sm:text-[length:var(--type-lead)]">
                {nosotrosPage.aboutBody2}
              </p>
            </div>
            <NosotrosStatsGrid />
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-xinergy-charcoal text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,166,35,0.12),transparent_55%)]" />
        <Container className="relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="max-w-lg">
            <p className="label-editorial-light">{teamOffsite.eyebrow}</p>
            <h2
              className={`${ttForsDisplay.className} brand-phrase mt-4 text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]`}
            >
              {teamOffsite.title}
            </h2>
            <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-xinergy-orange">
              {teamOffsite.location}
            </p>
            <p
              className={`${ttForsDisplay.className} brand-phrase mt-6 text-lg leading-snug text-xinergy-beige sm:text-xl`}
            >
              {teamOffsite.quote}
            </p>
            <p className="type-body mt-5 text-white/75 lg:text-[length:var(--type-lead)]">
              {teamOffsite.body}
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40 sm:aspect-[5/6] lg:aspect-[4/5]">
              <Image
                src={teamOffsite.image}
                alt={teamOffsite.imageAlt}
                fill
                sizes="(max-width: 1024px) 90vw, 42vw"
                className="object-cover object-[center_46%]"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-xinergy-charcoal/50 via-transparent to-transparent" />
            </div>
          </div>
        </Container>
      </section>

      <TeamGrid
        eyebrow={nosotrosPage.teamEyebrow}
        title={nosotrosPage.teamTitle}
        lead={nosotrosPage.teamLead}
        members={teamMembers}
      />

      <section className="border-t border-xinergy-charcoal/8 bg-white py-20">
        <Container>
          <h2 className="text-2xl font-bold text-xinergy-charcoal">{t("carbonNeutral")}</h2>
          <p className="type-body max-w-2xl text-xinergy-slate">
            {nosotrosPage.carbonNeutralBody}
          </p>
        </Container>
      </section>
      <CTABand />
    </>
  );
}
