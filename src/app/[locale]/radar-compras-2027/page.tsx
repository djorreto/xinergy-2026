import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { RadarSurvey } from "@/components/survey/RadarSurvey";
import { routing } from "@/i18n/routing";
import { brand } from "@/lib/content/es";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Radar de Compras LatAm 2027",
  description: "Encuesta de Xinergy a CEOs, CFOs y líderes de compras en América Latina.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default async function RadarPage({ params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) notFound();
  setRequestLocale(locale);
  return <RadarSurvey locale={locale} linkedin={brand.linkedin} />;
}
