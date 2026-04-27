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
import { OrganizationSchema, WebsiteSchema } from "@/components/StructuredData";
import { buildAlternates, siteUrl } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

const meta = {
 en: {
 title: "AI-powered kids' coding, robotics & STEM (6–18) | StemTechLab",
 description:
 "Live online coding, robotics, and Arabic classes for children ages 6–18, taught by certified instructors in groups of up to 8. Use the AI course finder to match your child to the right course by age, interests, and level. Free trial — no credit card. GCC and worldwide.",
 },
 ar: {
 title: "وكيل ذكاء اصطناعي لتحليل تعلّم طفلك | برمجة وSTEM ٦–١٨",
 description:
 "حصص مباشرة في البرمجة والروبوتات واللغة العربية للأعمار ٦–١٨، يدرّسها معلمون معتمدون في مجموعات لا تتجاوز ٨ طلاب. استخدم منتقي الدورات بالذكاء الاصطناعي لمعرفة الدورة الأنسب لطفلك حسب عمره واهتماماته ومستواه. تجربة مجانية بدون بطاقة ائتمان. الخليج والعالم.",
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
