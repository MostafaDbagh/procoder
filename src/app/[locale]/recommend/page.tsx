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
 "AI-assisted course finder that analyses your child's age, interests, experience, pace, and goals to suggest the best-fit STEM, coding, or Arabic course plus a 3-phase learning path. Free, no sign-up.",
 },
 ar: {
 title: "منتقي الدورات بالذكاء الاصطناعي | ستم تك لاب",
 description:
 "منتقي دورات مدعوم بالذكاء الاصطناعي يحلّل عمر طفلك واهتماماته وخبرته وسرعته وأهدافه ليقترح أنسب دورة STEM أو برمجة أو عربية مع مسار تعلم من ٣ مراحل. مجاني، بدون تسجيل.",
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

export default async function RecommendPage({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 setRequestLocale(locale);
 const initialCourses = await getCoursesISR();

 // Explicit AI feature description for Google + LLM crawlers. The narrative
 // matches /llms.txt and the on-page HowOurAIWorks explainer so claims are
 // consistent across HTML, JSON-LD, and machine-readable AI files.
 const aiFinderJsonLd = {
 "@context": "https://schema.org",
 "@type": "SoftwareApplication",
 "@id": `${SITE_URL}/${locale}/recommend#ai-course-finder`,
 name: locale === "ar" ? "منتقي الدورات بالذكاء الاصطناعي" : "AI Course Finder",
 alternateName: locale === "ar" ? "مرشد الدورات الذكي" : "Smart Course Finder",
 url: `${SITE_URL}/${locale}/recommend`,
 applicationCategory: "EducationalApplication",
 applicationSubCategory: "Course Recommendation",
 operatingSystem: "Any (browser-based)",
 inLanguage: ["en", "ar"],
 isAccessibleForFree: true,
 offers: {
 "@type": "Offer",
 price: "0",
 priceCurrency: "USD",
 availability: "https://schema.org/InStock",
 description: locale === "ar"
 ? "مجاني الاستخدام؛ التسجيل في الدورات منفصل."
 : "Free to use; course enrollment is separate.",
 },
 provider: {
 "@type": "Organization",
 name: "StemTechLab",
 url: SITE_URL,
 },
 audience: {
 "@type": "EducationalAudience",
 educationalRole: "parent",
 suggestedMinAge: 6,
 suggestedMaxAge: 18,
 },
 featureList: [
 "Natural-language input in English or Arabic — no login required",
 "Server-side OpenAI + DeepSeek API integrations extract age, interests, skill level, and parent goals",
 "Deterministic scoring engine ranks live courses (Programming, Robotics, Algorithms, Arabic) by age fit, level, and interest match",
 "Returns top 2–3 best-fit courses with plain-English explanation",
 "Generates a personalized 3-phase learning path",
 "Asks follow-up questions when the child profile is incomplete",
 "Advisory output — final enrollment decision always belongs to the parent",
 "Does NOT track child progress (handled separately in the parent dashboard)",
 "No personal data sold; child data not used for AI training",
 ],
 about: {
 "@type": "Thing",
 name: "Personalized course recommendation for children ages 6–18",
 description:
 "Matches each child to live online STEM, coding, robotics, algorithms, or Arabic classes based on age, current skill level, learning interests, and parent goals.",
 },
 keywords: [
 "AI course finder for kids",
 "personalized STEM matching",
 "kids coding course recommendation",
 "Arabic kids classes finder",
 "GCC STEM course matcher",
 ].join(", "),
 };

 return (
 <>
 <BreadcrumbSchema
 items={[
 { name: bcLabel("Home", locale), url: `${SITE_URL}/${locale}` },
 { name: bcLabel("Course finder", locale), url: `${SITE_URL}/${locale}/recommend` },
 ]}
 />
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(aiFinderJsonLd) }}
 />
 <RecommendContent initialCourses={initialCourses} />
 </>
 );
}
