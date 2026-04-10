import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ParentsContent from "./ParentsContent";
import { BreadcrumbSchema } from "@/components/StructuredData";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

const meta = {
  en: {
    title: "For Parents — Track Your Child's Progress | ProCoder",
    description:
      "ProCoder's parent portal: real-time progress reports, attendance tracking, instructor notes, session recordings, and a dedicated dashboard. We treat every child like family. Saudi Arabia, UAE, GCC.",
  },
  ar: {
    title: "لأولياء الأمور — تابع تقدم طفلك | بروكودر",
    description:
      "بوابة أولياء الأمور في بروكودر: تقارير تقدم فورية، تتبع الحضور، ملاحظات المعلمين، تسجيلات الجلسات، ولوحة تحكم مخصصة. نعامل كل طفل كأنه من العائلة.",
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
