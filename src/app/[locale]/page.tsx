import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { LearnByFun } from "@/components/LearnByFun";
import { WhyProgramming } from "@/components/WhyProgramming";
import { CategorySection } from "@/components/CategorySection";
import { HowItWorks } from "@/components/HowItWorks";
import { CTABanner } from "@/components/CTABanner";
import { MeetOurStars } from "@/components/MeetOurStars";
import { FAQ } from "@/components/FAQ";
import { getTeamPublicISR, getCategoriesPublicISR } from "@/lib/server-api";

const SITE_URL = process.env.SITE_URL || "https://stemtechlab.com";

const meta = {
 en: {
 title: "Live coding, robotics & Arabic for kids (6–18)",
 description:
 "AI suggests the best course for your child (OpenAI & DeepSeek). Small-group live classes: programming, robotics, algorithms, Arabic. GCC & worldwide. Free trial.",
 },
 ar: {
 title: "برمجة وروبوتات للأطفال ٦–١٨",
 description:
 "ذكاء اصطناعي يقترح أفضل دورة لطفلك (OpenAI وDeepSeek). حصص صغيرة مباشرة: برمجة وروبوتات وعربية . الخليج والعالم. تجربة مجانية.",
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
 canonical: `${SITE_URL}/${lang}`,
 languages: { en: `${SITE_URL}/en`, ar: `${SITE_URL}/ar`, "x-default": `${SITE_URL}/en` },
 },
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: `${SITE_URL}/${lang}`,
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
 <WhyProgramming />
 <CategorySection categories={cmsCategories} />
 <HowItWorks />
 <MeetOurStars cmsTeam={cmsTeam} />
 <FAQ />
 <CTABanner />
 </>
 );
}
