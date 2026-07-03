export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "AW-18294572204";
export const GOOGLE_ADS_CONTACT_CONVERSION =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONTACT_CONVERSION;

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

export function isAnalyticsEnabled() {
  return Boolean(GA_MEASUREMENT_ID || GOOGLE_ADS_ID);
}

export function getGtagScriptId() {
  return GA_MEASUREMENT_ID ?? GOOGLE_ADS_ID;
}

export function trackPageView(url: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  if (GA_MEASUREMENT_ID) {
    window.gtag("config", GA_MEASUREMENT_ID, { page_path: url });
  }
}

export function trackGoogleAdsConversion(sendTo: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", { send_to: sendTo });
}

export function trackGoogleAdsContactConversion() {
  if (!GOOGLE_ADS_CONTACT_CONVERSION) return;
  trackGoogleAdsConversion(GOOGLE_ADS_CONTACT_CONVERSION);
}

export function trackContactLead() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  if (GA_MEASUREMENT_ID) {
    window.gtag("event", "generate_lead", {
      event_category: "contact",
      event_label: "contact_form",
    });
  }
  trackGoogleAdsContactConversion();
}
