import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getBlogPostsISR } from "@/lib/server-api";
import { BreadcrumbSchema } from "@/components/StructuredData";
import BlogListClient from "./BlogListClient";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

export const revalidate = 300;


const meta = {
 en: {
 title: "Blog — Tips, Guides & News for Parents",
 description:
 "Practical guides for parents on how to choose the right coding course for your child, when to start robotics, how to support Arabic learning at home, and what STEM skills matter most by age. Written for families in Saudi Arabia, UAE, GCC, and worldwide.",
 },
 ar: {
 title: "المدونة — نصائح وأدلة وأخبار للوالدين",
 description: "أدلة عملية لأولياء الأمور حول اختيار دورة البرمجة المناسبة لطفلك، متى تبدأ بالروبوتات، كيف تدعم تعلم العربية في المنزل، ومهارات STEM الأهم حسب العمر. موجّهة للعائلات في السعودية والإمارات والخليج والعالم.",
 },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
 const { locale } = await params;
 const lang = locale === "ar" ? "ar" : "en";
 return {
 title: meta[lang].title,
 description: meta[lang].description,
 alternates: buildAlternates(lang, "/blogs"),
 openGraph: { title: meta[lang].title, description: meta[lang].description, url: siteUrl(lang, "/blogs"), type: "website", siteName: "StemTechLab", locale: lang === "ar" ? "ar_SA" : "en_US", alternateLocale: lang === "ar" ? "en_US" : "ar_SA", images: [{ url: `${SITE_URL}/og?locale=${lang}`, width: 1200, height: 630, alt: "StemTechLab" }] },
 twitter: { card: "summary_large_image", title: meta[lang].title, description: meta[lang].description },
 };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
 const { locale } = await params;
 setRequestLocale(locale);
 const data = await getBlogPostsISR();

 const homeUrl = locale === "en" ? SITE_URL : `${SITE_URL}/${locale}`;
 const blogsUrl = locale === "en" ? `${SITE_URL}/blogs` : `${SITE_URL}/${locale}/blogs`;
 return (
 <>
 <BreadcrumbSchema items={[
 { name: bcLabel("Home", locale), url: homeUrl },
 { name: bcLabel("Blog", locale), url: blogsUrl },
 ]} />
 <BlogListClient initialData={data} />
 </>
 );
}
