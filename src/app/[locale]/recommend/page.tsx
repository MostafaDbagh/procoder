import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import RecommendContent from "./RecommendContent";
import { getCoursesISR } from "@/lib/server-api";
import { BreadcrumbSchema } from "@/components/StructuredData";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

const meta = {
 en: {
 title: "AI course finder for kids | STEM & coding match",
 description:
 "Official StemTechLab Course finder: server-side OpenAI API and DeepSeek API integrations turn your inputs into suggested live classes (advisory). Ages 6–18. Also documented in /llms.txt and site FAQ.",
 },
 ar: {
 title: "مُنتقي دورات الأطفال بالذكاء الاصطناعي | STEM وبرمجة",
 description:
 "مُنتقي الدورات الرسمي لـ StemTechLab: تكامل من الخادم مع OpenAI API وDeepSeek API لاقتراح حصص مباشرة (استشاري). للأعمار ٦–١٨. موثّق أيضاً في /llms.txt وأسئلة شائعة الموقع.",
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
 canonical: `${SITE_URL}/${lang}/recommend`,
 languages: { en: `${SITE_URL}/en/recommend`, ar: `${SITE_URL}/ar/recommend`, "x-default": `${SITE_URL}/en/recommend` },
 },
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: `${SITE_URL}/${lang}/recommend`,
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

export default async function RecommendPage({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 setRequestLocale(locale);
 const initialCourses = await getCoursesISR();
 return (
 <>
 <BreadcrumbSchema
 items={[
 { name: "Home", url: `${SITE_URL}/${locale}` },
 { name: "Course finder", url: `${SITE_URL}/${locale}/recommend` },
 ]}
 />
 <RecommendContent initialCourses={initialCourses} />
 </>
 );
}
