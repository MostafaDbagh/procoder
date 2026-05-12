import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import InstructorDashboard from "./InstructorDashboard";
import { PRIVATE_APP_ROBOTS, buildAlternates } from "@/lib/seo";

export async function generateMetadata({
 params,
}: {
 params: Promise<{ locale: string }>;
}): Promise<Metadata> {
 const { locale } = await params;
 const lang = locale === "ar" ? "ar" : "en";
 return {
 title: lang === "ar" ? "لوحة المدرّس" : "Instructor dashboard",
 description:
 lang === "ar"
 ? "لوحة تحكم المعلم في ستم تك لاب: إدارة الحصص والطلاب والملاحظات."
 : "StemTechLab instructor dashboard: manage classes, students, and notes.",
 robots: PRIVATE_APP_ROBOTS,
 alternates: buildAlternates(lang, "/instructor"),
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
