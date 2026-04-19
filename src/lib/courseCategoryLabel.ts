/**
 * Maps API/CMS category slugs to a single `courses.categoryLabels.*` message key
 * so labels stay consistent (e.g. mobile-development → mobile-app-development).
 */
const SLUG_TO_LABEL_KEY: Record<string, string> = {
 mobappdev: "mobile-app-development",
 "mobile-app": "mobile-app-development",
 "mobile-development": "mobile-app-development",
 webdev: "web-development",
 gamedev: "game-development",
};

export function courseCategoryLabelKey(slug: string): string {
 const s = slug.trim().toLowerCase();
 return SLUG_TO_LABEL_KEY[s] ?? s;
}

/** Fallback when no message exists for a slug. */
export function titleizeCategorySlug(slug: string): string {
 return slug
 .split(/[-_]/g)
 .filter(Boolean)
 .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
 .join(" ");
}
