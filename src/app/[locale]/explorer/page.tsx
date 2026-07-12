import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ExplorerContent from "./ExplorerContent";
import { BreadcrumbSchema, buildCourseSchema } from "@/components/StructuredData";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

/** Tailored OG card: Explorer headline + "Explorer" category chip, per locale. */
function ogImageUrl(lang: string, headline: string): string {
  const params = new URLSearchParams({
    locale: lang,
    title: headline,
    cat: "Explorer",
  });
  return `${SITE_URL}/og?${params.toString()}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "ar" ? "ar" : "en";
  const t = await getTranslations({ locale, namespace: "explorer" });
  const title = t("meta.pageTitle");
  const description = t("meta.pageDesc");
  const ogHeadline = `${t("meta.name")} — ${t("meta.tagline")}`;
  const ogImg = ogImageUrl(lang, ogHeadline);

  return {
    title: { absolute: title },
    description,
    keywords:
      lang === "ar"
        ? [
            "Explorer",
            "تفكير حسابي للأطفال",
            "برمجة للأطفال 5-7",
            "تفكير منطقي للأطفال",
            "رحلة تأسيسية",
            "ستم تك لاب",
          ]
        : [
            "Explorer course",
            "computational thinking for kids",
            "coding for kids ages 5-7",
            "algorithmic thinking for children",
            "foundational STEM journey",
            "StemTechLab",
          ],
    alternates: buildAlternates(lang, "/explorer"),
    openGraph: {
      title,
      description,
      url: siteUrl(lang, "/explorer"),
      type: "website",
      siteName: "StemTechLab",
      locale: lang === "ar" ? "ar_AE" : "en_US",
      alternateLocale: lang === "ar" ? "en_US" : "ar_AE",
      images: [{ url: ogImg, width: 1200, height: 630, alt: ogHeadline }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImg],
    },
  };
}

export default async function ExplorerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale === "ar" ? "ar" : "en";
  const t = await getTranslations({ locale, namespace: "explorer" });

  const url = siteUrl(lang, "/explorer");
  const ogHeadline = `${t("meta.name")} — ${t("meta.tagline")}`;
  const habits = t.raw("practice.habits") as { name: string }[];

  // schema.org/Course — helps Google surface Explorer as a structured course.
  // Ages 5–7, 12 sessions, online, bilingual; payment deferred (no public price).
  const courseSchema = {
    "@context": "https://schema.org",
    ...buildCourseSchema(
      {
        name: `${t("meta.name")} — ${t("meta.tagline")}`,
        description: t("meta.pageDesc"),
        url,
        ageMin: 5,
        ageMax: 7,
        level: "beginner",
        lessons: 12,
        durationWeeks: 12,
        imageUrl: ogImageUrl(lang, ogHeadline),
        skills: Array.isArray(habits) ? habits.map((h) => h.name) : undefined,
      },
      lang
    ),
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: bcLabel("Home", locale), url: `${SITE_URL}/${locale}` },
          { name: bcLabel("Courses", locale), url: `${SITE_URL}/${locale}/courses` },
          { name: "Explorer", url },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <ExplorerContent />
    </>
  );
}
