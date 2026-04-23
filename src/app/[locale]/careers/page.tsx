import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { BreadcrumbSchema } from "@/components/StructuredData";
import CareersContent from "./CareersContent";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

const meta = {
  en: {
    title: "Careers at StemTechLab | Teach Kids Coding & STEM Online",
    description:
      "Join StemTechLab as an online STEM teacher, coding instructor, or Arabic tutor. Remote roles for certified educators. Teach kids ages 6–18 worldwide.",
  },
  ar: {
    title: "وظائف ستم تك لاب | علّم البرمجة وSTEM للأطفال أونلاين",
    description:
      "انضم إلى ستم تك لاب معلماً للبرمجة أو STEM أو اللغة العربية للأطفال أونلاين. وظائف عن بُعد للمعلمين المعتمدين. علّم أطفالاً بأعمار ٦–١٨ حول العالم.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "ar" ? "ar" : "en";

  return {
    title: meta[lang].title,
    description: meta[lang].description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/careers`,
      languages: { en: `${SITE_URL}/en/careers`, ar: `${SITE_URL}/ar/careers`, "x-default": `${SITE_URL}/en/careers` },
    },
    openGraph: {
      title: meta[lang].title,
      description: meta[lang].description,
      url: `${SITE_URL}/${lang}/careers`,
      type: "website",
      siteName: "StemTechLab",
      locale: lang === "ar" ? "ar_SA" : "en_US",
      alternateLocale: lang === "ar" ? "en_US" : "ar_SA",
      images: [{ url: `${SITE_URL}/og`, width: 1200, height: 630, alt: "StemTechLab Careers" }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta[lang].title,
      description: meta[lang].description,
    },
  };
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `${SITE_URL}/${locale}` },
          { name: "Careers", url: `${SITE_URL}/${locale}/careers` },
        ]}
      />
      <CareersContent />
    </>
  );
}
