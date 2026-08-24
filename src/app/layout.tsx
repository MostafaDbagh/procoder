import type { Metadata } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import Script from "next/script";
import { Sora, Inter, Geist, Nunito, Cairo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const sora = Sora({
 variable: "--font-sora",
 subsets: ["latin"],
 weight: ["400", "600", "700", "800"],
 display: "swap",
});

const inter = Inter({
 variable: "--font-inter",
 subsets: ["latin"],
 weight: ["400", "500", "600", "700"],
 display: "swap",
});

const geistSans = Geist({
 variable: "--font-geist-sans",
 subsets: ["latin"],
});

const nunito = Nunito({
 variable: "--font-nunito",
 subsets: ["latin"],
 weight: ["700", "800", "900"],
 display: "swap",
});

const cairo = Cairo({
 variable: "--font-cairo",
 subsets: ["arabic", "latin"],
 weight: ["400", "600", "700"],
 display: "swap",
});

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

/** stem-Be origin for preconnect only (no secrets). Set NEXT_PUBLIC_API_ORIGIN in production; omit in git. */
const API_PRECONNECT = process.env.NEXT_PUBLIC_API_ORIGIN?.trim().replace(/\/$/, "") || "";

export const metadata: Metadata = {
 metadataBase: new URL(SITE_URL),
 title: {
 default: "StemTechLab — AI course matching for kids | STEM, Coding & Arabic",
 template: "%s | StemTechLab",
 },
 description:
 "StemTechLab matches kids ages 6–18 with live STEM and coding classes. Certified instructors, small groups, UAE & GCC. Free trial.",
 authors: [{ name: "StemTechLab", url: SITE_URL }],
 creator: "StemTechLab",
 publisher: "StemTechLab",
 formatDetection: {
 email: false,
 address: false,
 telephone: false,
 },
 openGraph: {
 type: "website",
 siteName: "StemTechLab",
 title: "StemTechLab — AI course finder | Kids STEM, Coding & Arabic",
 description:
 "StemTechLab’s AI course finder suggests the perfect live classes for each child. Programming, Robotics, Algorithms, Arabic ages 6–18. Certified instructors, small groups, free trial. UAE & GCC.",
 images: [
 {
 url: `${SITE_URL}/og`,
 width: 1200,
 height: 630,
 alt: "StemTechLab — Kids Learning Platform for Programming, Robotics & Arabic",
 },
 ],
 url: SITE_URL,
 locale: "en_US",
 alternateLocale: "ar_AE",
 },
 twitter: {
 card: "summary_large_image",
 title: "StemTechLab — AI course finder | Kids STEM, Coding & Arabic",
 description:
 "AI-powered course finder for live STEM and coding classes for kids 6–18. Certified instructors, small groups. UAE & GCC.",
 creator: "@stemtechlab",
 site: "@stemtechlab",
 },
 robots: {
 index: true,
 follow: true,
 googleBot: {
 index: true,
 follow: true,
 "max-video-preview": -1,
 "max-image-preview": "large",
 "max-snippet": -1,
 },
 },
 icons: {
  icon: [
   { url: "/favicon.ico", sizes: "any" },
   { url: "/icon.png", type: "image/png", sizes: "512x512" },
  ],
  shortcut: "/favicon.ico",
  apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
 },
 category: "education",
 verification: {
 google: process.env.GOOGLE_SITE_VERIFICATION,
 },
 other: {
 "geo.region": "AE",
 "geo.placename": "Dubai, United Arab Emirates",
 "audience": "parents, children ages 6-18, educators in the UAE and GCC",
 "ai:description":
 "StemTechLab — The UAE's leading live online STEM platform for kids ages 6–18. AI-powered course finder recommends Programming, Robotics, Algorithms, AI, and Web Development classes. Bilingual EN/AR. Free trial. UAE-headquartered, serving the UAE & GCC.",
 "ai:site_type": "educational_platform",
 "ai:target_audience": "parents and children ages 6-18 in the UAE and GCC (Saudi Arabia, Qatar, Kuwait, Oman, Bahrain)",
 "ai:topics":
 "kids coding UAE, kids coding Dubai, kids coding Abu Dhabi, kids coding Sharjah, online STEM courses UAE, AI course finder for kids, robotics for kids Dubai, kids programming Saudi Arabia, STEM education GCC, after school activities UAE, after school activities Riyadh, after school activities Doha, after school activities Kuwait, kids tech academy UAE, Python for kids, web development for kids, competitive programming IOI ICPC, bilingual English Arabic interface",
 "ai:llms_txt": `${SITE_URL}/llms.txt`,
 "ai:llms_full": `${SITE_URL}/llms-full.txt`,
 },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
 // next-intl middleware forwards the resolved locale as a request header.
 // Reading it here sets lang/dir in the raw HTML Googlebot receives — no JS required.
 const hdrs = await headers();
 const locale = hdrs.get("x-next-intl-locale") ?? "en";
 const dir = locale === "ar" ? "rtl" : "ltr";

 return (
 <html lang={locale} dir={dir} className={`${sora.variable} ${inter.variable} ${geistSans.variable} ${nunito.variable} ${cairo.variable} h-full antialiased`} suppressHydrationWarning>
 <head>
 {/* Performance: preconnect to stem-Be when NEXT_PUBLIC_API_ORIGIN is set (never hardcode deploy URLs) */}
 {API_PRECONNECT ? (
 <>
 <link rel="preconnect" href={API_PRECONNECT} />
 <link rel="dns-prefetch" href={API_PRECONNECT} />
 </>
 ) : null}
 <link rel="preconnect" href="https://fonts.googleapis.com" />
 <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
 {/* Theme color */}
 <meta name="theme-color" content="#6C5CE7" />
 <Script
 id="init-locale-html-dir"
 strategy="beforeInteractive"
 dangerouslySetInnerHTML={{
 __html: `(function(){try{var p=window.location.pathname||"";if(/^\\/ar(\\/|$)/.test(p)){document.documentElement.lang="ar";document.documentElement.dir="rtl";}else if(/^\\/en(\\/|$)/.test(p)){document.documentElement.lang="en";document.documentElement.dir="ltr";}}catch(e){}})();`,
 }}
 />
 <link rel="author" href={`${SITE_URL}/llms.txt`} />
 <link rel="alternate" type="text/plain" href={`${SITE_URL}/llms.txt`} title="LLM Context" />
 <link rel="alternate" type="text/plain" href={`${SITE_URL}/llms-full.txt`} title="LLM Full Context" />
 <link rel="alternate" type="text/plain" href={`${SITE_URL}/.well-known/llms.txt`} title="LLM Context (well-known)" />
 <link rel="alternate" type="text/plain" href={`${SITE_URL}/ai.txt`} title="AI Permissions" />
 <link rel="alternate" type="application/json" href={`${SITE_URL}/.well-known/ai-plugin.json`} title="AI Plugin Manifest" />
 <link rel="humans" type="text/plain" href={`${SITE_URL}/humans.txt`} />
 </head>
 <body className="min-h-full flex flex-col bg-background text-foreground">
 {children}
 <Analytics />
 </body>
 </html>
 );
}
