import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #7c6ff7, #5b52e8)",
          borderRadius: "38px",
        }}
      >
        <span style={{ fontSize: "72px", fontWeight: 800, color: "white", lineHeight: 1, letterSpacing: "-3px" }}>
          STL
        </span>
        <div style={{ width: "110px", height: "8px", background: "white", borderRadius: "4px", marginTop: "10px" }} />
      </div>
    ),
    { ...size }
  );
}
