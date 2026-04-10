import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import AboutContent from "./AboutContent";
import { getTeamPublicISR } from "@/lib/server-api";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

const meta = {
  en: {
    title: "About ProCoder | Team & mission",
    description:
      "STEM and Quran for kids with bilingual support and certified instructors. GCC & worldwide.",
  },
  ar: {
    title: "عن بروكودر | الفريق والرسالة",
    description:
      "تعليم علوم وقرآن للأطفال بدعم ثنائي اللغة ومدرسين معتمدين. الخليج والعالم.",
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
