import { permanentRedirect } from "next/navigation";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function RadarOptionCPage({ params }: Props) {
  const { locale } = await params;
  const safeLocale = routing.locales.includes(locale as (typeof routing.locales)[number]) ? locale : "es";
  permanentRedirect(`/${safeLocale}/radar-compras-2027`);
}
