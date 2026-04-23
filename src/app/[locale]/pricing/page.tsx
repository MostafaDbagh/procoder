import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import PricingContent from "./PricingContent";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { getPricingISR } from "@/lib/server-api";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

const meta = {
  en: {
    title: "Pricing | Kids' Coding & STEM Classes — StemTechLab",
    description:
      "Transparent pricing for live kids' coding, robotics & Arabic classes. Free trial, flexible monthly plans, and up to 25% off annual bundles. No hidden fees.",
  },
  ar: {
    title: "الأسعار | دورات برمجة وSTEM للأطفال — ستم تك لاب",
    description:
      "أسعار شفافة لحصص البرمجة والروبوتات والعربية المباشرة للأطفال. تجربة مجانية، خطط شهرية مرنة، وخصم يصل إلى ٢٥٪. بدون رسوم مخفية.",
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
      canonical: `${SITE_URL}/${lang}/pricing`,
      languages: {
        en: `${SITE_URL}/en/pricing`,
        ar: `${SITE_URL}/ar/pricing`,
        "x-default": `${SITE_URL}/en/pricing`,
      },
    },
    openGraph: {
      title: meta[lang].title,
      description: meta[lang].description,
      url: `${SITE_URL}/${lang}/pricing`,
      type: "website",
      siteName: "StemTechLab",
      locale: lang === "ar" ? "ar_SA" : "en_US",
      alternateLocale: lang === "ar" ? "en_US" : "ar_SA",
      images: [{ url: `${SITE_URL}/og`, width: 1200, height: 630, alt: "StemTechLab" }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta[lang].title,
      description: meta[lang].description,
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const pricing = await getPricingISR();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `${SITE_URL}/${locale}` },
          { name: "Pricing", url: `${SITE_URL}/${locale}/pricing` },
        ]}
      />
      <Suspense>
        <PricingContent pricing={pricing} />
      </Suspense>
    </>
  );
}
