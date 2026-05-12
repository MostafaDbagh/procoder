import { NextResponse } from "next/server";

type Manifest = {
 name: string;
 short_name: string;
 description: string;
 lang: string;
 dir: "ltr" | "rtl";
 scope: string;
 start_url: string;
 display: string;
 orientation: string;
 categories: string[];
 background_color: string;
 theme_color: string;
 icons: { src: string; sizes: string; type: string; purpose?: string }[];
};

const MANIFESTS: Record<"en" | "ar", Manifest> = {
 en: {
 name: "StemTechLab — Kids Coding, STEM & Arabic",
 short_name: "StemTechLab",
 description:
 "Live online classes for kids 6–18 in coding, robotics, algorithms & Arabic. UAE & GCC.",
 lang: "en",
 dir: "ltr",
 scope: "/en/",
 start_url: "/en/",
 display: "standalone",
 orientation: "portrait",
 categories: ["education", "kids"],
 background_color: "#ffffff",
 theme_color: "#6C5CE7",
 icons: [
 { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
 { src: "/logo.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
 { src: "/logo.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
 ],
 },
 ar: {
 name: "ستم تك لاب — البرمجة وSTEM والعربية للأطفال",
 short_name: "ستم تك لاب",
 description:
 "حصص مباشرة للأطفال ٦–١٨ في البرمجة والروبوتات والخوارزميات والعربية. الإمارات ودول الخليج.",
 lang: "ar",
 dir: "rtl",
 scope: "/ar/",
 start_url: "/ar/",
 display: "standalone",
 orientation: "portrait",
 categories: ["education", "kids"],
 background_color: "#ffffff",
 theme_color: "#6C5CE7",
 icons: [
 { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
 { src: "/logo.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
 { src: "/logo.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
 ],
 },
};

export async function GET(
 _request: Request,
 { params }: { params: Promise<{ locale: string }> }
) {
 const { locale } = await params;
 const lang: "en" | "ar" = locale === "ar" ? "ar" : "en";
 return NextResponse.json(MANIFESTS[lang], {
 headers: {
 "Content-Type": "application/manifest+json; charset=utf-8",
 "Cache-Control": "public, max-age=3600, s-maxage=86400",
 },
 });
}
