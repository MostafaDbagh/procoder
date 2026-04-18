import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getBlogPostSSR, getCoursesISR } from "@/lib/server-api";
import { BreadcrumbSchema } from "@/components/StructuredData";
import BlogDetailClient from "./BlogDetailClient";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
 const { locale, slug } = await params;
 const lang = locale === "ar" ? "ar" : "en";
 const alt = lang === "en" ? "ar" : "en";
 const post = await getBlogPostSSR(slug);

 if (!post) return { title: "Post Not Found" };

 const title = post.metaTitle?.[lang] || post.title[lang];
 const description = post.metaDescription?.[lang] || post.excerpt[lang];

 return {
 title,
 description,
 alternates: { canonical: `${SITE_URL}/${lang}/blog/${slug}`, languages: { en: `${SITE_URL}/en/blog/${slug}`, ar: `${SITE_URL}/ar/blog/${slug}`, "x-default": `${SITE_URL}/en/blog/${slug}` } },
 openGraph: {
 title,
 description,
 url: `${SITE_URL}/${lang}/blog/${slug}`,
 type: "article",
 siteName: "StemTechLab",
 locale: lang === "ar" ? "ar_SA" : "en_US",
 alternateLocale: lang === "ar" ? "en_US" : "ar_SA",
 publishedTime: post.publishedAt,
 authors: [post.author.name],
 tags: post.tags,
 images: post.coverImage ? [{ url: post.coverImage }] : [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "StemTechLab" }],
 },
 twitter: {
 card: "summary_large_image",
 title,
 description,
 images: post.coverImage ? [post.coverImage] : [`${SITE_URL}/og-image.png`],
 },
 };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
 const { locale, slug } = await params;
 setRequestLocale(locale);

 const [post, courses] = await Promise.all([
 getBlogPostSSR(slug),
 getCoursesISR(),
 ]);

 if (!post) notFound();

 // Find related courses
 const relatedCourses = (courses || []).filter((c) => post.relatedCourses.includes(c.slug));

 return (
 <>
 <BreadcrumbSchema items={[
 { name: "Home", url: `${SITE_URL}/${locale}` },
 { name: "Blog", url: `${SITE_URL}/${locale}/blog` },
 { name: post.title[locale === "ar" ? "ar" : "en"], url: `${SITE_URL}/${locale}/blog/${slug}` },
 ]} />
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{
 __html: JSON.stringify({
 "@context": "https://schema.org",
 "@type": "BlogPosting",
 headline: post.title[locale === "ar" ? "ar" : "en"],
 description: post.excerpt[locale === "ar" ? "ar" : "en"],
 author: { "@type": "Person", name: post.author.name },
 datePublished: post.publishedAt,
 dateModified: post.publishedAt,
 publisher: { "@type": "Organization", name: "StemTechLab", url: SITE_URL },
 mainEntityOfPage: `${SITE_URL}/${locale}/blog/${slug}`,
 ...(post.coverImage ? { image: post.coverImage } : {}),
 inLanguage: locale,
 keywords: post.tags.join(", "),
 }),
 }}
 />
 <BlogDetailClient post={post} relatedCourses={relatedCourses} />
 </>
 );
}
