import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import RecommendContent from "./RecommendContent";
import { getCoursesISR } from "@/lib/server-api";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";


const meta = {
 en: {
 title: "AI Course Finder — Right Fit for Kids | StemTechLab",
 description:
 "Not a quiz — real AI that analyses your child's learning behaviour (age, interests, experience, pace) and recommends the best-fit STEM, coding, or Arabic course + a 3-phase learning path. The first of its kind. Free, no sign-up. UAE, Netherlands & Germany.",
 },
 ar: {
 title: "منتقي الدورات بالذكاء الاصطناعي | ستم تك لاب",
 description:
 "ليس اختباراً عادياً — ذكاء اصطناعي حقيقي يحلّل سلوك تعلّم طفلك (العمر، الاهتمامات، الخبرة، الإيقاع) ويوصي بأنسب دورة STEM أو برمجة أو عربية مع مسار تعلم من ٣ مراحل. الأول من نوعه. مجاني، بدون تسجيل. الإمارات وهولندا وألمانيا.",
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
 alternates: buildAlternates(lang, "/recommend"),
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: siteUrl(lang, "/recommend"),
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

export default async function RecommendPage({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 setRequestLocale(locale);
 const initialCourses = await getCoursesISR();
 return (
 <>
 <BreadcrumbSchema
 items={[
 { name: bcLabel("Home", locale), url: `${SITE_URL}/${locale}` },
 { name: bcLabel("Course finder", locale), url: `${SITE_URL}/${locale}/recommend` },
 ]}
 />
 <RecommendContent initialCourses={initialCourses} />
 </>
 );
}
