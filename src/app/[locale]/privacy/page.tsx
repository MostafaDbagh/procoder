import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import PrivacyContent from "./PrivacyContent";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

const meta = {
  en: {
    title: "Privacy Policy",
    description:
      "ProCoder's privacy policy. Learn how we protect your child's data and comply with COPPA guidelines for children's online safety.",
  },
  ar: {
    title: "سياسة الخصوصية",
    description:
      "سياسة الخصوصية لبروكودر. تعرف على كيفية حماية بيانات طفلك والامتثال لإرشادات سلامة الأطفال عبر الإنترنت.",
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
      canonical: `${SITE_URL}/${lang}/privacy`,
      languages: { [alt]: `${SITE_URL}/${alt}/privacy` },
    },
    openGraph: {
      title: meta[lang].title,
      description: meta[lang].description,
      url: `${SITE_URL}/${lang}/privacy`,
    },
    twitter: {
      title: meta[lang].title,
      description: meta[lang].description,
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrivacyContent />;
}
