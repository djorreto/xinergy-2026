export type PartnerLogo = { name: string; src: string };

/** Logos de partners en /public/partners */
export const partnerLogos: readonly PartnerLogo[] = [
  { name: "GEP", src: "/partners/gep.png" },
  { name: "SAP Ariba", src: "/partners/sap_ariba.png" },
  { name: "Jaggaer", src: "/partners/jaggaer.png" },
  { name: "EY", src: "/partners/ey.png" },
  { name: "Porsche Consulting", src: "/partners/porsche_consulting.png" },
  { name: "Globant", src: "/partners/globant.png" },
  { name: "UiPath", src: "/partners/uipath.png" },
  { name: "AWS", src: "/partners/aws.png" },
  { name: "monday.com", src: "/partners/monday.png" },
  { name: "Senegocia", src: "/partners/senegocia.png" },
  { name: "INDEXA", src: "/partners/indexa.png" },
  { name: "Webdox", src: "/partners/webdox.png" },
  { name: "Cleverit", src: "/partners/cleverit.png" },
  { name: "NoovaTech", src: "/partners/noovatech.png" },
  { name: "Digevo", src: "/partners/digevo.png" },
  { name: "DUX", src: "/partners/dux.png" },
  { name: "Iconstruye", src: "/partners/iconstruye.png" },
  { name: "Keedian", src: "/partners/keedian.png" },
  { name: "LIDEV", src: "/partners/lidev.png" },
  { name: "Valtin Consulting", src: "/partners/valtin_consulting.png" },
  { name: "Visa", src: "/partners/visa.png" },
] as const;
