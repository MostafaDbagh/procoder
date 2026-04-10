import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LocaleHtmlAttrs } from "@/components/LocaleHtmlAttrs";
import { QueryProvider } from "@/components/QueryProvider";
import {
  OrganizationSchema,
  WebsiteSchema,
  FAQSchema,
  LocalBusinessSchema,
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
      <QueryProvider>
        <ThemeProvider>
          <LocaleHtmlAttrs locale={locale} />
          <OrganizationSchema />
          <WebsiteSchema />
          <FAQSchema />
          <LocalBusinessSchema />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
