import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getBlogPostISR, getBlogPostsISR, getCoursesISR } from "@/lib/server-api";
import { BreadcrumbSchema } from "@/components/StructuredData";
import BlogDetailClient from "./BlogDetailClient";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";
import { renderBlogBody } from "@/lib/blogBody";
import { safeCoverImage } from "@/lib/mediaUrls";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

export async function generateStaticParams() {
 const data = await getBlogPostsISR();
 return (data?.items ?? []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
 const { locale, slug } = await params;
 const lang = locale === "ar" ? "ar" : "en";
 const post = await getBlogPostISR(slug);

 if (!post) return { title: "Post Not Found" };

 const title = post.metaTitle?.[lang] || post.title[lang];
 const description = post.metaDescription?.[lang] || post.excerpt[lang];
 // Editors often type the brand into metaTitle, and appending it again shipped
 // "… | StemTechLab | StemTechLab" on every post. Strip any trailing brand first.
 const brand = lang === "ar" ? "ستم تك لاب" : "StemTechLab";
 const bareTitle = title.replace(/\s*\|\s*(StemTechLab|ستم تك لاب)\s*$/u, "").trim();
 const brandedTitle = `${bareTitle} | ${brand}`;
 const cover = safeCoverImage(post.coverImage);

 return {
 title: { absolute: brandedTitle },
 description,
 alternates: buildAlternates(lang, `/blogs/${slug}`),
 openGraph: {
 title: brandedTitle,
 description,
 url: siteUrl(lang, `/blogs/${slug}`),
 type: "article",
 siteName: "StemTechLab",
 locale: lang === "ar" ? "ar_AE" : "en_US",
 alternateLocale: lang === "ar" ? "en_US" : "ar_AE",
 publishedTime: post.publishedAt,
 modifiedTime: post.updatedAt ?? post.publishedAt,
 authors: [post.author.name],
 tags: post.tags,
 images: cover ? [{ url: cover }] : [{ url: `${SITE_URL}/og?locale=${lang}`, width: 1200, height: 630, alt: "StemTechLab" }],
 },
 twitter: {
 card: "summary_large_image",
 title: brandedTitle,
 description,
 images: cover ? [cover] : [`${SITE_URL}/og?locale=${lang}`],
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

 // Preserve relevant links when an editorial post still stores a retired slug.
 const successors: Record<string, string> = {
  scratch: "programming1", webdev: "web-beginner", "robot-basics": "robotics", "algo-competitive": "algo-intro",
 };
 const relatedSlugs = new Set(post.relatedCourses.map(slug => successors[slug] ?? slug));
 const relatedCourses = (courses || []).filter((c) => relatedSlugs.has(c.slug));
 // Render Markdown → safe HTML on the server (avoids DOMPurify SSR crash).
 const bodyHtml = renderBlogBody(post.body[lang] || "");

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
 author: { "@type": post.author.name.trim().toLowerCase() === "stemtechlab team" ? "Organization" : "Person", name: post.author.name },
 datePublished: post.publishedAt,
 dateModified: post.updatedAt ?? post.publishedAt,
 publisher: { "@type": "Organization", name: "StemTechLab", url: SITE_URL },
 mainEntityOfPage: siteUrl(lang, `/blogs/${slug}`),
 ...(safeCoverImage(post.coverImage) ? { image: safeCoverImage(post.coverImage) } : {}),
 inLanguage: locale,
 }).replace(/</g, "\\u003c"),
 }}
 />
 <BlogDetailClient post={post} relatedCourses={relatedCourses} bodyHtml={bodyHtml} />
 </>
 );
}
