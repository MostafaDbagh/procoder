"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { LocalizedLink } from "@/components/LocalizedLink";
import { motion } from "framer-motion";
import { KidArrowRightIcon } from "@/components/icons/KidIcons";

function TargetArrowIcon({ className = "" }: { className?: string }) {
 return (
 <svg
 viewBox="0 0 260 260"
 fill="currentColor"
 className={className}
 aria-hidden
 >
 <path d="M218,94h3.023C228.057,108.874,232,125.484,232,143c0,63.411-51.589,115-115,115S2,206.411,2,143S53.589,28,117,28 c17.516,0,34.126,3.943,49,10.977V42v9.574l-7.979,7.979C145.64,53.441,131.715,50,117,50c-51.28,0-93,41.72-93,93s41.72,93,93,93 s93-41.72,93-93c0-14.716-3.441-28.641-9.552-41.022L208.426,94H218z M164,143c0,25.916-21.084,47-47,47s-47-21.084-47-47 s21.084-47,47-47c1.472,0,2.926,0.077,4.363,0.21l18.351-18.351C132.596,75.37,124.957,74,117,74c-38.047,0-69,30.953-69,69 s30.953,69,69,69s69-30.953,69-69c0-7.957-1.37-15.596-3.859-22.714l-18.35,18.35C163.923,140.074,164,141.528,164,143z M218,74 l40-40h-32V2l-40,40v17.857l-61.425,61.425c-2.373-0.828-4.92-1.283-7.575-1.283c-12.703,0-23,10.297-23,23 c0,12.703,10.297,23,23,23c12.703,0,23-10.297,23-23c0-2.655-0.455-5.202-1.283-7.575L200.143,74H218z" />
 </svg>
 );
}
export function Hero() {
 const t = useTranslations("hero");

 return (
 <section className="relative py-16 sm:py-0  min-h-[100vh] sm:min-h-[640px] md:min-h-[720px] lg:min-h-[820px] xl:min-h-[920px] flex items-center sm:block">
 {/* Mobile-only decorative bg — soft lavender wash + floating glows + tiny tech glyphs, echoing the desktop poster's vibe */}
 <div className="sm:hidden absolute inset-0 -z-10">
 <div className="absolute inset-0 bg-gradient-to-br from-purple/10 via-primary/5 to-background" />
 <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-purple/20 blur-3xl" />
 <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-primary/15 blur-3xl" />
 <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-pink/10 blur-3xl" />

 {/* Subtle dot grid */}
 <div
 className="absolute inset-0 opacity-[0.18]"
 style={{
 backgroundImage:
 "radial-gradient(circle, rgba(124,58,237,0.4) 1px, transparent 1px)",
 backgroundSize: "22px 22px",
 }}
 />

 {/* Floating glyphs */}
 <svg className="absolute top-8 right-8 w-10 h-10 text-purple/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
 <path strokeLinecap="round" strokeLinejoin="round" d="M8 10l-4 4 4 4M16 10l4 4-4 4M14 4l-4 16" />
 </svg>
 <svg className="absolute bottom-12 right-10 w-9 h-9 text-primary/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
 <rect x="4" y="4" width="6" height="6" rx="1" />
 <rect x="14" y="4" width="6" height="6" rx="1" />
 <rect x="4" y="14" width="6" height="6" rx="1" />
 <rect x="14" y="14" width="6" height="6" rx="1" />
 </svg>
 <svg className="absolute bottom-32 left-6 w-8 h-8 text-pink/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
 <circle cx="12" cy="12" r="3" />
 <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3" strokeLinecap="round" />
 </svg>
 </div>

 {/* Image — hidden on mobile, full-width absolute bg on sm+ so it never clips the text */}
 <div className="hidden sm:block absolute inset-0 -z-10 overflow-hidden">
 <Image
 src="/images/heor-bg.png"
 alt=""
 fill
 priority
 sizes="100vw"
 className="object-cover object-center"
 />
 </div>

 {/* Text — normal flow on mobile, absolute overlay on sm+ */}
 <motion.div
 initial={{ opacity: 1, x: 0 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.7, ease: "easeOut" }}
 className="px-4 sm:px-0 sm:absolute sm:top-[4%] sm:left-[6%] lg:left-[7%] sm:w-[40%] lg:w-[36%] xl:w-[34%]"
 >
 <h1
 className="font-display font-extrabold leading-[1.1] tracking-tight text-[42px] md:text-[56px] lg:text-[64px] xl:text-[64px] max-w-[90%] md:max-w-none"
 style={{ color: "#16234F" }}
 >
 <span className="block">{t("titleLead")}</span>
 <span className="block" style={{ color: "#8B6CFF" }}>
 {t("titleHighlight")}
 </span>
 </h1>

 {/* Purple divider line between headline and paragraph */}
 <div className="h-1 w-16 rounded-full mt-4 mb-5 sm:my-[5%]" style={{ backgroundColor: "#8B6CFF" }} />

 <p
 className="leading-relaxed mb-6 sm:mb-[5%] text-[18px] md:text-[22px] lg:text-[26px] xl:text-[28px] max-w-[90%] md:max-w-none"
 style={{ color: "#3F4868" }}
 >
 {t.rich("subtitle", {
 em: (chunks) => (
 <span style={{ color: "#7D63F6", fontWeight: 600 }}>{chunks}</span>
 ),
 })}
 </p>

 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto max-w-[420px] sm:max-w-none">
 <LocalizedLink
 href="/courses"
 className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto min-h-[56px] sm:min-h-0 px-6 sm:px-7 lg:px-9 py-3 sm:py-4 lg:py-5 rounded-2xl bg-primary text-white font-semibold shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/15 transition-all duration-300 hover:scale-[1.02] whitespace-nowrap"
 style={{ fontSize: "clamp(0.875rem, 1.4vw, 1.25rem)" }}
 >
 {t("cta")}
 <KidArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
 </LocalizedLink>
 <LocalizedLink
 href="/recommend"
 className="group inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto min-h-[56px] sm:min-h-0 px-6 sm:px-7 lg:px-9 py-3 sm:py-4 lg:py-5 rounded-2xl bg-surface text-foreground font-semibold shadow-lg shadow-black/[0.04] hover:bg-primary/10 hover:text-primary hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
 style={{ fontSize: "clamp(0.875rem, 1.4vw, 1.25rem)" }}
 >
 {t("secondaryCta")}
 <TargetArrowIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
 </LocalizedLink>
 </div>
 </motion.div>
 </section>
 );
}
