import type { MetadataRoute } from "next";
import { courses } from "@/data/courses";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["en", "ar"];
  const now = new Date();

  const staticPages = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/courses", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/recommend", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

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

  // Course detail pages
  for (const locale of locales) {
    for (const course of courses) {
      entries.push({
        url: `${SITE_URL}/${locale}/courses/${course.id}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: {
            en: `${SITE_URL}/en/courses/${course.id}`,
            ar: `${SITE_URL}/ar/courses/${course.id}`,
          },
        },
      });
    }
  }

  return entries;
}
