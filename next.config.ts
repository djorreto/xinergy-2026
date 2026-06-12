import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
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
