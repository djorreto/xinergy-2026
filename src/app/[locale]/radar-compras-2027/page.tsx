import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { RadarSurveyC } from "@/components/survey/RadarSurveyC";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Radar de Compras LatAm 2027",
  description: "La visión de los líderes de la región sobre las prioridades, desafíos y transformaciones que marcarán 2027.",
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
  return <RadarSurveyC locale={locale} />;
}
