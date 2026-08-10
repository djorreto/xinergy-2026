import type { MetadataRoute } from "next";

/** Bloquea rutas de registro por invitación en buscadores. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/es/registro/",
        "/en/registro/",
        "/pt/registro/",
        "/*/registro/",
      ],
    },
  };
}
