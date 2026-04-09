import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import RecommendContent from "./RecommendContent";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

const meta = {
  en: {
    title: "AI Course Recommendations",
    description:
      "Get personalized course recommendations for your child using our AI-powered tool. Find the perfect programming, robotics, or Quran course based on age and interests.",
  },
  ar: {
    title: "توصيات الدورات بالذكاء الاصطناعي",
    description:
      "احصل على توصيات دورات مخصصة لطفلك باستخدام أداتنا المدعومة بالذكاء الاصطناعي. اعثر على الدورة المثالية بناءً على العمر والاهتمامات.",
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
  return <RecommendContent />;
}
