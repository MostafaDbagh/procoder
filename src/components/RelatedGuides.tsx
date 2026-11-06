import Link from "next/link";
import { getBlogPostsISR } from "@/lib/server-api";
const successors: Record<string, string> = { scratch: "programming1", webdev: "web-beginner", "robot-basics": "robotics", "algo-competitive": "algo-intro" };

/** Optional editorial links: an unavailable archive must not break a course. */
export async function RelatedGuides({ locale, courseSlugs, excludeSlug }: { locale: string; courseSlugs: string[]; excludeSlug?: string }) {
 const lang = locale === "ar" ? "ar" : "en";
 const data = await getBlogPostsISR();
 const guides = (data?.items ?? []).filter(post => post.slug !== excludeSlug && post.title?.[lang] && post.relatedCourses?.some(slug => courseSlugs.includes(successors[slug] ?? slug))).slice(0, 3);
 if (!guides.length) return null;
 return <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
  <h2 className="mb-4 text-xl font-bold">{lang === "ar" ? "أدلة تساعدك على الاختيار" : "Guides to help you choose"}</h2>
  <ul className="space-y-3">{guides.map(post => <li key={post.slug}><Link className="font-medium text-primary underline underline-offset-4" href={`/${lang}/blogs/${post.slug}`}>{post.title[lang]}</Link><p className="mt-1 text-sm text-muted">{post.excerpt[lang]}</p></li>)}</ul>
 </section>;
}
