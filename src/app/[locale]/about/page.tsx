import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import AboutContent from "./AboutContent";
import { getTeamPublicISR } from "@/lib/server-api";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { buildAlternates, siteUrl } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";


const meta = {
 en: {
 title: "About StemTechLab | First AI agent for kids’ learning & future",
 description:
 "StemTechLab is a live online learning platform for children ages 6–18 offering Programming, Robotics, Algorithms, and Arabic Language courses. Certified instructors, max 8 students per class, AI-powered course matching (OpenAI + DeepSeek), COPPA-compliant. Serving families across the GCC and worldwide.",
 },
 ar: {
 title: "عن ستم تك لاب | أول وكيل ذكاء اصطناعي لتحليل تعلّم الأطفال",
 description:
 "ستم تك لاب منصة تعليم مباشر أونلاين للأطفال من ٦ إلى ١٨ سنة، تقدم دورات في البرمجة والروبوتات والخوارزميات واللغة العربية. معلمون معتمدون، حد أقصى ٨ طلاب في كل فصل، تطابق الدورات بالذكاء الاصطناعي، ومتوافقة مع COPPA. تخدم العائلات في الخليج وحول العالم.",
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
 alternates: buildAlternates(lang, "/about"),
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: siteUrl(lang, "/about"),
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

export default async function AboutPage({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 setRequestLocale(locale);
 const cmsTeam = await getTeamPublicISR();
 return (
 <>
 <BreadcrumbSchema
 items={[
 { name: "Home", url: `${SITE_URL}/${locale}` },
 { name: "About", url: `${SITE_URL}/${locale}/about` },
 ]}
 />
 <AboutContent cmsTeam={cmsTeam} />
 </>
 );
}
