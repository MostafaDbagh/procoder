/** Parent-facing names for the two introductory courses; CMS remains the source of course facts. */
export function coursePublicTitle(slug: string, fallback: string, locale: string): string {
 if (slug === "robotics") return locale === "ar" ? "الروبوتات للأطفال أونلاين" : "Online Robotics for Kids";
 if (slug === "python") return locale === "ar" ? "بايثون للأطفال أونلاين" : "Online Python for Kids";
 return fallback;
}
