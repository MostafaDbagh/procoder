import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import RecommendContent from "./RecommendContent";
import { getCoursesISR } from "@/lib/server-api";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

const meta = {
  en: {
    title: "AI Course Recommendations for Kids | Find the Perfect Class",
    description:
      "Use our AI-powered tool to find the ideal coding, robotics, Arabic or Quran course for your child. Personalized recommendations based on age, interests & skill level. Available in Saudi Arabia, UAE, GCC, Turkey, Canada, US & Europe.",
  },
  ar: {
    title: "توصيات ذكية للدورات | اعثر على الدورة المثالية لطفلك",
    description:
      "استخدم أداتنا الذكية لإيجاد دورة البرمجة أو الروبوتات أو العربية أو القرآن المثالية لطفلك. توصيات مخصصة حسب العمر والاهتمامات. متاح في السعودية والإمارات والخليج وتركيا وكندا وأمريكا وأوروبا.",
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
