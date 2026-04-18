import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ParentsContent from "./ParentsContent";
import { BreadcrumbSchema } from "@/components/StructuredData";

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

const meta = {
  en: {
    title: "Parents | Progress & attendance",
    description:
      "One dashboard for progress, attendance, and teacher notes.",
  },
  ar: {
    title: "لأولياء الأمور | التقدم والحضور",
    description:
      "لوحة واحدة للتقدم والحضور وملاحظات المعلم.",
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
      canonical: `${SITE_URL}/${lang}/parents`,
      languages: { [alt]: `${SITE_URL}/${alt}/parents` },
    },
    openGraph: {
      title: meta[lang].title,
      description: meta[lang].description,
      url: `${SITE_URL}/${lang}/parents`,
      type: "website",
      siteName: "StemTechLab",
      locale: lang === "ar" ? "ar_SA" : "en_US",
      alternateLocale: lang === "ar" ? "en_US" : "ar_SA",
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "StemTechLab" }],
    },
    twitter: {
      title: meta[lang].title,
      description: meta[lang].description,
    },
  };
}

export default async function ParentsPage({
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
          { name: "For Parents", url: `${SITE_URL}/${locale}/parents` },
        ]}
      />
      <ParentsContent />
    </>
  );
}
