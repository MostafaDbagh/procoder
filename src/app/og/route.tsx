import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
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
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background: "#6366f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
            }}
          >
            &#10024;
          </div>
          <span
            style={{
              fontSize: "56px",
              fontWeight: 800,
              background: "linear-gradient(90deg, #6366f1, #a855f7)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            StemTechLab
          </span>
        </div>
        <p
          style={{
            fontSize: "28px",
            color: "#cbd5e1",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          Live coding, robotics &amp; Arabic classes for kids ages 6-18
        </p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "32px",
          }}
        >
          {["Programming", "Robotics", "Algorithms", "Arabic", "Game Dev"].map(
            (cat) => (
              <span
                key={cat}
                style={{
                  padding: "8px 20px",
                  borderRadius: "999px",
                  background: "rgba(99, 102, 241, 0.2)",
                  color: "#a5b4fc",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                {cat}
              </span>
            )
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
