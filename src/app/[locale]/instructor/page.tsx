import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import InstructorDashboard from "./InstructorDashboard";

export const metadata: Metadata = {
 title: "Instructor Dashboard",
 robots: { index: false, follow: false },
};

export default async function InstructorPage({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 setRequestLocale(locale);
 return <InstructorDashboard />;
}
