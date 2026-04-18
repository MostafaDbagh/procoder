import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import DashboardContent from "./DashboardContent";
import { getCoursesISR } from "@/lib/server-api";

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

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
 ? "تابع تقدم طفلك، الدورات المسجلة، والإنجازات في ستم تك لاب."
 : "Track your child's progress, enrolled courses, and achievements on StemTechLab.",
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
 const initialCourses = await getCoursesISR();
 return <DashboardContent initialCourses={initialCourses} />;
}
