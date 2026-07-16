import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import AboutContent from "./AboutContent";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { MeetOurStars } from "@/components/MeetOurStars";
import { getTeamPublicISR } from "@/lib/server-api";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";


const meta = {
 en: {
 title: "About StemTechLab | AI STEM Platform for Kids (6–18)",
 description:
 "AI course matching finds the right fit for each child. Live STEM & coding classes for ages 6–18, certified teachers, max 3 students, and a parent dashboard.",
 },
 ar: {
 title: "عن ستم تك لاب | منصة STEM ذكية للأطفال",
 description:
 "تستخدم ستم تك لاب الذكاء الاصطناعي لاختيار الدورة الأنسب لكل طفل. دروس مباشرة في STEM والبرمجة للأعمار ٦–١٨، معلمون معتمدون، حد أقصى ٣ طلاب، ولوحة متابعة لولي الأمر.",
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
