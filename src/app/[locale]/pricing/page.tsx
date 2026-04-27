import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import PricingContent from "./PricingContent";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { getPricingISR } from "@/lib/server-api";
import { buildAlternates, siteUrl } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";


const meta = {
  en: {
    title: "Pricing | Kids' Coding & STEM Classes — StemTechLab",
    description:
      "StemTechLab pricing: 1 free trial class (no credit card), then monthly, quarterly (10% off), or annual (25% off) plans. Sibling discount 15% for a second child. School and group packages on request. All prices published — no hidden fees.",
  },
  ar: {
    title: "الأسعار | دورات برمجة وSTEM للأطفال — ستم تك لاب",
    description:
      "أسعار ستم تك لاب: حصة تجريبية مجانية بدون بطاقة ائتمان، ثم خطط شهرية أو ربع سنوية (خصم ١٠٪) أو سنوية (خصم ٢٥٪). خصم ١٥٪ للطفل الثاني. باقات المدارس والمجموعات بالطلب. جميع الأسعار منشورة بدون رسوم مخفية.",
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
    alternates: buildAlternates(lang, "/pricing"),
    openGraph: {
      title: meta[lang].title,
      description: meta[lang].description,
      url: siteUrl(lang, "/pricing"),
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
