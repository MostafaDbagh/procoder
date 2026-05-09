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
 <section className="relative">
 {/* Image at natural aspect, full width — no cropping, no fixed height */}
 <Image
 src="/images/hero-bg.png"
 alt=""
 width={922}
 height={1152}
 priority
 sizes="100vw"
 className="w-full h-auto block"
 />

 {/* Text overlay sits in the image's upper-left whitespace.
   Positions and font sizes use percentages / clamp() so they scale with the image
   at every viewport instead of fighting Tailwind breakpoints. */}
 <motion.div
 initial={{ opacity: 1, x: 0 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.7, ease: "easeOut" }}
 className="absolute top-[4%] left-[4%] sm:left-[6%] lg:left-[7%] w-[60%] sm:w-[48%] lg:w-[42%] xl:w-[38%]"
 >
 <h1
 className="font-bold leading-tight mb-[4%]"
 style={{ fontSize: "clamp(0.95rem, 4.2vw, 4.25rem)" }}
 >
 <span className="block">{t("titleLead")}</span>
 <span className="block bg-gradient-to-r from-primary to-purple bg-clip-text text-transparent">
 {t("titleHighlight")}
 </span>
 </h1>

 <p
 className="text-muted leading-relaxed mb-[5%]"
 style={{ fontSize: "clamp(0.7rem, 1.25vw, 1.25rem)" }}
 >
 {t("subtitle")}
 </p>

 <div className="flex flex-wrap gap-[2%]">
 <LocalizedLink
 href="/courses"
 className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 lg:px-6 py-1.5 sm:py-2.5 lg:py-3 rounded-2xl bg-primary text-white font-semibold shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/15 transition-all duration-300 hover:scale-[1.02]"
 style={{ fontSize: "clamp(0.65rem, 1vw, 1rem)" }}
 >
 {t("cta")}
 <KidArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
 </LocalizedLink>
 <LocalizedLink
 href="/recommend"
 className="group inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 lg:px-6 py-1.5 sm:py-2.5 lg:py-3 rounded-2xl bg-surface text-foreground font-semibold shadow-lg shadow-black/[0.04] hover:bg-primary/10 hover:text-primary hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
 style={{ fontSize: "clamp(0.65rem, 1vw, 1rem)" }}
 >
 {t("secondaryCta")}
 <TargetArrowIcon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
 </LocalizedLink>
 </div>
 </motion.div>
 </section>
 );
}
