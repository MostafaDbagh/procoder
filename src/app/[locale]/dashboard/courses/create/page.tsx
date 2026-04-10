import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import CreateCourseContent from "./CreateCourseContent";

export const metadata: Metadata = {
  title: "Create Course — Admin",
  robots: { index: false, follow: false },
};

export default async function CreateCoursePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CreateCourseContent />;
}
