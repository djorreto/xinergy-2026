"use client";

import { useLocale } from "next-intl";
import { getContent } from "@/lib/content";

export function useSiteContent() {
  const locale = useLocale();
  return getContent(locale);
}
