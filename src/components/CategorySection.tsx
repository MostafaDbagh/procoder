"use client";

import { useTranslations, useLocale } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import { AnimatedSection, AnimatedCard } from "./AnimatedSection";
import { motion } from "framer-motion";
import {
 Code2,
 Bot,
 Brain,
 BookOpen,
 BookMarked,
 Gamepad2,
 Smartphone,
 Layout,
 ArrowRight,
 Workflow,
} from "lucide-react";
import { ScratchCatIcon } from "@/components/icons/ScratchCatIcon";
import type { LucideIcon } from "lucide-react";
import type { APICategory } from "@/lib/server-api";

type StaticCat = {
 key: string;
 descKey: string;
 icon: LucideIcon;
 color: string;
 borderColor: string;
 emoji: string;
};

const SLUG_STYLE: Record<
 string,
 { icon: LucideIcon; color: string; borderColor: string; emoji: string }
> = {
 programming: {
 icon: Code2,
 color: "#3B82F6",
 borderColor: "border-b-blue-400",
 emoji: "💻",
 },
 robotics: {
 icon: Bot,
 color: "#10B981",
 borderColor: "border-b-emerald-400",
 emoji: "🤖",
 },
 algorithms: {
 icon: Workflow,
 color: "#c4b5fd",
 borderColor: "border-b-violet-400",
 emoji: "🧩",
 },
 arabic: {
 icon: BookMarked,
 color: "#F43F5E",
 borderColor: "border-b-rose-400",
 emoji: "📖",
 },
 "game-development": {
 icon: Gamepad2,
 color: "#F59E0B",
 borderColor: "border-b-amber-400",
 emoji: "🎮",
 },
 "mobile-development": {
 icon: Smartphone,
 color: "#EC4899",
 borderColor: "border-b-pink-400",
 emoji: "📱",
 },
 "mobile-app-development": {
 icon: Smartphone,
 color: "#EC4899",
 borderColor: "border-b-pink-400",
 emoji: "📱",
 },
 "web-development": {
 icon: Layout,
 color: "#06B6D4",
 borderColor: "border-b-cyan-400",
 emoji: "🌐",
 },
 "artificial-intelligence": {
 icon: Brain,
 color: "#6366F1",
 borderColor: "border-b-indigo-400",
 emoji: "🧠",
 },
 scratch: {
 icon: ScratchCatIcon as unknown as LucideIcon,
 color: "#F97316",
 borderColor: "border-b-orange-400",
 emoji: "🪄",
 },
};

const DEFAULT_STYLE = {
 icon: BookOpen,
 color: "#64748B",
 borderColor: "border-b-slate-400",
 emoji: "📚",
};

const STATIC_FALLBACK: StaticCat[] = [
 {
 key: "programming",
 descKey: "programmingDesc",
 ...SLUG_STYLE.programming,
 },
 {
 key: "robotics",
 descKey: "roboticsDesc",
 ...SLUG_STYLE.robotics,
 },
 {
 key: "algorithms",
 descKey: "algorithmsDesc",
 ...SLUG_STYLE.algorithms,
 },
 {
 key: "arabic",
 descKey: "arabicDesc",
 ...SLUG_STYLE.arabic,
 },
 {
 key: "web-development",
 descKey: "webDevelopmentDesc",
 ...SLUG_STYLE["web-development"],
 },
 {
 key: "artificial-intelligence",
 descKey: "artificialIntelligenceDesc",
 ...SLUG_STYLE["artificial-intelligence"],
 },
 {
 key: "scratch",
 descKey: "scratchDesc",
 ...SLUG_STYLE.scratch,
 },
];

const LEGACY_DESC_SLUGS = new Set([
 "programming",
 "robotics",
 "algorithms",
 "arabic",
 "web-development",
 "artificial-intelligence",
 "scratch",
]);

type Props = {
 /**
 * From GET /api/categories (ISR on the server). `null` = fetch failed → static fallback.
 * `[]` = no active categories in DB.
 */
 categories: APICategory[] | null;
};

export function CategorySection({ categories: apiCategories }: Props) {
 const t = useTranslations("categories");
 const locale = useLocale();

 if (apiCategories !== null && apiCategories.length === 0) {
 return (
 <section className="py-20 sm:py-28 bg-surface/50">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
 <p className="text-muted">{t("emptyCatalog")}</p>
 </div>
 </section>
 );
 }

 const fromApi = apiCategories !== null && apiCategories.length > 0;

 return (
 <section className="py-20 sm:py-28 bg-surface/50">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <AnimatedSection className="text-center mb-14">
 <div className="flex justify-center mb-6">
 <motion.div
 initial={{ scale: 0, rotate: -15 }}
 whileInView={{ scale: 1, rotate: 0 }}
 viewport={{ once: true }}
 transition={{ type: "spring", stiffness: 200, damping: 15 }}
 >
 <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
 <circle cx="60" cy="60" r="50" fill="#8B7BC8" opacity="0.07" />
 <path d="M25 72 Q60 62 95 72 L95 78 Q60 68 25 78Z" fill="#D4A46A" opacity="0.5" />
 <path d="M25 72 Q42 64 60 68 L60 74 Q42 70 25 78Z" fill="#D4A46A" opacity="0.35" />
 <path d="M95 72 Q78 64 60 68 L60 74 Q78 70 95 78Z" fill="#D4A46A" opacity="0.45" />
 <line x1="60" y1="68" x2="60" y2="78" stroke="#C4945A" strokeWidth="1.5" opacity="0.5" />
 <motion.g
 animate={{ y: [0, -4, 0] }}
 transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
 >
 <circle cx="32" cy="46" r="12" fill="#c4b5fd" opacity="0.15" />
 <rect x="24" y="40" width="16" height="12" rx="3" fill="#c4b5fd" opacity="0.6" />
 <text x="32" y="50" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white" fontFamily="monospace" opacity="0.9">&lt;/&gt;</text>
 </motion.g>
 <motion.g
 animate={{ y: [0, -5, 0] }}
 transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
 >
 <circle cx="48" cy="32" r="12" fill="#5CC4A0" opacity="0.15" />
 <rect x="41" y="26" width="14" height="12" rx="4" fill="#5CC4A0" opacity="0.6" />
 <circle cx="45.5" cy="31" r="1.5" fill="white" opacity="0.9" />
 <circle cx="50.5" cy="31" r="1.5" fill="white" opacity="0.9" />
 <rect x="44" y="35" width="8" height="2" rx="1" fill="white" opacity="0.6" />
 <line x1="48" y1="24" x2="48" y2="21" stroke="#5CC4A0" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
 <circle cx="48" cy="20" r="1.5" fill="#5CC4A0" opacity="0.5" />
 </motion.g>
 <motion.g
 animate={{ y: [0, -5, 0] }}
 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
 >
 <circle cx="72" cy="32" r="12" fill="#8B7BC8" opacity="0.15" />
 <circle cx="72" cy="32" r="8" fill="#8B7BC8" opacity="0.5" />
 <path d="M68 30 Q70 26 72 30 Q74 26 76 30" stroke="white" strokeWidth="1.2" fill="none" opacity="0.8" />
 <path d="M68 34 Q70 30 72 34 Q74 30 76 34" stroke="white" strokeWidth="1.2" fill="none" opacity="0.6" />
 </motion.g>
 <motion.g
 animate={{ y: [0, -4, 0] }}
 transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
 >
 <circle cx="88" cy="46" r="12" fill="#D4A46A" opacity="0.15" />
 <rect x="81" y="40" width="14" height="12" rx="2" fill="#5CC4A0" opacity="0.55" />
 <line x1="88" y1="40" x2="88" y2="52" stroke="white" strokeWidth="1.5" opacity="0.6" />
 <rect x="83" y="43" width="4" height="1.5" rx="0.75" fill="white" opacity="0.6" />
 <rect x="89" y="43" width="4" height="1.5" rx="0.75" fill="white" opacity="0.6" />
 <rect x="83" y="46.5" width="3" height="1.5" rx="0.75" fill="white" opacity="0.5" />
 <rect x="89" y="46.5" width="3" height="1.5" rx="0.75" fill="white" opacity="0.5" />
 </motion.g>
 <motion.path
 d="M18 28 L20 23 L22 28 L27 30 L22 32 L20 37 L18 32 L13 30Z"
 fill="#D4A46A"
 opacity="0.5"
 animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
 transition={{ duration: 2, repeat: Infinity }}
 style={{ transformOrigin: "20px 30px" }}
 />
 <motion.path
 d="M98 20 L99.5 16 L101 20 L105 21.5 L101 23 L99.5 27 L98 23 L94 21.5Z"
 fill="#5CC4A0"
 opacity="0.5"
 animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.3, 0.7, 0.3] }}
 transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}
 style={{ transformOrigin: "99.5px 21.5px" }}
 />
 <motion.circle cx="15" cy="55" r="2" fill="#8B7BC8" opacity="0.4"
 animate={{ opacity: [0.2, 0.5, 0.2] }}
 transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
 />
 <motion.circle cx="105" cy="50" r="2" fill="#c4b5fd" opacity="0.4"
 animate={{ opacity: [0.2, 0.5, 0.2] }}
 transition={{ duration: 2.2, repeat: Infinity, delay: 0.9 }}
 />
 </svg>
 </motion.div>
 </div>
 <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")}</h2>
 <p className="text-muted text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
 </AnimatedSection>

 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
 {fromApi
 ? apiCategories!.map((row, i) => (
 <CategoryCardApi
 key={row.slug}
 row={row}
 i={i}
 t={t}
 locale={locale}
 />
 ))
 : STATIC_FALLBACK.map((cat, i) => (
 <CategoryCardStatic key={cat.key} cat={cat} i={i} t={t} />
 ))}
 </div>

 <AnimatedSection delay={0.5} className="text-center mt-14">
 <LocalizedLink
 href="/courses"
 className="inline-flex items-center gap-2 text-primary font-semibold text-base hover:underline underline-offset-4 transition-all"
 >
 {t("title")} →
 </LocalizedLink>
 </AnimatedSection>
 </div>
 </section>
 );
}

function categoryDescription(
 slug: string,
 t: ReturnType<typeof useTranslations<"categories">>
): string {
 if (LEGACY_DESC_SLUGS.has(slug)) {
 const key =
 `${slug}Desc` as
 | "programmingDesc"
 | "roboticsDesc"
 | "algorithmsDesc"
 | "arabicDesc"
 | "webDevelopmentDesc"
 | "artificialIntelligenceDesc"
 | "scratchDesc";
 return t(key);
 }
 return t("catalogFallbackDesc");
}

function categoryDescriptionFromApi(
 row: APICategory,
 locale: string,
 t: ReturnType<typeof useTranslations<"categories">>
): string {
 const loc = locale === "ar" ? "ar" : "en";
 const fromApi = row.description?.[loc]?.trim();
 if (fromApi) return fromApi;
 return categoryDescription(row.slug, t);
}

function CategoryCardApi({
 row,
 i,
 t,
 locale,
}: {
 row: APICategory;
 i: number;
 t: ReturnType<typeof useTranslations<"categories">>;
 locale: string;
}) {
 const style = SLUG_STYLE[row.slug] ?? DEFAULT_STYLE;
 const Icon = style.icon;
 const title = locale === "ar" ? row.title.ar : row.title.en;
 const desc = categoryDescriptionFromApi(row, locale, t);
 const isRtl = locale === "ar";
 const href = `/courses?category=${encodeURIComponent(row.slug)}`;

 return (
 <AnimatedCard delay={i * 0.1}>
 <LocalizedLink href={href} className="block group h-full">
 <div
 className={`relative bg-white dark:bg-surface rounded-2xl p-7 h-full border border-border/60 border-b-4 ${style.borderColor} shadow-md shadow-black/[0.03] dark:shadow-black/[0.15] transition-all duration-300 hover:shadow-xl hover:shadow-black/[0.06] dark:hover:shadow-black/[0.25] hover:-translate-y-1 overflow-hidden`}
 >
 <div
 className={`absolute -top-8 ${isRtl ? "-left-8" : "-right-8"} w-28 h-28 rounded-full opacity-[0.07] transition-transform duration-500 group-hover:scale-125`}
 style={{ backgroundColor: style.color }}
 />
 <motion.span
 className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} text-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-300`}
 animate={{ y: [0, -4, 0], rotate: [0, 8, 0] }}
 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
 >
 {style.emoji}
 </motion.span>
 <div
 className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
 style={{ backgroundColor: `${style.color}15` }}
 >
 <Icon className="w-7 h-7" style={{ color: style.color }} />
 </div>
 <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
 <p className="text-muted leading-relaxed mb-5 text-[0.95rem]">{desc}</p>
 <span
 className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 group-hover:gap-2.5"
 style={{ color: style.color }}
 >
 {t("explore")} <ArrowRight className="w-4 h-4" />
 </span>
 </div>
 </LocalizedLink>
 </AnimatedCard>
 );
}

function CategoryCardStatic({
 cat,
 i,
 t,
}: {
 cat: StaticCat;
 i: number;
 t: ReturnType<typeof useTranslations<"categories">>;
}) {
 const Icon = cat.icon;
 const locale = useLocale();
 const isRtl = locale === "ar";
 const href = `/courses?category=${encodeURIComponent(cat.key)}`;

 return (
 <AnimatedCard delay={i * 0.1}>
 <LocalizedLink href={href} className="block group h-full">
 <div
 className={`relative bg-white dark:bg-surface rounded-2xl p-7 h-full border border-border/60 border-b-4 ${cat.borderColor} shadow-md shadow-black/[0.03] dark:shadow-black/[0.15] transition-all duration-300 hover:shadow-xl hover:shadow-black/[0.06] dark:hover:shadow-black/[0.25] hover:-translate-y-1 overflow-hidden`}
 >
 <div
 className={`absolute -top-8 ${isRtl ? "-left-8" : "-right-8"} w-28 h-28 rounded-full opacity-[0.07] transition-transform duration-500 group-hover:scale-125`}
 style={{ backgroundColor: cat.color }}
 />
 <motion.span
 className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} text-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-300`}
 animate={{ y: [0, -4, 0], rotate: [0, 8, 0] }}
 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
 >
 {cat.emoji}
 </motion.span>
 <div
 className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
 style={{ backgroundColor: `${cat.color}15` }}
 >
 <Icon className="w-7 h-7" style={{ color: cat.color }} />
 </div>
 <h3 className="text-xl font-bold mb-2 text-foreground">{t(cat.key as "programming")}</h3>
 <p className="text-muted leading-relaxed mb-5 text-[0.95rem]">
 {t(cat.descKey as "programmingDesc")}
 </p>
 <span
 className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 group-hover:gap-2.5"
 style={{ color: cat.color }}
 >
 {t("explore")} <ArrowRight className="w-4 h-4" />
 </span>
 </div>
 </LocalizedLink>
 </AnimatedCard>
 );
}
