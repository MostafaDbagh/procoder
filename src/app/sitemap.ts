import type { MetadataRoute } from "next";
import { courses as staticCourses } from "@/data/courses";
import { getCoursesISR, getBlogPostsSSR } from "@/lib/server-api";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const apiCourses = await getCoursesISR();
 const slugSet = new Set<string>([
 ...(apiCourses?.map((c) => c.slug) ?? []),
 ...staticCourses.map((c) => c.id),
 ]);
 const locales = ["en", "ar"];
 const now = new Date();

 const staticPages = [
 { path: "", priority: 1.0, changeFrequency: "weekly" as const },
 { path: "/courses", priority: 0.9, changeFrequency: "weekly" as const },
 { path: "/recommend", priority: 0.8, changeFrequency: "monthly" as const },
 { path: "/challenge", priority: 0.75, changeFrequency: "weekly" as const },
 { path: "/parents", priority: 0.85, changeFrequency: "monthly" as const },
 { path: "/pricing", priority: 0.9, changeFrequency: "monthly" as const },
 { path: "/free-trial", priority: 0.9, changeFrequency: "monthly" as const },
 { path: "/blog", priority: 0.85, changeFrequency: "weekly" as const },
 { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
 { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
 { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
 { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
 ];

 const entries: MetadataRoute.Sitemap = [];

 // Machine-readable context for AI / LLM crawlers (not locale-specific)
 entries.push({
 url: `${SITE_URL}/llms.txt`,
 lastModified: now,
 changeFrequency: "monthly",
 priority: 0.4,
 });
 entries.push({
 url: `${SITE_URL}/llms-full.txt`,
 lastModified: now,
 changeFrequency: "monthly",
 priority: 0.35,
 });
 entries.push({
 url: `${SITE_URL}/.well-known/llms.txt`,
 lastModified: now,
 changeFrequency: "monthly",
 priority: 0.35,
 });
 entries.push({
 url: `${SITE_URL}/.well-known/llms-full.txt`,
 lastModified: now,
 changeFrequency: "monthly",
 priority: 0.3,
 });

 // Static pages for each locale
 for (const locale of locales) {
 for (const page of staticPages) {
 entries.push({
 url: `${SITE_URL}/${locale}${page.path}`,
 lastModified: now,
 changeFrequency: page.changeFrequency,
 priority: page.priority,
 alternates: {
 languages: {
 en: `${SITE_URL}/en${page.path}`,
 ar: `${SITE_URL}/ar${page.path}`,
 },
 },
 });
 }
 }

 // Course detail pages (admin catalog + static fallback slugs)
 for (const locale of locales) {
 for (const slug of slugSet) {
 entries.push({
 url: `${SITE_URL}/${locale}/courses/${slug}`,
 lastModified: now,
 changeFrequency: "monthly",
 priority: 0.8,
 alternates: {
 languages: {
 en: `${SITE_URL}/en/courses/${slug}`,
 ar: `${SITE_URL}/ar/courses/${slug}`,
 },
 },
 });
 }
 }

 // Blog posts
 const blogData = await getBlogPostsSSR();
 if (blogData?.items) {
 for (const locale of locales) {
 for (const post of blogData.items) {
 entries.push({
 url: `${SITE_URL}/${locale}/blog/${post.slug}`,
 lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
 changeFrequency: "monthly",
 priority: 0.7,
 alternates: {
 languages: {
 en: `${SITE_URL}/en/blog/${post.slug}`,
 ar: `${SITE_URL}/ar/blog/${post.slug}`,
 },
 },
 });
 }
 }
 }

 return entries;
}
