import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://tracker.metricool.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://tracker.metricool.com https://*.supabase.co",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.googletagmanager.com https://www.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://stats.g.doubleclick.net https://pagead2.googlesyndication.com https://tracker.metricool.com https://challenges.cloudflare.com https://*.supabase.co wss://*.supabase.co",
  "frame-src https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  serverExternalPackages: ["unpdf", "exceljs"],
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  async headers() {
    const policy =
      process.env.NODE_ENV === "production"
        ? contentSecurityPolicy
        : contentSecurityPolicy.replace("script-src 'self'", "script-src 'self' 'unsafe-eval'");
    return [
      {
        source: "/(.*)",
        headers: securityHeaders.map((header) =>
          header.key === "Content-Security-Policy" ? { ...header, value: policy } : header,
        ),
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "xinergy.cl" }],
        destination: "https://xinergy.lat/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.xinergy.cl" }],
        destination: "https://xinergy.lat/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.xinergy.lat" }],
        destination: "https://xinergy.lat/:path*",
        permanent: true,
      },
      {
        source: "/:locale/servicios/procurement-transformation",
        destination: "/:locale/servicios/transformacion-abastecimiento",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
