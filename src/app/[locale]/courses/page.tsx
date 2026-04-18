import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import CoursesContent from "./CoursesContent";
import { BreadcrumbSchema } from "@/components/StructuredData";

// Force SSR — admin price/status changes reflect immediately
export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

const meta = {
 en: {
 title: "Kids’ coding & STEM courses | Live online (6–18)",
 description:
 "Browse live kids’ coding classes and STEM tutorials: Scratch, Python, robotics, algorithms, and Arabic. Structured paths for ages 6–18. Free trial. GCC & worldwide.",
 },
 ar: {
 title: "دورات برمجة وSTEM للأطفال | مباشرة أونلاين ٦–١٨",
 description:
 "استعرض دورات برمجة أطفال ودروس STEM مباشرة: سكراتش وبايثون وروبوتات وخوارزميات وعربية. مسارات للأعمار ٦–١٨. تجربة مجانية. الخليج والعالم.",
 },
};

export async function generateMetadata({
 params,
}: {
 params: Promise<{ locale: string }>;
}): Promise<Metadata> {
 const { locale } = await params;
 const lang = locale === "ar" ? "ar" : "en";
 const alt = lang === "en" ? "ar" : "en";

 return {
 title: meta[lang].title,
 description: meta[lang].description,
 alternates: {
 canonical: `${SITE_URL}/${lang}/courses`,
 languages: { en: `${SITE_URL}/en/courses`, ar: `${SITE_URL}/ar/courses`, "x-default": `${SITE_URL}/en/courses` },
 },
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: `${SITE_URL}/${lang}/courses`,
 type: "website",
 siteName: "StemTechLab",
 locale: lang === "ar" ? "ar_SA" : "en_US",
 alternateLocale: lang === "ar" ? "en_US" : "ar_SA",
 images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "StemTechLab" }],
 },
 twitter: {
 card: "summary_large_image",
 title: meta[lang].title,
 description: meta[lang].description,
 },
 };
}

export default async function CoursesPage({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 setRequestLocale(locale);
 const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";
 return (
 <>
 <BreadcrumbSchema items={[
 { name: "Home", url: `${SITE_URL}/${locale}` },
 { name: "Courses", url: `${SITE_URL}/${locale}/courses` },
 ]} />
 <CoursesContent />
 </>
 );
}
