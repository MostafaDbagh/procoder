import type { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { getCoursesISR } from "@/lib/server-api";
import { Footer } from "@/components/Footer";
import { LocaleHtmlAttrs } from "@/components/LocaleHtmlAttrs";
import { QueryProvider } from "@/components/QueryProvider";
import { SessionIdleGuard } from "@/components/SessionIdleGuard";
import {
 OrganizationSchema,
 WebsiteSchema,
 EducationalServiceSchema,
 CourseFinderApplicationSchema,
} from "@/components/StructuredData";

export function generateStaticParams() {
 return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
 params,
}: {
 params: Promise<{ locale: string }>;
}): Promise<Metadata> {
 const { locale } = await params;
 const lang = locale === "ar" ? "ar" : "en";
 return {
 manifest: `/${lang}/manifest.webmanifest`,
 };
}

export default async function LocaleLayout({
 children,
 params,
}: {
 children: ReactNode;
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;

 if (!hasLocale(routing.locales, locale)) {
 notFound();
 }

 setRequestLocale(locale);
 const messages = await getMessages();

 // Course list for the header dropdown. Fetched here (ISR-cached) rather than
 // client-side so the links are in the server HTML and cost no extra request.
 const allCourses = await getCoursesISR();
 const navCourses = (allCourses ?? []).map((c) => ({
 slug: c.slug,
 title: c.title,
 }));

 return (
 <NextIntlClientProvider locale={locale} messages={messages}>
 <QueryProvider>
 <SessionIdleGuard />
 <ThemeProvider>
 <LocaleHtmlAttrs />
 <OrganizationSchema />
 <WebsiteSchema locale={locale} />
 <CourseFinderApplicationSchema locale={locale} />
 <EducationalServiceSchema locale={locale} />
 <Navbar courses={navCourses} />
 <main className="flex-1">{children}</main>
 <Footer />
 </ThemeProvider>
 </QueryProvider>
 </NextIntlClientProvider>
 );
}
