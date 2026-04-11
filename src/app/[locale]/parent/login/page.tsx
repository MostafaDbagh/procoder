import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ParentLoginContent from "./ParentLoginContent";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "ar" ? "ar" : "en";
  return {
    title: lang === "ar" ? "تسجيل دخول ولي الأمر" : "Parent sign-in",
    description:
      lang === "ar"
        ? "تسجيل الدخول أو إنشاء حساب ولي أمر."
        : "Sign in or create a parent account for ProCoder.",
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${SITE_URL}/${lang}/parent/login`,
    },
  };
}

export default async function ParentLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ParentLoginContent />;
}
