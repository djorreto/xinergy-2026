import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { RadarSurveyC } from "@/components/survey/RadarSurveyC";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Radar Compras 2027 · versión C",
  description: "Encuesta breve de prioridades, capacidades y agenda de Compras.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default async function RadarOptionCPage({ params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) notFound();
  setRequestLocale(locale);
  return <RadarSurveyC locale={locale} />;
}
