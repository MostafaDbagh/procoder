import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ParentsContent from "./ParentsContent";
import { BreadcrumbSchema } from "@/components/StructuredData";

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

const meta = {
 en: {
 title: "For parents | Kids’ STEM & coding progress",
 description:
 "See how StemTechLab supports families: progress, attendance, and instructor notes for your child’s live coding and STEM classes—all in one parent-friendly hub.",
 },
 ar: {
 title: "لأولياء الأمور | تقدم طفلك في البرمجة وSTEM",
 description:
 "اطّلع على كيف تدعم ستم تك لاب العائلات: التقدم والحضور وملاحظات المدرّس لحصص البرمجة وSTEM المباشرة—في مكان واحد لولي الأمر.",
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
 canonical: `${SITE_URL}/${lang}/parents`,
 languages: { en: `${SITE_URL}/en/parents`, ar: `${SITE_URL}/ar/parents`, "x-default": `${SITE_URL}/en/parents` },
 },
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: `${SITE_URL}/${lang}/parents`,
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

export default async function ParentsPage({
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
 { name: "For Parents", url: `${SITE_URL}/${locale}/parents` },
 ]}
 />
 <ParentsContent />
 </>
 );
}
