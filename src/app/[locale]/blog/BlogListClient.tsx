"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BlogListResponse, APIBlogPost } from "@/lib/server-api";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Eye,
  Tag,
  ArrowRight,
  Search,
} from "lucide-react";

const categories = [
  { value: "all", label: "All", labelAr: "الكل" },
  { value: "coding", label: "Coding", labelAr: "البرمجة" },
  { value: "robotics", label: "Robotics", labelAr: "الروبوتات" },
  { value: "quran", label: "Quran", labelAr: "القرآن" },
  { value: "arabic", label: "Arabic", labelAr: "العربية" },
  { value: "stem", label: "STEM", labelAr: "العلوم" },
  { value: "parenting", label: "Parenting", labelAr: "الأبوة" },
];

interface Props {
  initialData: BlogListResponse | null;
}

export default function BlogListClient({ initialData }: Props) {
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const [filter, setFilter] = useState("all");

  const posts = initialData?.items || [];
  const filtered = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface/50 py-14 sm:py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-[10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-[10%] w-72 h-72 bg-purple/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              {lang === "ar" ? "المدونة" : "Blog"}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {lang === "ar" ? "نصائح وأدلة للوالدين" : "Tips & Guides for Parents"}
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              {lang === "ar"
                ? "مقالات متخصصة حول تعليم الأطفال البرمجة والروبوتات والقرآن والعربية"
                : "Expert articles on kids coding, robotics, Quran, Arabic & STEM education"}
            </p>
          </motion.div>

          {/* Category filter */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === cat.value
                    ? "bg-primary text-white shadow-md"
                    : "bg-surface border border-border text-muted hover:text-foreground hover:border-primary/30"
                }`}
              >
                {lang === "ar" ? cat.labelAr : cat.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <BlogCard key={post._id} post={post} lang={lang} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Search className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="text-muted text-lg">
                {lang === "ar" ? "لا توجد مقالات في هذه الفئة" : "No articles in this category"}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function BlogCard({ post, lang, index }: { post: APIBlogPost; lang: "en" | "ar"; index: number }) {
  const categoryColors: Record<string, string> = {
    coding: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    robotics: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
    quran: "bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400",
    arabic: "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400",
    stem: "bg-violet-100 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400",
    parenting: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
    general: "bg-muted/20 text-muted",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
    >
      <Link href={`/blog/${post.slug}`} className="block group h-full">
        <div className="h-full bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300">
          {/* Cover */}
          {post.coverImage ? (
            <div className="h-48 bg-gradient-to-br from-primary/10 to-purple/10 overflow-hidden">
              <img src={post.coverImage} alt={post.title[lang]} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-primary/5 to-purple/5 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-primary/20" />
            </div>
          )}

          <div className="p-5">
            {/* Category + meta */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${categoryColors[post.category] || categoryColors.general}`}>
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted">
                <Clock className="w-3 h-3" />
                {post.readTimeMinutes} min
              </span>
              <span className="flex items-center gap-1 text-xs text-muted">
                <Eye className="w-3 h-3" />
                {post.viewCount}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {post.title[lang]}
            </h2>

            {/* Excerpt */}
            <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-3">
              {post.excerpt[lang]}
            </p>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-[10px] text-muted bg-background px-2 py-0.5 rounded-full">
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                  {post.author.name.charAt(0)}
                </div>
                <span className="text-xs text-muted">{post.author.name}</span>
              </div>
              <span className="text-sm font-semibold text-primary group-hover:underline flex items-center gap-1">
                {lang === "ar" ? "اقرأ" : "Read"}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
