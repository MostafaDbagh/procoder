import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { FAQ } from "@/components/FAQ";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";

const meta = {
  en: {
    title: "FAQ — Frequently Asked Questions | StemTechLab",
    description:
      "Got questions? Find answers about StemTechLab classes, scheduling, teachers, pricing, and more. Live coding, robotics & Arabic courses for kids 6–18 in UAE, Netherlands & Germany.",
  },
  ar: {
    title: "الأسئلة الشائعة | ستم تك لاب",
    description:
      "أجوبة على أسئلتك حول حصص ستم تك لاب، المواعيد، المعلمين، الأسعار وأكثر. دورات برمجة وروبوتات وعربية للأطفال ٦–١٨ في الإمارات وهولندا وألمانيا.",
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
    title: m.title,
    description: m.description,
    alternates: buildAlternates(lang, "/faq"),
    openGraph: {
      title: m.title,
      description: m.description,
      url: siteUrl(lang, "/faq"),
      siteName: "StemTechLab",
      type: "website",
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
      <FAQ />
    </>
  );
}
