import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { brand } from "@/lib/content";
import { ttForsDisplay, univers } from "@/lib/fonts";

export const metadata: Metadata = {
  title: {
    default: `${brand.name} | ${brand.claim}`,
    template: `%s | ${brand.name}`,
  },
  description:
    "#Fitness for business — ejecutamos eficiencias con impacto real en Latinoamérica. Compartimos riesgos, medimos, y somos tus socios en la implementación y ejecución.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/icon.png",
  },
  openGraph: {
    title: brand.name,
    description: brand.promise,
    locale: "es_CL",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#3f374b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${ttForsDisplay.variable} ${univers.variable} h-full`}>
      <body className={`${univers.className} flex min-h-dvh flex-col antialiased overflow-x-clip pb-[env(safe-area-inset-bottom)]`}>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
