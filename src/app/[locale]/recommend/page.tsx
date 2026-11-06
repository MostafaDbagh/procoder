import { SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import RecommendContent from "./RecommendContent";
import { getCoursesISR } from "@/lib/server-api";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { siteUrl, bcLabel, metaForMaybeVariant } from "@/lib/seo";



const meta = {
 en: {
 title: "Find Your Child’s STEM Starting Level | StemTechLab",
 description:
 "Explore a STEM starting level for your child, ages 5–18. Share what they enjoy and can do in a simple guided conversation. Free, in English and Arabic.",
 },
 ar: {
 title: "اكتشف مستوى البداية المناسب لطفلك | ستم تك لاب",
 description:
 "اكتشف مستوى بداية لطفلك من عمر ٥ إلى ١٨ سنة عبر محادثة بسيطة عن اهتماماته وخبرته وما يستطيع فعله. خمسة مستويات، بالعربية والإنجليزية، مجاناً دون حساب.",
 },
};

export async function generateMetadata({
 params,
 searchParams,
}: {
 params: Promise<{ locale: string }>;
 searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
 const { locale } = await params;
 const sp = await searchParams;
 // `?q=` (shared/pre-filled finder queries) are variants of the clean /recommend
 // URL — consolidate & drop hreflang so crawled query URLs don't conflict.
 const isVariant = Object.keys(sp || {}).length > 0;
 const lang = locale === "ar" ? "ar" : "en";

 return {
 title: { absolute: meta[lang].title },
 description: meta[lang].description,
 ...metaForMaybeVariant(lang, "/recommend", isVariant),
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
 name: locale === "ar" ? "مرشد مستوى البداية لطفلك" : "STEM Starting Level Finder",
 alternateName: locale === "ar" ? "مرشد الدورات الذكي" : "Smart Course Finder",
 url: `${SITE_URL}/${locale}/recommend`,
 applicationCategory: "EducationalApplication",
 applicationSubCategory: "Learning Level Guidance",
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
 },
 featureList: [
 "English and Arabic guided conversation — no login required",
 "Reuses details already shared and asks one missing question at a time",
 "Provisional suggestions across Explorer, Builder, Creator, Innovator and Pro",
 "Missing or conflicting answers prompt clarification or teacher review",
 "Compatible published courses filtered by stage, age and experience",
 "Application-controlled educational guidance; AI cannot override placement rules",
 "Teacher observation is needed to confirm the starting point",
 ],
 about: {
 "@type": "Thing",
 name: "Provisional learning-level guidance for children ages 5–18",
 description:
 "Offers a provisional starting level based on parent-reported age, experience, observed readiness and support. A teacher confirms the fit through a practical trial.",
 },
 };

 return (
 <>
 <BreadcrumbSchema
 items={[
 { name: bcLabel("Home", locale), url: `${SITE_URL}/${locale}` },
 { name: locale === "ar" ? "مستوى البداية" : "Starting level finder", url: `${SITE_URL}/${locale}/recommend` },
 ]}
 />
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(aiFinderJsonLd).replace(/</g, "\\u003c") }}
 />
 <RecommendContent initialCourses={initialCourses} />
 </>
 );
}
