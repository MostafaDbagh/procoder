import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import RecommendContent from "./RecommendContent";
import { getCoursesISR } from "@/lib/server-api";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

const meta = {
  en: {
    title: "Course finder for kids | ProCoder",
    description:
      "Answer a few questions to match your child to the right live class. Ages 6–18.",
  },
  ar: {
    title: "أداة اختيار الدورة لطفلك | بروكودر",
    description:
      "بضع أسئلة لاقتراح الحصة المناسبة. للأعمار ٦–١٨.",
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
      canonical: `${SITE_URL}/${lang}/recommend`,
      languages: { [alt]: `${SITE_URL}/${alt}/recommend` },
    },
    openGraph: {
      title: meta[lang].title,
      description: meta[lang].description,
      url: `${SITE_URL}/${lang}/recommend`,
    },
    twitter: {
      title: meta[lang].title,
      description: meta[lang].description,
    },
  };
}

export default async function RecommendPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const initialCourses = await getCoursesISR();
  return <RecommendContent initialCourses={initialCourses} />;
}
