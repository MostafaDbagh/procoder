import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CoursesContent from "./CoursesContent";
import { BreadcrumbSchema, CourseCatalogSchema, type CourseListSchemaItem } from "@/components/StructuredData";
import { courses as staticCourses } from "@/data/courses";
import { getCoursesISR } from "@/lib/server-api";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

// ISR: rebuild every 5 minutes so price/status changes land quickly
// without hammering the backend on every crawl hit.
export const revalidate = 300;


const meta = {
 en: {
 title: "Kids’ Coding & STEM Courses Online (6–18)",
 description:
 "Live coding & STEM courses for kids 6–18: Python, Robotics, Algorithms, AI, Web & Mobile Development. Certified teachers, small groups. Free trial.",
 },
 ar: {
 title: "دورات برمجة وSTEM للأطفال أونلاين ٦–١٨",
 description:
 "دورات مباشرة للأطفال ٦–١٨: بايثون، روبوتات، خوارزميات، ذكاء اصطناعي، وتطوير الويب والتطبيقات. معلمون معتمدون، مجموعات صغيرة. تجربة مجانية.",
 },
};

export async function generateMetadata({
 params,
 searchParams,
}: {
 params: Promise<{ locale: string }>;
 searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
 const { locale } = await params;
 const sp = await searchParams;
 // Category filtering happens client-side, so `/courses?category=X` serves the
 // same HTML as `/courses`. Consolidate those filter views to the clean base URL
 // and drop hreflang from them (hreflang belongs only on the canonical page) —
 // this removes the "no self-referencing hreflang" conflicts on filter URLs.
 const isFiltered = typeof sp?.category === "string" && sp.category.trim() !== "";
 const lang = locale === "ar" ? "ar" : "en";

 const fullTitle = lang === "ar"
 ? `${meta.ar.title} | ستم تك لاب`
 : `${meta.en.title} | StemTechLab`;
 const title = { absolute: fullTitle };
 const ogTitle = fullTitle;

 return {
 title,
 description: meta[lang].description,
 alternates: isFiltered
 ? { canonical: siteUrl(lang, "/courses") }
 : buildAlternates(lang, "/courses"),
 ...(isFiltered ? { robots: { index: false, follow: true } } : {}),
 openGraph: {
 title: ogTitle,
 description: meta[lang].description,
 url: siteUrl(lang, "/courses"),
 type: "website",
 siteName: "StemTechLab",
 locale: lang === "ar" ? "ar_AE" : "en_US",
 alternateLocale: lang === "ar" ? "en_US" : "ar_AE",
 images: [{ url: `${SITE_URL}/og?locale=${lang}`, width: 1200, height: 630, alt: "StemTechLab" }],
 },
 twitter: {
 card: "summary_large_image",
 title: ogTitle,
 description: meta[lang].description,
 },
 };
}

export default async function CoursesPage({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 setRequestLocale(locale);
 const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";
 const homeUrl = `${SITE_URL}/${locale}`;
 const coursesUrl = `${SITE_URL}/${locale}/courses`;
 const lang = locale === "ar" ? "ar" : "en";
 const [apiCourses, ct] = await Promise.all([
 getCoursesISR(),
 getTranslations({ locale, namespace: "courseData" }),
 ]);
 const schemaCourses: CourseListSchemaItem[] =
 apiCourses && apiCourses.length > 0
 ? apiCourses.map((course) => ({
 name: course.title[lang],
 description: course.description[lang],
 url: siteUrl(lang, `/courses/${course.slug}`),
 ageMin: course.ageMin,
 ageMax: course.ageMax,
 level: course.level,
 lessons: course.lessons,
 durationWeeks: course.durationWeeks,
 price: course.price,
 currency: course.currency,
 imageUrl: course.imageUrl,
 skills: course.skills?.[lang],
 }))
 : staticCourses.map((course) => ({
 name: ct(course.titleKey),
 description: ct(course.descKey),
 url: siteUrl(lang, `/courses/${course.id}`),
 ageMin: course.ageMin,
 ageMax: course.ageMax,
 level: course.level,
 lessons: course.lessons,
 durationWeeks: course.durationWeeks,
 price: course.price,
 currency: course.currency,
 skills: course.skillKeys.map((key) => ct(key)),
 }));

 return (
 <>
 <BreadcrumbSchema items={[
 { name: bcLabel("Home", locale), url: homeUrl },
 { name: bcLabel("Courses", locale), url: coursesUrl },
 ]} />
 <CourseCatalogSchema locale={lang} courses={schemaCourses} />
 <CoursesContent />
 </>
 );
}
