import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { ParentQuestions } from "@/components/ParentQuestions";
import { LearningJourney } from "@/components/LearningJourney";
import { CategorySection } from "@/components/CategorySection";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyUs } from "@/components/WhyUs";
import { CTABanner } from "@/components/CTABanner";
import { getCategoriesPublicISR } from "@/lib/server-api";
import { buildAlternates, siteUrl } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

const meta = {
 en: {
 title: "AI Course Matching for Kids (6–18) | StemTechLab",
 description:
 "AI course matching analyses your child’s age, interests, pace, and goals to suggest the right STEM, coding, or Arabic course. Live classes, max 3 students, certified teachers, parent dashboard, and free trial.",
 },
 ar: {
 title: "ذكاء اصطناعي يختار الدورة الأنسب لطفلك | ستم تك لاب",
 description:
 "ذكاء اصطناعي يحلّل عمر طفلك واهتماماته وسرعته وأهدافه ليقترح الدورة الأنسب في STEM أو البرمجة أو العربية. دروس مباشرة، حد أقصى ٣ طلاب، معلمون معتمدون، لوحة ولي الأمر، وتجربة مجانية.",
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
 const cmsCategories = await getCategoriesPublicISR();

 return (
 <>
 <Hero />
 <LearningJourney />
 <ParentQuestions />
 <WhyUs />
 <CategorySection categories={cmsCategories} />
 <HowItWorks />
 <CTABanner />
 </>
 );
}
