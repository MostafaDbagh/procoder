import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { BreadcrumbSchema } from "@/components/StructuredData";
import CareersContent from "./CareersContent";

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

const meta = {
  en: {
    title: "Careers at StemTechLab | Join Our Team",
    description:
      "Explore career opportunities at StemTechLab. Join our mission to provide quality STEM and coding education for children worldwide.",
  },
  ar: {
    title: "الوظائف في ستم تك لاب | انضم لفريقنا",
    description:
      "اكتشف فرص العمل في ستم تك لاب. انضم إلى مهمتنا لتقديم تعليم STEM وبرمجة عالي الجودة للأطفال في جميع أنحاء العالم.",
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
