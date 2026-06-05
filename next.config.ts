import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/servicios/procurement-transformation",
        destination: "/servicios/transformacion-abastecimiento",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
