import { SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { ParentQuestions } from "@/components/ParentQuestions";
import { LearningJourney } from "@/components/LearningJourney";
import { CategorySection } from "@/components/CategorySection";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyUs } from "@/components/WhyUs";
import { CTABanner } from "@/components/CTABanner";
import { ExplorerFloatBubble } from "@/components/ExplorerFloatBubble";
import { getCategoriesPublicISR, getCoursesISR } from "@/lib/server-api";
import { buildAlternates, siteUrl } from "@/lib/seo";


const meta = {
 en: {
 title: "Online Coding Classes for Kids in the UAE | StemTechLab",
 description:
 "Live online coding, robotics and AI classes for kids ages 6–18 in the UAE. Small groups, English and Arabic support, and a free trial from home.",
 },
 ar: {
 title: "دورات برمجة للأطفال في الإمارات أونلاين",
 description:
 "دورات برمجة وروبوتات وذكاء اصطناعي للأطفال ٦–١٨ في الإمارات. حصص مباشرة أونلاين، مجموعات صغيرة، ودعم بالعربية والإنجليزية. ابدأ بتجربة مجانية.",
 },
};

export async function generateMetadata({
 params,
}: {
 params: Promise<{ locale: string }>;
}): Promise<Metadata> {
 const { locale } = await params;
 const lang = locale === "ar" ? "ar" : "en";

 const fullTitle = lang === "ar" ? `${meta.ar.title} | ستم تك لاب` : meta.en.title;
 const title = { absolute: fullTitle };
 const ogTitle = fullTitle;

 return {
 title,
 description: meta[lang].description,
 alternates: buildAlternates(lang, ""),
 openGraph: {
 title: ogTitle,
 description: meta[lang].description,
 url: siteUrl(lang, ""),
 type: "website",
 siteName: "StemTechLab",
 locale: lang === "ar" ? "ar_AE" : "en_US",
 alternateLocale: lang === "ar" ? "en_US" : "ar_AE",
 images: [{ url: `${SITE_URL}/og?locale=${lang}`, width: 1200, height: 630, alt: "StemTechLab" }],
 },
 twitter: {
 card: "summary_large_image",
 title: ogTitle,
 description: meta[lang].description,
 },
 };
}

export default async function HomePage({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 setRequestLocale(locale);
 const [cmsCategories, allCourses] = await Promise.all([
 getCategoriesPublicISR(),
 getCoursesISR(),
 ]);
 // Only promote categories that actually have a course behind them.
 const availableSlugs = [
 ...new Set((allCourses ?? []).map((c) => c.category).filter(Boolean)),
 ];

 return (
 <>
 <Hero />
 <LearningJourney />
 <ParentQuestions />
 <WhyUs />
 <CategorySection categories={cmsCategories} availableSlugs={availableSlugs} />
 <HowItWorks />
 <CTABanner />
 <ExplorerFloatBubble />
 </>
 );
}
