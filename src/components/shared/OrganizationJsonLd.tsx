import { getContent } from "@/lib/content";

export function OrganizationJsonLd({ locale }: { locale: string }) {
  const { brand, officeCountries, presenceCountries } = getContent(locale);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: `https://xinergy.lat/${locale}`,
    logo: "https://xinergy.lat/brand/logo-color.png",
    email: brand.email,
    description: brand.promise,
    sameAs: [brand.linkedin],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Andrés Bello 2457, piso 16, Of. 1603",
      addressLocality: "Providencia, Santiago",
      addressCountry: "CL",
    },
    areaServed: presenceCountries.map((country) => ({
      "@type": "Country",
      name: country,
    })),
    location: officeCountries.map((country) => ({
      "@type": "Place",
      name: `Xinergy · ${country}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
