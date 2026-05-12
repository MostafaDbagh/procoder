import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import DashboardContent from "./DashboardContent";
import { getCoursesISR } from "@/lib/server-api";
import { PRIVATE_APP_ROBOTS, buildAlternates } from "@/lib/seo";

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
 robots: PRIVATE_APP_ROBOTS,
 alternates: buildAlternates(lang, "/dashboard"),
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
