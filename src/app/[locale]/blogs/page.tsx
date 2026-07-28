import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ApiUnavailableError, getBlogPostsISR } from "@/lib/server-api";
import { BreadcrumbSchema } from "@/components/StructuredData";
import BlogListClient from "./BlogListClient";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

export const revalidate = 300;


const meta = {
 en: {
 title: "Blog — Tips, Guides & News for Parents",
 description:
 "Practical guides for parents: choosing your child’s first coding course, when to start robotics, and the STEM skills that matter most by age (6–18).",
 },
 ar: {
 title: "المدونة — نصائح وأدلة وأخبار للوالدين",
 description: "أدلة عملية لأولياء الأمور: اختيار دورة البرمجة المناسبة لطفلك، متى يبدأ الروبوتات، ومهارات STEM الأهم حسب العمر. للعائلات في الإمارات ودول الخليج.",
 },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
 const { locale } = await params;
 const lang = locale === "ar" ? "ar" : "en";
 const fullTitle = lang === "ar"
 ? `${meta.ar.title} | ستم تك لاب`
 : `${meta.en.title} | StemTechLab`;
 return {
 title: { absolute: fullTitle },
 description: meta[lang].description,
 alternates: buildAlternates(lang, "/blogs"),
 openGraph: { title: meta[lang].title, description: meta[lang].description, url: siteUrl(lang, "/blogs"), type: "website", siteName: "StemTechLab", locale: lang === "ar" ? "ar_AE" : "en_US", alternateLocale: lang === "ar" ? "en_US" : "ar_AE", images: [{ url: `${SITE_URL}/og?locale=${lang}`, width: 1200, height: 630, alt: "StemTechLab" }] },
 twitter: { card: "summary_large_image", title: meta[lang].title, description: meta[lang].description },
 };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
 const { locale } = await params;
 setRequestLocale(locale);
 // null means the fetch failed (an empty `items` array is a valid, distinct
 // result). Rendering the index with zero posts in that case would serve a 200
 // soft-404; failing makes Google retry and keeps the cached page live.
 const data = await getBlogPostsISR();
 if (!data) throw new ApiUnavailableError("blog list");

 const homeUrl = `${SITE_URL}/${locale}`;
 const blogsUrl = `${SITE_URL}/${locale}/blogs`;
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
