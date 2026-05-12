import type { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LocaleHtmlAttrs } from "@/components/LocaleHtmlAttrs";
import { QueryProvider } from "@/components/QueryProvider";
import { SessionIdleGuard } from "@/components/SessionIdleGuard";
import { CookieBanner } from "@/components/CookieBanner";
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
 <Navbar />
 <main className="flex-1">{children}</main>
 <Footer />
 <CookieBanner />
 </ThemeProvider>
 </QueryProvider>
 </NextIntlClientProvider>
 );
}
