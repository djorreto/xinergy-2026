import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { RadarSurveyB } from "@/components/survey/RadarSurveyB";
import { routing } from "@/i18n/routing";
import { brand } from "@/lib/content/es";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Radar Compras 2027 · opción B",
  description: "Encuesta de prioridades, capacidades y agenda de Compras.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default async function RadarOptionBPage({ params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) notFound();
  setRequestLocale(locale);
  return <RadarSurveyB locale={locale} linkedin={brand.linkedin} />;
}
