import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import CoursesContent from "./CoursesContent";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

const meta = {
  en: {
    title: "Courses — Programming, Robotics, Quran & More",
    description:
      "Browse ProCoder's courses for kids ages 6–18: Scratch, Python, Web Development, Robotics, Algorithms, Arabic, and Quran studies. Filter by age, level, and category.",
  },
  ar: {
    title: "الدورات — البرمجة والروبوتات والقرآن والمزيد",
    description:
      "تصفح دورات بروكودر للأطفال من 6 إلى 18 سنة: سكراتش، بايثون، تطوير الويب، الروبوتات، الخوارزميات، العربية، والقرآن.",
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
  return <CoursesContent />;
}
