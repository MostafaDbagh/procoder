import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import CoursesContent from "./CoursesContent";
import { BreadcrumbSchema } from "@/components/StructuredData";

// Force SSR — admin price/status changes reflect immediately
export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

const meta = {
  en: {
    title: "Kids’ courses | Coding, robotics, Arabic & Quran",
    description:
      "Live online paths for ages 6–18: Scratch to Python, robotics, algorithms, Arabic & Quran. Free trial.",
  },
  ar: {
    title: "دورات الأطفال | برمجة وروبوتات وعربية وقرآن",
    description:
      "مسارات مباشرة ٦–١٨: من سكراتش إلى بايثون والروبوتات والخوارزميات والعربية والقرآن. تجربة مجانية.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "ar" ? "ar" : "en";
  const alt = lang === "en" ? "ar" : "en";

  return {
    title: meta[lang].title,
    description: meta[lang].description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/courses`,
      languages: { [alt]: `${SITE_URL}/${alt}/courses` },
    },
    openGraph: {
      title: meta[lang].title,
      description: meta[lang].description,
      url: `${SITE_URL}/${lang}/courses`,
    },
    twitter: {
      title: meta[lang].title,
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
  const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: `${SITE_URL}/${locale}` },
        { name: "Courses", url: `${SITE_URL}/${locale}/courses` },
      ]} />
      <CoursesContent />
    </>
  );
}
