"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { apiRoot } from "@/lib/api";
import {
  Briefcase,
  MapPin,
  Clock,
  ChevronRight,
  Users,
  Sparkles,
} from "lucide-react";

interface Career {
  _id: string;
  slug: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  requirements: { en: string; ar: string };
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  skills: string[];
  applicationEmail: string;
  applicationUrl: string;
}

const deptColors: Record<string, string> = {
  engineering: "from-blue-400 to-cyan-400",
  education: "from-emerald-400 to-teal-400",
  design: "from-purple to-violet-400",
  marketing: "from-orange to-amber-400",
  operations: "from-rose-400 to-pink-400",
  support: "from-indigo-400 to-blue-400",
  other: "from-slate-400 to-slate-500",
};

export default function CareersContent() {
  const t = useTranslations("careers");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${apiRoot()}/careers?limit=50`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCareers(data.items ?? []);
      } catch {
        setCareers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-5">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {t("title")}
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </AnimatedSection>

        {loading ? (
          <div className="text-center py-20">
            <Sparkles className="w-8 h-8 text-primary animate-pulse mx-auto mb-3" />
            <p className="text-muted">{t("loading")}</p>
          </div>
        ) : careers.length === 0 ? (
          <AnimatedSection className="text-center py-20 bg-surface rounded-2xl border border-border">
            <Briefcase className="w-12 h-12 text-muted mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">{t("noPositions")}</h2>
            <p className="text-muted max-w-md mx-auto">{t("noPositionsDesc")}</p>
          </AnimatedSection>
        ) : (
          <div className="space-y-4">
            {careers.map((career, i) => {
              const isOpen = expanded === career._id;
              return (
                <AnimatedCard key={career._id} delay={i * 0.05}>
                  <div className="bg-surface rounded-2xl border border-border overflow-hidden transition-all">
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : career._id)}
                      className="w-full text-start p-5 sm:p-6 flex items-center gap-4"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${deptColors[career.department] ?? deptColors.other} flex items-center justify-center shrink-0`}>
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate">
                          {career.title[lang]}
                        </h3>
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {career.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {career.employmentType.replace(/-/g, " ")}
                          </span>
                          <span className="capitalize px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            {career.department}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-muted transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-6 sm:px-6 border-t border-border pt-5 space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">{t("description")}</h4>
                          <p className="text-muted text-sm leading-relaxed whitespace-pre-line">
                            {career.description[lang]}
                          </p>
                        </div>
                        {career.requirements[lang] && (
                          <div>
                            <h4 className="font-semibold mb-2">{t("requirements")}</h4>
                            <p className="text-muted text-sm leading-relaxed whitespace-pre-line">
                              {career.requirements[lang]}
                            </p>
                          </div>
                        )}
                        {career.skills.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">{t("skills")}</h4>
                            <div className="flex flex-wrap gap-2">
                              {career.skills.map((skill) => (
                                <span key={skill} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="pt-2">
                          {career.applicationUrl ? (
                            <a
                              href={career.applicationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:scale-[1.02] transition-transform"
                            >
                              {t("apply")}
                            </a>
                          ) : career.applicationEmail ? (
                            <a
                              href={`mailto:${career.applicationEmail}?subject=${encodeURIComponent(career.title[lang])}`}
                              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:scale-[1.02] transition-transform"
                            >
                              {t("apply")}
                            </a>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
