import type { Metadata } from "next";
import { ttForsDisplay, univers } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Insights",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${ttForsDisplay.variable} ${univers.variable} h-full`}>
      <body className={`${univers.className} min-h-dvh bg-xinergy-ivory text-xinergy-charcoal antialiased`}>{children}</body>
    </html>
  );
}
