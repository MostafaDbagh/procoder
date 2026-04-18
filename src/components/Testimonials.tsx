"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedCard } from "./AnimatedSection";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
 const t = useTranslations("testimonials");

 const testimonials = [
 {
 name: t("t1Name"),
 role: t("t1Role"),
 text: t("t1Text"),
 avatar: "S",
 color: "from-pink-400 to-rose-400",
 },
 {
 name: t("t2Name"),
 role: t("t2Role"),
 text: t("t2Text"),
 avatar: "A",
 color: "from-blue-400 to-cyan-400",
 },
 {
 name: t("t3Name"),
 role: t("t3Role"),
 text: t("t3Text"),
 avatar: "L",
 color: "from-purple to-violet-400",
 },
 ];

 return (
 <section className="py-20 sm:py-28 bg-surface/50">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <AnimatedSection className="text-center mb-14">
 <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")}</h2>
 <p className="text-muted text-lg max-w-2xl mx-auto">
 {t("subtitle")}
 </p>
 </AnimatedSection>

 <div className="grid md:grid-cols-3 gap-6">
 {testimonials.map((item, i) => (
 <AnimatedCard key={i} delay={i * 0.1}>
 <div className="bg-surface rounded-2xl p-7 border border-border h-full flex flex-col">
 <Quote className="w-8 h-8 text-primary/30 mb-4" />
 <p className="text-foreground leading-relaxed mb-6 flex-1">
 &ldquo;{item.text}&rdquo;
 </p>
 <div className="flex items-center gap-3">
 <div
 className={`w-11 h-11 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm`}
 >
 {item.avatar}
 </div>
 <div>
 <p className="font-semibold text-sm">{item.name}</p>
 <p className="text-xs text-muted">{item.role}</p>
 </div>
 <div className="ml-auto flex gap-0.5">
 {[...Array(5)].map((_, s) => (
 <Star
 key={s}
 className="w-4 h-4 fill-amber-400 text-amber-400"
 />
 ))}
 </div>
 </div>
 </div>
 </AnimatedCard>
 ))}
 </div>
 </div>
 </section>
 );
}
