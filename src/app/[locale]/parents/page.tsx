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
 "Everything parents need to know about StemTechLab: use the AI course finder to match your child to the right course, then track attendance, progress, and instructor notes from the parent dashboard. Certified teachers, max 8 students per class, COPPA-compliant.",
 },
 ar: {
 title: "لأولياء الأمور | ذكاء اصطناعي يحلّل سلوك طفلك ويبني مستقبله",
 description:
 "كل ما يحتاجه ولي الأمر في ستم تك لاب: استخدم منتقي الدورات بالذكاء الاصطناعي لاختيار الدورة المناسبة لطفلك، ثم تابع الحضور والتقدم وملاحظات المعلم من لوحة التحكم الخاصة بك. معلمون معتمدون، حد أقصى ٨ طلاب في الفصل، متوافق مع COPPA.",
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
