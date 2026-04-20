import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ChallengeContent from "./ChallengeContent";
import { getChallengePublicLatestISR } from "@/lib/server-api";
import { BreadcrumbSchema } from "@/components/StructuredData";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

const meta = {
 en: {
 title: "Free Kids STEM Challenge — Project of the Month",
 description:
 "Try a free paper “pixel letter” mini-challenge for kids. No login. Sign up with email for next month’s project and STEM tips from StemTechLab.",
 },
 ar: {
 title: "تحدي STEM مجاني للأطفال — مشروع الشهر",
 description:
 "جرّب تحديًا ورقيًا مجانيًا على شكل حرف بكسل للأطفال. بلا تسجيل. أرسل بريدك لاستلام مشروع الشهر القادم ونصائح STEM من ستم تك لاب.",
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

 const ch = await getChallengePublicLatestISR();
 const title = ch
 ? lang === "ar"
 ? ch.titleAr
 : ch.titleEn
 : meta[lang].title;
 const description = ch
 ? (lang === "ar" ? ch.subtitleAr : ch.subtitleEn) || meta[lang].description
 : meta[lang].description;

 return {
 title,
 description,
 alternates: {
 canonical: `${SITE_URL}/${lang}/challenge`,
 languages: { en: `${SITE_URL}/en/challenge`, ar: `${SITE_URL}/ar/challenge`, "x-default": `${SITE_URL}/en/challenge` },
 },
 openGraph: {
 title,
 description,
 url: `${SITE_URL}/${lang}/challenge`,
 type: "website",
 siteName: "StemTechLab",
 locale: lang === "ar" ? "ar_SA" : "en_US",
 alternateLocale: lang === "ar" ? "en_US" : "ar_SA",
 images: [{ url: `${SITE_URL}/og`, width: 1200, height: 630, alt: "StemTechLab" }],
 },
 twitter: {
 card: "summary_large_image",
 title,
 description,
 },
 };
}

export default async function ChallengePage({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 setRequestLocale(locale);
 const cmsChallenge = await getChallengePublicLatestISR();
 return (
 <>
 <BreadcrumbSchema
 items={[
 { name: "Home", url: `${SITE_URL}/${locale}` },
 { name: "Challenge", url: `${SITE_URL}/${locale}/challenge` },
 ]}
 />
 <ChallengeContent cmsChallenge={cmsChallenge} />
 </>
 );
}
