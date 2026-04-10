import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { LearnByFun } from "@/components/LearnByFun";
import { CategorySection } from "@/components/CategorySection";
import { HowItWorks } from "@/components/HowItWorks";
import { CTABanner } from "@/components/CTABanner";
import { MeetOurStars } from "@/components/MeetOurStars";
import { FAQ } from "@/components/FAQ";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

const meta = {
  en: {
    title: "ProCoder — Fun Coding, Robotics & Quran Classes for Kids",
    description:
      "Interactive online courses in Programming, Robotics, Algorithms, Arabic & Quran for children ages 6–18. Small live classes with expert instructors. Free trial available!",
  },
  ar: {
    title: "بروكودر — دروس ممتعة في البرمجة والروبوتات والقرآن للأطفال",
    description:
      "دورات تفاعلية عبر الإنترنت في البرمجة والروبوتات والخوارزميات واللغة العربية والقرآن للأطفال من 6 إلى 18 سنة. فصول مباشرة صغيرة مع مدرسين خبراء.",
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

  return (
    <>
      <Hero />
      <LearnByFun />
      <CategorySection />
      <HowItWorks />
      <MeetOurStars />
      <FAQ />
      <CTABanner />
    </>
  );
}
