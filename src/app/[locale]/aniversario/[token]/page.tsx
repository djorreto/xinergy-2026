import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AnniversaryExperience } from "@/components/anniversary/AnniversaryExperience";
import { routing } from "@/i18n/routing";
import { ANNIVERSARY_TOKEN, isAnniversaryToken } from "@/lib/anniversary";

type Props = {
  params: Promise<{ locale: string; token: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale, token: ANNIVERSARY_TOKEN }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  if (!isAnniversaryToken(token)) {
    return { robots: { index: false, follow: false } };
  }

  return {
    title: "Xinergy 5",
    description: "Celebración interna de aniversario.",
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false, noimageindex: true },
    },
  };
}

export default async function AnniversaryPage({ params }: Props) {
  const { locale, token } = await params;
  if (!isAnniversaryToken(token)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations("ui.aniversario");

  return (
    <AnniversaryExperience
      copy={{
        eyebrow: t("eyebrow"),
        kicker: t("kicker"),
        title: t("title"),
        lead: t("lead"),
        surprise: t("surprise"),
        whenLabel: t("whenLabel"),
        when: t("when"),
        whenTime: t("whenTime"),
        whereLabel: t("whereLabel"),
        dressLabel: t("dressLabel"),
        dress: t("dress"),
        days: t("days"),
        hours: t("hours"),
        minutes: t("minutes"),
        seconds: t("seconds"),
        live: t("live"),
        maps: t("maps"),
        calendar: t("calendar"),
        privateNote: t("privateNote"),
        skip: t("skip"),
        enter: t("enter"),
        enterHint: t("enterHint"),
        hint: t("hint"),
      }}
    />
  );
}
