import { SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import AboutContent from "./AboutContent";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { MeetOurStars } from "@/components/MeetOurStars";
import { getTeamPublicISR } from "@/lib/server-api";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";



const meta = {
 en: {
 title: "About StemTechLab | AI STEM Platform for Kids (5–18)",
 description:
 "Meet StemTechLab: live online coding, robotics and AI, with five learning levels for ages 5–18. Explore a starting point and check course entry requirements.",
 },
 ar: {
 title: "عن ستم تك لاب | منصة STEM ذكية للأطفال",
 description:
 "تعرّف على ستم تك لاب: برمجة وروبوتات وذكاء اصطناعي أونلاين، مع خمسة مستويات للأعمار ٥–١٨. استكشف نقطة بداية وراجع متطلبات القبول لكل دورة.",
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
 title: { absolute: meta[lang].title },
 description: meta[lang].description,
 alternates: buildAlternates(lang, "/about"),
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: siteUrl(lang, "/about"),
 type: "website",
 siteName: "StemTechLab",
 locale: lang === "ar" ? "ar_AE" : "en_US",
 alternateLocale: lang === "ar" ? "en_US" : "ar_AE",
 images: [{ url: `${SITE_URL}/og?locale=${lang}`, width: 1200, height: 630, alt: "StemTechLab" }],
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
 { name: bcLabel("Home", locale), url: `${SITE_URL}/${locale}` },
 { name: bcLabel("About", locale), url: `${SITE_URL}/${locale}/about` },
 ]}
 />
 <AboutContent />
 <MeetOurStars cmsTeam={cmsTeam} />
 </>
 );
}
