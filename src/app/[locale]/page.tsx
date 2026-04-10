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
    title: "ProCoder — Kids Coding, Robotics & Quran Classes | Saudi Arabia, UAE, GCC & Worldwide",
    description:
      "Online coding, robotics, algorithms, Arabic & Quran courses for kids ages 6–18. Live small-group classes with certified instructors. Serving Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain, Turkey, Canada, US & Europe. Free trial!",
  },
  ar: {
    title: "بروكودر — دروس البرمجة والروبوتات والقرآن للأطفال | السعودية، الإمارات، الخليج والعالم",
    description:
      "دورات أونلاين في البرمجة والروبوتات والخوارزميات والعربية والقرآن للأطفال ٦–١٨ سنة. فصول مباشرة مع مدرسين معتمدين. نخدم السعودية والإمارات وقطر والكويت وعمان والبحرين وتركيا وكندا وأمريكا وأوروبا. حصة تجريبية مجانية!",
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
