import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { courses } from "@/data/courses";
import CourseDetailContent from "./CourseDetailContent";
import { BreadcrumbSchema } from "@/components/StructuredData";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

export function generateStaticParams() {
  return courses.map((course) => ({ id: course.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const lang = locale === "ar" ? "ar" : "en";
  const alt = lang === "en" ? "ar" : "en";

  const course = courses.find((c) => c.id === id);
  if (!course) {
    return { title: "Course Not Found" };
  }

  const ct = await getTranslations({ locale, namespace: "courseData" });
  const title = ct(course.titleKey);
  const description = ct(course.descKey);
  const ageRange = `${course.ageMin}–${course.ageMax}`;
  const seoDescription = `${description} For ages ${ageRange}. ${course.level.charAt(0).toUpperCase() + course.level.slice(1)} level, ${course.lessons} lessons over ${course.durationWeeks} weeks.`;

  return {
    title,
    description: seoDescription,
    alternates: {
      canonical: `${SITE_URL}/${lang}/courses/${id}`,
      languages: { [alt]: `${SITE_URL}/${alt}/courses/${id}` },
    },
    openGraph: {
      title: `${title} | ProCoder`,
      description: seoDescription,
      url: `${SITE_URL}/${lang}/courses/${id}`,
      type: "article",
    },
    twitter: {
      title: `${title} | ProCoder`,
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

  const course = courses.find((c) => c.id === id);
  const ct = course ? await getTranslations({ locale, namespace: "courseData" }) : null;

  const courseSchema = course && ct ? {
    "@context": "https://schema.org",
    "@type": "Course",
    name: ct(course.titleKey),
    description: ct(course.descKey),
    provider: {
      "@type": "Organization",
      name: "ProCoder",
      url: "https://procoder.com",
    },
    educationalLevel: course.level,
    courseMode: "online",
    availableLanguage: ["English", "Arabic"],
    numberOfCredits: course.lessons,
    timeRequired: `P${course.durationWeeks}W`,
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      suggestedMinAge: course.ageMin,
      suggestedMaxAge: course.ageMax,
    },
    offers: {
      "@type": "Offer",
      category: "Paid",
      availability: "https://schema.org/InStock",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      instructor: {
        "@type": "Person",
        name: "ProCoder Instructor",
      },
    },
  } : null;

  const courseTitle = course && ct ? ct(course.titleKey) : id;

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
