import { SITE_URL } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import { priceAfterCourseDiscount } from "@/lib/formatCoursePrice";
import { ALL_FAQ_KEYS } from "@/data/faqKeys";

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
/** Public contact only — set in Vercel env; never put API keys in NEXT_PUBLIC_* . */
const PUBLIC_CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
const PUBLIC_CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim();

function organizationContactPoints() {
 if (!PUBLIC_CONTACT_EMAIL && !PUBLIC_CONTACT_PHONE) return undefined;
 const cp: Record<string, unknown> = {
 "@type": "ContactPoint",
 contactType: "customer service",
 availableLanguage: ["English", "Arabic"],
 areaServed: ["AE", "SA", "QA", "KW", "OM", "BH"],
 };
 if (PUBLIC_CONTACT_EMAIL) cp.email = PUBLIC_CONTACT_EMAIL;
 if (PUBLIC_CONTACT_PHONE) cp.telephone = PUBLIC_CONTACT_PHONE;
 return [cp];
}

export function OrganizationSchema() {
 const data: Record<string, unknown> = {
 "@context": "https://schema.org",
 "@type": "EducationalOrganization",
 "@id": ORG_ID,
 name: "StemTechLab",
 legalName: "StemTechLab",
 alternateName: ["STEM Tech Lab", "Stem Tech Lab"],
 description:
 "Live online STEM and coding classes for children ages 6–18 in the UAE and other GCC countries. Bilingual English/Arabic interface, AI-powered course matching, and small-group classes. Programming, Robotics, Algorithms, AI, Web and Mobile Development. Built for families in the UAE and GCC. Certified teachers, parent dashboard, free trial.",
 url: SITE_URL,
 logo: `${SITE_URL}/logo.svg`,
 image: `${SITE_URL}/og`,
 foundingDate: "2024",
 knowsAbout: [
 "Online STEM education for children",
 "Kids coding and programming",
 "Robotics for kids",
 "Competitive programming",
 "Personalized learning",
 ],
 areaServed: [
 "United Arab Emirates",
 "Saudi Arabia",
 "Qatar",
 "Kuwait",
 "Bahrain",
 ].map((name) => ({ "@type": "Country", name })),
 address: {
 "@type": "PostalAddress",
 addressLocality: "Dubai",
 addressCountry: "AE",
 },
 sameAs: [
 "https://www.facebook.com/share/1D3FrzK2N9/",
 "https://www.instagram.com/stemtechlab",
 "https://www.linkedin.com/company/stem-tech-lab/",
 ],
 };
 const cps = organizationContactPoints();
 if (cps) data.contactPoint = cps;


 return <JsonLd data={data} />;
}

/**
 * FAQPage JSON-LD built from the same `faq` translation namespace the visible
 * FAQ accordion renders — Google requires the schema to match on-page content,
 * so this must only be emitted on pages that render <FAQ />.
 */
export async function FAQSchema({ locale = "en" }: { locale?: string }) {
 const t = await getTranslations({ locale, namespace: "faq" });

 const data = {
 "@context": "https://schema.org",
 "@type": "FAQPage",
 mainEntity: ALL_FAQ_KEYS.map((id) => ({
 "@type": "Question",
 name: t(`${id}_q`),
 acceptedAnswer: { "@type": "Answer", text: t(`${id}_a`) },
 })),
 };

 return <JsonLd data={data} />;
}

export function WebsiteSchema({ locale = "en" }: { locale?: string } = {}) {
 const lang = locale === "ar" ? "ar" : "en";
 const data = {
 "@context": "https://schema.org",
 "@type": "WebSite",
 "@id": WEBSITE_ID,
 name: "StemTechLab",
 url: SITE_URL,
 description:
 lang === "ar"
 ? "حصص مباشرة للأطفال في البرمجة والروبوتات والخوارزميات والذكاء الاصطناعي (٦–١٨). واجهة عربية وإنجليزية. الإمارات ودول الخليج."
 : "Live kids’ classes in programming, robotics, algorithms & AI (ages 6–18). Bilingual English/Arabic interface. UAE & GCC.",
 inLanguage: ["en", "ar"],
 publisher: { "@id": ORG_ID },

 };

 return <JsonLd data={data} />;
}

export interface CourseListSchemaItem {
 name: string;
 description: string;
 url: string;
 ageMin: number;
 ageMax: number;
 level: string;
 lessons: number;
 durationWeeks: number;
 price?: number;
 discountPercent?: number;
 currency?: string;
 imageUrl?: string;
 skills?: string[];
}

export function CourseCatalogSchema({
 courses,
 locale = "en",
}: {
 courses: CourseListSchemaItem[];
 locale?: string;
}) {
 const data = {
 "@context": "https://schema.org",
 "@type": "ItemList",
 name: locale === "ar" ? "دورات StemTechLab" : "StemTechLab course catalog",
 description:
 locale === "ar"
 ? "دورات مباشرة أونلاين للأطفال في البرمجة والروبوتات والخوارزميات والذكاء الاصطناعي وتطوير التطبيقات."
 : "Live online courses for kids in coding, robotics, algorithms, AI, and app development.",
 inLanguage: locale,
 itemListOrder: "https://schema.org/ItemListOrderAscending",
 numberOfItems: courses.length,
 itemListElement: courses.map((course, index) => ({
 "@type": "ListItem",
 position: index + 1,
 url: course.url,
 item: buildCourseSchema(course, locale),
 })),
 };

 return <JsonLd data={data} />;
}

/** Machine-readable: Course finder is a WebApplication that uses third-party AI APIs. */
export function CourseFinderApplicationSchema({ locale = "en" }: { locale?: string } = {}) {
 const lang = locale === "ar" ? "ar" : "en";
 const data: Record<string, unknown> = {
 "@context": "https://schema.org",
 "@type": "WebApplication",
 name: "StemTechLab Course Finder",
 url: `${SITE_URL}/${lang}/recommend`,
 applicationCategory: "EducationalApplication",
 operatingSystem: "Any (web browser)",
 inLanguage: ["en", "ar"],
 offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free to use; course enrollment is separate." },
 description:
 "Bilingual (English/Arabic) tool that suggests live STEM and coding courses for children ages 6–18. Uses server-side OpenAI API and DeepSeek API integrations to generate advisory recommendations from parent or guardian inputs.",
 featureList: [
 "OpenAI API integration (server-side) for natural-language course suggestions",
 "DeepSeek API integration (server-side) for course suggestions",
 "Structured form and optional chat input",
 "Bilingual English and Arabic UI",
 ],
 provider: { "@type": "Organization", name: "StemTechLab", url: SITE_URL },
 isAccessibleForFree: true,
 };
 return <JsonLd data={data} />;
}

export function EducationalServiceSchema({ locale = "en" }: { locale?: string } = {}) {
 const lang = locale === "ar" ? "ar" : "en";
 const data = {
 "@context": "https://schema.org",
 "@type": "Service",
 "@id": `${SITE_URL}/#live-online-classes`,
 name: "StemTechLab live online classes",
 serviceType: "Live online STEM, coding, robotics, algorithms and AI classes for children",
 provider: { "@id": ORG_ID },
 areaServed: [
 "United Arab Emirates",
 "Saudi Arabia",
 "Qatar",
 "Kuwait",
 "Bahrain",
 ].map((name) => ({ "@type": "Country", name })),
 audience: {
 "@type": "EducationalAudience",
 educationalRole: "student",
 suggestedMinAge: 6,
 suggestedMaxAge: 18,
 },
 availableChannel: {
 "@type": "ServiceChannel",
 serviceUrl: `${SITE_URL}/${lang}/free-trial`,
 availableLanguage: ["English", "Arabic"],
 },
 offers: {
 "@type": "Offer",
 url: `${SITE_URL}/${lang}/free-trial`,
 availability: "https://schema.org/InStock",
 category: "Live online education",
 },
 };

 return <JsonLd data={data} />;
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
 const data = {
 "@context": "https://schema.org",
 "@type": "BreadcrumbList",
 itemListElement: items.map((item, i) => ({
 "@type": "ListItem",
 position: i + 1,
 name: item.name,
 item: item.url,
 })),
 };

 return <JsonLd data={data} />;
}

// --- Helpers ---

export function JsonLd({ data }: { data: Record<string, unknown> }) {
 return (
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
 />
 );
}

export function buildCourseSchema(course: CourseListSchemaItem, locale = "en") {
 const hasPrice = typeof course.price === "number" && course.price > 0;
 // Only advertise an Offer when there is a real price — never claim a course is
 // free (e.g. Explorer defers payment). Offers need price + priceCurrency to be valid.
 const offer = hasPrice
 ? {
 "@type": "Offer",
 url: course.url,
 availability: "https://schema.org/InStock",
 price: String(priceAfterCourseDiscount(course.price!, course.discountPercent ?? 0)),
 priceCurrency: (course.currency || "USD").toUpperCase(),
 category: "Paid",
 }
 : null;

 return {
 "@type": "Course",
 "@id": `${course.url}#course`,
 name: course.name,
 description: course.description,
 url: course.url,
 // Inline the provider (name + url) so each Course validates on its own —
 // an `@id`-only reference can't be resolved across blocks by validators.
 provider: {
 "@type": "Organization",
 "@id": ORG_ID,
 name: "StemTechLab",
 url: SITE_URL,
 },
 educationalLevel: course.level,
  timeRequired: `P${course.durationWeeks}W`,
 audience: {
 "@type": "EducationalAudience",
 educationalRole: "student",
 suggestedMinAge: course.ageMin,
 suggestedMaxAge: course.ageMax,
 },
 availableLanguage: ["English", "Arabic"],
 inLanguage: locale,
 ...(course.imageUrl ? { image: new URL(course.imageUrl, SITE_URL).href } : {}),
 ...(course.skills?.length ? { teaches: course.skills } : {}),
 ...(offer ? { offers: offer } : {}),
 hasCourseInstance: [
 {
 "@type": "CourseInstance",
 name: course.name,
 courseMode: "online",
 location: { "@type": "VirtualLocation", url: course.url },
 ...(offer ? { offers: offer } : {}),
 },
 ],
 };
}

