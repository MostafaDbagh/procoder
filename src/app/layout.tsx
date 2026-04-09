import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ProCoder — Kids Learning Platform",
    template: "%s | ProCoder",
  },
  description:
    "Fun, interactive courses in Programming, Robotics, Algorithms, Arabic & Quran for ages 6–18",
  keywords: [
    "kids coding",
    "children programming",
    "robotics for kids",
    "quran learning",
    "arabic for kids",
    "algorithms",
    "online learning platform",
    "STEM education",
    "coding for children",
    "learn programming online",
    "kids robotics classes",
    "quran memorization online",
    "arabic language for kids",
  ],
  authors: [{ name: "ProCoder", url: SITE_URL }],
  creator: "ProCoder",
  publisher: "ProCoder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "ProCoder",
    title: "ProCoder — Kids Learning Platform",
    description:
      "Fun, interactive courses in Programming, Robotics, Algorithms, Arabic & Quran for ages 6–18. Live online classes with qualified instructors.",
    url: SITE_URL,
    locale: "en_US",
    alternateLocale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProCoder — Kids Learning Platform",
    description:
      "Fun, interactive courses in Programming, Robotics, Algorithms, Arabic & Quran for ages 6–18",
    creator: "@procoder",
    site: "@procoder",
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
  alternates: {
    canonical: SITE_URL,
    languages: {
      en: `${SITE_URL}/en`,
      ar: `${SITE_URL}/ar`,
    },
  },
  category: "education",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
