import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import LevelContent from "./LevelContent";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { getCoursesISR } from "@/lib/server-api";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";
import {
  JOURNEY_LEVELS,
  JOURNEY_LEVEL_META,
  isJourneyLevel,
} from "@/data/journeyLevels";
import { LOCALES } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

// Matches the catalogue ISR window — level pages list live courses.
export const revalidate = 300;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    JOURNEY_LEVELS.map((level) => ({ locale, level }))
  );
}

/** OG card headline for a level, e.g. "Builder — From Ideas to Working Instructions". */
function ogImageUrl(lang: string, headline: string, name: string): string {
  const params = new URLSearchParams({ locale: lang, title: headline, cat: name });
  return `${SITE_URL}/og?${params.toString()}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; level: string }>;
}): Promise<Metadata> {
  const { locale, level } = await params;
  if (!isJourneyLevel(level)) return { title: "Not Found" };

  const lang = locale === "ar" ? "ar" : "en";
  const t = await getTranslations({
    locale,
    namespace: `journey.levels.${level}`,
  });
  const title = t("seo.pageTitle");
  const description = t("seo.pageDesc");
  const name = t("meta.name");
  const headline = `${name} — ${t("meta.tagline")}`;
  const ogImg = ogImageUrl(lang, headline, name);
  const path = `/learning-path/${level}`;

  return {
    title: { absolute: title },
    description,
    alternates: buildAlternates(lang, path),
    openGraph: {
      title,
      description,
      url: siteUrl(lang, path),
      type: "website",
      siteName: "StemTechLab",
      locale: lang === "ar" ? "ar_AE" : "en_US",
      alternateLocale: lang === "ar" ? "en_US" : "ar_AE",
      images: [{ url: ogImg, width: 1200, height: 630, alt: headline }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImg],
    },
  };
}

export default async function LevelPage({
  params,
}: {
  params: Promise<{ locale: string; level: string }>;
}) {
  const { locale, level } = await params;
  if (!isJourneyLevel(level)) notFound();
  setRequestLocale(locale);

  const lang = locale === "ar" ? "ar" : "en";
  const t = await getTranslations({
    locale,
    namespace: `journey.levels.${level}`,
  });
  const meta = JOURNEY_LEVEL_META[level];
  const path = `/learning-path/${level}`;
  const url = siteUrl(lang, path);

  const allCourses = await getCoursesISR();
  const courses = (allCourses ?? []).filter((c) => c.stlLevel === level);

  const habits = t.raw("practice.habits") as { name: string }[];

  // schema.org/Course describing the stage itself. Individual courses carry
  // their own Course schema on their detail pages, so this stays at stage level.
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${t("meta.name")} — ${t("meta.tagline")}`,
    description: t("seo.pageDesc"),
    url,
    inLanguage: lang,
    educationalLevel: t("meta.name"),
    typicalAgeRange: `${meta.ageMin}-${meta.ageMax}`,
    teaches: Array.isArray(habits) ? habits.map((h) => h.name) : undefined,
    provider: {
      "@type": "Organization",
      name: "StemTechLab",
      url: SITE_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      inLanguage: lang,
    },
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: bcLabel("Home", locale), url: `${SITE_URL}/${locale}` },
          {
            name: bcLabel("Learning path", locale),
            url: siteUrl(lang, "/learning-path"),
          },
          { name: t("meta.name"), url },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <LevelContent level={level} courses={courses} />
    </>
  );
}
