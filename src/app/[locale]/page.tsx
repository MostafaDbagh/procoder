import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { LearnByFun } from "@/components/LearnByFun";
import { CategorySection } from "@/components/CategorySection";
import { HowItWorks } from "@/components/HowItWorks";
import { CTABanner } from "@/components/CTABanner";
import { MeetOurStars } from "@/components/MeetOurStars";
import { getTeamPublicISR, getCategoriesPublicISR } from "@/lib/server-api";
import { buildAlternates, siteUrl } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

const meta = {
 en: {
 title: "AI Course Matching for Kids (6–18) | StemTechLab",
 description:
 "The first AI that analyses how your child learns and matches them to the right STEM, coding, or Arabic course — not guesswork. Live classes, max 8 students, certified teachers. Parent dashboard included. UAE, Netherlands & Germany. Free trial.",
 },
 ar: {
 title: "ذكاء اصطناعي يختار الدورة الأنسب لطفلك | ستم تك لاب",
 description:
 "أول ذكاء اصطناعي يحلّل سلوك تعلّم طفلك ويطابقه مع الدورة الأنسب في STEM أو البرمجة أو العربية. دروس مباشرة، فصول بحد أقصى ٨ طلاب، معلمون معتمدون. لوحة تحكم لأولياء الأمور. الإمارات وهولندا وألمانيا. تجربة مجانية.",
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
 <CTABanner />
 </>
 );
}
