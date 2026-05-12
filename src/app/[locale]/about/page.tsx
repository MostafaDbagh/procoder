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
 "StemTechLab uses AI-assisted course matching to find the right course fit for each child. Live STEM, coding & Arabic for kids 6–18, parent dashboard, progress tracking, instructor notes, weekly reports, certified teachers, max 3 students, and child-privacy-aware practices.",
 },
 ar: {
 title: "عن ستم تك لاب | منصة STEM ذكية للأطفال",
 description:
 "تستخدم ستم تك لاب مطابقة دورات مدعومة بالذكاء الاصطناعي لاختيار المسار الأنسب لكل طفل. دروس مباشرة في STEM والبرمجة والعربية للأطفال ٦–١٨، لوحة ولي الأمر، تتبع التقدم، ملاحظات المعلم، تقارير أسبوعية، معلمون معتمدون، وحد أقصى ٣ طلاب.",
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
