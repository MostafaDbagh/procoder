import type { Metadata } from "next";

const BREADCRUMB_AR: Record<string, string> = {
  Home: "الرئيسية",
  Courses: "الدورات",
  Blog: "المدونة",
  About: "من نحن",

  Contact: "تواصل معنا",
  "Free Trial": "تجربة مجانية",
  Careers: "الوظائف",
  Privacy: "الخصوصية",
  Terms: "الشروط والأحكام",
  Recommend: "اقتراح الدورات",
  Challenge: "التحدي",
  Parents: "للوالدين",
  "For Parents": "للوالدين",
  "Course finder": "محدد الدورات",
  Blogs: "المدونة",
};

/** Returns the breadcrumb label in the correct language. */
export function bcLabel(name: string, locale: string): string {
  if (locale !== "ar") return name;
  return BREADCRUMB_AR[name] ?? name;
}

/** Member, instructor, and admin app surfaces — keep out of organic search. */
export const PRIVATE_APP_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

const SITE = process.env.SITE_URL || "https://www.stemtechlab.com";

export const SITE_URL = SITE.replace(/\/$/, "");

export const LOCALES = ["en", "ar"] as const;
export type SiteLocale = (typeof LOCALES)[number];

export const PUBLIC_STATIC_PATHS = [
 { path: "", priority: 1.0, changeFrequency: "weekly" as const },
 { path: "/courses", priority: 0.9, changeFrequency: "weekly" as const },
 { path: "/free-trial", priority: 0.9, changeFrequency: "monthly" as const },
 { path: "/parents", priority: 0.85, changeFrequency: "monthly" as const },
 { path: "/blogs", priority: 0.85, changeFrequency: "weekly" as const },
 { path: "/recommend", priority: 0.8, changeFrequency: "monthly" as const },
 { path: "/challenge", priority: 0.75, changeFrequency: "weekly" as const },
 { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
 { path: "/faq", priority: 0.65, changeFrequency: "monthly" as const },
 { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
 { path: "/careers", priority: 0.45, changeFrequency: "monthly" as const },
 { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
 { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
] as const;

export const PRIVATE_CRAWL_PATHS = [
 "/api/",
 "/admin",
 "/admin/",
 "/dashboard",
 "/dashboard/",
 "/instructor",
 "/instructor/",
 "/parent/login",
 "/en/dashboard",
 "/ar/dashboard",
 "/en/dashboard/",
 "/ar/dashboard/",
 "/en/instructor",
 "/ar/instructor",
 "/en/instructor/",
 "/ar/instructor/",
 "/en/instructor/login",
 "/ar/instructor/login",
 "/en/parent/login",
 "/ar/parent/login",
 "/en/dashboard/courses/",
 "/ar/dashboard/courses/",
] as const;

/**
 * Returns the canonical URL for a given locale and path.
 * Locale prefixes are always present because next-intl uses localePrefix: "always".
 */
export function siteUrl(lang: string, path: string = ""): string {
 const p = path && !path.startsWith("/") ? `/${path}` : path;
 return `${SITE_URL}/${lang}${p}`;
}

/**
 * Builds the alternates block (canonical + hreflang) for a page.
 * path should start with "/" e.g. "/about" or "" for home.
 */
export function buildAlternates(lang: string, path: string = "") {
  const arUrl = siteUrl("ar", path);
  const enUrl = siteUrl("en", path);
  return {
    canonical: siteUrl(lang, path),
    languages: {
      en: enUrl,
      "en-US": enUrl,
      "en-GB": enUrl,
      ar: arUrl,
      "ar-SA": arUrl,
      "ar-AE": arUrl,
      "ar-QA": arUrl,
      "ar-OM": arUrl,
      "ar-KW": arUrl,
      "ar-BH": arUrl,
      "ar-EG": arUrl,
      "x-default": enUrl,
    },
  };
}
