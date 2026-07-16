import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { BreadcrumbSchema } from "@/components/StructuredData";
import CareersContent from "./CareersContent";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

const meta = {
 en: {
 title: "Careers at StemTechLab | Teach Kids Coding & STEM Online",
 description:
 "We’re hiring certified online instructors for coding (Scratch, Python, web & game dev), robotics, and algorithms. Fully remote, flexible hours, ages 6–18.",
 },
 ar: {
 title: "وظائف ستم تك لاب | علّم البرمجة وSTEM للأطفال أونلاين",
 description:
 "ستم تك لاب توظف معلمين أونلاين معتمدين في البرمجة (سكراتش، بايثون، تطوير مواقع وألعاب)، الروبوتات والخوارزميات. عمل عن بُعد وساعات مرنة. خبرة بتدريس الأطفال ٦–١٨.",
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
 return (
 <>
 <BreadcrumbSchema
 items={[
 { name: bcLabel("Home", locale), url: siteUrl(lang, "") },
 { name: bcLabel("Careers", locale), url: siteUrl(lang, "/careers") },
 ]}
 />
 <CareersContent />
 </>
 );
}
