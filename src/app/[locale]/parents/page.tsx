import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ParentsContent from "./ParentsContent";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";


const meta = {
 en: {
 title: "For Parents — Track Your Child’s Progress",
 description:
 "Match your child to the right course with the AI course finder, then follow attendance, progress, and instructor notes from the parent dashboard.",
 },
 ar: {
 title: "لأولياء الأمور — تابع تقدم طفلك",
 description:
 "منتقي دورات بالذكاء الاصطناعي يختار الأنسب لطفلك. تابع الحضور والتقدم وملاحظات المعلم من لوحة التحكم. معلمون معتمدون، حد أقصى ٣ طلاب، وتجربة مجانية.",
 },
};

export async function generateMetadata({
 params,
}: {
 params: Promise<{ locale: string }>;
}): Promise<Metadata> {
 const { locale } = await params;
 const lang = locale === "ar" ? "ar" : "en";

 const fullTitle = lang === "ar"
 ? `${meta.ar.title} | ستم تك لاب`
 : `${meta.en.title} | StemTechLab`;
 const title = { absolute: fullTitle };
 const ogTitle = fullTitle;

 return {
 title,
 description: meta[lang].description,
 alternates: buildAlternates(lang, "/parents"),
 openGraph: {
 title: ogTitle,
 description: meta[lang].description,
 url: siteUrl(lang, "/parents"),
 type: "website",
 siteName: "StemTechLab",
 locale: lang === "ar" ? "ar_AE" : "en_US",
 alternateLocale: lang === "ar" ? "en_US" : "ar_AE",
 images: [{ url: `${SITE_URL}/og?locale=${lang}`, width: 1200, height: 630, alt: "StemTechLab" }],
 },
 twitter: {
 card: "summary_large_image",
 title: ogTitle,
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
 { name: bcLabel("Home", locale), url: `${SITE_URL}/${locale}` },
 { name: bcLabel("For Parents", locale), url: `${SITE_URL}/${locale}/parents` },
 ]}
 />
 <ParentsContent />
 </>
 );
}
