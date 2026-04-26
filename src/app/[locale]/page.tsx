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
import { OrganizationSchema, WebsiteSchema } from "@/components/StructuredData";
import { buildAlternates, siteUrl } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

const meta = {
 en: {
 title: "Live coding, robotics & Arabic for kids (6–18)",
 description:
 "Live STEM & coding classes for kids: Scratch, Python, robotics, algorithms and Arabic. AI-matched courses, small groups, ages 6–18. GCC & worldwide. Free trial.",
 },
 ar: {
 title: "برمجة وروبوتات للأطفال ٦–١٨",
 description:
 "STEM وتعليم برمجة للأطفال: حصص مباشرة ودروس تعليمية واختيار دورات بالذكاء الاصطناعي. سكراتش وبايثون وروبوتات وخوارزميات وعربية. مجموعات صغيرة للأعمار ٦–١٨. الخليج والعالم. تجربة مجانية.",
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
 alternates: buildAlternates(lang, ""),
 openGraph: {
 title: meta[lang].title,
 description: meta[lang].description,
 url: siteUrl(lang, ""),
 type: "website",
 siteName: "StemTechLab",
 locale: lang === "ar" ? "ar_SA" : "en_US",
 alternateLocale: lang === "ar" ? "en_US" : "ar_SA",
 images: [{ url: `${SITE_URL}/og`, width: 1200, height: 630, alt: "StemTechLab" }],
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
 <OrganizationSchema />
 <WebsiteSchema />
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
