import { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { GoogleAnalyticsPageView } from "@/components/analytics/GoogleAnalyticsPageView";
import { GoogleAnalyticsClickTracker } from "@/components/analytics/GoogleAnalyticsClickTracker";
import { Metricool } from "@/components/analytics/Metricool";
import { OrganizationJsonLd } from "@/components/shared/OrganizationJsonLd";
import { routing } from "@/i18n/routing";
import { ttForsDisplay, univers } from "@/lib/fonts";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${ttForsDisplay.variable} ${univers.variable} h-full`}>
      <head>
        <GoogleAnalytics />
        <Metricool />
      </head>
      <body
        className={`${univers.className} flex min-h-dvh flex-col antialiased overflow-x-clip pb-[env(safe-area-inset-bottom)]`}
      >
        <NextIntlClientProvider messages={messages}>
          <Suspense fallback={null}>
            <GoogleAnalyticsPageView />
          </Suspense>
          <GoogleAnalyticsClickTracker />
          <OrganizationJsonLd locale={locale} />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
