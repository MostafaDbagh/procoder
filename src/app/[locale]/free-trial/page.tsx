import { SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import FreeTrialContent from "./FreeTrialContent";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";



const meta = {
  en: {
    title: "Free Trial Class for Kids — Coding & Robotics | StemTechLab",
    description:
      "Request a free live trial for your child. Our team confirms availability, teaching language and class format. Explore a suitable STEM starting point.",
  },
  ar: {
    title: "حصة مجانية للأطفال | برمجة وروبوتات",
    description:
      "اطلب حصة تجريبية مجانية لطفلك. يؤكّد الفريق التوفّر ولغة التدريس وصيغة الحصة. استكشف نقطة بداية مناسبة في البرمجة والعلوم والتقنية.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "ar" ? "ar" : "en";

  const fullTitle = lang === "ar" ? `${meta.ar.title} | ستم تك لاب` : meta.en.title;
  const title = { absolute: fullTitle };
  const ogTitle = fullTitle;

  return {
    title,
    description: meta[lang].description,
    alternates: buildAlternates(lang, "/free-trial"),
    openGraph: {
      title: ogTitle,
      description: meta[lang].description,
      url: siteUrl(lang, "/free-trial"),
      type: "website",
      siteName: "StemTechLab",
      locale: lang === "ar" ? "ar_AE" : "en_US",
      alternateLocale: lang === "ar" ? "en_US" : "ar_AE",
      images: [{ url: `${SITE_URL}/og?locale=${lang}`, width: 1200, height: 630, alt: "StemTechLab Free Trial" }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
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
          { name: bcLabel("Home", locale), url: `${SITE_URL}/${locale}` },
          { name: bcLabel("Free Trial", locale), url: `${SITE_URL}/${locale}/free-trial` },
        ]}
      />
      <Suspense>
        <FreeTrialContent />
      </Suspense>
    </>
  );
}
