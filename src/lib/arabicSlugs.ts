/**
 * Bidirectional Arabic ↔ English slug mapping for course URLs.
 *
 * WHY: Course slugs in the database are English (set by admins). For Arabic
 * SEO we want /ar/courses/بايثون to resolve to the same page as
 * /ar/courses/python and redirect to the canonical English-slug URL.
 */

export const ARABIC_SLUG_TO_ENGLISH: Record<string, string> = {
  سكراتش: "scratch",
  بايثون: "python",
  "تطوير-الويب": "webdev",
  "تطوير-المواقع": "webdev",
  خوارزميات: "algorithms",
  روبوتات: "robotics",
  "روبوتات-متقدمة": "robotics-advanced",
  "تطوير-الالعاب": "game-development",
  "تطوير-الألعاب": "game-development",
  "تطوير-الأعاب": "game-development",
  موبايل: "mobile-development",
  "تطوير-التطبيقات": "mobile-development",
  "ذكاء-اصطناعي": "artificial-intelligence",
  عربي: "arabic",
  "لغة-عربية": "arabic",
  "برمجة-تنافسية": "competitive-programming",
};

/** Reverse: English slug → preferred Arabic slug (for hreflang URLs). */
export const ENGLISH_SLUG_TO_ARABIC: Record<string, string> = {
  scratch: "سكراتش",
  python: "بايثون",
  webdev: "تطوير-الويب",
  algorithms: "خوارزميات",
};

/**
 * Resolve an Arabic slug to its English equivalent.
 * Returns the input unchanged if it isn't an Arabic slug.
 */
export function resolveArabicSlug(slug: string): string {
  return ARABIC_SLUG_TO_ENGLISH[slug] ?? slug;
}

/** Return the Arabic slug for a given English slug, or null if none exists. */
export function toArabicSlug(englishSlug: string): string | null {
  return ENGLISH_SLUG_TO_ARABIC[englishSlug] ?? null;
}

/** True when the slug contains Arabic characters. */
export function isArabicSlug(slug: string): boolean {
  return /[\u0600-\u06FF]/.test(slug);
}
