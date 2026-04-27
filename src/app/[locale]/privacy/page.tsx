import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import PrivacyContent from "./PrivacyContent";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { buildAlternates, siteUrl } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";


const meta = {
 en: {
 title: "Privacy Policy",
 description:
 "StemTechLab privacy policy: what data we collect from parents and children, how it is stored and protected, COPPA compliance details, third-party AI providers (OpenAI, DeepSeek) disclosure, and how to request data deletion.",
 },
 ar: {
 title: "سياسة الخصوصية",
 description:
 "سياسة خصوصية ستم تك لاب: البيانات التي نجمعها من أولياء الأمور والأطفال، كيف نحفظها ونحميها، التوافق مع COPPA، الإفصاح عن مزودي الذكاء الاصطناعي (OpenAI وDeepSeek)، وكيفية طلب حذف البيانات.",
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
 alternates: buildAlternates(lang, "/privacy"),
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: siteUrl(lang, "/privacy"),
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
