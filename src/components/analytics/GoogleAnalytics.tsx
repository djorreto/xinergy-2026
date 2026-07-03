import Script from "next/script";
import {
  GA_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
  getGtagScriptId,
  isAnalyticsEnabled,
} from "@/lib/gtag";

function buildGtagInit() {
  const configs: string[] = [];

  if (GA_MEASUREMENT_ID) {
    configs.push(`gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });`);
  }
  if (GOOGLE_ADS_ID) {
    configs.push(`gtag('config', '${GOOGLE_ADS_ID}');`);
  }

  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    ${configs.join("\n    ")}
  `;
}

export function GoogleAnalytics() {
  const scriptId = getGtagScriptId();
  if (!isAnalyticsEnabled() || !scriptId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${scriptId}`}
        strategy="afterInteractive"
      />
      <Script id="google-tags-init" strategy="afterInteractive">
        {buildGtagInit()}
      </Script>
    </>
  );
}
