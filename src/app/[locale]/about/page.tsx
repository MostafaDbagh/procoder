import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import AboutContent from "./AboutContent";
import { getTeamPublicISR } from "@/lib/server-api";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";


const meta = {
 en: {
 title: "About StemTechLab | AI STEM Platform for Kids (6–18)",
 description:
 "We built the first AI that analyses a child’s learning behaviour to find the right course fit — not guesswork. Live STEM, coding & Arabic for kids 6–18 in UAE, Netherlands & Germany. Parent dashboard with real-time progress tracking, instructor notes, and weekly reports. Certified teachers, max 8 students, COPPA-compliant.",
 },
 ar: {
 title: "عن ستم تك لاب | منصة STEM ذكية للأطفال",
 description:
 "بنينا أول ذكاء اصطناعي يحلّل سلوك تعلّم طفلك لإيجاد الدورة الأنسب له — لا تخمين. دروس مباشرة في STEM والبرمجة والعربية للأطفال ٦–١٨ في الإمارات وهولندا وألمانيا. لوحة تحكم لأولياء الأمور بملاحظات المعلم وتقارير أسبوعية. معلمون معتمدون، حد أقصى ٨ طلاب، متوافقة مع COPPA.",
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
