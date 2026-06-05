import type { NextConfig } from "next";

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
        source: "/servicios/procurement-transformation",
        destination: "/servicios/transformacion-abastecimiento",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
