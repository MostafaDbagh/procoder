import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import LearningPathIndex from "./LearningPathIndex";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { getCoursesISR } from "@/lib/server-api";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";
import {
  JOURNEY_LEVELS,
  JOURNEY_LEVEL_META,
  type JourneyLevel,
} from "@/data/journeyLevels";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "ar" ? "ar" : "en";
  const t = await getTranslations({ locale, namespace: "journey" });
  const title = t("meta.pageTitle");
  const description = t("meta.pageDesc");
  const ogImg = `${SITE_URL}/og?locale=${lang}&title=${encodeURIComponent(
    t("index.title")
  )}`;

  return {
    title: { absolute: title },
    description,
    alternates: buildAlternates(lang, "/learning-path"),
    openGraph: {
      title,
      description,
      url: siteUrl(lang, "/learning-path"),
      type: "website",
      siteName: "StemTechLab",
      locale: lang === "ar" ? "ar_AE" : "en_US",
      alternateLocale: lang === "ar" ? "en_US" : "ar_AE",
      images: [{ url: ogImg, width: 1200, height: 630, alt: t("index.title") }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImg],
    },
  };
}

export default async function LearningPathPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale === "ar" ? "ar" : "en";
  const t = await getTranslations({ locale, namespace: "journey" });

  const courses = (await getCoursesISR()) ?? [];
  const courseCounts = JOURNEY_LEVELS.reduce(
    (acc, level) => {
      acc[level] = courses.filter((c) => c.stlLevel === level).length;
      return acc;
    },
    {} as Record<JourneyLevel, number>
  );

  const url = siteUrl(lang, "/learning-path");

  // An ordered list of the five stages, so the journey itself is machine-readable
  // rather than only the individual courses inside it.
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("index.title"),
    description: t("meta.pageDesc"),
    inLanguage: lang,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: JOURNEY_LEVELS.length,
    itemListElement: JOURNEY_LEVELS.map((level, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t(`levels.${level}.meta.name`),
      description: t(`levels.${level}.meta.desc`),
      url: siteUrl(lang, `/learning-path/${level}`),
    })),
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: bcLabel("Home", locale), url: `${SITE_URL}/${locale}` },
          { name: bcLabel("Learning path", locale), url },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <LearningPathIndex courseCounts={courseCounts} />
    </>
  );
}
