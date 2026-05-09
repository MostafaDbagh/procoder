"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { AuthModal } from "@/components/AuthModal";
import { LocalizedLink } from "@/components/LocalizedLink";
import { FutureThinkersSection } from "@/components/FutureThinkersSection";
import { BrainPattern } from "@/components/BrainPatterns";
import { motion } from "framer-motion";
import {
 Heart,
 BarChart3,
 Bell,
 FileText,
 ShieldCheck,
 Calendar,
 MessageCircle,
 CheckCircle2,
 Eye,
 Award,
 Clock,
 Video,
 UserPlus,
 Star,
 LayoutDashboard,
} from "lucide-react";
import { ChatHeartIcon } from "@/components/icons/PillarIcons";
import {
 BarChartIcon,
 BellNotifyIcon,
 ReportIcon,
 ShieldSafeIcon,
 CalendarIcon,
 ClockTimeIcon,
 VideoCameraIcon,
} from "@/components/icons/KidIcons";

export default function ParentsContent() {
 const t = useTranslations("parents");
 const [authOpen, setAuthOpen] = useState(false);
 const [authTab] = useState<"signup" | "login">("login");

 const trustCards = [
 { icon: BarChartIcon, title: t("trust1Title"), desc: t("trust1Desc"), bubble: "bg-blue-400/10 border-blue-400/30" },
 { icon: BellNotifyIcon, title: t("trust2Title"), desc: t("trust2Desc"), bubble: "bg-amber-400/10 border-amber-400/30" },
 { icon: ReportIcon, title: t("trust3Title"), desc: t("trust3Desc"), bubble: "bg-violet-400/10 border-violet-400/30" },
 { icon: ShieldSafeIcon, title: t("trust4Title"), desc: t("trust4Desc"), bubble: "bg-emerald-400/10 border-emerald-400/30" },
 { icon: CalendarIcon, title: t("trust5Title"), desc: t("trust5Desc"), bubble: "bg-rose-400/10 border-rose-400/30" },
 { icon: ChatHeartIcon, title: t("trust6Title"), desc: t("trust6Desc"), bubble: "bg-teal-400/10 border-teal-400/30" },
 ];

 const dashItems = [
 { icon: BarChartIcon, text: t("dash1") },
 { icon: BellNotifyIcon, text: t("dash2") },
 { icon: ReportIcon, text: t("dash3") },
 { icon: ClockTimeIcon, text: t("dash4") },
 { icon: ShieldSafeIcon, text: t("dash5") },
 { icon: VideoCameraIcon, text: t("dash6") },
 ];

 const promises = [
 t("promise1"), t("promise2"), t("promise3"),
 t("promise4"), t("promise5"), t("promise6"),
 ];

 return (
 <div>
 {/* ═══ HERO ═══ */}
 <section
 className="relative overflow-hidden w-full"
 style={{ aspectRatio: "1448 / 1086" }}
 >
 {/* Full-bleed cover — section aspect matches image aspect, so image fits perfectly with no crop and no whitespace */}
 <Image
 src="/images/parent-bg.jpeg"
 alt=""
 fill
 priority
 sizes="100vw"
 className="object-cover object-center -z-10"
 />

 <div className="absolute inset-0">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
 <motion.div
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.6 }}
 className="pt-6 sm:pt-10 lg:pt-16 max-w-[88%] sm:max-w-[55%] lg:max-w-[42%]"
 >
 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3 sm:mb-5">
 <Heart className="w-4 h-4" />
 {t("badge")}
 </div>

 <h1 className="text-2xl sm:text-4xl lg:text-[48px] font-bold leading-tight mb-3 sm:mb-5">
 <span className="block">{t("heroTitleLead")}</span>
 <span className="block bg-gradient-to-r from-primary to-purple bg-clip-text text-transparent">
 {t("heroTitleHighlight")}
 </span>
 </h1>

 <p className="text-sm sm:text-base lg:text-lg text-muted leading-relaxed mb-4 sm:mb-6">
 {t("heroSubtitle")}
 </p>

 <div className="flex flex-col gap-2 sm:gap-3 max-w-md">
 <button
 type="button"
 onClick={() => setAuthOpen(true)}
 className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-2xl bg-primary text-white font-semibold text-sm sm:text-base shadow-md shadow-primary/10 hover:shadow-lg hover:scale-[1.02] transition-all"
 >
 <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
 {t("heroCta")} / {t("loginLink")}
 </button>
 <LocalizedLink
 href="/parent/login"
 className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-2xl border-2 border-border bg-surface text-foreground font-semibold text-sm sm:text-base shadow-sm transition-all hover:border-primary/45 hover:bg-primary/[0.06] hover:text-primary hover:shadow-md hover:scale-[1.02] dark:hover:bg-primary/10"
 >
 <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" aria-hidden />
 <span>{t("openDashboard")}</span>
 </LocalizedLink>
 </div>
 </motion.div>
 </div>
 </div>
 </section>


 <FutureThinkersSection />

 {/* ═══ WHY PARENTS TRUST US ═══ */}
 <section className="relative overflow-hidden py-20 sm:py-28 bg-surface/50">
 <BrainPattern variant="rubik" />
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <AnimatedSection className="text-center mb-14">
 <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("trustTitle")}</h2>
 <p className="text-muted text-lg max-w-2xl mx-auto">{t("trustSubtitle")}</p>
 </AnimatedSection>

 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {trustCards.map((card, i) => (
 <AnimatedCard key={i} delay={i * 0.08}>
 <article className="bg-surface rounded-2xl border border-border p-7 h-full">
 <div className={`w-16 h-16 rounded-2xl border-2 ${card.bubble} flex items-center justify-center mb-5`}>
 <card.icon className="w-10 h-10" />
 </div>
 <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
 <p className="text-muted text-sm leading-relaxed">{card.desc}</p>
 </article>
 </AnimatedCard>
 ))}
 </div>
 </div>
 </section>

 {/* ═══ DASHBOARD PREVIEW ═══ */}
 <section className="relative overflow-hidden py-20 sm:py-28">
 <BrainPattern variant="lego" />
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <AnimatedSection className="text-center mb-14">
 <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("dashTitle")}</h2>
 <p className="text-muted text-lg max-w-2xl mx-auto">{t("dashSubtitle")}</p>
 </AnimatedSection>

 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
 {dashItems.map((item, i) => (
 <motion.div
 key={i}
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: i * 0.08 }}
 className="flex items-center gap-4 bg-surface rounded-2xl border border-border p-5"
 >
 <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
 <item.icon className="w-9 h-9" />
 </div>
 <p className="text-sm font-medium">{item.text}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* ═══ OUR PROMISE ═══ */}
 <section className="relative overflow-hidden py-20 sm:py-28 bg-surface/50">
 <BrainPattern variant="brain" />
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
 <AnimatedSection className="text-center mb-14">
 <div className="flex justify-center mb-4">
 <Star className="w-10 h-10 text-amber-400 fill-amber-400/30" />
 </div>
 <h2 className="text-3xl sm:text-4xl font-bold mb-3">{t("promiseTitle")}</h2>
 <p className="text-muted text-lg">{t("promiseSubtitle")}</p>
 </AnimatedSection>

 <div className="space-y-4">
 {promises.map((p, i) => (
 <motion.div
 key={i}
 initial={{ opacity: 0, x: -15 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ delay: i * 0.08 }}
 className="flex items-start gap-4 bg-surface rounded-2xl border border-border p-5"
 >
 <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
 <p className="font-medium">{p}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Auth Modal */}
 <AuthModal
 open={authOpen}
 onClose={() => setAuthOpen(false)}
 defaultTab={authTab}
 />
 </div>
 );
}
