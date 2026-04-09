import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import AboutContent from "./AboutContent";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

const meta = {
  en: {
    title: "About ProCoder",
    description:
      "Learn about ProCoder's mission to make coding, robotics, and Quran education accessible and fun for children ages 6–18 worldwide.",
  },
  ar: {
    title: "عن بروكودر",
    description:
      "تعرف على مهمة بروكودر في جعل تعليم البرمجة والروبوتات والقرآن متاحاً وممتعاً للأطفال من 6 إلى 18 سنة حول العالم.",
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
      canonical: `${SITE_URL}/${lang}/about`,
      languages: { [alt]: `${SITE_URL}/${alt}/about` },
    },
    openGraph: {
      title: meta[lang].title,
      description: meta[lang].description,
      url: `${SITE_URL}/${lang}/about`,
    },
    twitter: {
      title: meta[lang].title,
      description: meta[lang].description,
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutContent />;
}
