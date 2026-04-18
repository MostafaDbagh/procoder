import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ParentLoginContent from "./ParentLoginContent";

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

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
 : "Sign in or create a parent account for StemTechLab.",
 robots: { index: false, follow: false },
 alternates: {
 canonical: `${SITE_URL}/${lang}/parent/login`,
 },
 };
}

export default async function ParentLoginPage({
 params,
 searchParams,
}: {
 params: Promise<{ locale: string }>;
 searchParams?: Promise<{ idle?: string }>;
}) {
 const { locale } = await params;
 setRequestLocale(locale);
 const sp = (await searchParams) ?? {};
 const idleSignOut = sp.idle === "1";
 return <ParentLoginContent idleSignOut={idleSignOut} />;
}
