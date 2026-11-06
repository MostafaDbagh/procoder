import { unstable_cache } from "next/cache";
import type { MetadataRoute } from "next";
import { ApiUnavailableError, getCoursesISR, serverApiRoot } from "@/lib/server-api";
import { SITE_URL, LOCALES, PUBLIC_STATIC_PATHS, siteUrl } from "@/lib/seo";

// Revalidate sitemap every 6 hours instead of on every request
export const revalidate = 21600;

/**
 * Only publish reliable modification dates; omit dates that are unknown.
 */
function validDate(value?: string): Date | undefined {
 if (!value) return undefined;
 const date = new Date(value);
 return Number.isNaN(date.getTime()) || date.getTime() > Date.now() ? undefined : date;
}

async function getBlogSlugsForSitemap(): Promise<{ slug: string; lastModified?: string }[]> {
 const posts: { slug: string; lastModified?: string }[] = [];
 let page = 1;
 let totalPages = 1;
 const seen = new Set<string>();
 // Bound the complete traversal, not just each individual request.
 const signal = AbortSignal.timeout(20000);
 do {
  let res: Response;
  try {
   res = await fetch(`${serverApiRoot()}/blog?limit=50&page=${page}`, {
    cache: "no-store",
    signal: AbortSignal.any([signal, AbortSignal.timeout(8000)]),
   });
  } catch (error) {
   throw new ApiUnavailableError("blog list for sitemap", error);
  }
  if (!res.ok) throw new ApiUnavailableError(`blog list for sitemap (HTTP ${res.status})`);
  const data = await res.json();
  if (!data || !Array.isArray(data.items)) throw new ApiUnavailableError("invalid blog list for sitemap");
  const pages = data.totalPages;
  if (!Number.isSafeInteger(pages) || pages < 0 || pages > 1000) throw new ApiUnavailableError("invalid sitemap pagination");
  if ((page > 1 && Math.max(1, pages) !== totalPages) ||
      (page < pages && data.items.length !== 50) ||
      (page > 1 && data.items.length === 0) || (pages === 0 && data.items.length > 0)) {
   throw new ApiUnavailableError("incomplete sitemap pagination");
  }
  totalPages = Math.max(1, pages);
  if (data.items.some((post: { slug?: unknown }) => typeof post?.slug !== "string" || !post.slug || /[/?#]/.test(post.slug))) throw new ApiUnavailableError("invalid sitemap blog slug");
  for (const post of data.items) {
   if (seen.has(post.slug)) throw new ApiUnavailableError("duplicate sitemap blog slug");
   seen.add(post.slug);
  }
  posts.push(...data.items.map((post: { slug: string; publishedAt?: string; updatedAt?: string }) => ({
   slug: post.slug,
   lastModified: post.updatedAt ?? post.publishedAt,
  })));
  page += 1;
 } while (page <= totalPages);
 return posts;
}

async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
 const apiCourses = await getCoursesISR();
 if (!apiCourses) throw new ApiUnavailableError("course catalog for sitemap");
 if (apiCourses.some(c => typeof c.slug !== "string" || !c.slug || /[/?#]/.test(c.slug)) ||
     new Set(apiCourses.map(c => c.slug)).size !== apiCourses.length) {
  throw new ApiUnavailableError("invalid course catalog for sitemap");
 }

 // Live catalog only. Slugs that exist solely in the static fallback are not
 // linked from anywhere in the UI, so submitting them asks Google to spend
 // crawl budget on orphaned pages for courses that are not on offer.
 const slugSet = new Set<string>(apiCourses.map((c) => c.slug));
 // slug → updatedAt (Mongoose timestamp).
 const courseUpdatedAt = new Map<string, Date>();
 for (const c of apiCourses) {
 const updated = validDate(c.updatedAt);
 if (updated) courseUpdatedAt.set(c.slug, updated);
 }


 const entries: MetadataRoute.Sitemap = [];

 // This sitemap focuses on public landing pages. Optional AI discovery files
 // are linked separately and are not commercial search landing pages.

 // Static pages for each locale
 for (const locale of LOCALES) {
 for (const page of PUBLIC_STATIC_PATHS) {
 entries.push({
 url: siteUrl(locale, page.path),
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
 lastModified: courseUpdatedAt.get(slug),
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
 lastModified: validDate(post.lastModified),
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

// Cache only a complete successful snapshot. A failed background refresh leaves the
// last good sitemap in Next's persistent Data Cache, including across deployments.
const cachedSitemap = unstable_cache(buildSitemap, ["public-sitemap-v1", SITE_URL, serverApiRoot()], {
 revalidate: 21600, tags: ["public-sitemap"],
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 return cachedSitemap();
}
