import { SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { getPublicCareers } from "@/lib/careers-api";
import CareersContent from "./CareersContent";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";


const meta = {
 en: {
 title: "Careers at StemTechLab | Teach Kids Coding & STEM Online",
 description:
 "Explore current opportunities at StemTechLab. Read role descriptions, requirements and application details for the positions currently available.",
 },
 ar: {
 title: "وظائف ستم تك لاب | علّم البرمجة وSTEM للأطفال أونلاين",
 description:
 "استكشف فرص العمل الحالية في ستم تك لاب، واقرأ وصف كل وظيفة ومتطلباتها وطريقة التقديم للفرص المتاحة.",
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
 title: { absolute: meta[lang].title },
 description: meta[lang].description,
 alternates: buildAlternates(lang, "/careers"),
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: siteUrl(lang, "/careers"),
 type: "website",
 siteName: "StemTechLab",
 locale: lang === "ar" ? "ar_AE" : "en_US",
 alternateLocale: lang === "ar" ? "en_US" : "ar_AE",
 images: [{ url: `${SITE_URL}/og?locale=${lang}`, width: 1200, height: 630, alt: "StemTechLab Careers" }],
 },
 twitter: {
 card: "summary_large_image",
 title: meta[lang].title,
 description: meta[lang].description,
 },
 };
}

export default async function CareersPage({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 const lang = locale === "ar" ? "ar" : "en";
 setRequestLocale(locale);
 const careers = await getPublicCareers();
 return (
 <>
 <BreadcrumbSchema
 items={[
 { name: bcLabel("Home", locale), url: siteUrl(lang, "") },
 { name: bcLabel("Careers", locale), url: siteUrl(lang, "/careers") },
 ]}
 />
 <CareersContent careers={careers} locale={locale} />
 </>
 );
}
