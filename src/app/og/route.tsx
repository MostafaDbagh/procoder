import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * Load Cairo (an Arabic-first Google Font) as TTF bytes.
 * Requesting with a legacy User-Agent forces Google Fonts to serve TTF instead
 * of WOFF2, which is the format Satori (used by ImageResponse) needs.
 */
async function loadArabicFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Cairo:wght@700&display=block",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 5.1; rv:14.0) Gecko/20100101 Firefox/14.0.1",
        },
      }
    ).then((r) => r.text());

    // Extract the first url(...) from the CSS
    const match = css.match(/url\(([^)]+)\)/);
    if (!match?.[1]) return null;

    return await fetch(match[1]).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

const EN_TAGLINE = "Live coding, robotics & Arabic classes for kids ages 6–18";
const AR_TAGLINE = "دروس مباشرة في البرمجة والروبوتات والعربية للأطفال ٦–١٨";

const EN_CATS = ["Programming", "Robotics", "Algorithms", "Arabic", "Game Dev"];
const AR_CATS = ["البرمجة", "الروبوتات", "الخوارزميات", "العربية", "تطوير الألعاب"];

export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);

  const locale = searchParams.get("locale") || "en";
  const isAr = locale === "ar";

  // Optional per-page overrides passed by metadata builders
  const customTitle = searchParams.get("title") || "";
  const customCat = searchParams.get("cat") || "";

  const tagline = isAr ? AR_TAGLINE : EN_TAGLINE;
  const cats = isAr ? AR_CATS : EN_CATS;
  const displayCats = customCat
    ? [customCat, ...cats.filter((c) => c !== customCat)].slice(0, 5)
    : cats;

  // Load Arabic font only when needed
  const arabicFontData = isAr ? await loadArabicFont() : null;
  const fontFamily = arabicFontData ? "Cairo" : "sans-serif";

  const fonts = arabicFontData
    ? [{ name: "Cairo", data: arabicFontData, weight: 700 as const, style: "normal" as const }]
    : undefined;

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
          fontFamily,
          direction: isAr ? "rtl" : "ltr",
          padding: "40px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "28px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${origin}/logo.png`}
            width={400}
            height={236}
            alt="STEM Tech Lab"
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Course title (when coming from a course detail page) */}
        {customTitle ? (
          <p
            style={{
              fontSize: "38px",
              color: "#e2e8f0",
              textAlign: "center",
              maxWidth: "960px",
              lineHeight: 1.25,
              marginBottom: "14px",
              fontWeight: 700,
            }}
          >
            {customTitle}
          </p>
        ) : null}

        {/* Tagline */}
        <p
          style={{
            fontSize: customTitle ? "22px" : "28px",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "820px",
            lineHeight: 1.45,
            marginBottom: "0px",
          }}
        >
          {tagline}
        </p>

        {/* Category pills */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "28px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {displayCats.map((cat) => (
            <span
              key={cat}
              style={{
                padding: "8px 22px",
                borderRadius: "999px",
                background: "rgba(99, 102, 241, 0.22)",
                border: "1px solid rgba(165, 180, 252, 0.25)",
                color: "#a5b4fc",
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );
}
