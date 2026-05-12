import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { FAQ } from "@/components/FAQ";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

const meta = {
  en: {
    title: "FAQ — Frequently Asked Questions | StemTechLab",
    description:
      "Got questions? Find answers about StemTechLab classes, scheduling, teachers, and more. The UAE's leading live coding, robotics & Arabic courses for kids 6–18 across the UAE and GCC.",
  },
  ar: {
    title: "الأسئلة الشائعة | ستم تك لاب",
    description:
      "أجوبة على أسئلتك حول حصص ستم تك لاب، المواعيد، المعلمين، الأسعار وأكثر. دورات برمجة وروبوتات وعربية للأطفال ٦–١٨ في الإمارات ودول الخليج العربي.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "ar" ? "ar" : "en";
  const m = meta[lang];
  return {
    title: { absolute: m.title },
    description: m.description,
    alternates: buildAlternates(lang, "/faq"),
    openGraph: {
      title: m.title,
      description: m.description,
      url: siteUrl(lang, "/faq"),
      siteName: "StemTechLab",
      type: "website",
      locale: lang === "ar" ? "ar_AE" : "en_US",
      alternateLocale: lang === "ar" ? "en_US" : "ar_AE",
      images: [{ url: `${SITE_URL}/og?locale=${lang}`, width: 1200, height: 630, alt: "StemTechLab FAQ" }],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
    },
  };
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale === "ar" ? "ar" : "en";

  const breadcrumbs = [
    { name: bcLabel("Home", lang), url: siteUrl(lang) },
    { name: lang === "ar" ? "الأسئلة الشائعة" : "FAQ", url: siteUrl(lang, "/faq") },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema locale={lang} />
      <FAQ />
    </>
  );
}
