import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import ContactContent from "./ContactContent";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

const meta = {
  en: {
    title: "Contact Us",
    description:
      "Get in touch with ProCoder. Questions about our kids coding, robotics, or Quran courses? We'd love to hear from you.",
  },
  ar: {
    title: "تواصل معنا",
    description:
      "تواصل مع بروكودر. هل لديك أسئلة حول دوراتنا في البرمجة والروبوتات والقرآن للأطفال؟ يسعدنا سماع منك.",
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
