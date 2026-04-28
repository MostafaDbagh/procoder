import type { Metadata } from "next";

const BREADCRUMB_AR: Record<string, string> = {
  Home: "الرئيسية",
  Courses: "الدورات",
  Blog: "المدونة",
  About: "من نحن",
  Pricing: "الأسعار",
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

/**
 * Returns the canonical URL for a given locale and path.
 * English (default locale) has no prefix: /about
 * Arabic has /ar prefix: /ar/about
 */
export function siteUrl(lang: string, path: string = ""): string {
  const p = path && !path.startsWith("/") ? `/${path}` : path;
  return `${SITE}/${lang}${p}`;
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
