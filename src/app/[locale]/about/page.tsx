import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import AboutContent from "./AboutContent";
import { getTeamPublicISR } from "@/lib/server-api";
import { BreadcrumbSchema } from "@/components/StructuredData";

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

const meta = {
 en: {
 title: "About StemTechLab | Kids’ STEM & coding education",
 description:
 "StemTechLab offers live STEM, coding, and Arabic for ages 6–18. Our Course finder uses OpenAI and DeepSeek API integrations (server-side) for advisory course suggestions—see this page and our Privacy Policy.",
 },
 ar: {
 title: "عن ستم تك لاب | تعليم STEM وبرمجة للأطفال",
 description:
 "ستم تك لاب: STEM وبرمجة وعربية مباشرة للأعمار ٦–١٨. مُنتقي الدورات يستخدم تكامل OpenAI وDeepSeek من الخادم لاقتراحات استشارية—راجع هذه الصفحة وسياسة الخصوصية.",
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
 canonical: `${SITE_URL}/${lang}/about`,
 languages: { en: `${SITE_URL}/en/about`, ar: `${SITE_URL}/ar/about`, "x-default": `${SITE_URL}/en/about` },
 },
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: `${SITE_URL}/${lang}/about`,
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
