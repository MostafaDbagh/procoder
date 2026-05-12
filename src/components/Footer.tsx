"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import { sendContactMessage } from "@/lib/api";
import { Mail, Phone, ArrowRight, Rocket, CheckCircle2, LayoutDashboard, GraduationCap, Shield } from "lucide-react";

export function Footer() {
 const t = useTranslations("footer");
 const nav = useTranslations("nav");
 const cats = useTranslations("categories");
 const [email, setEmail] = useState("");
 const [subLoading, setSubLoading] = useState(false);
 const [subDone, setSubDone] = useState(false);

 const handleSubscribe = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email || subLoading) return;
  setSubLoading(true);
  try {
   await sendContactMessage({
    name: "Newsletter",
    email,
    phone: "",
    subject: "Newsletter Subscription",
    message: `Newsletter signup: ${email}`,
   } as never);
   setSubDone(true);
  } catch {
   setSubDone(true);
  } finally {
   setSubLoading(false);
  }
 };

 return (
 <footer className="relative backdrop-blur-2xl bg-surface/60 dark:bg-surface/45 border-t border-white/40 dark:border-white/10 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.3)]">
 <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
 {/* Brand */}
 <div>
 <div className="mb-4">
 <Image src="/logo.png" alt="StemTechLab" width={100} height={59} className="object-contain" />
 </div>
 <p className="text-muted text-sm leading-relaxed mb-5 max-w-[290px]">
 {t("description")}
 </p>
 <div className="flex items-center gap-3">
  <a href="https://www.facebook.com/share/1D3FrzK2N9/" target="_blank" rel="noopener noreferrer"
   className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
   style={{ background: "#1877F2" }}>
   <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
   </svg>
  </a>
  <a href="https://www.instagram.com/stemtechlab" target="_blank" rel="noopener noreferrer"
   className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
   style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
   <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5"/>
   </svg>
  </a>
  <a href="https://www.linkedin.com/company/stem-tech-lab/" target="_blank" rel="noopener noreferrer"
   className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
   style={{ background: "#0A66C2" }}>
   <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
   </svg>
  </a>
 </div>
 </div>

 {/* Quick Links */}
 <div>
 <h3 className="font-bold mb-4 flex items-center gap-2">
 <span className="w-2.5 h-2.5 rounded-full bg-primary" />
 {t("quickLinks")}
 </h3>
 <ul className="space-y-2.5">
 <li><LocalizedLink href="/courses" className="text-sm text-muted hover:text-primary transition-colors">{nav("courses")}</LocalizedLink></li>
 <li><LocalizedLink href="/recommend" className="text-sm text-muted hover:text-primary transition-colors">{nav("recommend")}</LocalizedLink></li>
 <li><LocalizedLink href="/free-trial" className="text-sm text-muted hover:text-primary transition-colors">{nav("freeTrial")}</LocalizedLink></li>
 <li><LocalizedLink href="/challenge" className="text-sm text-muted hover:text-primary transition-colors">{nav("challenge")}</LocalizedLink></li>
 <li><LocalizedLink href="/blogs" className="text-sm text-muted hover:text-primary transition-colors">{nav("blog")}</LocalizedLink></li>
 <li><LocalizedLink href="/faq" className="text-sm text-muted hover:text-primary transition-colors">{nav("faq")}</LocalizedLink></li>
 </ul>
 </div>

 {/* Categories */}
 <div>
 <h3 className="font-bold mb-4 flex items-center gap-2">
 <span className="w-2.5 h-2.5 rounded-full bg-pink" />
 {t("categories")}
 </h3>
 <ul className="space-y-2.5">
 <li><LocalizedLink href="/courses?category=programming" className="text-sm text-muted hover:text-primary transition-colors">{cats("programming")}</LocalizedLink></li>
 <li><LocalizedLink href="/courses?category=robotics" className="text-sm text-muted hover:text-primary transition-colors">{cats("robotics")}</LocalizedLink></li>
 <li><LocalizedLink href="/courses?category=algorithms" className="text-sm text-muted hover:text-primary transition-colors">{cats("algorithms")}</LocalizedLink></li>
 <li><LocalizedLink href="/courses?category=arabic" className="text-sm text-muted hover:text-primary transition-colors">{cats("arabic")}</LocalizedLink></li>
 <li><LocalizedLink href="/courses?category=artificial-intelligence" className="text-sm text-muted hover:text-primary transition-colors">{cats("artificial-intelligence")}</LocalizedLink></li>
 <li><LocalizedLink href="/courses?category=mobile-development" className="text-sm text-muted hover:text-primary transition-colors">{cats("mobile-development")}</LocalizedLink></li>
 <li><LocalizedLink href="/courses?category=web-development" className="text-sm text-muted hover:text-primary transition-colors">{cats("web-development")}</LocalizedLink></li>
 </ul>
 </div>

 {/* Reach Out */}
 <div>
 <h3 className="font-bold mb-3 flex items-center gap-2">
 <Rocket className="w-5 h-5 text-primary" aria-hidden />
 {t("stayUpdated")}
 </h3>
 <p className="text-sm text-muted leading-relaxed mb-4">
 {t("stayUpdatedSubtitle")}
 </p>
 {subDone ? (
  <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium mb-6">
   <CheckCircle2 className="w-4 h-4" />
   {t("subscribeSuccess")}
  </div>
 ) : (
  <form onSubmit={handleSubscribe} className="space-y-3 mb-6">
   <input
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder={t("emailPlaceholder")}
    className="w-full px-5 py-3 rounded-full bg-background border border-border text-sm text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
   />
   <button
    type="submit"
    disabled={subLoading}
    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary-hover hover:shadow-xl transition-all disabled:opacity-60"
   >
    <span>{subLoading ? "..." : t("subscribe")}</span>
    <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden />
   </button>
  </form>
 )}

 <h3 className="font-bold mb-4">{t("contactUs")}</h3>
 <ul className="space-y-3">
  <li>
   <a href={`tel:${t("phone").replace(/\s/g, "")}`} className="flex items-center gap-3 text-sm text-muted hover:text-primary transition-colors group">
    <span className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover:bg-primary/15">
     <Phone className="w-4 h-4" aria-hidden />
    </span>
    <span dir="ltr" className="text-start">{t("phone")}</span>
   </a>
  </li>
  <li>
   <a href={`mailto:${t("email")}`} className="flex items-center gap-3 text-sm text-muted hover:text-primary transition-colors group break-all">
    <span className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover:bg-primary/15">
     <Mail className="w-4 h-4" aria-hidden />
    </span>
    <span>{t("email")}</span>
   </a>
  </li>
 </ul>
 </div>

 </div>

 <div className="mt-10 pt-8 border-t border-border">
 <div className="rounded-2xl border border-border bg-background/60 dark:bg-background/30 px-4 py-6 sm:px-8 sm:py-7">
 <p className="text-center text-[0.7rem] sm:text-xs font-semibold uppercase tracking-[0.12em] text-muted mb-5">
 {t("memberAccess")}
 </p>
 <nav
 className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3"
 aria-label={t("memberAccess")}
 >
 <LocalizedLink
 href="/parent/login"
 className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/45 hover:bg-primary/[0.06] hover:text-primary hover:shadow-md dark:hover:bg-primary/10 text-start"
 >
 <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
 <LayoutDashboard className="h-4 w-4" aria-hidden />
 </span>
 <span>{t("parentDashboardLink")}</span>
 </LocalizedLink>
 <LocalizedLink
 href="/instructor/login"
 className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:border-purple/45 hover:bg-purple/[0.06] hover:text-purple hover:shadow-md dark:hover:bg-purple/10 text-start"
 >
 <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple/10 text-purple transition-colors group-hover:bg-purple/15">
 <GraduationCap className="h-4 w-4" aria-hidden />
 </span>
 <span>{t("instructorPortalLink")}</span>
 </LocalizedLink>
 <Link
 href="/admin/login"
 className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:border-muted hover:bg-surface-hover hover:text-foreground hover:shadow-md"
 >
 <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/15 text-muted transition-colors group-hover:bg-muted/25 group-hover:text-foreground">
 <Shield className="h-4 w-4" aria-hidden />
 </span>
 <span className="text-start">{t("adminLoginLink")}</span>
 </Link>
 </nav>
 </div>
 </div>

 <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
 <p className="text-sm text-muted">
 &copy; {new Date().getFullYear()} StemTechLab. {t("rights")}
 </p>
 <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
 <li><LocalizedLink href="/privacy" className="text-sm text-muted hover:text-primary transition-colors">{t("privacy")}</LocalizedLink></li>
 <li><LocalizedLink href="/terms" className="text-sm text-muted hover:text-primary transition-colors">{t("terms")}</LocalizedLink></li>
 </ul>
 </div>
 </div>
 </footer>
 );
}
