"use client";

import { useMemo, useEffect } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { APIBlogPost } from "@/lib/server-api";
import type { APICourse } from "@/lib/api";
import { CourseCard } from "@/components/CourseCard";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import {
 ArrowLeft,
 Clock,
 Eye,
 Tag,
 Calendar,
 User,
 Share2,
 BookOpen,
} from "lucide-react";

interface Props {
 post: APIBlogPost;
 relatedCourses: APICourse[];
}

export default function BlogDetailClient({ post, relatedCourses }: Props) {
 const locale = useLocale();
 const lang = locale === "ar" ? "ar" : "en";

 useEffect(() => {
 fetch(`/api/blog/${post.slug}/view`, { method: "POST" }).catch(() => {});
 }, [post.slug]);

 const publishDate = post.publishedAt
 ? new Date(post.publishedAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
 year: "numeric",
 month: "long",
 day: "numeric",
 })
 : "";

 const sanitizedBody = useMemo(() => {
 const raw = (post.body[lang] || "")
   .replace(/^## (.*$)/gm, '<h2>$1</h2>')
   .replace(/^### (.*$)/gm, '<h3>$1</h3>')
   .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
   .replace(/\n- (.*)/g, '\n<li>$1</li>')
   .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
   .replace(/\n{2,}/g, '</p><p>')
   .replace(/^/, '<p>')
   .replace(/$/, '</p>')
   .replace(/<p><h/g, '<h')
   .replace(/<\/h([23])><\/p>/g, '</h$1>')
   .replace(/<p><ul>/g, '<ul>')
   .replace(/<\/ul><\/p>/g, '</ul>')
   .replace(/<p>\s*<\/p>/g, '');
 return DOMPurify.sanitize(raw, {
   ALLOWED_TAGS: ['h2', 'h3', 'p', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'br', 'blockquote', 'code', 'pre'],
   ALLOWED_ATTR: ['href', 'target', 'rel'],
 });
 }, [post.body, lang]);

 const handleShare = async () => {
 const url = window.location.href;
 if (navigator.share) {
 await navigator.share({ title: post.title[lang], url });
 } else {
 await navigator.clipboard.writeText(url);
 }
 };

 return (
 <div className="py-10 sm:py-16">
 <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
 {/* Back */}
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
 <Link
 href="/blog"
 className="inline-flex items-center gap-2 text-muted hover:text-primary font-medium mb-8 transition-colors text-sm"
 >
 <ArrowLeft className="w-4 h-4" />
 {lang === "ar" ? "العودة للمدونة" : "Back to Blog"}
 </Link>
 </motion.div>

 {/* Header */}
 <motion.header initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
 {/* Category */}
 <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary capitalize mb-4">
 {post.category}
 </span>

 <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-5">
 {post.title[lang]}
 </h1>

 {/* Meta row */}
 <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-6">
 <span className="flex items-center gap-1.5">
 <User className="w-4 h-4" />
 {post.author.name}
 </span>
 {publishDate && (
 <span className="flex items-center gap-1.5">
 <Calendar className="w-4 h-4" />
 {publishDate}
 </span>
 )}
 <span className="flex items-center gap-1.5">
 <Clock className="w-4 h-4" />
 {post.readTimeMinutes} {lang === "ar" ? "دقائق قراءة" : "min read"}
 </span>
 <span className="flex items-center gap-1.5">
 <Eye className="w-4 h-4" />
 {post.viewCount} {lang === "ar" ? "مشاهدة" : "views"}
 </span>
 <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-primary transition-colors">
 <Share2 className="w-4 h-4" />
 {lang === "ar" ? "مشاركة" : "Share"}
 </button>
 </div>

 {/* Tags */}
 {post.tags.length > 0 && (
 <div className="flex flex-wrap gap-2">
 {post.tags.map((tag) => (
 <span key={tag} className="flex items-center gap-1 text-xs text-muted bg-surface border border-border px-2.5 py-1 rounded-full">
 <Tag className="w-3 h-3" />
 {tag}
 </span>
 ))}
 </div>
 )}
 </motion.header>

 {/* Cover image */}
 {post.coverImage && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-10">
 <img
 src={post.coverImage}
 alt={post.title[lang]}
 className="w-full rounded-2xl border border-border"
 />
 </motion.div>
 )}

 {/* Body */}
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.15 }}
 className="prose prose-lg dark:prose-invert max-w-none mb-12
 prose-headings:font-bold prose-headings:text-foreground
 prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
 prose-p:text-muted prose-p:leading-relaxed
 prose-li:text-muted
 prose-strong:text-foreground
 prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
 dangerouslySetInnerHTML={{ __html: sanitizedBody }}
 />

 {/* Region targeting (SEO text) */}
 {post.targetRegions.length > 0 && (
 <div className="bg-surface rounded-2xl border border-border p-5 mb-10">
 <p className="text-xs text-muted">
 <strong>{lang === "ar" ? "المناطق المستهدفة:" : "Available in:"}</strong>{" "}
 {post.targetRegions.join(", ")}
 </p>
 </div>
 )}

 {/* CTA */}
 <div className="bg-primary rounded-2xl p-8 text-center mb-12">
 <h3 className="text-xl font-bold text-white mb-3">
 {lang === "ar" ? "ابدأ رحلة طفلك التعليمية اليوم" : "Start Your Child's Learning Journey Today"}
 </h3>
 <p className="text-white/70 text-sm mb-5">
 {lang === "ar" ? "حصة تجريبية مجانية بدون أي التزام" : "Free trial class with no obligation"}
 </p>
 <Link
 href="/contact?subject=Book%20a%20Free%20Trial%20Class"
 className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary font-semibold hover:scale-[1.02] transition-transform"
 >
 <BookOpen className="w-4 h-4" />
 {lang === "ar" ? "احجز حصة مجانية" : "Book Free Trial"}
 </Link>
 </div>

 {/* Related courses */}
 {relatedCourses.length > 0 && (
 <div className="mb-10">
 <h3 className="text-xl font-bold mb-5">
 {lang === "ar" ? "الدورات ذات الصلة" : "Related Courses"}
 </h3>
 <div className="grid sm:grid-cols-2 gap-5">
 {relatedCourses.slice(0, 4).map((course, i) => (
 <CourseCard
 key={course.slug}
 course={{
 id: course.slug,
 category: course.category as "programming",
 ageMin: course.ageMin,
 ageMax: course.ageMax,
 level: course.level as "beginner",
 lessons: course.lessons,
 durationWeeks: course.durationWeeks,
 color: course.color,
 iconName: course.iconName,
 titleKey: "",
 descKey: "",
 skillKeys: [],
 _title: course.title[lang],
 _desc: course.description[lang],
 }}
 index={i}
 title={course.title[lang]}
 description={course.description[lang]}
 />
 ))}
 </div>
 </div>
 )}
 </div>
 </div>
 );
}
