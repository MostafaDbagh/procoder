import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import DashboardContent from "./DashboardContent";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "ar" ? "ar" : "en";

  return {
    title: lang === "ar" ? "لوحة التحكم" : "My Dashboard",
    description:
      lang === "ar"
        ? "تابع تقدم طفلك، الدورات المسجلة، والإنجازات في بروكودر."
        : "Track your child's progress, enrolled courses, and achievements on ProCoder.",
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${SITE_URL}/${lang}/dashboard`,
    },
  };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DashboardContent />;
}
