import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { courses as staticCourses } from "@/data/courses";
import CourseDetailContent from "./CourseDetailContent";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { getCourseISR, getCourseSlugsISR } from "@/lib/server-api";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";
import { resolveArabicSlug, isArabicSlug } from "@/lib/arabicSlugs";

// Force SSR — admin price/status changes reflect immediately
export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

export async function generateStaticParams() {
 const slugs = await getCourseSlugsISR();
 const merged = new Set([
 ...slugs,
 ...staticCourses.map((c) => c.id),
 ]);
 return [...merged].map((id) => ({ id }));
}

export async function generateMetadata({
 params,
}: {
 params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
 const { locale, id: rawId } = await params;
 const id = resolveArabicSlug(rawId);
 const lang = locale === "ar" ? "ar" : "en";

 const apiCourse = await getCourseISR(id);
 const staticCourse = staticCourses.find((c) => c.id === id);

 if (!apiCourse && !staticCourse) {
 return { title: "Course Not Found" };
 }

 const ct = await getTranslations({ locale, namespace: "courseData" });
 let title: string;
 let seoDescription: string;

 const levelLabel = (level: string, l: "ar" | "en") => {
 const map: Record<string, { ar: string; en: string }> = {
 beginner: { ar: "مبتدئ", en: "Beginner" },
 intermediate: { ar: "متوسط", en: "Intermediate" },
 advanced: { ar: "متقدم", en: "Advanced" },
 };
 return map[level]?.[l] ?? level;
 };

 // Truncate body to leave room for the appended stats (age, level, duration)
 const truncate = (s: string, max: number) =>
 s.length <= max ? s : s.slice(0, s.lastIndexOf(" ", max) || max) + "…";

 if (apiCourse) {
 title = lang === "ar" ? apiCourse.title.ar : apiCourse.title.en;
 const rawBody = lang === "ar" ? apiCourse.description.ar : apiCourse.description.en;
 const ageRange = `${apiCourse.ageMin}–${apiCourse.ageMax}`;
 const lvl = levelLabel(apiCourse.level, lang);
 const suffix = lang === "ar"
 ? ` للأعمار ${ageRange}. مستوى ${lvl}، ${apiCourse.lessons} درسًا على مدى ${apiCourse.durationWeeks} أسابيع.`
 : ` For ages ${ageRange}. ${lvl} level, ${apiCourse.lessons} lessons over ${apiCourse.durationWeeks} weeks.`;
 const body = truncate(rawBody.split("\n")[0], 120 - suffix.length);
 seoDescription = body + suffix;
 } else {
 const sc = staticCourse!;
 title = ct(sc.titleKey);
 const rawDesc = ct(sc.descKey);
 const ageRange = `${sc.ageMin}–${sc.ageMax}`;
 const lvl = levelLabel(sc.level, lang);
 const suffix = lang === "ar"
 ? ` للأعمار ${ageRange}. مستوى ${lvl}، ${sc.lessons} درسًا على مدى ${sc.durationWeeks} أسابيع.`
 : ` For ages ${ageRange}. ${lvl} level, ${sc.lessons} lessons over ${sc.durationWeeks} weeks.`;
 const description = truncate(rawDesc.split("\n")[0], 120 - suffix.length);
 seoDescription = description + suffix;
 }

 return {
 title,
 description: seoDescription,
 alternates: buildAlternates(lang, `/courses/${id}`),
 openGraph: {
 title: `${title} | StemTechLab`,
 description: seoDescription,
 url: siteUrl(lang, `/courses/${id}`),
 type: "website",
 siteName: "StemTechLab",
 locale: lang === "ar" ? "ar_SA" : "en_US",
 alternateLocale: lang === "ar" ? "en_US" : "ar_SA",
 images: [{ url: `${SITE_URL}/og?locale=${lang}&title=${encodeURIComponent(title)}&cat=${encodeURIComponent(apiCourse?.category ?? staticCourse?.category ?? "")}`, width: 1200, height: 630, alt: title }],
 },
 twitter: {
 card: "summary_large_image",
 title: `${title} | StemTechLab`,
 description: seoDescription,
 },
 };
}

export default async function CourseDetailPage({
 params,
}: {
 params: Promise<{ locale: string; id: string }>;
}) {
 const { locale, id: rawId } = await params;
 setRequestLocale(locale);

 // Redirect Arabic slugs (e.g. /ar/courses/بايثون) to their canonical English slug
 if (isArabicSlug(rawId)) {
 const resolved = resolveArabicSlug(rawId);
 const target = `/${locale}/courses/${resolved}`;
 redirect(target);
 }

 const id = rawId;
 const apiCourse = await getCourseISR(id);
 const staticCourse = staticCourses.find((c) => c.id === id);
 if (!apiCourse && !staticCourse) {
 notFound();
 }

 const ct = staticCourse
 ? await getTranslations({ locale, namespace: "courseData" })
 : null;

 const courseSchema =
 apiCourse || (staticCourse && ct)
 ? {
 "@context": "https://schema.org",
 "@type": "Course",
 name: apiCourse
 ? locale === "ar"
 ? apiCourse.title.ar
 : apiCourse.title.en
 : ct!(staticCourse!.titleKey),
 description: apiCourse
 ? locale === "ar"
 ? apiCourse.description.ar
 : apiCourse.description.en
 : ct!(staticCourse!.descKey),
 provider: {
 "@type": "Organization",
 name: "StemTechLab",
 url: SITE_URL,
 },
 educationalLevel: apiCourse?.level ?? staticCourse!.level,
 courseMode: "online",
 availableLanguage: ["English", "Arabic"],
 numberOfCredits: apiCourse?.lessons ?? staticCourse!.lessons,
 timeRequired: `P${apiCourse?.durationWeeks ?? staticCourse!.durationWeeks}W`,
 audience: {
 "@type": "EducationalAudience",
 educationalRole: "student",
 suggestedMinAge: apiCourse?.ageMin ?? staticCourse!.ageMin,
 suggestedMaxAge: apiCourse?.ageMax ?? staticCourse!.ageMax,
 },
 offers: {
 "@type": "Offer",
 category: "Paid",
 availability: "https://schema.org/InStock",
 ...(apiCourse && apiCourse.price > 0
 ? {
 price: String(apiCourse.price),
 priceCurrency: (apiCourse.currency || "USD").toUpperCase(),
 }
 : {}),
 },
 hasCourseInstance: {
 "@type": "CourseInstance",
 courseMode: "online",
 instructor: {
 "@type": "Person",
 name: "StemTechLab Instructor",
 },
 },
 }
 : null;

 const courseTitle = apiCourse
 ? locale === "ar"
 ? apiCourse.title.ar
 : apiCourse.title.en
 : staticCourse && ct
 ? ct(staticCourse.titleKey)
 : id;

 const homeUrl = `${SITE_URL}/${locale}`;
 const coursesUrl = `${SITE_URL}/${locale}/courses`;
 const courseUrl = `${SITE_URL}/${locale}/courses/${id}`;
 return (
 <>
 <BreadcrumbSchema items={[
 { name: bcLabel("Home", locale), url: homeUrl },
 { name: bcLabel("Courses", locale), url: coursesUrl },
 { name: courseTitle, url: courseUrl },
 ]} />
 {courseSchema && (
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
 />
 )}
 <CourseDetailContent />
 </>
 );
}
