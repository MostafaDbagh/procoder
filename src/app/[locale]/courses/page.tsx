import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import CoursesContent from "./CoursesContent";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

// ISR: rebuild every 5 minutes so price/status changes land quickly
// without hammering the backend on every crawl hit.
export const revalidate = 300;


const meta = {
 en: {
 title: "Kids’ coding & STEM courses | Live online (6–18)",
 description:
 "Live coding & STEM courses for kids 6–18: Python, Scratch, Robotics, Algorithms, Game Dev & Arabic. Certified teachers, small groups. Free trial.",
 },
 ar: {
 title: "دورات برمجة وSTEM للأطفال | مباشرة أونلاين ٦–١٨",
 description:
 "١٢ دورة مباشرة للأطفال ٦–١٨: بايثون، سكراتش، روبوتات، خوارزميات، تطوير الألعاب، عربية. معلمون معتمدون، مجموعات صغيرة. تجربة مجانية.",
 },
};

export async function generateMetadata({
 params,
}: {
 params: Promise<{ locale: string }>;
}): Promise<Metadata> {
 const { locale } = await params;
 const lang = locale === "ar" ? "ar" : "en";

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
 images: [{ url: `${SITE_URL}/og?locale=${lang}`, width: 1200, height: 630, alt: "StemTechLab" }],
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
 const homeUrl = `${SITE_URL}/${locale}`;
 const coursesUrl = `${SITE_URL}/${locale}/courses`;
 return (
 <>
 <BreadcrumbSchema items={[
 { name: bcLabel("Home", locale), url: homeUrl },
 { name: bcLabel("Courses", locale), url: coursesUrl },
 ]} />
 <CoursesContent />
 </>
 );
}
