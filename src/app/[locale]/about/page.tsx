import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import AboutContent from "./AboutContent";
import { getTeamPublicISR } from "@/lib/server-api";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

const meta = {
  en: {
    title: "About ProCoder — Our Team, Vision & Mission | Saudi Arabia, UAE, GCC",
    description:
      "ProCoder is a bilingual kids learning platform serving Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain, Turkey, Canada, US & Europe. Meet our certified instructors and learn about our vision for STEM & Quran education.",
  },
  ar: {
    title: "عن بروكودر — فريقنا ورؤيتنا ومهمتنا | السعودية والإمارات والخليج",
    description:
      "بروكودر منصة تعليمية ثنائية اللغة للأطفال تخدم السعودية والإمارات وقطر والكويت وعمان والبحرين وتركيا وكندا وأمريكا وأوروبا. تعرف على مدرسينا المعتمدين ورؤيتنا لتعليم العلوم والقرآن.",
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
  const cmsTeam = await getTeamPublicISR();
  return <AboutContent cmsTeam={cmsTeam} />;
}
