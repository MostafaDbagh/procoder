import { coursePublicTitle } from "./course-positioning";
import { SITE_URL } from "@/lib/seo";
import { LLMS_FULL_TEMPLATE } from "./llms-full-template";

/** Canonical origin for LLM files (no trailing slash). */
export function getSiteBase(): string {
 return SITE_URL;
}

/**
 * Short machine-readable index for crawlers and assistants.
 * Served at /llms.txt and mirrored via /.well-known/llms.txt (rewrite).
 */
/** Shape we need from the catalogue; matches APICourse without importing it. */
export type LlmsCourse = {
 slug: string;
 category?: string;
 ageMin?: number;
 ageMax?: number;
 level?: string;
 lessons?: number;
 durationWeeks?: number;
 title?: { en?: string };
 description?: { en?: string };
 skills?: { en?: string[] };
};

const CATEGORY_LABELS: Record<string, string> = {
 programming: "Programming",
 robotics: "Robotics",
 algorithms: "Algorithms",
 "web-development": "Web Development",
 "mobile-app-development": "Mobile App Development",
 "artificial-intelligence": "Artificial Intelligence",
 "game-development": "Game Development",
 scratch: "Scratch & Creative Coding",
};

const categoryLabel = (slug: string) =>
 CATEGORY_LABELS[slug] ??
 slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

/**
 * Course facts served to AI assistants come from the live catalogue, never a
 * hardcoded list: the previous hardcoded one drifted until llms.txt was naming
 * eight courses that had been deleted, sending assistants to 404s.
 */
export function formatCourseList(courses: LlmsCourse[] | null, base: string): string {
 if (!courses || courses.length === 0) {
 return `## Course catalog\nLive catalogue: ${base}/en/courses (Arabic: ${base}/ar/courses)`;
 }
 const lines = courses.map((c) => {
 const name = coursePublicTitle(c.slug, c.title?.en?.trim() || c.slug, "en");
 const ages = c.ageMin && c.ageMax ? `ages ${c.ageMin}–${c.ageMax}` : null;
 const bits = [
 ages,
 c.level,
 c.durationWeeks ? `${c.durationWeeks} weeks` : null,
 c.lessons ? `${c.lessons} lessons` : null,
 ].filter(Boolean);
 return `- ${name} — ${bits.join(", ")} — ${base}/en/courses/${c.slug}`;
 });
 return [
 `## Course catalog (${courses.length} live courses)`,
 ...lines,
 ].join("\n");
}

/** The subject line in the summary paragraph, also derived from live data. */
export function formatSubjectList(courses: LlmsCourse[] | null): string {
 const cats = Array.from(
 new Set((courses ?? []).map((c) => c.category).filter(Boolean) as string[])
 );
 if (cats.length === 0) return "**Programming**, **Robotics**, and **AI**";
 const labels = cats.map((c) => `**${categoryLabel(c)}**`);
 return labels.length === 1
 ? labels[0]
 : `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}

export function formatLlmsShort(base: string, courses: LlmsCourse[] | null = null): string {
 return `# StemTechLab — Live online coding and STEM classes for children
> Online classes for families in the UAE and other GCC countries. English and Arabic website. Course ages, prerequisites and availability vary by course.

## Learning from the UAE
Families in the UAE can join online from home. Confirm the class language, schedule in UAE time, equipment and current price with the team before enrolling.
- [UAE parent guide in English](${base}/en/uae)
- [دورات الأطفال في الإمارات](${base}/ar/uae)

## Courses
Subjects in the live catalog: ${formatSubjectList(courses)}.
${formatCourseList(courses, base)}

## Parent resources
- [English homepage](${base}/en)
- [الصفحة الرئيسية](${base}/ar)
- [Course catalog](${base}/en/courses)
- [الدورات](${base}/ar/courses)
- [Learning path](${base}/en/learning-path)
- [Free trial](${base}/en/free-trial)
- [حصة تجريبية مجانية](${base}/ar/free-trial)
- [Course finder](${base}/en/recommend): advisory suggestions; a parent chooses whether to enroll.
- [Frequently asked questions](${base}/en/faq)
- [About the team](${base}/en/about)
- [Contact](${base}/en/contact)
- [Privacy](${base}/en/privacy)
- [Full course descriptions](${base}/llms-full.txt)

The linked course pages are the source for current course details. A free trial does not mean that the full course is free.
`;
}

/** Full catalog + FAQ text for RAG-style retrieval. */
export function formatLlmsFull(
 base: string,
 courses: LlmsCourse[] | null = null
): string {
 const core = LLMS_FULL_TEMPLATE.replace(/\{\{BASE\}\}/g, base).replace(
  "{{COURSE_CATALOG}}",
  formatCourseCatalog(courses, base)
 );
 return core;
}

/** Long-form catalogue for llms-full.txt, grouped by category, live data only. */
export function formatCourseCatalog(courses: LlmsCourse[] | null, base: string): string {
 if (!courses || courses.length === 0) {
  return `## Complete Course Catalog\nThe live catalogue with current course details is at ${base}/en/courses (Arabic: ${base}/ar/courses).`;
 }
 const byCategory = new Map<string, LlmsCourse[]>();
 for (const c of courses) {
  const key = c.category || "other";
  byCategory.set(key, [...(byCategory.get(key) ?? []), c]);
 }
 const sections = Array.from(byCategory.entries()).map(([cat, list]) => {
  const entries = list.map((c) => {
   const facts = [
    c.ageMin && c.ageMax ? `Ages: ${c.ageMin}–${c.ageMax}` : null,
    c.level ? `Level: ${c.level}` : null,
    c.durationWeeks ? `Duration: ${c.durationWeeks} weeks` : null,
    c.lessons ? `Lessons: ${c.lessons}` : null,
   ].filter(Boolean).join(" | ");
   const skills = c.skills?.en?.length ? `\n- Skills: ${c.skills.en.join(", ")}` : "";
   const desc = c.description?.en?.trim();
   return [
    `**${coursePublicTitle(c.slug, c.title?.en?.trim() || c.slug, "en")}**`,
    facts ? `- ${facts}` : "",
    desc ? `- ${desc}` : "",
    skills.replace(/^\n/, ""),
    `- English page: ${base}/en/courses/${c.slug}`,
    `- Arabic page: ${base}/ar/courses/${c.slug}`,
   ].filter(Boolean).join("\n");
  });
  return `### ${categoryLabel(cat)} (${list.length} course${list.length === 1 ? "" : "s"})\n\n${entries.join("\n\n")}`;
 });
 return [
  `## Complete Course Catalog (${courses.length} live courses)`,
  "",
  sections.join("\n\n---\n\n"),
 ].join("\n");
}
