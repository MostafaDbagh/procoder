import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import ContactContent from "./ContactContent";
import { BreadcrumbSchema } from "@/components/StructuredData";

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

const meta = {
 en: {
 title: "Contact StemTechLab | Free trial for kids’ coding & STEM",
 description:
 "Book a free trial or ask about kids’ coding classes, STEM tutorials, and Arabic programs. We reply quickly. Parents worldwide and in the GCC welcome.",
 },
 ar: {
 title: "تواصل مع ستم تك لاب | تجربة مجانية لبرمجة الأطفال وSTEM",
 description:
 "احجز تجربة مجانية أو اسأل عن دورات برمجة الأطفال ودروس STEM والعربية. رد سريع. نرحب بالعائلات في الخليج والعالم.",
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
 languages: { en: `${SITE_URL}/en/contact`, ar: `${SITE_URL}/ar/contact`, "x-default": `${SITE_URL}/en/contact` },
 },
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: `${SITE_URL}/${lang}/contact`,
 type: "website",
 siteName: "StemTechLab",
 locale: lang === "ar" ? "ar_SA" : "en_US",
 alternateLocale: lang === "ar" ? "en_US" : "ar_SA",
 images: [{ url: `${SITE_URL}/og`, width: 1200, height: 630, alt: "StemTechLab" }],
 },
 twitter: {
 card: "summary_large_image",
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
 <>
 <BreadcrumbSchema
 items={[
 { name: "Home", url: `${SITE_URL}/${locale}` },
 { name: "Contact", url: `${SITE_URL}/${locale}/contact` },
 ]}
 />
 <Suspense>
 <ContactContent />
 </Suspense>
 </>
 );
}
