import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import CreateCourseContent from "./CreateCourseContent";
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
 title: lang === "ar" ? "إنشاء دورة" : "Create course",
 robots: PRIVATE_APP_ROBOTS,
 alternates: {
 canonical: `${SITE_URL}/${lang}/dashboard/courses/create`,
 languages: {
 en: `${SITE_URL}/en/dashboard/courses/create`,
 ar: `${SITE_URL}/ar/dashboard/courses/create`,
 },
 },
 };
}

export default async function CreateCoursePage({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 setRequestLocale(locale);
 return <CreateCourseContent />;
}
