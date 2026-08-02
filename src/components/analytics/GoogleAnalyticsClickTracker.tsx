"use client";

import { useEffect } from "react";
import { GA_MEASUREMENT_ID, trackLinkClick } from "@/lib/gtag";

function normalizeText(value: string | null | undefined) {
  return (value ?? "").replace(/\s+/g, " ").trim().slice(0, 120);
}

function isOutbound(href: string) {
  if (
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("sms:")
  ) {
    return true;
  }
  try {
    const url = new URL(href, window.location.origin);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}

function resolveHref(anchor: HTMLAnchorElement) {
  const raw = anchor.getAttribute("href");
  if (!raw || raw.startsWith("#") || raw.startsWith("javascript:")) return null;
  try {
    return new URL(raw, window.location.origin).href;
  } catch {
    return raw;
  }
}

export function GoogleAnalyticsClickTracker() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const linkUrl = resolveHref(anchor);
      if (!linkUrl) return;

      const ctaAttr = normalizeText(anchor.getAttribute("data-ga-cta"));
      const isMarkedCta =
        anchor.hasAttribute("data-ga-cta") || anchor.className.includes("btn-");
      const ctaName = isMarkedCta
        ? ctaAttr || normalizeText(anchor.textContent) || undefined
        : undefined;

      trackLinkClick({
        link_url: linkUrl,
        link_text: normalizeText(anchor.textContent) || undefined,
        outbound: isOutbound(linkUrl),
        link_classes: normalizeText(anchor.className) || undefined,
        cta_name: ctaName,
        cta_location:
          normalizeText(anchor.getAttribute("data-ga-location")) || undefined,
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
