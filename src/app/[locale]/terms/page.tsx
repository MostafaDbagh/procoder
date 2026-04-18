import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import TermsContent from "./TermsContent";

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

const meta = {
  en: {
    title: "Terms of Service",
    description:
      "Terms for using StemTechLab’s kids’ learning platform and live classes.",
  },
  ar: {
    title: "شروط الخدمة",
    description:
      "شروط استخدام منصة ستم تك لاب والحصص المباشرة للأطفال.",
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
      canonical: `${SITE_URL}/${lang}/terms`,
      languages: { [alt]: `${SITE_URL}/${alt}/terms` },
    },
    openGraph: {
      title: meta[lang].title,
      description: meta[lang].description,
      url: `${SITE_URL}/${lang}/terms`,
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TermsContent />;
}
