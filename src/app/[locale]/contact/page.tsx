import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import ContactContent from "./ContactContent";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";


const meta = {
 en: {
 title: "Contact StemTechLab | Free trial for kids’ coding & STEM",
 description:
 "Send StemTechLab a message about enrollment, course fit, pricing, or your child’s specific needs. We reply within 24 hours. Arabic-speaking support available for GCC families. Email: contact@stemtechlab.com.",
 },
 ar: {
 title: "تواصل مع ستم تك لاب | تجربة مجانية لبرمجة الأطفال وSTEM",
 description:
 "أرسل رسالة إلى ستم تك لاب بشأن التسجيل أو الدورة المناسبة أو الأسعار أو احتياجات طفلك. نرد خلال ٢٤ ساعة. الدعم متاح بالعربية لعائلات الخليج. contact@stemtechlab.com.",
 },
};

export async function generateMetadata({
 params,
}: {
 params: Promise<{ locale: string }>;
}): Promise<Metadata> {
 const { locale } = await params;
 const lang = locale === "ar" ? "ar" : "en";

 return {
 title: meta[lang].title,
 description: meta[lang].description,
 alternates: buildAlternates(lang, "/contact"),
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: siteUrl(lang, "/contact"),
 type: "website",
 siteName: "StemTechLab",
 locale: lang === "ar" ? "ar_SA" : "en_US",
 alternateLocale: lang === "ar" ? "en_US" : "ar_SA",
 images: [{ url: `${SITE_URL}/og?locale=${lang}`, width: 1200, height: 630, alt: "StemTechLab" }],
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
 { name: bcLabel("Home", locale), url: `${SITE_URL}/${locale}` },
 { name: bcLabel("Contact", locale), url: `${SITE_URL}/${locale}/contact` },
 ]}
 />
 <Suspense>
 <ContactContent />
 </Suspense>
 </>
 );
}
