import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/constants";

export const alt = `${SITE_NAME} — Free QR Code Generator`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A simple QR-like pattern drawn with boxes, so the image needs no assets.
const PATTERN = [
  "1111111.1.1.1111111",
  "1.....1.111.1.....1",
  "1.111.1..1..1.111.1",
  "1.111.1.1.1.1.111.1",
  "1.111.1..11.1.111.1",
  "1.....1.1...1.....1",
  "1111111.1.1.1111111",
  "........11.........",
  "1.11.1111..1.11.1.1",
  ".1..1..1.11.1..11..",
  "11.1.11.1.1.111.1.1",
  "..1.11..11.1..1..1.",
  "1.1.1.11..1.11.1111",
  "........1.1.1...1..",
  "1111111..11.1.1.1.1",
  "1.....1.1..111...1.",
  "1.111.1.11.1.11111.",
  "1.111.1..1..1..1.1.",
  "1.111.1.1.111.11..1",
  "1.....1..1.1..1.1..",
  "1111111.1..11.1.111",
];

export default function OpenGraphImage() {
  const cell = 14;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 88px",
          background: "linear-gradient(135deg, #030712 0%, #111827 60%, #1f2937 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 680 }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 40, fontWeight: 700 }}>
            <span style={{ color: "#C45B28" }}>QR</span>
            <span>Forge</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>
            Free QR Code Generator
          </div>
          <div style={{ marginTop: 24, fontSize: 30, color: "#9ca3af", lineHeight: 1.4 }}>
            Create, customize, and track QR codes for URLs, Wi-Fi, vCards, and more.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 20,
            background: "#ffffff",
            borderRadius: 24,
          }}
        >
          {PATTERN.map((row, y) => (
            <div key={y} style={{ display: "flex" }}>
              {row.split("").map((c, x) => (
                <div
                  key={x}
                  style={{
                    width: cell,
                    height: cell,
                    background: c === "1" ? "#030712" : "#ffffff",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
