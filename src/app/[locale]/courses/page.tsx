import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import CoursesContent from "./CoursesContent";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { buildAlternates, siteUrl } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

// Force SSR — admin price/status changes reflect immediately
export const dynamic = "force-dynamic";


const meta = {
 en: {
 title: "Kids’ coding & STEM courses | Live online (6–18)",
 description:
 "12 live online courses for children ages 6–18: Scratch, Python, Web Development, Game Dev, Robotics, Advanced Robotics, Algorithms, Competitive Programming (IOI/ICPC), and 4 Arabic Language tracks. Each course lists age range, level, duration, and lesson count. Free trial available.",
 },
 ar: {
 title: "دورات برمجة وSTEM للأطفال | مباشرة أونلاين ٦–١٨",
 description:
 "١٢ دورة مباشرة أونلاين للأطفال من ٦ إلى ١٨ سنة: سكراتش، بايثون، تطوير مواقع، تطوير ألعاب، روبوتات، روبوتات متقدمة، خوارزميات، برمجة تنافسية (IOI/ICPC)، وأربع مسارات للغة العربية. كل دورة تحدد الفئة العمرية والمستوى والمدة وعدد الحصص. تجربة مجانية متاحة.",
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
 alternates: buildAlternates(lang, "/courses"),
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: siteUrl(lang, "/courses"),
 type: "website",
 siteName: "StemTechLab",
 locale: lang === "ar" ? "ar_SA" : "en_US",
 alternateLocale: lang === "ar" ? "en_US" : "ar_SA",
 images: [{ url: `${SITE_URL}/og`, width: 1200, height: 630, alt: "StemTechLab" }],
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
 const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";
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
