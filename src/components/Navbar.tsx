"use client";

import { useState, useEffect, useMemo, startTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { LocalizedLink } from "@/components/LocalizedLink";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import { courses as staticCourses } from "@/data/courses";

function titleizeSlug(slug: string) {
 return slug
 .split("-")
 .filter(Boolean)
 .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
 .join(" ");
}

export function Navbar() {
 const t = useTranslations("nav");
 const ct = useTranslations("courseData");
 const locale = useLocale();
 const pathname = usePathname();
 const { theme, toggleTheme } = useTheme();
 const [mobileOpen, setMobileOpen] = useState(false);

 const contactWithTrialSubject = useMemo(() => {
 const m = pathname.match(/\/courses\/([^/?#]+)/);
 const slug = m?.[1];
 const subject = slug
 ? (() => {
 const staticCourse = staticCourses.find((c) => c.id === slug);
 const courseLabel = staticCourse ? ct(staticCourse.titleKey) : titleizeSlug(slug);
 return t("bookDemoSubject", { course: courseLabel });
 })()
 : t("bookDemoSubjectGeneric");
 return `/contact?subject=${encodeURIComponent(subject)}`;
 }, [pathname, t, ct]);

 useEffect(() => {
 startTransition(() => {
 setMobileOpen(false);
 });
 }, [pathname, locale]);

 const links = useMemo(() => [
 { href: "/", label: t("home") },
 { href: "/courses", label: t("courses") },
 { href: "/recommend", label: t("recommend") },
 { href: "/parents", label: t("parents") },
 { href: "/blogs", label: t("blog") },
 { href: "/contact", label: t("contact") },
 ], [t]);

 // localePrefix:"always" — swap /en ↔ /ar prefix directly
 // usePathname() returns path WITHOUT locale prefix (e.g. "/courses")
 const switchHref = locale === "en"
 ? `/ar${pathname === "/" ? "" : pathname}` || "/ar"
 : `/en${pathname === "/" ? "" : pathname}` || "/en";

 return (
 <header className="sticky top-0 z-50 backdrop-blur-xl bg-surface/80 border-b border-border">
 <nav className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex items-center justify-between h-16">
 {/* Logo */}
 <LocalizedLink href="/" className="flex items-center group">
 <Image src="/logo.png" alt="StemTechLab" width={92} height={54} priority className="object-contain" />
 </LocalizedLink>

 {/* Desktop nav */}
 <div className="hidden md:flex items-center gap-1">
 {links.map((link) => {
 const active = pathname === link.href;
 return (
 <LocalizedLink
 key={link.href}
 href={link.href}
 className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
 active
 ? "bg-primary/10 text-primary"
 : "text-muted hover:text-foreground hover:bg-surface-hover"
 }`}
 >
 {link.label}
 </LocalizedLink>
 );
 })}
 </div>

 {/* Actions */}
 <div className="flex items-center gap-2">
 <LocalizedLink
 href={contactWithTrialSubject}
 className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple text-white text-sm font-semibold shadow-[0_4px_14px_rgba(139,123,200,0.40)] hover:shadow-[0_6px_20px_rgba(139,123,200,0.55)] hover:scale-[1.03] hover:brightness-110 transition-all duration-200 md:me-5"
 >
 {t("bookDemo")}
 </LocalizedLink>

 <div className="hidden md:block">
 <LangToggle locale={locale} switchHref={switchHref} />
 </div>

 <button
 onClick={toggleTheme}
 className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
 aria-label={theme === "dark" ? t("lightMode") : t("darkMode")}
 >
 <AnimatePresence mode="wait" initial={false}>
 <motion.div
 key={theme}
 initial={{ rotate: -90, opacity: 0 }}
 animate={{ rotate: 0, opacity: 1 }}
 exit={{ rotate: 90, opacity: 0 }}
 transition={{ duration: 0.2 }}
 >
 {theme === "dark" ? (
 <Sun className="w-5 h-5" />
 ) : (
 <Moon className="w-5 h-5" />
 )}
 </motion.div>
 </AnimatePresence>
 </button>

 {/* Mobile toggle */}
 <button
 onClick={() => setMobileOpen(!mobileOpen)}
 className="md:hidden p-2 rounded-xl text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
 aria-label={t("menu")}
 >
 {mobileOpen ? (
 <X className="w-5 h-5" />
 ) : (
 <Menu className="w-5 h-5" />
 )}
 </button>
 </div>
 </div>

 {/* Mobile menu */}
 <AnimatePresence>
 {mobileOpen && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="md:hidden overflow-hidden"
 >
 <div className="pb-4 space-y-1">
 {links.map((link) => {
 const active = pathname === link.href;
 return (
 <LocalizedLink
 key={link.href}
 href={link.href}
 className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
 active
 ? "text-primary bg-primary/10"
 : "text-muted hover:text-foreground hover:bg-surface-hover"
 }`}
 >
 {link.label}
 </LocalizedLink>
 );
 })}
 <div className={`flex px-4 py-1 ${locale === "ar" ? "justify-start" : "justify-end"}`}>
 <LangToggle locale={locale} switchHref={switchHref} />
 </div>
 <LocalizedLink
 href={contactWithTrialSubject}
 className="block mx-4 mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-purple text-white text-sm font-semibold text-center shadow-[0_4px_14px_rgba(139,123,200,0.40)]"
 >
 {t("bookDemo")}
 </LocalizedLink>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </nav>
 </header>
 );
}

// ─── Language toggle pill ────────────────────────────────────────────────────
function LangToggle({
 locale,
 switchHref,
}: {
 locale: string;
 switchHref: string;
}) {
 const isAr = locale === "ar";

 return (
 <a
 href={switchHref}
 dir="ltr"
 aria-label={isAr ? "Switch to English" : "Switch to Arabic"}
 style={{ fontFamily: "var(--font-nunito), var(--font-geist-sans), sans-serif" }}
 className="relative flex items-center h-9 rounded-full p-[3px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80
 shadow-[0_2px_10px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.25),0_1px_3px_rgba(0,0,0,0.15)]
 hover:shadow-[0_4px_18px_rgba(167,139,250,0.25),0_2px_6px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_4px_18px_rgba(167,139,250,0.30),0_2px_6px_rgba(0,0,0,0.20)]
 hover:border-primary/50 transition-all duration-300 select-none no-underline"
 >
 {/* sliding highlight */}
 <motion.span
 layout
 transition={{ type: "spring", stiffness: 500, damping: 35 }}
 className={`absolute inset-y-[3px] w-[calc(50%-3px)] rounded-full
 bg-gradient-to-br from-primary to-primary/80
 shadow-[0_2px_8px_rgba(108,92,231,0.45)]
 ${isAr ? "left-[calc(50%+0px)]" : "left-[3px]"}`}
 />

 {/* EN */}
 <span className={`relative z-10 flex items-center justify-center gap-[5px] w-14 h-full text-[11.5px] font-extrabold tracking-wide transition-colors duration-200 ${!isAr ? "text-white drop-shadow-sm" : "text-slate-500 dark:text-slate-400"}`}>
 <span className="leading-none text-[13px]">🇬🇧</span>
 <span>EN</span>
 </span>

 {/* AR */}
 <span className={`relative z-10 flex items-center justify-center gap-[5px] w-14 h-full text-[11.5px] font-extrabold tracking-wide transition-colors duration-200 ${isAr ? "text-white drop-shadow-sm" : "text-slate-500 dark:text-slate-400"}`}>
 <span>AR</span>
 <span className="leading-none text-[13px]">🇦🇪</span>
 </span>
 </a>
 );
}
