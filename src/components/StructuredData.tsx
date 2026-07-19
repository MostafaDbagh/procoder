import { getTranslations } from "next-intl/server";
import { ALL_FAQ_KEYS } from "@/data/faqKeys";

const SITE_URL = (process.env.SITE_URL || "https://www.stemtechlab.com").replace(/\/$/, "");
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
 "The UAE's leading live online STEM platform for kids ages 6–18. Bilingual English/Arabic instruction, AI-powered course matching, and small-group classes (max 3 students). Programming, Robotics, Algorithms, and Arabic Language. Built for families in the UAE and GCC. Certified teachers, parent dashboard, free trial.",
 url: SITE_URL,
 logo: `${SITE_URL}/logo.svg`,
 image: `${SITE_URL}/og`,
 foundingDate: "2024",
 knowsAbout: [
 "Online STEM education for children",
 "Kids coding and programming",
 "Robotics for kids",
 "Arabic language teaching",
 "Competitive programming",
 "Personalized learning",
 ],
 areaServed: [
 "United Arab Emirates",
 "Saudi Arabia",
 "Qatar",
 "Kuwait",
 "Bahrain",
 "Oman",
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

 data.hasOfferCatalog = {
 "@type": "OfferCatalog",
 name: "StemTechLab Courses",
 itemListElement: [
 catalogSection("Programming", [
 courseOffer("Scratch Programming", "6-9", "Beginner", 20, 8),
 courseOffer("Python for Kids", "10-13", "Beginner", 24, 10),
 courseOffer("Web Development", "14-18", "Intermediate", 30, 12),
 courseOffer("Game Development", "12-16", "Intermediate", 26, 12),
 ]),
 catalogSection("Robotics", [
 courseOffer("Robot Builders", "8-12", "Beginner", 18, 8),
 courseOffer("Advanced Robotics & AI", "13-18", "Intermediate", 28, 14),
 ]),
 catalogSection("Algorithms", [
 courseOffer("Algorithm Adventures", "10-13", "Beginner", 22, 10),
 courseOffer("Competitive Programming (IOI/ICPC)", "14-18", "Advanced", 36, 16),
 ]),
 catalogSection("Arabic Language", [
 courseOffer("Arabic Reading & Writing", "6-9", "Beginner", 24, 12),
 courseOffer("Arabic Grammar & Composition", "10-14", "Intermediate", 28, 14),
 courseOffer("Arabic Reading & Expression", "6-12", "Beginner", 30, 16),
 courseOffer("Arabic Writing & Composition", "10-18", "Intermediate", 40, 20),
 ]),
 ],
 };

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
 ? "حصص مباشرة للأطفال في البرمجة والروبوتات والخوارزميات والعربية (٦–١٨). إنجليزي وعربي. الإمارات ودول الخليج."
 : "Live kids’ classes in programming, robotics, algorithms & Arabic (ages 6–18). English & Arabic. UAE & GCC.",
 inLanguage: ["en", "ar"],
 publisher: { "@id": ORG_ID },
 potentialAction: {
 "@type": "SearchAction",
 target: {
 "@type": "EntryPoint",
 urlTemplate: `${SITE_URL}/${lang}/courses?q={search_term_string}`,
 },
 "query-input": "required name=search_term_string",
 },
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
 ? "دورات مباشرة أونلاين للأطفال في البرمجة والروبوتات والخوارزميات واللغة العربية."
 : "Live online courses for kids in coding, robotics, algorithms, and Arabic.",
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
 "Bilingual (English/Arabic) tool that suggests live STEM, coding, and Arabic courses for children ages 6–18. Uses server-side OpenAI API and DeepSeek API integrations to generate advisory recommendations from parent or guardian inputs.",
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
 serviceType: "Live online STEM, coding, robotics, algorithms, and Arabic classes for children",
 provider: { "@id": ORG_ID },
 areaServed: [
 "United Arab Emirates",
 "Saudi Arabia",
 "Qatar",
 "Kuwait",
 "Bahrain",
 "Oman",
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

export function LocalBusinessSchema() {
 const locations = [
 { city: "Dubai", country: "AE", lat: 25.2048, lng: 55.2708 },
 { city: "Abu Dhabi", country: "AE", lat: 24.4539, lng: 54.3773 },
 { city: "Sharjah", country: "AE", lat: 25.3463, lng: 55.4209 },
 { city: "Ajman", country: "AE", lat: 25.4052, lng: 55.5136 },
 { city: "Ras Al Khaimah", country: "AE", lat: 25.7895, lng: 55.9432 },
 { city: "Fujairah", country: "AE", lat: 25.1288, lng: 56.3265 },
 { city: "Riyadh", country: "SA", lat: 24.7136, lng: 46.6753 },
 { city: "Doha", country: "QA", lat: 25.2854, lng: 51.5310 },
 { city: "Kuwait City", country: "KW", lat: 29.3759, lng: 47.9774 },
 ];

 return (
 <>
 {locations.map((loc) => {
 const locData: Record<string, unknown> = {
 "@context": "https://schema.org",
 "@type": "EducationalOrganization",
 name: `StemTechLab ${loc.city}`,
 description: `Live coding, robotics & Arabic for kids in ${loc.city}. Ages 6–18. Free trial.`,
 url: SITE_URL,
 address: {
 "@type": "PostalAddress",
 addressLocality: loc.city,
 addressCountry: loc.country,
 },
 geo: {
 "@type": "GeoCoordinates",
 latitude: loc.lat,
 longitude: loc.lng,
 },
 areaServed: { "@type": "City", name: loc.city },
 priceRange: "$$",
 openingHoursSpecification: {
 "@type": "OpeningHoursSpecification",
 dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
 opens: "09:00",
 closes: "19:00",
 },
 };
 if (PUBLIC_CONTACT_PHONE) locData.telephone = PUBLIC_CONTACT_PHONE;
 if (PUBLIC_CONTACT_EMAIL) locData.email = PUBLIC_CONTACT_EMAIL;
 return <JsonLd key={loc.city} data={locData} />;
 })}
 </>
 );
}

// --- Helpers ---

function JsonLd({ data }: { data: Record<string, unknown> }) {
 return (
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
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
 price: String(course.price),
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
 numberOfCredits: course.lessons,
 timeRequired: `P${course.durationWeeks}W`,
 audience: {
 "@type": "EducationalAudience",
 educationalRole: "student",
 suggestedMinAge: course.ageMin,
 suggestedMaxAge: course.ageMax,
 },
 availableLanguage: ["English", "Arabic"],
 inLanguage: locale,
 courseMode: "online",
 ...(course.imageUrl ? { image: course.imageUrl } : {}),
 ...(course.skills?.length ? { teaches: course.skills } : {}),
 ...(offer ? { offers: offer } : {}),
 hasCourseInstance: [
 {
 "@type": "CourseInstance",
 name: course.name,
 courseMode: "online",
 // Google requires a schedule/workload on the instance; live online, weekly.
 courseWorkload: "PT1H",
 courseSchedule: {
 "@type": "Schedule",
 duration: "PT1H",
 repeatFrequency: "Weekly",
 repeatCount: course.durationWeeks,
 },
 location: { "@type": "VirtualLocation", url: course.url },
 instructor: {
 "@type": "Person",
 name: "StemTechLab Instructor",
 affiliation: { "@id": ORG_ID },
 },
 ...(offer ? { offers: offer } : {}),
 },
 ],
 };
}

function catalogSection(name: string, items: Record<string, unknown>[]) {
 return {
 "@type": "OfferCatalog",
 name: `${name} Courses`,
 itemListElement: items,
 };
}

// Catalog entry for the Organization's site-wide hasOfferCatalog. Emitted as an
// Offer→Service (NOT a Course): these are hard-coded, priceless catalog stubs
// shown on every page, so a `Course` here would be an invalid rich-result entity
// (no hasCourseInstance / no priced offer). The accurate, valid Course schema
// lives on /courses and each course detail page (see buildCourseSchema).
function courseOffer(
 name: string,
 ageRange: string,
 level: string,
 lessons: number,
 weeks: number
) {
 return {
 "@type": "Offer",
 name,
 availability: "https://schema.org/InStock",
 category: `${level} · ages ${ageRange} · ${lessons} lessons over ${weeks} weeks`,
 itemOffered: {
 "@type": "Service",
 name,
 serviceType: "Live online course for children",
 provider: { "@id": ORG_ID },
 },
 };
}
