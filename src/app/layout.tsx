import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
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
    "AI-powered course matching (OpenAI & DeepSeek) helps pick the best live class for your child—plus coding, robotics, algorithms, Arabic & Quran for ages 6–18. Certified instructors, GCC & worldwide. Free trial.",
  keywords: [
    "kids coding Saudi Arabia",
    "children programming UAE",
    "robotics for kids Dubai",
    "quran learning online",
    "arabic for kids online",
    "STEM education GCC",
    "online learning platform Middle East",
    "coding for children Qatar",
    "kids robotics classes Kuwait",
    "quran memorization online Hifz",
    "Tajweed classes for kids",
    "arabic language for kids",
    "learn programming online kids",
    "Scratch Python for children",
    "after school coding classes",
    "kids coding Turkey",
    "children programming Canada",
    "STEM courses Europe",
    "online tutoring Oman Bahrain",
    "competitive programming IOI kids",
    "kids coding classes Abu Dhabi",
    "children coding Dubai",
    "online classes for kids UAE",
    "kids programming Sharjah",
    "STEM education United Arab Emirates",
    "robotics classes Dubai Abu Dhabi",
    "تعليم البرمجة للأطفال",
    "دورات روبوتات للأطفال",
    "تحفيظ القرآن أونلاين",
    "تعليم العربية للأطفال",
    "دورات أطفال السعودية",
    "تعليم الأطفال الإمارات",
    "دورات برمجة أطفال دبي",
    "تعليم البرمجة أبوظبي",
    "دورات روبوتات أطفال الإمارات",
    "تعليم القرآن للأطفال أونلاين",
    "دورات تعليمية أطفال قطر",
    "دورات أطفال الكويت",
    "تعليم البرمجة للأطفال عمان",
    "دورات تعليمية أطفال البحرين",
    "تعليم الأطفال عن بعد الخليج",
    "دورات STEM أطفال الشرق الأوسط",
    "تعلم البرمجة للأطفال تركيا",
    "دورات أطفال أونلاين كندا أمريكا",
    "أنشطة أطفال بعد المدرسة",
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
    title: "ProCoder — Kids Coding, Robotics & Quran Platform | Saudi Arabia, UAE, GCC & Worldwide",
    description:
      "AI suggests the best course for each child (OpenAI & DeepSeek). Live Programming, Robotics, Algorithms, Arabic & Quran for ages 6–18. GCC & worldwide. Certified instructors, small groups, free trial.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "ProCoder — Kids Learning Platform for Programming, Robotics & Quran",
      },
    ],
    url: SITE_URL,
    locale: "en_US",
    alternateLocale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProCoder — Kids Coding, Robotics & Quran | GCC & Worldwide",
    description:
      "AI course finder with OpenAI & DeepSeek. Live Programming, Robotics, Algorithms, Arabic & Quran for kids 6–18. Saudi Arabia, UAE, Qatar, Kuwait, Turkey, Canada, US, Europe.",
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
  other: {
    "geo.region": "SA",
    "geo.placename": "Riyadh, Saudi Arabia",
    "distribution": "global",
    "rating": "general",
    "target": "Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain, Turkey, Syria, Canada, United States, United Kingdom, Germany, France, Netherlands, Sweden",
    "audience": "parents, children ages 6-18, educators",
    "ai:description":
      "ProCoder — Online learning for ages 6–18. Core feature: AI-powered course matching so parents can find the best live course for each child, powered by OpenAI and DeepSeek integrations. Programming, Robotics, Algorithms, Arabic, Quran. Free trial. GCC & worldwide.",
    "ai:site_type": "educational_platform",
    "ai:target_audience": "parents, children ages 6-18, educators in GCC, Middle East, Europe, North America",
    "ai:topics":
      "AI course recommendation for children, OpenAI DeepSeek course matching, personalized kids STEM classes, kids coding Saudi Arabia, children programming UAE, STEM education GCC, robotics for kids Dubai, Quran online classes, Arabic language learning, competitive programming, Scratch, Python, web development, after school activities Qatar Kuwait Oman",
    "ai:llms_txt": `${SITE_URL}/llms.txt`,
    "ai:llms_full": `${SITE_URL}/llms-full.txt`,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
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
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
