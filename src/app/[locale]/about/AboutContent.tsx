"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import {
  Sparkles,
  Rocket,
  Telescope,
  Heart,
  Users,
  GraduationCap,
  Globe,
  ShieldCheck,
  Code2,
  BookOpen,
  Brain,
  ExternalLink,
} from "lucide-react";

export default function AboutContent() {
  const t = useTranslations("about");

  const values = [
    { icon: Heart, title: t("value1Title"), desc: t("value1Desc"), color: "from-pink-400 to-rose-400" },
    { icon: ShieldCheck, title: t("value2Title"), desc: t("value2Desc"), color: "from-emerald-400 to-teal-400" },
    { icon: Sparkles, title: t("value3Title"), desc: t("value3Desc"), color: "from-amber-400 to-orange-400" },
    { icon: Globe, title: t("value4Title"), desc: t("value4Desc"), color: "from-blue-400 to-cyan-400" },
  ];

  const team = [
    { name: t("member1Name"), role: t("member1Role"), avatar: "M", color: "from-blue-400 to-primary" },
    { name: t("member2Name"), role: t("member2Role"), avatar: "S", color: "from-purple to-violet-400" },
    { name: t("member3Name"), role: t("member3Role"), avatar: "A", color: "from-emerald-400 to-teal-400" },
    { name: t("member4Name"), role: t("member4Role"), avatar: "L", color: "from-pink-400 to-rose-400" },
    { name: t("member5Name"), role: t("member5Role"), avatar: "K", color: "from-amber-400 to-orange-400" },
    { name: t("member6Name"), role: t("member6Role"), avatar: "N", color: "from-cyan-400 to-blue-400" },
  ];

  const stats = [
    { value: "500+", label: t("statStudents"), icon: Users },
    { value: "50+", label: t("statCourses"), icon: GraduationCap },
    { value: "12+", label: t("statInstructors"), icon: Brain },
    { value: "5", label: t("statCategories"), icon: BookOpen },
  ];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <AnimatedSection className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            {t("badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            {t("title")}
          </h1>
          <p className="text-muted text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </AnimatedSection>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          <AnimatedCard delay={0}>
            <div className="bg-surface rounded-2xl border border-border p-8 h-full">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-5">
                <Telescope className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3">{t("visionTitle")}</h2>
              <p className="text-muted leading-relaxed">{t("visionDesc")}</p>
            </div>
          </AnimatedCard>
          <AnimatedCard delay={0.1}>
            <div className="bg-surface rounded-2xl border border-border p-8 h-full">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange to-amber-400 flex items-center justify-center mb-5">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3">{t("missionTitle")}</h2>
              <p className="text-muted leading-relaxed">{t("missionDesc")}</p>
            </div>
          </AnimatedCard>
        </div>

        {/* Stats */}
        <AnimatedSection className="mb-20">
          <div className="bg-primary rounded-3xl p-8 sm:p-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="w-8 h-8 text-white/80 mx-auto mb-3" />
                  <p className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-white/70 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Values */}
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("valuesTitle")}</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">{t("valuesSubtitle")}</p>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {values.map((v, i) => (
            <AnimatedCard key={i} delay={i * 0.08}>
              <div className="bg-surface rounded-2xl border border-border p-6 text-center h-full">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center mx-auto mb-4`}>
                  <v.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Our Story */}
        <AnimatedSection className="mb-20">
          <div className="bg-surface rounded-2xl border border-border p-8 sm:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <Code2 className="w-10 h-10 text-primary mx-auto mb-5" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-5">{t("storyTitle")}</h2>
              <p className="text-muted leading-relaxed mb-4">{t("storyP1")}</p>
              <p className="text-muted leading-relaxed">{t("storyP2")}</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Team */}
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("teamTitle")}</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">{t("teamSubtitle")}</p>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <AnimatedCard key={i} delay={i * 0.08}>
              <div className="bg-surface rounded-2xl border border-border p-7 text-center">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold`}>
                  {member.avatar}
                </div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-muted text-sm mb-3">{member.role}</p>
                <button className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                  <ExternalLink className="w-4 h-4" />
                  LinkedIn
                </button>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </div>
  );
}
