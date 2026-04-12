import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { LearnByFun } from "@/components/LearnByFun";
import { CategorySection } from "@/components/CategorySection";
import { HowItWorks } from "@/components/HowItWorks";
import { CTABanner } from "@/components/CTABanner";
import { MeetOurStars } from "@/components/MeetOurStars";
import { FAQ } from "@/components/FAQ";
import { getTeamPublicISR } from "@/lib/server-api";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

const meta = {
  en: {
    title: "ProCoder | Live coding, robotics & Quran for kids (6–18)",
    description:
      "AI suggests the best course for your child (OpenAI & DeepSeek). Small-group live classes: programming, robotics, algorithms, Arabic & Quran. GCC & worldwide. Free trial.",
  },
  ar: {
    title: "بروكودر | برمجة وروبوتات وقرآن مباشر للأطفال ٦–١٨",
    description:
      "ذكاء اصطناعي يقترح أفضل دورة لطفلك (OpenAI وDeepSeek). حصص صغيرة مباشرة: برمجة وروبوتات وعربية وقرآن. الخليج والعالم. تجربة مجانية.",
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
      canonical: `${SITE_URL}/${lang}`,
      languages: { [alt]: `${SITE_URL}/${alt}` },
    },
    openGraph: {
      title: meta[lang].title,
      description: meta[lang].description,
      url: `${SITE_URL}/${lang}`,
      locale: lang === "ar" ? "ar_SA" : "en_US",
      alternateLocale: lang === "ar" ? "en_US" : "ar_SA",
    },
    twitter: {
      title: meta[lang].title,
      description: meta[lang].description,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cmsTeam = await getTeamPublicISR();

  return (
    <>
      <Hero />
      <LearnByFun />
      <CategorySection />
      <HowItWorks />
      <MeetOurStars cmsTeam={cmsTeam} />
      <FAQ />
      <CTABanner />
    </>
  );
}
