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
 "StemTechLab built the first AI agent that analyses children’s learning behaviour and actions to recommend the right path and build their future. Live STEM, coding & Arabic for ages 6–18. GCC & worldwide.",
 },
 ar: {
 title: "عن ستم تك لاب | أول وكيل ذكاء اصطناعي لتحليل تعلّم الأطفال",
 description:
 "ستم تك لاب: أول وكيل ذكاء اصطناعي يحلّل سلوكيات الطفل وأفعاله التعليمية ليوصي بالمسار الصحيح ويبني مستقبله. برمجة وSTEM وعربية مباشرة للأعمار ٦–١٨. الخليج والعالم.",
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
