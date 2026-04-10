import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import ContactContent from "./ContactContent";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

const meta = {
  en: {
    title: "Contact ProCoder — Book a Free Trial Class | Saudi Arabia, UAE, GCC",
    description:
      "Contact ProCoder to book a free trial class or ask about our kids coding, robotics, Arabic & Quran courses. We serve families in Saudi Arabia, UAE, Qatar, Kuwait, Oman, Turkey, Canada, US & Europe.",
  },
  ar: {
    title: "تواصل مع بروكودر — احجز حصة تجريبية مجانية | السعودية والإمارات والخليج",
    description:
      "تواصل مع بروكودر لحجز حصة تجريبية مجانية أو الاستفسار عن دورات البرمجة والروبوتات والعربية والقرآن. نخدم العائلات في السعودية والإمارات وقطر والكويت وعمان وتركيا وكندا وأمريكا وأوروبا.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "ar" ? "ar" : "en";
  const alt = lang === "en" ? "ar" : "en";

  return {
    title: meta[lang].title,
    description: meta[lang].description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/contact`,
      languages: { [alt]: `${SITE_URL}/${alt}/contact` },
    },
    openGraph: {
      title: meta[lang].title,
      description: meta[lang].description,
      url: `${SITE_URL}/${lang}/contact`,
    },
    twitter: {
      title: meta[lang].title,
      description: meta[lang].description,
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense>
      <ContactContent />
    </Suspense>
  );
}
