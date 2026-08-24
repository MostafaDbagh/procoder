"use client";

import { useState, useEffect, useMemo, useRef, startTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { LocalizedLink } from "@/components/LocalizedLink";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";

/** Minimal shape the header needs — supplied by the server layout. */
export interface NavCourse {
 slug: string;
 title: { en: string; ar: string };
}

export function Navbar({ courses = [] }: { courses?: NavCourse[] }) {
 const t = useTranslations("nav");
 const locale = useLocale();
 const pathname = usePathname();
 const { theme, toggleTheme } = useTheme();
 const [mobileOpen, setMobileOpen] = useState(false);
 const [coursesOpen, setCoursesOpen] = useState(false);
 const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
 const coursesRef = useRef<HTMLDivElement | null>(null);
 const lang = locale === "ar" ? "ar" : "en";
 const inCourses = pathname === "/courses" || pathname.startsWith("/courses/") || pathname === "/recommend";

 useEffect(() => {
 startTransition(() => {
 setMobileOpen(false);
 setCoursesOpen(false);
 setMobileCoursesOpen(false);
 });
 }, [pathname, locale]);

 // Close the dropdown on Escape or a click outside it.
 useEffect(() => {
 if (!coursesOpen) return;
 const onKey = (e: KeyboardEvent) => {
 if (e.key === "Escape") setCoursesOpen(false);
 };
 const onDown = (e: MouseEvent) => {
 if (!coursesRef.current?.contains(e.target as Node)) setCoursesOpen(false);
 };
 document.addEventListener("keydown", onKey);
 document.addEventListener("mousedown", onDown);
 return () => {
 document.removeEventListener("keydown", onKey);
 document.removeEventListener("mousedown", onDown);
 };
 }, [coursesOpen]);

 // The Courses dropdown is rendered between these two groups, so it keeps its
 // original position in the bar.
 const linksBefore = useMemo(() => [
 { href: "/", label: t("home"), wideOnly: false },
 { href: "/learning-path", label: t("learningPath"), wideOnly: false },
 ], [t]);
 const linksAfter = useMemo(() => [
 { href: "/free-trial", label: t("freeTrial"), wideOnly: false },
 { href: "/parents", label: t("parents"), wideOnly: false },
 { href: "/contact", label: t("contact"), wideOnly: true },
 ], [t]);
 const links = useMemo(() => [...linksBefore, ...linksAfter], [linksBefore, linksAfter]);

 // localePrefix:"always" — swap /en ↔ /ar prefix directly
 // usePathname() returns path WITHOUT locale prefix (e.g. "/courses")
 const switchHref = locale === "en"
 ? `/ar${pathname === "/" ? "" : pathname}` || "/ar"
 : `/en${pathname === "/" ? "" : pathname}` || "/en";

 return (
 <header className="sticky top-0 z-50 backdrop-blur-2xl bg-surface/60 dark:bg-surface/45 border-b border-white/40 dark:border-white/10 shadow-sm dark:shadow-black/30">
 <nav className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex items-center justify-between h-16">
 {/* Logo */}
 <LocalizedLink href="/" className="flex items-center group">
 <Image src="/logo.png" alt="StemTechLab" width={92} height={54} priority className="object-contain" />
 </LocalizedLink>

 {/* Desktop nav */}
 <div className="hidden md:flex items-center gap-1">
 {linksBefore.map((link) => {
 const active = pathname === link.href;
 return (
 <LocalizedLink
 key={link.href}
 href={link.href}
 className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
 link.wideOnly ? "hidden min-[1350px]:inline-flex" : ""
 } ${
 active
 ? "bg-primary/15 text-primary"
 : "text-muted hover:text-foreground hover:bg-surface-hover"
 }`}
 >
 {link.label}
 {active && (
 <motion.span
 layoutId="nav-active-dot"
 className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"
 transition={{ type: "spring", stiffness: 500, damping: 35 }}
 />
 )}
 </LocalizedLink>
 );
 })}

 {/* Courses dropdown: the catalogue plus the course finder. Opens on
 hover for pointer users and on click/Enter for keyboard users. */}
 <div
 ref={coursesRef}
 className="relative"
 onMouseEnter={() => setCoursesOpen(true)}
 onMouseLeave={() => setCoursesOpen(false)}
 >
 <button
 type="button"
 aria-expanded={coursesOpen}
 aria-haspopup="true"
 aria-controls="nav-courses-menu"
 onClick={() => setCoursesOpen((v) => !v)}
 className={`relative inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
 inCourses
 ? "bg-primary/15 text-primary"
 : "text-muted hover:text-foreground hover:bg-surface-hover"
 }`}
 >
 {t("courses")}
 <ChevronDown
 className={`h-4 w-4 transition-transform duration-200 ${coursesOpen ? "rotate-180" : ""}`}
 aria-hidden
 />
 </button>

 <div
 id="nav-courses-menu"
 className={`absolute start-0 top-full z-50 mt-2 w-[34rem] rounded-2xl border border-border bg-surface p-3 shadow-xl shadow-black/10 transition-all duration-150 ${
 coursesOpen
 ? "visible translate-y-0 opacity-100"
 : "invisible -translate-y-1 opacity-0"
 }`}
 >
 {courses.length > 0 && (
 <>
 <p className="px-3 pb-1 pt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
 {t("browseCourses")}
 </p>
 <ul className="grid grid-cols-2 gap-0.5">
 {courses.map((c) => (
 <li key={c.slug}>
 <LocalizedLink
 href={`/courses/${c.slug}`}
 className="block rounded-xl px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
 >
 {c.title?.[lang] ?? c.slug}
 </LocalizedLink>
 </li>
 ))}
 </ul>
 <div className="my-2 border-t border-border" />
 </>
 )}
 <div className="grid grid-cols-2 gap-0.5">
 <LocalizedLink
 href="/courses"
 className="block rounded-xl px-3 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
 >
 {t("allCourses")}
 </LocalizedLink>
 <LocalizedLink
 href="/recommend"
 className="block rounded-xl px-3 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
 >
 {t("recommend")}
 </LocalizedLink>
 </div>
 </div>
 </div>

 {linksAfter.map((link) => {
 const active = pathname === link.href;
 return (
 <LocalizedLink
 key={link.href}
 href={link.href}
 className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
 link.wideOnly ? "hidden min-[1350px]:inline-flex" : ""
 } ${
 active
 ? "bg-primary/15 text-primary"
 : "text-muted hover:text-foreground hover:bg-surface-hover"
 }`}
 >
 {link.label}
 {active && (
 <motion.span
 layoutId="nav-active-dot"
 className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"
 transition={{ type: "spring", stiffness: 500, damping: 35 }}
 />
 )}
 </LocalizedLink>
 );
 })}
 </div>

 {/* Actions */}
 <div className="flex items-center gap-2">
 <LocalizedLink
 href="/free-trial"
 className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-purple text-white text-sm font-bold shadow-[0_4px_14px_rgba(139,123,200,0.40)] hover:shadow-[0_6px_20px_rgba(139,123,200,0.55)] hover:scale-[1.03] hover:brightness-110 transition-all duration-200 md:me-5"
 >
 {t("bookDemo")}
 </LocalizedLink>

 <div className="hidden md:block">
 <LangToggle locale={locale} switchHref={switchHref} />
 </div>

{/* TODO: re-enable when dark mode is ready for prod */}
<button
 onClick={toggleTheme}
className="hidden p-2 rounded-full text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
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
 className="md:hidden p-2 rounded-full text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
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
 className={`block px-4 py-3 rounded-full text-sm font-semibold transition-colors ${
 active
 ? "text-primary bg-primary/15"
 : "text-muted hover:text-foreground hover:bg-surface-hover"
 }`}
 >
 {link.label}
 </LocalizedLink>
 );
 })}

 {/* Courses section — expandable, since touch has no hover. */}
 <button
 type="button"
 aria-expanded={mobileCoursesOpen}
 aria-controls="nav-courses-mobile"
 onClick={() => setMobileCoursesOpen((v) => !v)}
 className={`flex w-full items-center justify-between px-4 py-3 rounded-full text-sm font-semibold transition-colors ${
 inCourses
 ? "text-primary bg-primary/15"
 : "text-muted hover:text-foreground hover:bg-surface-hover"
 }`}
 >
 {t("courses")}
 <ChevronDown
 className={`h-4 w-4 transition-transform duration-200 ${mobileCoursesOpen ? "rotate-180" : ""}`}
 aria-hidden
 />
 </button>

 <AnimatePresence initial={false}>
 {mobileCoursesOpen && (
 <motion.div
 id="nav-courses-mobile"
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="overflow-hidden"
 >
 <div className="ms-3 space-y-0.5 border-s border-border ps-3">
 {courses.map((c) => (
 <LocalizedLink
 key={c.slug}
 href={`/courses/${c.slug}`}
 className="block rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
 >
 {c.title?.[lang] ?? c.slug}
 </LocalizedLink>
 ))}
 <LocalizedLink
 href="/courses"
 className="block rounded-xl px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
 >
 {t("allCourses")}
 </LocalizedLink>
 <LocalizedLink
 href="/recommend"
 className="block rounded-xl px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
 >
 {t("recommend")}
 </LocalizedLink>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

<div className="mx-4 mt-1 flex gap-2">
 {/* TODO: re-enable when dark mode is ready for prod */}
 <button
  onClick={toggleTheme}
  className="hidden flex-1 items-center justify-center h-12 rounded-xl border border-border text-foreground bg-surface hover:bg-surface-hover transition-colors"
  aria-label={theme === "dark" ? t("lightMode") : t("darkMode")}
 >
  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
 </button>
 <a
  href={switchHref}
  dir="ltr"
  className="flex flex-1 items-center justify-center gap-2 h-12 rounded-xl border border-border text-sm font-semibold text-foreground bg-surface hover:bg-surface-hover transition-colors"
 >
  {locale === "ar" ? (
   <><span className="text-base">🇬🇧</span><span>EN</span></>
  ) : (
   <><span className="text-base">🇦🇪</span><span>AR</span></>
  )}
 </a>
</div>
 <LocalizedLink
 href="/free-trial"
 className="block mx-4 mt-2 px-4 py-3 rounded-full bg-gradient-to-r from-primary to-purple text-white text-sm font-bold text-center shadow-[0_4px_14px_rgba(139,123,200,0.40)]"
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
mobile = false,
}: {
 locale: string;
 switchHref: string;
mobile?: boolean;
}) {
 const isAr = locale === "ar";

 return (
 <a
 href={switchHref}
 dir="ltr"
 aria-label={isAr ? "Switch to English" : "Switch to Arabic"}
 style={{ fontFamily: "var(--font-nunito), var(--font-geist-sans), sans-serif" }}
className={`relative flex items-center rounded-full p-[3px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80
 shadow-[0_2px_10px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.25),0_1px_3px_rgba(0,0,0,0.15)]
 hover:shadow-[0_4px_18px_rgba(167,139,250,0.25),0_2px_6px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_4px_18px_rgba(167,139,250,0.30),0_2px_6px_rgba(0,0,0,0.20)]
hover:border-primary/50 transition-all duration-300 select-none no-underline ${
mobile ? "h-8 w-full" : "h-9"
}`}
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
<span className={`relative z-10 flex items-center justify-center gap-[5px] ${mobile ? "w-[44px]" : "w-14"} h-full text-[11.5px] font-extrabold tracking-wide transition-colors duration-200 ${!isAr ? "text-white drop-shadow-sm" : "text-slate-500 dark:text-slate-400"}`}>
 <span className="leading-none text-[13px]">🇬🇧</span>
 <span>EN</span>
 </span>

 {/* AR */}
<span className={`relative z-10 flex items-center justify-center gap-[5px] ${mobile ? "w-[44px]" : "w-14"} h-full text-[11.5px] font-extrabold tracking-wide transition-colors duration-200 ${isAr ? "text-white drop-shadow-sm" : "text-slate-500 dark:text-slate-400"}`}>
 <span>AR</span>
 <span className="leading-none text-[13px]">🇦🇪</span>
 </span>
 </a>
 );
}
