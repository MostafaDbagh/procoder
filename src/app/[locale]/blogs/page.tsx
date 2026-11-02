import { SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ApiUnavailableError, getBlogPostsISR } from "@/lib/server-api";
import { BreadcrumbSchema } from "@/components/StructuredData";
import BlogListClient from "./BlogListClient";
import { buildAlternates, siteUrl, bcLabel } from "@/lib/seo";


export const revalidate = 300;


type Props = {
 params: Promise<{ locale: string }>;
 searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function getArchive(searchParams: Props["searchParams"]) {
 const query = await searchParams;
 const rawPage = query.page ?? "1";
 const category = query.category ?? "all";
 if (typeof rawPage !== "string" || !/^[1-9]\d*$/.test(rawPage)) notFound();
 const page = Number(rawPage);
 if (!Number.isSafeInteger(page)) notFound();
 if (typeof category !== "string" || !["all", "coding", "robotics", "arabic", "stem", "parenting", "general"].includes(category)) notFound();
 const data = await getBlogPostsISR({ page, limit: 50, category: category === "all" ? undefined : category });
 if (!data) throw new ApiUnavailableError("blog list");
 if (page > Math.max(1, data.totalPages) || (page > 1 && data.items.length === 0)) notFound();
 const canonicalQuery = new URLSearchParams();
 if (category !== "all") canonicalQuery.set("category", category);
 if (page > 1) canonicalQuery.set("page", String(page));
 const path = `/blogs${canonicalQuery.size ? `?${canonicalQuery}` : ""}`;
 return { data, page, category, path };
}

const meta = {
 en: {
 title: "Blog — Tips, Guides & News for Parents",
 description:
 "Practical guides for parents: choosing your child’s first coding course, when to start robotics, and the STEM skills that matter most by age (6–18).",
 },
 ar: {
 title: "المدونة — نصائح وأدلة وأخبار للوالدين",
 description: "أدلة عملية لأولياء الأمور: اختيار دورة البرمجة المناسبة لطفلك، متى يبدأ الروبوتات، ومهارات STEM الأهم حسب العمر. للعائلات في عُمان ودول الخليج.",
 },
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
 const { locale } = await params;
 const lang = locale === "ar" ? "ar" : "en";
 const { page, category, path } = await getArchive(searchParams);
 const categoryLabel = lang === "ar" ? ({ coding: "البرمجة", robotics: "الروبوتات", arabic: "العربية", stem: "العلوم", parenting: "التربية", general: "عام" } as Record<string, string>)[category] : category;
 const suffix = `${category !== "all" ? ` — ${categoryLabel}` : ""}${page > 1 ? (lang === "ar" ? ` — الصفحة ${page}` : ` — Page ${page}`) : ""}`;
 const fullTitle = lang === "ar"
 ? `${meta.ar.title}${suffix} | ستم تك لاب`
 : `${meta.en.title}${suffix} | StemTechLab`;
 return {
 title: { absolute: fullTitle },
 description: meta[lang].description,
 alternates: buildAlternates(lang, path),
 openGraph: { title: meta[lang].title, description: meta[lang].description, url: siteUrl(lang, path), type: "website", siteName: "StemTechLab", locale: lang === "ar" ? "ar_AE" : "en_US", alternateLocale: lang === "ar" ? "en_US" : "ar_AE", images: [{ url: `${SITE_URL}/og?locale=${lang}`, width: 1200, height: 630, alt: "StemTechLab" }] },
 twitter: { card: "summary_large_image", title: meta[lang].title, description: meta[lang].description },
 };
}

export default async function BlogPage({ params, searchParams }: Props) {
 const { locale } = await params;
 setRequestLocale(locale);
 const { data, page, category } = await getArchive(searchParams);

 const homeUrl = `${SITE_URL}/${locale}`;
 const blogsUrl = `${SITE_URL}/${locale}/blogs`;
 return (
 <>
 <BreadcrumbSchema items={[
 { name: bcLabel("Home", locale), url: homeUrl },
 { name: bcLabel("Blog", locale), url: blogsUrl },
 ]} />
 <BlogListClient initialData={data} page={page} category={category} />
 </>
 );
}
