import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import InstructorDashboard from "./InstructorDashboard";
import { PRIVATE_APP_ROBOTS } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

export async function generateMetadata({
 params,
}: {
 params: Promise<{ locale: string }>;
}): Promise<Metadata> {
 const { locale } = await params;
 const lang = locale === "ar" ? "ar" : "en";
 return {
 title: lang === "ar" ? "لوحة المدرّس" : "Instructor dashboard",
 robots: PRIVATE_APP_ROBOTS,
 alternates: {
 canonical: `${SITE_URL}/${lang}/instructor`,
 languages: {
 en: `${SITE_URL}/en/instructor`,
 ar: `${SITE_URL}/ar/instructor`,
 },
 },
 };
}

export default async function InstructorPage({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 setRequestLocale(locale);
 return <InstructorDashboard />;
}
