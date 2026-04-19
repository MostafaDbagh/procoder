import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { courses as staticCourses } from "@/data/courses";
import CourseDetailContent from "./CourseDetailContent";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { getCourseISR, getCourseSlugsISR } from "@/lib/server-api";

// Force SSR — admin price/status changes reflect immediately
export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

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
 const { locale, id } = await params;
 const lang = locale === "ar" ? "ar" : "en";
 const alt = lang === "en" ? "ar" : "en";

 const apiCourse = await getCourseISR(id);
 const staticCourse = staticCourses.find((c) => c.id === id);

 if (!apiCourse && !staticCourse) {
 return { title: "Course Not Found" };
 }

 const ct = await getTranslations({ locale, namespace: "courseData" });
 let title: string;
 let seoDescription: string;

 if (apiCourse) {
 title = lang === "ar" ? apiCourse.title.ar : apiCourse.title.en;
 const body =
 lang === "ar" ? apiCourse.description.ar : apiCourse.description.en;
 const ageRange = `${apiCourse.ageMin}–${apiCourse.ageMax}`;
 seoDescription = `${body} For ages ${ageRange}. ${apiCourse.level.charAt(0).toUpperCase() + apiCourse.level.slice(1)} level, ${apiCourse.lessons} lessons over ${apiCourse.durationWeeks} weeks.`;
 } else {
 const sc = staticCourse!;
 title = ct(sc.titleKey);
 const description = ct(sc.descKey);
 const ageRange = `${sc.ageMin}–${sc.ageMax}`;
 seoDescription = `${description} For ages ${ageRange}. ${sc.level.charAt(0).toUpperCase() + sc.level.slice(1)} level, ${sc.lessons} lessons over ${sc.durationWeeks} weeks.`;
 }

 return {
 title,
 description: seoDescription,
 alternates: {
 canonical: `${SITE_URL}/${lang}/courses/${id}`,
 languages: { en: `${SITE_URL}/en/courses/${id}`, ar: `${SITE_URL}/ar/courses/${id}`, "x-default": `${SITE_URL}/en/courses/${id}` },
 },
 openGraph: {
 title: `${title} | StemTechLab`,
 description: seoDescription,
 url: `${SITE_URL}/${lang}/courses/${id}`,
 type: "website",
 siteName: "StemTechLab",
 locale: lang === "ar" ? "ar_SA" : "en_US",
 alternateLocale: lang === "ar" ? "en_US" : "ar_SA",
 images: [{ url: `${SITE_URL}/og`, width: 1200, height: 630, alt: title }],
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
 const { locale, id } = await params;
 setRequestLocale(locale);

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

 return (
 <>
 <BreadcrumbSchema items={[
 { name: "Home", url: `${SITE_URL}/${locale}` },
 { name: "Courses", url: `${SITE_URL}/${locale}/courses` },
 { name: courseTitle, url: `${SITE_URL}/${locale}/courses/${id}` },
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
