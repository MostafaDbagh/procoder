import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import TermsContent from "./TermsContent";
import { BreadcrumbSchema } from "@/components/StructuredData";

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

const meta = {
 en: {
 title: "Terms of Service",
 description:
 "Terms for using StemTechLab’s kids’ learning platform and live classes.",
 },
 ar: {
 title: "شروط الخدمة",
 description:
 "شروط استخدام منصة ستم تك لاب والحصص المباشرة للأطفال.",
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
 canonical: `${SITE_URL}/${lang}/terms`,
 languages: { en: `${SITE_URL}/en/terms`, ar: `${SITE_URL}/ar/terms`, "x-default": `${SITE_URL}/en/terms` },
 },
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: `${SITE_URL}/${lang}/terms`,
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

export default async function TermsPage({
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
 { name: "Terms", url: `${SITE_URL}/${locale}/terms` },
 ]}
 />
 <TermsContent />
 </>
 );
}
