"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

type Props = {
  children: React.ReactNode;
  className?: string;
  ctaLocation: string;
  text?: string;
  ariaLabel?: string;
};

export function WhatsAppLink({ children, className, ctaLocation, text, ariaLabel }: Props) {
  const [pending, setPending] = useState(false);

  async function open(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    try {
      const response = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = (await response.json()) as { url?: string };
      if (data.url) window.open(data.url, "_blank", "noopener,noreferrer");
    } catch {
      /* el enlace de respaldo sigue siendo la página de contacto */
    } finally {
      setPending(false);
    }
  }

  return (
    <Link
      href="/contacto"
      onClick={open}
      aria-label={ariaLabel}
      data-cta-name="whatsapp"
      data-cta-location={ctaLocation}
      className={className}
    >
      {children}
    </Link>
  );
}
