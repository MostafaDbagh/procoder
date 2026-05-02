import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import AboutContent from "./AboutContent";
import { getTeamPublicISR } from "@/lib/server-api";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";


const meta = {
 en: {
 title: "About StemTechLab | First AI agent for kids’ learning & future",
 description:
 "StemTechLab is a live online STEM platform for kids combining Arabic-native instruction, AI-powered course matching, and small classes. Programming, Robotics, Algorithms & Arabic for ages 6–18 in UAE, Netherlands & Germany. Certified instructors, max 8 students, COPPA-compliant.",
 },
 ar: {
 title: "عن ستم تك لاب | منصة STEM وبرمجة موثوقة للأطفال",
 description:
 "ستم تك لاب منصة تعليم مباشر أونلاين للأطفال تجمع التعليم بالعربية الأصلية ومطابقة الدورات بالذكاء الاصطناعي وفصول صغيرة. برمجة وروبوتات وخوارزميات وعربية للأعمار ٦–١٨ في الإمارات وهولندا وألمانيا. معلمون معتمدون، حد أقصى ٨ طلاب، متوافقة مع COPPA.",
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
 alternates: buildAlternates(lang, "/about"),
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: siteUrl(lang, "/about"),
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
 { name: bcLabel("Home", locale), url: `${SITE_URL}/${locale}` },
 { name: bcLabel("About", locale), url: `${SITE_URL}/${locale}/about` },
 ]}
 />
 <AboutContent cmsTeam={cmsTeam} />
 </>
 );
}
