"use client";

import { useEffect } from "react";
import { ATTRIBUTION_KEY, UTM_KEYS, type Attribution } from "@/lib/insights/attribution";

export function AttributionCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasUtm = UTM_KEYS.some((key) => params.get(key));
    const referrer = document.referrer;
    if (!hasUtm && !referrer) return;

    let current: Attribution = {};
    try {
      current = JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || "{}") as Attribution;
    } catch {
      current = {};
    }

    const next: Attribution = { ...current };
    if (hasUtm) {
      for (const key of UTM_KEYS) {
        const value = params.get(key)?.trim();
        if (value) next[key] = value.slice(0, 200);
      }
    }
    if (referrer && !next.referrer && !referrer.includes(window.location.hostname)) {
      next.referrer = referrer.slice(0, 500);
    }
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(next));
  }, []);

  return null;
}
