import type { MetadataRoute } from "next";
import { ApiUnavailableError, getCoursesISR, serverApiRoot } from "@/lib/server-api";
import { LOCALES, PUBLIC_STATIC_PATHS, siteUrl } from "@/lib/seo";

// Revalidate sitemap every 6 hours instead of on every request
export const revalidate = 21600;

/**
 * Throws rather than degrading to [] when the API is down: a sitemap that
 * silently omits every post reads to Google as "these URLs are gone". Failing
 * the response instead makes Google retry and keep the last known sitemap.
 */
async function getBlogSlugsForSitemap(): Promise<{ slug: string; lastModified?: string }[]> {
 let res: Response;
 try {
  res = await fetch(`${serverApiRoot()}/blog?limit=500`, {
   next: { revalidate: 21600 },
  });
 } catch (e) {
  throw new ApiUnavailableError("blog list for sitemap", e);
 }
 if (!res.ok) throw new ApiUnavailableError(`blog list for sitemap (HTTP ${res.status})`);
 const data = await res.json();
 return (data?.items ?? []).map(
  (p: { slug: string; publishedAt?: string; updatedAt?: string }) => ({
   slug: p.slug,
   lastModified: p.updatedAt ?? p.publishedAt,
  })
 );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const apiCourses = await getCoursesISR();
 if (!apiCourses) throw new ApiUnavailableError("course catalog for sitemap");

 // Live catalog only. Slugs that exist solely in the static fallback are not
 // linked from anywhere in the UI, so submitting them asks Google to spend
 // crawl budget on orphaned pages for courses that are not on offer.
 const slugSet = new Set<string>(apiCourses.map((c) => c.slug));
 // slug → updatedAt (Mongoose timestamp).
 const courseUpdatedAt = new Map<string, Date>();
 for (const c of apiCourses) {
 if (c.updatedAt) courseUpdatedAt.set(c.slug, new Date(c.updatedAt));
 }
 const now = new Date();

 const entries: MetadataRoute.Sitemap = [];

 // llms.txt / ai.txt / ai-plugin.json are deliberately absent: sitemaps are for
 // indexable HTML, and Google reports non-HTML entries as unindexable. AI
 // crawlers find those files via robots.txt and /.well-known.

 // Static pages for each locale
 for (const locale of LOCALES) {
 for (const page of PUBLIC_STATIC_PATHS) {
 entries.push({
 url: siteUrl(locale, page.path),
 lastModified: now,
 changeFrequency: page.changeFrequency,
 priority: page.priority,
 alternates: {
 languages: {
 en: siteUrl("en", page.path),
 ar: siteUrl("ar", page.path),
 "x-default": siteUrl("en", page.path),
 },
 },
 });
 }
 }

 // Course detail pages (admin catalog + static fallback slugs)
 for (const locale of LOCALES) {
 for (const slug of slugSet) {
 entries.push({
 url: siteUrl(locale, `/courses/${slug}`),
 lastModified: courseUpdatedAt.get(slug) ?? now,
 changeFrequency: "monthly",
 priority: 0.8,
 alternates: {
 languages: {
 en: siteUrl("en", `/courses/${slug}`),
 ar: siteUrl("ar", `/courses/${slug}`),
 "x-default": siteUrl("en", `/courses/${slug}`),
 },
 },
 });
 }
 }

 // Blog posts
 const blogPosts = await getBlogSlugsForSitemap();
 if (blogPosts.length > 0) {
 for (const locale of LOCALES) {
 for (const post of blogPosts) {
 entries.push({
 url: siteUrl(locale, `/blogs/${post.slug}`),
 lastModified: post.lastModified ? new Date(post.lastModified) : now,
 changeFrequency: "monthly",
 priority: 0.7,
 alternates: {
 languages: {
 en: siteUrl("en", `/blogs/${post.slug}`),
 ar: siteUrl("ar", `/blogs/${post.slug}`),
 "x-default": siteUrl("en", `/blogs/${post.slug}`),
 },
 },
 });
 }
 }
 }

 return entries;
}
