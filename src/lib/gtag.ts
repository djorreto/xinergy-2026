export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-LMXEEPBX2S";
export const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "AW-18294572204";
export const GOOGLE_ADS_CONTACT_CONVERSION =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONTACT_CONVERSION ??
  "AW-18294572204/Z0tUCJjp_tocEKyJxJNE";

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

function canTrack() {
  return (
    typeof window !== "undefined" &&
    typeof window.gtag === "function" &&
    Boolean(GA_MEASUREMENT_ID)
  );
}

export function trackPageView(url: string) {
  if (!canTrack() || !GA_MEASUREMENT_ID) return;
  window.gtag!("config", GA_MEASUREMENT_ID, { page_path: url });
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean | undefined>,
) {
  if (!canTrack()) return;
  window.gtag!("event", name, params);
}

export function trackLinkClick(params: {
  link_url: string;
  link_text?: string;
  outbound?: boolean;
  link_classes?: string;
  cta_name?: string;
  cta_location?: string;
}) {
  const isCta = Boolean(params.cta_name || params.link_classes?.includes("btn-"));
  trackEvent(isCta ? "cta_click" : "link_click", {
    link_url: params.link_url,
    link_text: params.link_text,
    outbound: params.outbound,
    link_classes: params.link_classes,
    cta_name: params.cta_name,
    cta_location: params.cta_location,
  });
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
