import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import TermsContent from "./TermsContent";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { buildAlternates, siteUrl } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";


const meta = {
 en: {
 title: "Terms of Service",
 description:
 "StemTechLab terms of service: enrollment rules, cancellation and refund policy, acceptable use for students ages 6–18, instructor conduct standards, session recording policy, and platform usage conditions for parents and guardians.",
 },
 ar: {
 title: "شروط الخدمة",
 description:
 "شروط خدمة ستم تك لاب: قواعد التسجيل، سياسة الإلغاء والاسترداد، الاستخدام المقبول للطلاب من ٦ إلى ١٨ سنة، معايير سلوك المعلمين، سياسة تسجيل الجلسات، وشروط الاستخدام لأولياء الأمور.",
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
 alternates: buildAlternates(lang, "/terms"),
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: siteUrl(lang, "/terms"),
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
