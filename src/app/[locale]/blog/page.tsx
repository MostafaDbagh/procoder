import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getBlogPostsSSR } from "@/lib/server-api";
import { BreadcrumbSchema } from "@/components/StructuredData";
import BlogListClient from "./BlogListClient";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

const meta = {
  en: {
    title: "Blog — Tips, Guides & News for Parents | ProCoder",
    description: "Expert articles on kids coding, robotics, Quran learning, Arabic education, and STEM in Saudi Arabia, UAE, GCC & worldwide.",
  },
  ar: {
    title: "المدونة — نصائح وأدلة وأخبار للوالدين | بروكودر",
    description: "مقالات متخصصة حول تعليم البرمجة والروبوتات والقرآن والعربية والعلوم للأطفال في السعودية والإمارات والخليج.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "ar" ? "ar" : "en";
  const alt = lang === "en" ? "ar" : "en";
  return {
    title: meta[lang].title,
    description: meta[lang].description,
    alternates: { canonical: `${SITE_URL}/${lang}/blog`, languages: { [alt]: `${SITE_URL}/${alt}/blog` } },
    openGraph: { title: meta[lang].title, description: meta[lang].description, url: `${SITE_URL}/${lang}/blog` },
    twitter: { title: meta[lang].title, description: meta[lang].description },
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
