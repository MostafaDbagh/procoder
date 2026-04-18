import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import PrivacyContent from "./PrivacyContent";
import { BreadcrumbSchema } from "@/components/StructuredData";

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

const meta = {
 en: {
 title: "Privacy Policy",
 description:
 "How StemTechLab handles children’s data and online safety (COPPA-aware).",
 },
 ar: {
 title: "سياسة الخصوصية",
 description:
 "كيف تتعامل ستم تك لاب مع بيانات الأطفال والسلامة عبر الإنترنت.",
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
 canonical: `${SITE_URL}/${lang}/privacy`,
 languages: { en: `${SITE_URL}/en/privacy`, ar: `${SITE_URL}/ar/privacy`, "x-default": `${SITE_URL}/en/privacy` },
 },
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: `${SITE_URL}/${lang}/privacy`,
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

export default async function PrivacyPage({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 setRequestLocale(locale);
 return (
 <>
 <BreadcrumbSchema
 items={[
 { name: "Home", url: `${SITE_URL}/${locale}` },
 { name: "Privacy", url: `${SITE_URL}/${locale}/privacy` },
 ]}
 />
 <PrivacyContent />
 </>
 );
}
