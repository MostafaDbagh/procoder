import { coursePublicTitle } from "@/lib/course-positioning";
import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { BreadcrumbSchema, JsonLd } from "@/components/StructuredData";
import { getCoursesISR } from "@/lib/server-api";
import { buildAlternates, siteUrl, SITE_URL } from "@/lib/seo";

const copy = {
 en: {
  title: "Online Coding & STEM Classes for Kids in the UAE",
  description: "Explore live online coding, robotics and AI classes for children in the UAE. Compare course ages and levels, plan lessons from home and request a free trial.",
  intro: "Learn from home in Dubai, Abu Dhabi, Sharjah or elsewhere in the UAE. StemTechLab offers live online classes in coding, robotics and AI, with courses chosen around your child's age and experience.",
  delivery: "Online classes, wherever you live in the UAE",
  deliveryText: "Your child joins a live instructor online from home. Before booking, tell us your child's age, previous coding experience and preferred teaching language. The team can help you choose a suitable course and confirm availability.",
  planning: "Before your first class",
  steps: ["Schedule: ask for the lesson time in UAE local time (UTC+4) and check it against school and family commitments.", "Equipment: prepare a laptop or desktop, a stable internet connection and audio. Ask which software is needed for your chosen course. Robotics requirements vary; confirm whether the course uses simulations or hardware before buying a kit.", "Language and group: classes have a maximum of 3 students. Confirm the teaching language for the course you choose. The website is available in English and Arabic.", "Price: check the current course price and billing currency. Ask the team to confirm the total before paying; a free trial is separate from full-course enrollment."],
  courses: "Find a course for your child's stage",
  courseIntro: "Use the age range and level as a starting point. Experience and confidence matter too: a child new to coding may need a different starting point from a child who already builds projects.",
  skills: "Learning goals",
  compare: "How to compare online STEM classes",
  compareText: "Look beyond the course name. Ask to see an example project, find out what your child will do during a lesson, and check how the teacher gives feedback. During a trial, notice whether your child gets time to explain an idea, try a solution and ask for help. Choose a level that offers a manageable challenge, rather than choosing by age alone.",
  ages: "Ages", weeks: "weeks", lessons: "lessons", empty: "Explore the course catalog or contact us to confirm current availability.",
  trial: "Request a free online trial", catalog: "See all courses", contact: "Ask about classes in the UAE", guide: "Read the parent guide",
  faqTitle: "Questions from parents in the UAE",
  faq: [
   ["Are classes taught in Arabic or English?", "The website is available in both languages. Confirm the teaching language for the specific course and available group before booking; the website language alone does not tell you the language of a lesson."],
   ["What should I check about course fees?", "Check the amount and currency on the selected course page, then confirm what is included: number of lessons, required software or equipment, and any additional costs. A free trial is separate from the paid course."],
   ["Can my child attend from outside Dubai?", "Yes. Classes are online, so families elsewhere in the UAE can attend from home with the required device and internet connection."],
   ["Does my child need coding experience?", "That depends on the course. Start with a beginner course if your child is new to programming, and check the age range and prerequisites before enrolling."],
   ["Are robotics classes in person?", "StemTechLab's UAE offering is online. Read the selected course's description and confirm whether it uses a simulator or requires physical equipment."],
   ["How do we choose the first course?", "Compare the live courses on this page, use the learning path as a guide, or request a free trial. Share your child's age and interests with the team so you can discuss the right starting point."],
  ],
 },
 ar: {
  title: "دورات برمجة وSTEM للأطفال في الإمارات أونلاين",
  description: "استكشف حصص البرمجة والروبوتات والذكاء الاصطناعي المباشرة للأطفال في الإمارات. اختر الدورة المناسبة لعمر طفلك ومستواه، وتعلّم من المنزل مع حصة تجريبية مجانية.",
  intro: "تعلّم من المنزل في دبي أو أبوظبي أو الشارقة أو أي مكان في الإمارات. تقدم ستم تك لاب حصصاً مباشرة أونلاين في البرمجة والروبوتات والذكاء الاصطناعي، مع اختيار الدورة حسب عمر طفلك وخبرته.",
  delivery: "حصص أونلاين أينما كنت في الإمارات",
  deliveryText: "ينضم طفلك إلى معلم مباشرة عبر الإنترنت من المنزل. قبل الحجز، أخبرنا بعمر طفلك وخبرته السابقة ولغة التدريس المفضلة. يساعدك الفريق على اختيار دورة مناسبة والتأكد من توفرها.",
  planning: "قبل الحصة الأولى",
  steps: ["المواعيد: اطلب تأكيد وقت الحصة بتوقيت الإمارات المحلي (UTC+4)، وراجعه مع مواعيد المدرسة والتزامات الأسرة.", "الأجهزة: جهّز حاسوباً محمولاً أو مكتبياً واتصالاً مستقراً بالإنترنت وصوتاً واضحاً. اسأل عن البرامج المطلوبة، وما إذا كانت دورة الروبوتات تستخدم المحاكاة أم تحتاج إلى معدات قبل شراء أي أدوات أو معدات.", "اللغة والمجموعة: تضم الحصص ٣ طلاب كحد أقصى. تأكد من لغة التدريس في الدورة التي تختارها. الموقع متاح بالعربية والإنجليزية.", "السعر: راجع سعر الدورة الحالي وعملة الدفع، واطلب تأكيد التكلفة الإجمالية قبل الدفع. الحصة المجانية منفصلة عن التسجيل في الدورة الكاملة."],
  courses: "اختر دورة تناسب مرحلة طفلك",
  courseIntro: "ابدأ بالعمر والمستوى، ثم راعِ الخبرة والثقة. قد يحتاج الطفل الذي يبدأ البرمجة إلى نقطة انطلاق مختلفة عن طفل لديه مشاريع سابقة.",
  skills: "أهداف التعلم",
  compare: "كيف تقارن بين حصص STEM أونلاين؟",
  compareText: "لا تكتفِ باسم الدورة. اطلب مثالاً على مشروع، وتعرّف على ما سيفعله طفلك خلال الحصة وكيف يقدم المعلم الملاحظات. في الحصة التجريبية، لاحظ ما إذا كان لدى طفلك وقت لشرح فكرة وتجربة حل وطلب المساعدة. اختر مستوى يقدم تحدياً مناسباً، ولا تعتمد على العمر وحده.",
  ages: "الأعمار", weeks: "أسابيع", lessons: "دروس", empty: "استكشف دليل الدورات أو تواصل معنا للتأكد من الدورات المتاحة حالياً.",
  trial: "اطلب حصة تجريبية مجانية أونلاين", catalog: "استعرض جميع الدورات", contact: "اسأل عن الحصص في الإمارات", guide: "اقرأ دليل أولياء الأمور",
  faqTitle: "أسئلة أولياء الأمور في الإمارات",
  faq: [
   ["هل تُدرّس الحصص بالعربية أم بالإنجليزية؟", "الموقع متاح باللغتين. تأكد من لغة التدريس للدورة والمجموعة المتاحة قبل الحجز؛ لغة الموقع وحدها لا تحدد لغة الحصة."],
   ["ما الذي ينبغي التأكد منه بشأن الرسوم؟", "راجع المبلغ وعملة الدفع في صفحة الدورة، ثم تأكد مما يشمله السعر: عدد الحصص والبرامج أو الأجهزة المطلوبة وأي تكاليف إضافية. الحصة التجريبية المجانية منفصلة عن الدورة المدفوعة."],
   ["هل يستطيع طفلي الانضمام من خارج دبي؟", "نعم، الحصص أونلاين، ويمكن للعائلات في مختلف مناطق الإمارات الانضمام من المنزل مع الجهاز المطلوب واتصال الإنترنت."],
   ["هل يحتاج طفلي إلى خبرة سابقة في البرمجة؟", "يعتمد ذلك على الدورة. ابدأ بدورة للمبتدئين إذا كان طفلك جديداً في البرمجة، وراجع العمر والمتطلبات قبل التسجيل."],
   ["هل حصص الروبوتات حضورية؟", "خدمات ستم تك لاب في الإمارات أونلاين. راجع وصف الدورة المختارة وتأكد من اعتمادها على المحاكاة أو حاجتها إلى معدات فعلية."],
   ["كيف نختار الدورة الأولى؟", "قارن الدورات المتاحة في هذه الصفحة، واستعن بمسار التعلم أو اطلب حصة مجانية. شارك عمر طفلك واهتماماته مع الفريق لمناقشة البداية المناسبة."],
  ],
 },
};
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
 const { locale } = await params;
 const lang = locale === "ar" ? "ar" : "en";
 const c = copy[lang];
 return { title: { absolute: `${c.title} | ${lang === "ar" ? "ستم تك لاب" : "StemTechLab"}` }, description: c.description, alternates: buildAlternates(lang, "/uae"),
  openGraph: { title: c.title, description: c.description, url: siteUrl(lang, "/uae"), type: "website", siteName: "StemTechLab", images: [{ url: `${SITE_URL}/og?locale=${lang}`, width: 1200, height: 630, alt: c.title }], locale: lang === "ar" ? "ar_AE" : "en_AE" },
  twitter: { card: "summary_large_image", title: c.title, description: c.description, images: [`${SITE_URL}/og?locale=${lang}`] } };
}
export default async function UAEPage({ params }: { params: Promise<{ locale: string }> }) {
 const { locale } = await params;
 setRequestLocale(locale);
 const lang = locale === "ar" ? "ar" : "en";
 const c = copy[lang];
 const courses = await getCoursesISR();
 const linkClass = "text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4";
 return <>
  <BreadcrumbSchema items={[{ name: lang === "ar" ? "الرئيسية" : "Home", url: siteUrl(lang) }, { name: lang === "ar" ? "الإمارات" : "UAE", url: siteUrl(lang, "/uae") }]} />
  <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", "@id": `${siteUrl(lang, "/uae")}#service`, name: c.title, description: c.description, url: siteUrl(lang, "/uae"), serviceType: "Live online coding and STEM classes for children", areaServed: { "@type": "Country", name: "United Arab Emirates" }, provider: { "@id": `${siteUrl(lang).replace(/\/(en|ar)$/, "")}/#organization` }, availableChannel: { "@type": "ServiceChannel", serviceUrl: siteUrl(lang, "/free-trial") } }} />
  <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
   <header className="max-w-3xl mb-12">
    <p className="text-primary font-semibold mb-3">{lang === "ar" ? "ستم تك لاب · الإمارات" : "StemTechLab · UAE"}</p>
    <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-6">{c.title}</h1>
    <p className="text-lg text-muted leading-relaxed mb-6">{c.intro}</p>
    <Link href={`/${lang}/free-trial`} className="inline-flex rounded-xl bg-primary text-white font-semibold px-6 py-3 focus-visible:outline-2 focus-visible:outline-offset-4">{c.trial}</Link>
   </header>
   <section className="mb-12"><h2 className="text-2xl font-bold mb-4">{c.delivery}</h2><p className="leading-relaxed text-muted">{c.deliveryText}</p></section>
   <section className="mb-12"><h2 className="text-2xl font-bold mb-4">{c.planning}</h2><ul className="list-disc ps-6 space-y-3 text-muted leading-relaxed">{c.steps.map(step => <li key={step}>{step}</li>)}</ul></section>
   <section className="mb-12">
    <h2 className="text-2xl font-bold mb-4">{c.courses}</h2><p className="text-muted leading-relaxed mb-6">{c.courseIntro}</p>
    <ul className="divide-y divide-border border-y border-border">{(courses ?? []).map(course => <li key={course.slug} className="py-5"><h3 className="text-lg font-semibold mb-2"><Link className={linkClass} href={`/${lang}/courses/${course.slug}`}>{coursePublicTitle(course.slug, course.title[lang], lang)}</Link></h3><p className="text-sm text-muted">{c.ages} {course.ageMin}–{course.ageMax} · {({ en: { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" }, ar: { beginner: "مبتدئ", intermediate: "متوسط", advanced: "متقدم" } }[lang] as Record<string, string>)[course.level] ?? course.level} · {course.lessons} {c.lessons} · {course.durationWeeks} {c.weeks}</p>{course.skills?.[lang]?.length > 0 && <p className="mt-3 text-sm text-muted leading-relaxed"><span className="font-semibold">{c.skills}: </span>{course.skills[lang].join(lang === "ar" ? "، " : ", ")}</p>}</li>)}</ul>
    {!courses?.length && <p className="text-muted my-4">{c.empty}</p>}
    <Link href={`/${lang}/courses`} className={`${linkClass} inline-block mt-6`}>{c.catalog}</Link>
   </section>
   <section className="mb-12"><h2 className="text-2xl font-bold mb-4">{c.compare}</h2><p className="text-muted leading-relaxed">{c.compareText}</p></section>
   <section className="mb-12"><h2 className="text-2xl font-bold mb-6">{c.faqTitle}</h2><dl className="space-y-6">{c.faq.map(([q,a]) => <div key={q}><dt className="font-semibold mb-2">{q}</dt><dd className="text-muted leading-relaxed">{a}</dd></div>)}</dl></section>
   <nav className="flex flex-wrap gap-6" aria-label={lang === "ar" ? "الخطوات التالية" : "Next steps"}><Link href={`/${lang}/contact`} className={linkClass}>{c.contact}</Link><Link href={`/${lang}/parents`} className={linkClass}>{c.guide}</Link><Link href={`/${lang}/learning-path`} className={linkClass}>{lang === "ar" ? "مسار التعلم" : "Explore the learning path"}</Link></nav>
  </article>
 </>;
}
