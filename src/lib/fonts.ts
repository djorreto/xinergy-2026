import localFont from "next/font/local";

export const ttForsDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/TTForsDisplay-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/TTForsDisplay-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/TTForsDisplay-Bold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-tt-fors-display",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const univers = localFont({
  src: [
    {
      path: "../../public/fonts/Univers-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Univers-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-univers",
  display: "swap",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});
