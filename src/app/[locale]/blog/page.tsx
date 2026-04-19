import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getBlogPostsSSR } from "@/lib/server-api";
import { BreadcrumbSchema } from "@/components/StructuredData";
import BlogListClient from "./BlogListClient";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

const meta = {
 en: {
 title: "Blog — Tips, Guides & News for Parents",
 description:
 "Expert articles and tutorials for parents: kids’ coding, STEM education, robotics, and Arabic learning—in Saudi Arabia, UAE, the GCC, and worldwide.",
 },
 ar: {
 title: "المدونة — نصائح وأدلة وأخبار للوالدين",
 description: "مقالات متخصصة حول تعليم البرمجة والروبوتات والعربية والعلوم للأطفال في السعودية والإمارات والخليج.",
 },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
 const { locale } = await params;
 const lang = locale === "ar" ? "ar" : "en";
 const alt = lang === "en" ? "ar" : "en";
 return {
 title: meta[lang].title,
 description: meta[lang].description,
 alternates: { canonical: `${SITE_URL}/${lang}/blog`, languages: { en: `${SITE_URL}/en/blog`, ar: `${SITE_URL}/ar/blog`, "x-default": `${SITE_URL}/en/blog` } },
 openGraph: { title: meta[lang].title, description: meta[lang].description, url: `${SITE_URL}/${lang}/blog`, type: "website", siteName: "StemTechLab", locale: lang === "ar" ? "ar_SA" : "en_US", alternateLocale: lang === "ar" ? "en_US" : "ar_SA", images: [{ url: `${SITE_URL}/og`, width: 1200, height: 630, alt: "StemTechLab" }] },
 twitter: { card: "summary_large_image", title: meta[lang].title, description: meta[lang].description },
 };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
 const { locale } = await params;
 setRequestLocale(locale);
 const data = await getBlogPostsSSR();

 return (
 <>
 <BreadcrumbSchema items={[
 { name: "Home", url: `${SITE_URL}/${locale}` },
 { name: "Blog", url: `${SITE_URL}/${locale}/blog` },
 ]} />
 <BlogListClient initialData={data} />
 </>
 );
}
