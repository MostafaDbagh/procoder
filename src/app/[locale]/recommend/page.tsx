import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import RecommendContent from "./RecommendContent";
import { getCoursesISR } from "@/lib/server-api";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

const meta = {
  en: {
    title: "AI course finder for kids | OpenAI & DeepSeek | ProCoder",
    description:
      "Find the best live course for your child: AI-powered matching (OpenAI & DeepSeek), or a quick form. Ages 6–18.",
  },
  ar: {
    title: "مُنتقي الدورات بالذكاء الاصطناعي لطفلك | بروكودر",
    description:
      "اكتشف أفضل حصة مناسبة لطفلك: مطابقة بالذكاء الاصطناعي (OpenAI وDeepSeek) أو نموذج سريع. للأعمار ٦–١٨.",
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
