import { ImageResponse } from "next/og";
import { getContent } from "@/lib/content";

export const alt = "Xinergy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function OpenGraphImage({ params }: Props) {
  const { locale } = await params;
  const { brand } = getContent(locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #3f374b 0%, #2a2433 55%, #1f1a26 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#e8622a",
            }}
          />
          <span style={{ fontSize: 28, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            {brand.name}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 920 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            {brand.claim}
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.35, color: "rgba(255,255,255,0.78)" }}>
            {brand.tagline}
          </div>
        </div>
        <div style={{ fontSize: 22, color: "#e8622a", letterSpacing: "0.08em" }}>
          xinergy.lat
        </div>
      </div>
    ),
    size,
  );
}
