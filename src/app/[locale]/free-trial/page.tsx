import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import FreeTrialContent from "./FreeTrialContent";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { buildAlternates, siteUrl } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";


const meta = {
  en: {
    title: "Free Trial Class for Kids | Coding, Robotics & Arabic — StemTechLab",
    description:
      "Book your child's free 60-minute live class — a real certified instructor, a real small group, no credit card and no commitment. Available for Coding, Robotics, and Arabic courses for ages 6–18. Spots are limited per session.",
  },
  ar: {
    title: "حصة تجريبية مجانية للأطفال | برمجة وروبوتات وعربية — ستم تك لاب",
    description:
      "احجز حصة مباشرة مجانية لطفلك لمدة ٦٠ دقيقة — معلم معتمد حقيقي، مجموعة صغيرة، بدون بطاقة ائتمان أو أي التزام. متاحة لدورات البرمجة والروبوتات والعربية للأعمار ٦–١٨. الأماكن محدودة لكل جلسة.",
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
    alternates: buildAlternates(lang, "/free-trial"),
    openGraph: {
      title: meta[lang].title,
      description: meta[lang].description,
      url: siteUrl(lang, "/free-trial"),
      type: "website",
      siteName: "StemTechLab",
      locale: lang === "ar" ? "ar_SA" : "en_US",
      alternateLocale: lang === "ar" ? "en_US" : "ar_SA",
      images: [{ url: `${SITE_URL}/og`, width: 1200, height: 630, alt: "StemTechLab Free Trial" }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta[lang].title,
      description: meta[lang].description,
    },
  };
}

export default async function FreeTrialPage({
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
          { name: "Free Trial", url: `${SITE_URL}/${locale}/free-trial` },
        ]}
      />
      <Suspense>
        <FreeTrialContent />
      </Suspense>
    </>
  );
}
