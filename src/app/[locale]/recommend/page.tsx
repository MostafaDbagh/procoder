import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import RecommendContent from "./RecommendContent";
import { getCoursesISR } from "@/lib/server-api";

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

const meta = {
 en: {
 title: "AI course finder for kids | OpenAI & DeepSeek",
 description:
 "Find the best live course for your child: AI-powered matching (OpenAI & DeepSeek), or a quick form. Ages 6–18.",
 },
 ar: {
 title: "مُنتقي الدورات بالذكاء الاصطناعي لطفلك",
 description:
 "اكتشف أفضل حصة مناسبة لطفلك: مطابقة بالذكاء الاصطناعي (OpenAI وDeepSeek) أو نموذج سريع. للأعمار ٦–١٨.",
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
 images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "StemTechLab" }],
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
 return <RecommendContent initialCourses={initialCourses} />;
}
