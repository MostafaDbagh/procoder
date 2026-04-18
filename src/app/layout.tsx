import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
 variable: "--font-geist-sans",
 subsets: ["latin"],
});

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

export const metadata: Metadata = {
 metadataBase: new URL(SITE_URL),
 title: {
 default: "StemTechLab — Kids Learning Platform",
 template: "%s | StemTechLab",
 },
 description:
 "AI-powered course matching (OpenAI & DeepSeek) helps pick the best live class for your child—plus coding, robotics, algorithms, Arabic for ages 6–18. Certified instructors, GCC & worldwide. Free trial.",
 keywords: [
 // --- Kids coding & programming ---
 "kids coding classes",
 "coding for kids online",
 "kids coding Saudi Arabia",
 "children programming UAE",
 "kids coding classes Dubai",
 "kids coding classes Abu Dhabi",
 "children coding Dubai",
 "kids programming Sharjah",
 "kids coding Turkey",
 "children programming Canada",
 "coding for children Qatar",
 "learn programming online kids",
 "Scratch programming for kids",
 "Python for kids",
 "kids game development course",
 "web development for teens",
 "competitive programming IOI kids",
 // --- Kids tutorials & CS foundations (high intent) ---
 "coding tutorials for kids",
 "STEM tutorials for kids",
 "kids coding lessons",
 "learn to code for kids",
 "computer science for kids",
 "programming tutorials for kids",
 "block coding for kids",
 "visual programming for kids",
 "computational thinking for kids",
 "technology classes for kids",
 "digital skills for kids",
 "beginner coding for kids",
 "kids software basics",
 // --- STEM education ---
 "STEM education for kids",
 "STEM classes for children",
 "STEM education GCC",
 "STEM education United Arab Emirates",
 "STEM courses Europe",
 "STEM activities for kids",
 "STEM learning platform",
 "STEM after school program",
 "best STEM programs for kids",
 // --- Robotics ---
 "robotics for kids",
 "robotics for kids Dubai",
 "kids robotics classes Kuwait",
 "robotics classes Dubai Abu Dhabi",
 "online robotics course children",
 "robot building for kids",
 // --- After school activities ---
 "after school activities for kids",
 "after school programs near me",
 "after school coding classes",
 "after school enrichment programs",
 "extracurricular activities for kids",
 "after school STEM activities",
 "weekend classes for kids",
 "summer coding camp for kids",
 "holiday programs for children",
 // --- Kids teaching & education ---
 "online tutoring for kids",
 "online classes for kids",
 "online classes for kids UAE",
 "online learning platform Middle East",
 "online tutoring Oman Bahrain",
 "kids online learning platform",
 "best online courses for kids",
 "live online classes for children",
 "small group tutoring kids",
 "private tutoring for children online",
 "personalized learning for kids",
 // --- Kids care & development ---
 "kids educational activities",
 "child development programs",
 "creative activities for kids",
 "kids enrichment programs",
 "safe online platform for kids",
 "kids learning from home",
 "homeschool coding curriculum",
 "educational games for children",
 "fun learning activities for kids",
 // --- Arabic language ---
 "arabic for kids online",
 "arabic classes for kids online",
 "arabic language for kids",
 "learn arabic for children",
 "arabic reading and writing for kids",
 // --- Arabic keywords: البرمجة والتعليم ---
 "تعليم البرمجة للأطفال",
 "دورات برمجة للأطفال أونلاين",
 "تعليم البرمجة للأطفال السعودية",
 "دورات برمجة أطفال دبي",
 "تعليم البرمجة أبوظبي",
 "برمجة سكراتش للأطفال",
 "تعلم بايثون للأطفال",
 "دورات تطوير ألعاب للأطفال",
 "دروس برمجة للأطفال أونلاين",
 "دروس STEM للأطفال",
 "علوم الحاسوب للأطفال",
 "تعلم أساسيات البرمجة للأطفال",
 "مهارات رقمية للأطفال",
 // --- Arabic keywords: STEM والروبوتات ---
 "تعليم STEM للأطفال",
 "دورات STEM أطفال الشرق الأوسط",
 "أنشطة STEM للأطفال",
 "دورات روبوتات للأطفال",
 "دورات روبوتات أطفال الإمارات",
 "تعليم الروبوتات للأطفال أونلاين",
 // --- Arabic keywords: أنشطة ما بعد المدرسة ---
 "أنشطة أطفال بعد المدرسة",
 "أنشطة لا منهجية للأطفال",
 "برامج إثرائية للأطفال",
 "أنشطة صيفية للأطفال",
 "دورات نهاية الأسبوع للأطفال",
 "أنشطة تعليمية ممتعة للأطفال",
 // --- Arabic keywords: التعليم والرعاية ---
 "تعليم الأطفال أونلاين",
 "منصة تعليم أطفال آمنة",
 "تعليم الأطفال عن بعد",
 "دورات أطفال أونلاين",
 "دورات أطفال السعودية",
 "تعليم الأطفال الإمارات",
 "دورات تعليمية أطفال قطر",
 "دورات أطفال الكويت",
 "تعليم الأطفال عن بعد الخليج",
 "دورات أطفال أونلاين كندا أمريكا",
 "تعلم البرمجة للأطفال تركيا",
 // --- Arabic keywords: العربية ---
 "تعليم العربية للأطفال",
 "دورات عربية للأطفال أونلاين",
 "تعلم القراءة والكتابة العربية للأطفال",
 // --- Arabic keywords: رعاية الأطفال ---
 "أنشطة تنمية مهارات الأطفال",
 "تعليم الأطفال في المنزل",
 "أنشطة إبداعية للأطفال",
 "برامج تعليمية للأطفال أونلاين",
 "ألعاب تعليمية للأطفال",
 ],
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
 title: "StemTechLab — Kids Coding, Robotics & Arabic Platform | Saudi Arabia, UAE, GCC & Worldwide",
 description:
 "AI suggests the best course for each child (OpenAI & DeepSeek). Live Programming, Robotics, Algorithms, Arabic for ages 6–18. GCC & worldwide. Certified instructors, small groups, free trial.",
 images: [
 {
 url: `${SITE_URL}/og-image.png`,
 width: 1200,
 height: 630,
 alt: "StemTechLab — Kids Learning Platform for Programming, Robotics & Arabic",
 },
 ],
 url: SITE_URL,
 locale: "en_US",
 alternateLocale: "ar_SA",
 },
 twitter: {
 card: "summary_large_image",
 title: "StemTechLab — Kids Coding, Robotics & Arabic | GCC & Worldwide",
 description:
 "AI course finder with OpenAI & DeepSeek. Live Programming, Robotics, Algorithms, Arabic for kids 6–18. Saudi Arabia, UAE, Qatar, Kuwait, Turkey, Canada, US, Europe.",
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
 alternates: {
 canonical: SITE_URL,
 languages: {
 en: `${SITE_URL}/en`,
 ar: `${SITE_URL}/ar`,
 "x-default": `${SITE_URL}/en`,
 },
 },
 category: "education",
 verification: {
 google: process.env.GOOGLE_SITE_VERIFICATION,
 },
 other: {
 "geo.region": "AE",
 "geo.placename": "Dubai, United Arab Emirates",
 "distribution": "global",
 "rating": "general",
 "target": "Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain, Turkey, Syria, Canada, United States, United Kingdom, Germany, France, Netherlands, Sweden",
 "audience": "parents, children ages 6-18, educators",
 "ai:description":
 "StemTechLab — Online learning for ages 6–18. Core feature: AI-powered course matching so parents can find the best live course for each child, powered by OpenAI and DeepSeek integrations. Programming, Robotics, Algorithms, Arabic. Free trial. GCC & worldwide.",
 "ai:site_type": "educational_platform",
 "ai:target_audience": "parents, children ages 6-18, educators in GCC, Middle East, Europe, North America",
 "ai:topics":
 "AI course recommendation for children, OpenAI DeepSeek course matching, personalized kids STEM classes, kids coding tutorials, STEM tutorials for kids, computer science for kids, computational thinking, kids coding Saudi Arabia, children programming UAE, STEM education GCC, robotics for kids Dubai, Arabic language classes online, Arabic language learning, competitive programming, Scratch, Python, web development, after school activities Qatar Kuwait Oman",
 "ai:llms_txt": `${SITE_URL}/llms.txt`,
 "ai:llms_full": `${SITE_URL}/llms-full.txt`,
 },
};

export default function RootLayout({ children }: { children: ReactNode }) {
 return (
 <html lang="en" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
 <head>
 {/* Performance: preconnect to backend API + Google Fonts (like Tynker/CodaKid/Codingal) */}
 <link rel="preconnect" href="https://procoderbe.onrender.com" />
 <link rel="dns-prefetch" href="https://procoderbe.onrender.com" />
 <link rel="preconnect" href="https://fonts.googleapis.com" />
 <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
 {/* Theme color (all 5 competitors use this) */}
 <meta name="theme-color" content="#6C5CE7" />
 {/* Apple touch icon (competitors have multiple favicon sizes) */}
 <link rel="apple-touch-icon" sizes="180x180" href="/logo.svg" />
 <link rel="icon" type="image/svg+xml" href="/logo.svg" />
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
