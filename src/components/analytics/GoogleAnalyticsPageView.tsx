"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { GA_MEASUREMENT_ID, trackPageView } from "@/lib/gtag";

export function GoogleAnalyticsPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
