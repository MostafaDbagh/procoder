import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import AboutContent from "./AboutContent";
import { getTeamPublicISR } from "@/lib/server-api";
import { BreadcrumbSchema } from "@/components/StructuredData";

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

const meta = {
 en: {
 title: "About StemTechLab | Kids’ STEM & coding education",
 description:
 "Our mission: quality STEM education and coding for kids—live classes, small groups, bilingual support, and certified instructors. Serving families in the GCC and worldwide.",
 },
 ar: {
 title: "عن ستم تك لاب | تعليم STEM وبرمجة للأطفال",
 description:
 "رسالتنا: تعليم STEM وجودة في برمجة الأطفال—حصص مباشرة ومجموعات صغيرة ودعم ثنائي اللغة ومدرّسون معتمدون. للعائلات في الخليج والعالم.",
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
 canonical: `${SITE_URL}/${lang}/about`,
 languages: { en: `${SITE_URL}/en/about`, ar: `${SITE_URL}/ar/about`, "x-default": `${SITE_URL}/en/about` },
 },
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: `${SITE_URL}/${lang}/about`,
 type: "website",
 siteName: "StemTechLab",
 locale: lang === "ar" ? "ar_SA" : "en_US",
 alternateLocale: lang === "ar" ? "en_US" : "ar_SA",
 images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "StemTechLab" }],
 },
 twitter: {
 card: "summary_large_image",
 title: meta[lang].title,
 description: meta[lang].description,
 },
 };
}

export default async function AboutPage({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 setRequestLocale(locale);
 const cmsTeam = await getTeamPublicISR();
 return (
 <>
 <BreadcrumbSchema
 items={[
 { name: "Home", url: `${SITE_URL}/${locale}` },
 { name: "About", url: `${SITE_URL}/${locale}/about` },
 ]}
 />
 <AboutContent cmsTeam={cmsTeam} />
 </>
 );
}
