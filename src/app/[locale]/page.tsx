import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { LearnByFun } from "@/components/LearnByFun";
import { CategorySection } from "@/components/CategorySection";
import { HowItWorks } from "@/components/HowItWorks";
import { CTABanner } from "@/components/CTABanner";
import { MeetOurStars } from "@/components/MeetOurStars";
import { FAQ } from "@/components/FAQ";
import { getTeamPublicISR, getCategoriesPublicISR } from "@/lib/server-api";
import { buildAlternates, siteUrl } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

const meta = {
 en: {
 title: "AI-powered kids' coding, robotics & STEM (6–18) | StemTechLab",
 description:
 "The only live online STEM platform for kids that combines Arabic-native instruction, GCC focus, and AI-powered course matching in one place. Coding, robotics & Arabic for ages 6–18 — certified teachers, max 8 students, free trial.",
 },
 ar: {
 title: "وكيل ذكاء اصطناعي لتحليل تعلّم طفلك | برمجة وSTEM ٦–١٨",
 description:
 "المنصة الوحيدة للتعليم المباشر أونلاين التي تجمع التعليم بالعربية الأصلية، والتركيز على الخليج، ومطابقة الدورات بالذكاء الاصطناعي في مكان واحد. برمجة وروبوتات وعربية للأعمار ٦–١٨ — معلمون معتمدون، حد أقصى ٨ طلاب، تجربة مجانية.",
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
 alternates: buildAlternates(lang, ""),
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: siteUrl(lang, ""),
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

export default async function HomePage({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 setRequestLocale(locale);
 const [cmsTeam, cmsCategories] = await Promise.all([
 getTeamPublicISR(),
 getCategoriesPublicISR(),
 ]);

 return (
 <>
 <Hero />
 <LearnByFun />
 {/* <WhyProgramming /> */}
 <CategorySection categories={cmsCategories} />
 <HowItWorks />
 <MeetOurStars cmsTeam={cmsTeam} />
 <FAQ />
 <CTABanner />
 </>
 );
}
