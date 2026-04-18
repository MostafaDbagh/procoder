import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import InstructorLoginContent from "./InstructorLoginContent";
import { PRIVATE_APP_ROBOTS } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

export async function generateMetadata({
 params,
}: {
 params: Promise<{ locale: string }>;
}): Promise<Metadata> {
 const { locale } = await params;
 const lang = locale === "ar" ? "ar" : "en";
 return {
 title: lang === "ar" ? "تسجيل دخول المدرّس" : "Instructor sign-in",
 description:
 lang === "ar"
 ? "تسجيل الدخول بحساب المدرّس."
 : "Sign in to the StemTechLab instructor portal.",
 robots: PRIVATE_APP_ROBOTS,
 alternates: {
 canonical: `${SITE_URL}/${lang}/instructor/login`,
 languages: {
 en: `${SITE_URL}/en/instructor/login`,
 ar: `${SITE_URL}/ar/instructor/login`,
 },
 },
 };
}

export default async function InstructorLoginPage({
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
 return <InstructorLoginContent idleSignOut={idleSignOut} />;
}
