import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getBlogPostISR, getCoursesISR } from "@/lib/server-api";
import { BreadcrumbSchema } from "@/components/StructuredData";
import BlogDetailClient from "./BlogDetailClient";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
 const { locale, slug } = await params;
 const lang = locale === "ar" ? "ar" : "en";
 const post = await getBlogPostISR(slug);

 if (!post) return { title: "Post Not Found" };

 const title = post.metaTitle?.[lang] || post.title[lang];
 const description = post.metaDescription?.[lang] || post.excerpt[lang];

 return {
 title,
 description,
 alternates: buildAlternates(lang, `/blogs/${slug}`),
 openGraph: {
 title,
 description,
 url: siteUrl(lang, `/blogs/${slug}`),
 type: "article",
 siteName: "StemTechLab",
 locale: lang === "ar" ? "ar_SA" : "en_US",
 alternateLocale: lang === "ar" ? "en_US" : "ar_SA",
 publishedTime: post.publishedAt,
 authors: [post.author.name],
 tags: post.tags,
 images: post.coverImage ? [{ url: post.coverImage }] : [{ url: `${SITE_URL}/og?locale=${lang}`, width: 1200, height: 630, alt: "StemTechLab" }],
 },
 twitter: {
 card: "summary_large_image",
 title,
 description,
 images: post.coverImage ? [post.coverImage] : [`${SITE_URL}/og`],
 },
 };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
 const { locale, slug } = await params;
 setRequestLocale(locale);
 const lang = locale === "ar" ? "ar" : "en";

 const [post, courses] = await Promise.all([
 getBlogPostISR(slug),
 getCoursesISR().catch(() => []),
 ]);

 if (!post) notFound();

 const relatedCourses = (courses || []).filter((c) => post.relatedCourses.includes(c.slug));

 return (
 <>
 <BreadcrumbSchema items={[
 { name: bcLabel("Home", locale), url: siteUrl(lang, "") },
 { name: bcLabel("Blogs", locale), url: siteUrl(lang, "/blogs") },
 { name: post.title[lang], url: siteUrl(lang, `/blogs/${slug}`) },
 ]} />
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{
 __html: JSON.stringify({
 "@context": "https://schema.org",
 "@type": "BlogPosting",
 headline: post.title[lang],
 description: post.excerpt[lang],
 author: { "@type": "Person", name: post.author.name },
 datePublished: post.publishedAt,
 dateModified: post.publishedAt,
 publisher: { "@type": "Organization", name: "StemTechLab", url: SITE_URL },
 mainEntityOfPage: siteUrl(lang, `/blogs/${slug}`),
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
