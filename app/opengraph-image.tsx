import { ImageResponse } from "next/og";

export const alt = "PPC Guru — Google Partner & Meta Business Partner performance marketing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social/OG card for the site (cascades to routes that don't set their own).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#14170e",
          color: "#f1efe3",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#ceff3a" }}>PPC Guru</div>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 800, lineHeight: 1.1, marginTop: 24, maxWidth: 1000 }}>
          Ad spend, turned into booked jobs.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#9a9b88", marginTop: 28 }}>
          Google Partner &amp; Meta Business Partner · GTA · Canada &amp; USA
        </div>
      </div>
    ),
    { ...size },
  );
}
