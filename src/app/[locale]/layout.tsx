import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LocaleHtmlAttrs } from "@/components/LocaleHtmlAttrs";
import {
  OrganizationSchema,
  WebsiteSchema,
  FAQSchema,
} from "@/components/StructuredData";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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
      <ThemeProvider>
        <LocaleHtmlAttrs locale={locale} />
        <OrganizationSchema />
        <WebsiteSchema />
        <FAQSchema />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
