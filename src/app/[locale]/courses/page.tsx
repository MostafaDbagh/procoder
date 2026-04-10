import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import CoursesContent from "./CoursesContent";
import { BreadcrumbSchema } from "@/components/StructuredData";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

const meta = {
  en: {
    title: "Kids Courses — Coding, Robotics, Arabic & Quran | Saudi Arabia, UAE, GCC",
    description:
      "Browse 12+ online courses for kids ages 6–18: Scratch, Python, Web Dev, Game Dev, Robotics, Algorithms, Arabic & Quran. Live classes available in Saudi Arabia, UAE, Qatar, Kuwait, Oman, Turkey, Canada, US & Europe.",
  },
  ar: {
    title: "دورات الأطفال — البرمجة والروبوتات والعربية والقرآن | السعودية والإمارات والخليج",
    description:
      "تصفح +١٢ دورة أونلاين للأطفال ٦–١٨ سنة: سكراتش، بايثون، تطوير الويب، الألعاب، الروبوتات، الخوارزميات، العربية والقرآن. فصول مباشرة في السعودية والإمارات وقطر والكويت وعمان وتركيا وكندا وأمريكا وأوروبا.",
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
  const SITE_URL = process.env.SITE_URL || "https://procoder.com";
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
