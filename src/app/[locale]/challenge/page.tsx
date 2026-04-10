import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ChallengeContent from "./ChallengeContent";
import { getChallengePublicLatestISR } from "@/lib/server-api";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

const meta = {
  en: {
    title: "Free Kids STEM Challenge — Project of the Month | ProCoder",
    description:
      "Try a free paper “pixel letter” mini-challenge for kids. No login. Sign up with email for next month’s project and STEM tips from ProCoder.",
  },
  ar: {
    title: "تحدي STEM مجاني للأطفال — مشروع الشهر | بروكودر",
    description:
      "جرّب تحديًا ورقيًا مجانيًا على شكل حرف بكسل للأطفال. بلا تسجيل. أرسل بريدك لاستلام مشروع الشهر القادم ونصائح STEM من بروكودر.",
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
      languages: { [alt]: `${SITE_URL}/${alt}/challenge` },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}/challenge`,
    },
    twitter: {
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
  return <ChallengeContent cmsChallenge={cmsChallenge} />;
}
