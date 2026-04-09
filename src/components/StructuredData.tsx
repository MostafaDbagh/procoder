export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "ProCoder",
    description:
      "Fun, interactive courses in Programming, Robotics, Algorithms, Arabic & Quran for children ages 6–18. Online live classes with qualified instructors.",
    url: "https://procoder.com",
    logo: "https://procoder.com/logo.png",
    foundingDate: "2024",
    areaServed: [
      { "@type": "Country", name: "Saudi Arabia" },
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "Kuwait" },
      { "@type": "Country", name: "Qatar" },
      { "@type": "Country", name: "Bahrain" },
      { "@type": "Country", name: "Oman" },
      { "@type": "Country", name: "Turkey" },
      { "@type": "Country", name: "Syria" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "France" },
      { "@type": "Country", name: "Netherlands" },
      { "@type": "Country", name: "Sweden" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@procoder.com",
      contactType: "customer service",
      availableLanguage: ["English", "Arabic"],
    },
    sameAs: [],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "ProCoder Courses",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Programming Courses",
          itemListElement: [
            courseOffer("Scratch Programming", "6-9", "Beginner"),
            courseOffer("Python for Kids", "10-13", "Beginner"),
            courseOffer("Web Development", "14-18", "Intermediate"),
            courseOffer("Game Development", "12-16", "Intermediate"),
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Robotics Courses",
          itemListElement: [
            courseOffer("Robot Builders", "8-12", "Beginner"),
            courseOffer("Advanced Robotics", "13-18", "Intermediate"),
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Algorithm Courses",
          itemListElement: [
            courseOffer("Algorithm Adventures", "10-13", "Beginner"),
            courseOffer("Competitive Programming", "14-18", "Advanced"),
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Arabic Language",
          itemListElement: [
            courseOffer("Arabic Reading & Writing", "6-9", "Beginner"),
            courseOffer("Arabic Grammar", "10-14", "Intermediate"),
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Quran Studies",
          itemListElement: [
            courseOffer("Quran Recitation with Tajweed", "6-12", "Beginner"),
            courseOffer("Quran Memorization (Hifz)", "10-18", "Intermediate"),
          ],
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FAQSchema() {
  const faqs = [
    {
      q: "What age group are ProCoder courses designed for?",
      a: "All our programs and courses are designed for children aged 6–18 years, with structured learning paths tailored to their age and skill level.",
    },
    {
      q: "How is my child's data and privacy protected?",
      a: "We take data privacy extremely seriously. All data is encrypted, we comply with COPPA guidelines, and we never share personal information with third parties.",
    },
    {
      q: "Does my child need prior experience?",
      a: "Not at all! Our courses are designed for all skill levels. Beginners start with fundamentals, and we have advanced tracks for experienced students.",
    },
    {
      q: "Do you offer free trial classes?",
      a: "Yes! We offer a completely free trial class with no obligation. Your child can experience a full session to see if the program is a good fit.",
    },
    {
      q: "How are ProCoder classes conducted?",
      a: "Classes are conducted live online in small groups (4–8 students) or 1-on-1 with qualified instructors using interactive tools and hands-on coding environments.",
    },
    {
      q: "What devices are needed for classes?",
      a: "A laptop or desktop with a stable internet connection. For programming courses, we use browser-based tools — no installation required.",
    },
  ];

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ProCoder",
    url: "https://procoder.com",
    description:
      "Online learning platform for children ages 6–18. Courses in Programming, Robotics, Algorithms, Arabic Language, and Quran Studies.",
    inLanguage: ["en", "ar"],
    potentialAction: {
      "@type": "SearchAction",
      target: "https://procoder.com/en/courses?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function courseOffer(name: string, ageRange: string, level: string) {
  return {
    "@type": "Course",
    name,
    description: `${name} for children ages ${ageRange}. ${level} level.`,
    provider: { "@type": "Organization", name: "ProCoder" },
    educationalLevel: level,
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      suggestedMinAge: parseInt(ageRange.split("-")[0]),
      suggestedMaxAge: parseInt(ageRange.split("-")[1]),
    },
    availableLanguage: ["English", "Arabic"],
    courseMode: "online",
  };
}
