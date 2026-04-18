const SITE_URL = (process.env.SITE_URL || "https://stemtechlab.com").replace(/\/$/, "");
/** Public contact only — set in Vercel env; never put API keys in NEXT_PUBLIC_* . */
const PUBLIC_CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
const PUBLIC_CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim();

function organizationContactPoints() {
 if (!PUBLIC_CONTACT_EMAIL && !PUBLIC_CONTACT_PHONE) return undefined;
 const cp: Record<string, unknown> = {
 "@type": "ContactPoint",
 contactType: "customer service",
 availableLanguage: ["English", "Arabic"],
 areaServed: ["SA", "AE", "QA", "KW", "BH", "OM", "TR", "CA", "US", "GB", "DE", "FR"],
 };
 if (PUBLIC_CONTACT_EMAIL) cp.email = PUBLIC_CONTACT_EMAIL;
 if (PUBLIC_CONTACT_PHONE) cp.telephone = PUBLIC_CONTACT_PHONE;
 return [cp];
}

export function OrganizationSchema() {
 const data: Record<string, unknown> = {
 "@context": "https://schema.org",
 "@type": "EducationalOrganization",
 name: "StemTechLab",
 description:
 "Live online STEM & Arabic for ages 6–18. AI-powered course matching (OpenAI & DeepSeek) helps families pick the best live class for each child—plus small groups, certified teachers, English & Arabic. GCC & worldwide.",
 url: SITE_URL,
 logo: `${SITE_URL}/logo.svg`,
 image: `${SITE_URL}/og-image.png`,
 foundingDate: "2024",
 areaServed: [
 "Saudi Arabia", "United Arab Emirates", "Kuwait", "Qatar",
 "Bahrain", "Oman", "Turkey", "Syria", "Iraq", "Jordan",
 "Egypt", "Lebanon", "Canada", "United States", "United Kingdom",
 "Germany", "France", "Netherlands", "Sweden", "Australia",
 ].map((name) => ({ "@type": "Country", name })),
 address: {
 "@type": "PostalAddress",
 addressLocality: "Dubai",
 addressCountry: "AE",
 },
 sameAs: [],
 aggregateRating: {
 "@type": "AggregateRating",
 ratingValue: "4.9",
 reviewCount: "842",
 bestRating: "5",
 worstRating: "1",
 },
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
 ]),
 catalogSection("Arabic", [
 courseOffer("Arabic Reading & Expression", "6-12", "Beginner", 30, 16),
 courseOffer("Arabic Writing & Composition", "10-18", "Intermediate", 40, 20),
 ]),
 ],
 };

 return <JsonLd data={data} />;
}

export function FAQSchema() {
 const faqs = [
 { q: "What age group are StemTechLab courses designed for?", a: "Ages 6–18 with paths by level. Most students take about two 1-hour live sessions per week." },
 { q: "How does StemTechLab suggest the best course for my child?", a: "Our Course finder uses AI-powered matching with OpenAI and DeepSeek integrations to propose live courses that fit your child’s age, interests, and level. Parents choose what to enroll in." },
 { q: "How is my child's data and privacy protected?", a: "Encryption, COPPA-aware practices, and no selling of child data. Parents control student accounts." },
 { q: "Does my child need prior experience?", a: "No—beginners start with fundamentals; advanced tracks exist too. Our AI course finder and form help pick a level." },
 { q: "Do you offer free trial classes?", a: "Yes: one free live session, no obligation." },
 { q: "How are StemTechLab classes conducted?", a: "Live online in small groups or 1:1 with screen share, guided practice, and interactive tools." },
 { q: "What devices are needed for classes?", a: "Laptop or desktop plus stable internet. Coding runs in the browser; robotics kits ship where needed." },
 { q: "Which countries does StemTechLab serve?", a: "GCC, Turkey, North America, Europe, and more—in English or Arabic." },
 { q: "Can I reschedule or cancel classes?", a: "Reschedule up to 4 hours before class; plans can pause when your schedule changes." },
 ];

 const data = {
 "@context": "https://schema.org",
 "@type": "FAQPage",
 mainEntity: faqs.map((f) => ({
 "@type": "Question",
 name: f.q,
 acceptedAnswer: { "@type": "Answer", text: f.a },
 })),
 };

 return <JsonLd data={data} />;
}

export function WebsiteSchema() {
 const data = {
 "@context": "https://schema.org",
 "@type": "WebSite",
 name: "StemTechLab",
 url: SITE_URL,
 description:
 "Live kids’ classes in programming, robotics, algorithms, Arabic (ages 6–18). AI course finder uses OpenAI & DeepSeek to suggest the best fit per child. English & Arabic.",
 inLanguage: ["en", "ar"],
 potentialAction: {
 "@type": "SearchAction",
 target: `${SITE_URL}/en/courses?q={search_term_string}`,
 "query-input": "required name=search_term_string",
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
 { city: "Riyadh", country: "SA", lat: 24.7136, lng: 46.6753 },
 { city: "Dubai", country: "AE", lat: 25.2048, lng: 55.2708 },
 { city: "Abu Dhabi", country: "AE", lat: 24.4539, lng: 54.3773 },
 { city: "Doha", country: "QA", lat: 25.2854, lng: 51.531 },
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

function catalogSection(name: string, items: Record<string, unknown>[]) {
 return {
 "@type": "OfferCatalog",
 name: `${name} Courses`,
 itemListElement: items,
 };
}

function courseOffer(
 name: string,
 ageRange: string,
 level: string,
 lessons: number,
 weeks: number
) {
 return {
 "@type": "Course",
 name,
 description: `${name} for children ages ${ageRange}. ${level} level. ${lessons} lessons over ${weeks} weeks.`,
 provider: { "@type": "Organization", name: "StemTechLab", url: SITE_URL },
 educationalLevel: level,
 numberOfCredits: lessons,
 timeRequired: `P${weeks}W`,
 audience: {
 "@type": "EducationalAudience",
 educationalRole: "student",
 suggestedMinAge: parseInt(ageRange.split("-")[0]),
 suggestedMaxAge: parseInt(ageRange.split("-")[1]),
 },
 availableLanguage: ["English", "Arabic"],
 courseMode: "online",
 offers: {
 "@type": "Offer",
 availability: "https://schema.org/InStock",
 category: "Paid",
 },
 };
}
