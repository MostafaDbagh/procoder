"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import { sendContactMessage } from "@/lib/api";
import { Mail, Phone, CheckCircle2, LayoutDashboard, GraduationCap, Shield } from "lucide-react";
import { emailError, isValidEmail } from "@/lib/validation";

export function Footer() {
 const t = useTranslations("footer");
 const nav = useTranslations("nav");
 const cats = useTranslations("categories");
 const locale = useLocale();
 const lang: "en" | "ar" = locale === "ar" ? "ar" : "en";
 const [email, setEmail] = useState("");
 const [emailErr, setEmailErr] = useState("");
 const [subLoading, setSubLoading] = useState(false);
 const [subDone, setSubDone] = useState(false);

 const handleSubscribe = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email || subLoading) return;
  if (!isValidEmail(email)) {
   setEmailErr(emailError(email, lang));
   return;
  }
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
   setEmailErr(lang === "ar" ? "تعذر إرسال الطلب. حاول مرة أخرى." : "Your request could not be sent. Please try again.");
  } finally {
   setSubLoading(false);
  }
 };

 return (
 <footer className="site-footer border-t border-border bg-surface text-foreground [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-4 [&_a]:focus-visible:outline-primary">
 <div className="max-w-7xl mx-auto px-5 py-10 sm:px-8 sm:py-14 lg:px-8">
 <div className="grid grid-cols-1 min-[400px]:grid-cols-2 items-start gap-x-6 gap-y-10 md:gap-x-10 lg:grid-cols-[1.2fr_1fr_1fr_1.3fr]">

 {/* Brand */}
 <div className="col-span-full md:col-span-1 lg:col-span-1">
 <div className="mb-3">
 <Image src="/logo.png" alt="StemTechLab" width={120} height={71} className="object-contain" />
 </div>
 <p className="mb-5 max-w-sm text-base leading-7 text-muted">
 {t("description").split("\n").map((line) => (
 <span key={line} className="block text-balance">{line}</span>
 ))}
 </p>
 <div className="flex items-center gap-3">
  <a aria-label="Facebook" href="https://www.facebook.com/share/1D3FrzK2N9/" target="_blank" rel="noopener noreferrer"
   className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
   style={{ background: "#1877F2" }}>
   <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
   </svg>
  </a>
  <a aria-label="Instagram" href="https://www.instagram.com/stemtechlab" target="_blank" rel="noopener noreferrer"
   className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
   style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
   <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5"/>
   </svg>
  </a>
  <a aria-label="LinkedIn" href="https://www.linkedin.com/company/stem-tech-lab/" target="_blank" rel="noopener noreferrer"
   className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
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
 <h3 className="font-semibold mb-4 text-lg">
 {t("quickLinks")}
 </h3>
 <ul className="space-y-1">
 <li><LocalizedLink href="/uae" className="inline-flex min-h-11 items-center py-2 text-base leading-relaxed text-muted hover:text-primary transition-colors">{lang === "ar" ? "دورات أونلاين في الإمارات" : "Online classes in the UAE"}</LocalizedLink></li>
 <li><LocalizedLink href="/courses" className="inline-flex min-h-11 items-center py-2 text-base leading-relaxed text-muted hover:text-primary transition-colors">{nav("courses")}</LocalizedLink></li>
 <li><LocalizedLink href="/recommend" className="inline-flex min-h-11 items-center py-2 text-base leading-relaxed text-muted hover:text-primary transition-colors">{nav("recommend")}</LocalizedLink></li>
 <li><LocalizedLink href="/free-trial" className="inline-flex min-h-11 items-center py-2 text-base leading-relaxed text-muted hover:text-primary transition-colors">{nav("freeTrial")}</LocalizedLink></li>
 <li><LocalizedLink href="/challenge" className="inline-flex min-h-11 items-center py-2 text-base leading-relaxed text-muted hover:text-primary transition-colors">{nav("challenge")}</LocalizedLink></li>
 <li><LocalizedLink href="/blogs" className="inline-flex min-h-11 items-center py-2 text-base leading-relaxed text-muted hover:text-primary transition-colors">{nav("blog")}</LocalizedLink></li>
 <li><LocalizedLink href="/about" className="inline-flex min-h-11 items-center py-2 text-base leading-relaxed text-muted hover:text-primary transition-colors">{lang === "ar" ? "من نحن" : "About us"}</LocalizedLink></li>
 <li><LocalizedLink href="/careers" className="inline-flex min-h-11 items-center py-2 text-base leading-relaxed text-muted hover:text-primary transition-colors">{lang === "ar" ? "الوظائف" : "Careers"}</LocalizedLink></li>
 <li><LocalizedLink href="/faq" className="inline-flex min-h-11 items-center py-2 text-base leading-relaxed text-muted hover:text-primary transition-colors">{nav("faq")}</LocalizedLink></li>
 </ul>
 </div>

 {/* Categories */}
 <div>
 <h3 className="font-semibold mb-4 text-lg">
 {t("categories")}
 </h3>
 <ul className="space-y-1">
 <li><LocalizedLink href="/courses?category=programming" className="inline-flex min-h-11 items-center py-2 text-base leading-relaxed text-muted hover:text-primary transition-colors">{cats("programming")}</LocalizedLink></li>
 <li><LocalizedLink href="/courses?category=robotics" className="inline-flex min-h-11 items-center py-2 text-base leading-relaxed text-muted hover:text-primary transition-colors">{cats("robotics")}</LocalizedLink></li>
 <li><LocalizedLink href="/courses?category=algorithms" className="inline-flex min-h-11 items-center py-2 text-base leading-relaxed text-muted hover:text-primary transition-colors">{cats("algorithms")}</LocalizedLink></li>
 <li><LocalizedLink href="/courses?category=artificial-intelligence" className="inline-flex min-h-11 items-center py-2 text-base leading-relaxed text-muted hover:text-primary transition-colors">{cats("artificial-intelligence")}</LocalizedLink></li>
 <li><LocalizedLink href="/courses?category=mobile-app-development" className="inline-flex min-h-11 items-center py-2 text-base leading-relaxed text-muted hover:text-primary transition-colors">{cats("mobile-development")}</LocalizedLink></li>
 <li><LocalizedLink href="/courses?category=web-development" className="inline-flex min-h-11 items-center py-2 text-base leading-relaxed text-muted hover:text-primary transition-colors">{cats("web-development")}</LocalizedLink></li>
 </ul>
 </div>

 {/* Reach Out */}
 <div className="col-span-full min-w-0 md:col-span-1">
 <div className="rounded-2xl bg-primary/5 p-5 text-center md:text-start">
 <h3 className="mb-2 text-lg font-bold">
 {t("stayUpdated")}
 </h3>
 <p className="text-base text-muted leading-7 mb-4">
 {t("stayUpdatedSubtitle")}
 </p>
 {subDone ? (
  <div role="status" className="flex items-center gap-2 text-emerald-500 text-base font-medium mb-6">
   <CheckCircle2 className="w-4 h-4" />
   {t("subscribeSuccess")}
  </div>
 ) : (
 <form onSubmit={handleSubscribe} dir={lang === "ar" ? "rtl" : "ltr"} className="text-start">
   <label htmlFor="footer-email" className="sr-only">{t("emailPlaceholder")}</label>
   <div className={`flex flex-col items-stretch gap-2 rounded-xl border bg-surface p-1 sm:flex-row sm:items-center sm:gap-1 focus-within:ring-2 focus-within:ring-primary/20 ${emailErr ? "border-red-500" : "border-border focus-within:border-primary"}`}>
   <input
    id="footer-email"
    name="email"
    autoComplete="email"
    dir="ltr"
    aria-describedby={emailErr ? "footer-email-error" : undefined}
    type="email"
    required
    value={email}
    onChange={(e) => { setEmail(e.target.value); if (emailErr) setEmailErr(""); }}
    onBlur={(e) => setEmailErr(emailError(e.target.value, lang))}
    placeholder={t("emailPlaceholder")}
    aria-invalid={!!emailErr}
    className={`w-full min-w-0 flex-1 bg-transparent sm:w-auto px-3 py-3 text-base text-foreground placeholder:text-muted focus:outline-none text-left ${lang === "ar" ? "placeholder:text-right placeholder:[direction:rtl] placeholder-shown:text-right" : "placeholder:text-left"}`}
   />
   <button
    type="submit"
    disabled={subLoading}
    className="shrink-0 inline-flex min-h-11 items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white text-base font-semibold hover:bg-primary-hover transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
   >
    <span>{subLoading ? "..." : t("subscribe")}</span>
   </button>
   </div>
   {emailErr && <p id="footer-email-error" role="alert" className="mt-2 text-sm text-red-500">{emailErr}</p>}
  </form>
 )}

 </div>
 <div className="mt-6 text-center md:text-start">
 <h3 className="mb-3 text-lg font-bold">{t("contactUs")}</h3>
 <ul className="mx-auto flex w-fit max-w-full flex-col gap-1 md:mx-0">
  <li>
   <a href={`tel:${t("phone").replace(/\s/g, "")}`} className="flex min-h-11 items-center gap-3 text-base text-foreground hover:text-primary transition-colors group">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center text-primary">
     <Phone className="w-4 h-4" aria-hidden />
    </span>
    <span dir="ltr" className="text-start">{t("phone")}</span>
   </a>
  </li>
  <li>
   <a href={`mailto:${t("email")}`} className="flex min-h-11 items-center gap-3 text-base text-foreground hover:text-primary transition-colors group break-all">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center text-primary">
     <Mail className="w-4 h-4" aria-hidden />
    </span>
    <span dir="ltr">{t("email")}</span>
   </a>
  </li>
 </ul>
 </div>
 </div>

 </div>

 <nav aria-label={t("memberAccess")} className="mt-8 border-t border-border pt-6 sm:mt-10">
 <div className="mx-auto max-w-lg text-center">
 <h3 className="mb-4 text-lg font-bold">{t("memberAccess")}</h3>
 <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3">
 <LocalizedLink href="/parent/login" className="flex min-h-16 flex-col items-center justify-center gap-2 rounded-xl border border-border px-3 py-4 text-base font-medium transition-colors hover:border-primary/40 hover:bg-primary/5 sm:flex-row">
 <LayoutDashboard className="h-5 w-5 shrink-0 text-primary" aria-hidden />{t("parentDashboardLink")}
 </LocalizedLink>
 <LocalizedLink href="/instructor/login" className="flex min-h-16 flex-col items-center justify-center gap-2 rounded-xl border border-border px-3 py-4 text-base font-medium transition-colors hover:border-primary/40 hover:bg-primary/5 sm:flex-row">
 <GraduationCap className="h-5 w-5 shrink-0 text-primary" aria-hidden />{t("instructorPortalLink")}
 </LocalizedLink>
 </div>
 <Link href="/admin/login" className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 text-sm text-muted transition-colors hover:text-primary">
 <Shield className="h-3.5 w-3.5" aria-hidden />{t("adminLoginLink")}
 </Link>
 </div>
 </nav>

 <div className="mt-6 pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 sm:mt-8 sm:pt-6 sm:gap-4">
 <p className="text-center text-sm leading-relaxed text-muted sm:text-start">
 &copy; {new Date().getFullYear()} StemTechLab. {t("rights")}
 </p>
 <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
 <li><LocalizedLink href="/privacy" className="text-base text-muted hover:text-primary transition-colors">{t("privacy")}</LocalizedLink></li>
 <li><LocalizedLink href="/terms" className="text-base text-muted hover:text-primary transition-colors">{t("terms")}</LocalizedLink></li>
 </ul>
 </div>
 </div>
 </footer>
 );
}
