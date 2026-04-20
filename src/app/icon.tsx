import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "7px",
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: 800, color: "white", lineHeight: 1, letterSpacing: "-0.5px" }}>
          STL
        </span>
        <div style={{ width: "22px", height: "2px", background: "white", borderRadius: "1px", marginTop: "2px" }} />
      </div>
    ),
    { ...size }
  );
}
