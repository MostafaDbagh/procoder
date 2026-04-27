import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ParentsContent from "./ParentsContent";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { buildAlternates, siteUrl } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";


const meta = {
 en: {
 title: "For Parents | AI analyses your child’s behaviour & builds their future",
 description:
 "StemTechLab’s AI agent analyses your child’s learning actions and behaviours to recommend the right STEM path and shape their future. Track progress, attendance & instructor notes — all in one hub.",
 },
 ar: {
 title: "لأولياء الأمور | ذكاء اصطناعي يحلّل سلوك طفلك ويبني مستقبله",
 description:
 "وكيل ذكاء ستم تك لاب الاصطناعي يحلّل سلوكيات طفلك وأفعاله التعليمية ليوصي بمسار STEM المناسب ويبني مستقبله. تابع التقدم والحضور وملاحظات المدرّس في مكان واحد.",
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
 alternates: buildAlternates(lang, "/parents"),
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: siteUrl(lang, "/parents"),
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
