"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { AnimatedSection } from "./AnimatedSection";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Briefcase, Code2 } from "lucide-react";
import type { APITeamMember } from "@/lib/server-api";
import { resolveTeamStarHeaderColor } from "@/lib/teamStarPresets";

type StaticFallback = {
  key: string;
  headerColor: string;
  rating: number;
  reviews: number;
  experience: number;
  skills: string[];
  location: string;
  flag: string;
  bio: string;
};

const STATIC_FALLBACK: StaticFallback[] = [
  {
    key: "1",
    headerColor: "bg-amber-400",
    rating: 5.0,
    reviews: 842,
    experience: 5,
    skills: ["Python", "JavaScript", "React", "Node.js"],
    location: "Saudi Arabia",
    flag: "\u{1F1F8}\u{1F1E6}",
    bio: "A passionate educator and tech entrepreneur who founded ProCoder to make STEM education accessible and fun for every child in the region.",
  },
  {
    key: "2",
    headerColor: "bg-purple",
    rating: 4.9,
    reviews: 1567,
    experience: 7,
    skills: ["Curriculum Design", "Pedagogy", "Scratch", "Python"],
    location: "UAE",
    flag: "\u{1F1E6}\u{1F1EA}",
    bio: "A curriculum specialist with 7 years of experience designing engaging learning paths for children. Expert in making complex concepts simple and fun.",
  },
  {
    key: "3",
    headerColor: "bg-blue-500",
    rating: 4.9,
    reviews: 1203,
    experience: 6,
    skills: ["Full-Stack", "TypeScript", "Next.js", "MongoDB"],
    location: "Turkey",
    flag: "\u{1F1F9}\u{1F1F7}",
    bio: "A full-stack developer who builds the ProCoder platform. Passionate about creating interactive coding environments that make learning intuitive.",
  },
  {
    key: "4",
    headerColor: "bg-rose-400",
    rating: 4.8,
    reviews: 956,
    experience: 4,
    skills: ["UI/UX", "Figma", "Design Systems", "Accessibility"],
    location: "Canada",
    flag: "\u{1F1E8}\u{1F1E6}",
    bio: "A UX designer specializing in child-friendly interfaces. Creates beautiful, accessible designs that kids love to interact with.",
  },
  {
    key: "5",
    headerColor: "bg-emerald-500",
    rating: 5.0,
    reviews: 731,
    experience: 8,
    skills: ["Arduino", "Raspberry Pi", "3D Printing", "IoT"],
    location: "Kuwait",
    flag: "\u{1F1F0}\u{1F1FC}",
    bio: "A robotics engineer with 8 years of experience teaching kids to build and program real robots. Competition coach and STEM advocate.",
  },
  {
    key: "6",
    headerColor: "bg-teal-500",
    rating: 5.0,
    reviews: 1890,
    experience: 10,
    skills: ["Tajweed", "Hifz", "Arabic Grammar", "Islamic Studies"],
    location: "Syria",
    flag: "\u{1F1F8}\u{1F1FE}",
    bio: "A certified Quran and Arabic teacher with 10 years of experience. Combines traditional teaching methods with modern interactive techniques.",
  },
];

export type MeetOurStarsProps = {
  cmsTeam: APITeamMember[] | null;
};

type StarRow = {
  key: string;
  name: string;
  headerColor: string;
  rating: number;
  reviews: number;
  experience: number;
  skills: string[];
  location: string;
  flag: string;
  bio: string;
};

function MeetOurStarsCarousel({ teamRows }: { teamRows: StarRow[] }) {
  const t = useTranslations("about");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedBio, setExpandedBio] = useState<string | null>(null);
  const totalPages = Math.max(1, Math.ceil(teamRows.length / 3));

  const updatePage = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 380;
    const page = Math.round(el.scrollLeft / (cardWidth * 3));
    setCurrentPage(Math.min(page, totalPages - 1));
  }, [totalPages]);

  useEffect(() => {
    const el = scrollRef.current;
    el?.addEventListener("scroll", updatePage);
    return () => el?.removeEventListener("scroll", updatePage);
  }, [updatePage]);

  const [fading, setFading] = useState(false);

  const goToPage = useCallback((page: number, wrap = false) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("[data-card]")?.clientWidth || 370;
    const gap = 20;
    const target = page * (cardWidth + gap) * 3;

    if (wrap) {
      setFading(true);
      setTimeout(() => {
        el.scrollTo({ left: target, behavior: "instant" as ScrollBehavior });
        setCurrentPage(page);
        setTimeout(() => setFading(false), 50);
      }, 300);
    } else {
      el.scrollTo({ left: target, behavior: "smooth" });
      setCurrentPage(page);
    }
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (dir === "left") {
      const isFirst = currentPage === 0;
      goToPage(isFirst ? totalPages - 1 : currentPage - 1, isFirst);
    } else {
      const isLast = currentPage + 1 >= totalPages;
      goToPage(isLast ? 0 : currentPage + 1, isLast);
    }
  };

  return (
    <>
      <div
        ref={scrollRef}
        className={`flex items-start gap-5 overflow-x-auto pb-6 snap-x snap-mandatory transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {teamRows.map((member, i) => {
          const isExpanded = expandedBio === member.key;
          const bioSnippet =
            member.bio.length > 90
              ? `${member.bio.slice(0, 90)}...... `
              : `${member.bio} `;
          return (
            <motion.div
              key={member.key}
              data-card
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="snap-start shrink-0 w-[300px] sm:w-[330px] max-w-[330px] self-start"
            >
              <div
                className="bg-surface rounded-2xl border border-border overflow-hidden"
                style={{ height: isExpanded ? "auto" : 460 }}
              >
                <div
                  className={`group ${member.headerColor} transition-all duration-500 ease-in-out h-36 hover:h-[370px] cursor-pointer`}
                />

                <div className="px-6 pt-5 pb-3">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-sm">{member.rating}</span>
                    <span className="text-muted text-xs">
                      ({t("starsRatingsCount", { count: member.reviews })})
                    </span>
                  </div>
                  <div style={{ width: 240, maxWidth: "100%" }}>
                    <div className="h-px bg-border" />
                  </div>
                </div>

                <div className="px-6 pb-5">
                  {member.experience > 0 ? (
                    <div className="flex items-center gap-2 text-sm text-muted mb-3">
                      <Briefcase className="w-4 h-4 shrink-0" />
                      <span>{t("starsExperience", { years: member.experience })}</span>
                    </div>
                  ) : null}

                  {member.skills.length > 0 ? (
                    <div className="flex items-start gap-2 text-sm text-muted mb-3">
                      <Code2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="uppercase text-xs font-medium tracking-wide">
                        {member.skills.join(", ")}
                      </span>
                    </div>
                  ) : null}

                  {member.location || member.flag ? (
                    <div className="flex items-center gap-2 text-sm mb-4">
                      {member.flag ? <span className="text-lg">{member.flag}</span> : null}
                      {member.location ? (
                        <span className="text-muted text-xs">
                          {t("starsLocatedIn", { place: member.location })}
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  {member.bio ? (
                    <p className="text-sm text-muted leading-relaxed">
                      {isExpanded ? member.bio : bioSnippet}
                      {member.bio.length > 90 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedBio(isExpanded ? null : member.key)
                          }
                          className="font-semibold text-foreground hover:text-primary transition-colors inline ms-1"
                        >
                          {isExpanded ? t("starsShowLess") : t("starsReadMore")}
                        </button>
                      ) : null}
                    </p>
                  ) : null}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 mt-12">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="rounded-full bg-purple/10 flex items-center justify-center text-purple hover:bg-purple/20 transition-colors"
          style={{ width: 37, height: 37 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToPage(i)}
              className="w-7 h-7 flex items-center justify-center transition-all"
            >
              {currentPage === i ? (
                <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7">
                  <path
                    d="M14 3 C20 3 24 7 24 13 C24 19 20 23 16 23 C12 23 9 20 9 16 C9 12 12 10 15 10"
                    stroke="#D4A46A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              ) : (
                <span className="w-5 h-5 rounded-full border-2 border-foreground/25 hover:border-foreground/50 transition-colors block" />
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="rounded-full bg-muted/10 flex items-center justify-center text-muted hover:bg-muted/20 transition-colors"
          style={{ width: 37, height: 37 }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}

function StarDecoSVG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" className={className}>
      <path
        d="M30 5 C32 20 40 28 55 30 C40 32 32 40 30 55 C28 40 20 32 5 30 C20 28 28 20 30 5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 3"
        fill="none"
        opacity="0.15"
      />
    </svg>
  );
}

export function MeetOurStars({ cmsTeam }: MeetOurStarsProps) {
  const t = useTranslations("about");
  const lang = useLocale() === "ar" ? "ar" : "en";

  const teamRows: StarRow[] = useMemo(() => {
    if (cmsTeam && cmsTeam.length > 0) {
      return [...cmsTeam]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((m) => {
          const bioEn = String(m.bio?.en ?? "").trim();
          const bioAr = String(m.bio?.ar ?? "").trim();
          const bio = lang === "ar" ? bioAr || bioEn : bioEn || bioAr;
          const skills =
            lang === "ar"
              ? (m.skillsAr?.length ? m.skillsAr : m.skillsEn) ?? []
              : (m.skillsEn?.length ? m.skillsEn : m.skillsAr) ?? [];
          const locEn = String(m.locationEn ?? "").trim();
          const locAr = String(m.locationAr ?? "").trim();
          const location = lang === "ar" ? locAr || locEn : locEn || locAr;
          const rawRating = m.rating;
          const rating =
            rawRating === undefined || rawRating === null
              ? 5
              : Math.min(5, Math.max(0, Number(rawRating)));
          const rawReviews = m.reviews;
          const reviews =
            rawReviews === undefined || rawReviews === null
              ? 0
              : Math.max(0, Math.floor(Number(rawReviews)));
          return {
            key: String(m._id),
            name: lang === "ar" ? m.name.ar : m.name.en,
            headerColor: resolveTeamStarHeaderColor(m.headerColor),
            rating,
            reviews,
            experience: Math.max(0, Math.floor(Number(m.experienceYears) || 0)),
            skills: skills.map(String).filter(Boolean),
            location,
            flag: String(m.flag ?? "").trim(),
            bio,
          };
        });
    }
    return STATIC_FALLBACK.map((row) => ({
      key: row.key,
      name: t(`member${row.key}Name` as Parameters<typeof t>[0]),
      headerColor: resolveTeamStarHeaderColor(row.headerColor),
      rating: row.rating,
      reviews: row.reviews,
      experience: row.experience,
      skills: row.skills,
      location:
        lang === "ar"
          ? row.location === "Saudi Arabia"
            ? "السعودية"
            : row.location === "UAE"
              ? "الإمارات"
              : row.location === "Turkey"
                ? "تركيا"
                : row.location === "Canada"
                  ? "كندا"
                  : row.location === "Kuwait"
                    ? "الكويت"
                    : row.location === "Syria"
                      ? "سوريا"
                      : row.location
          : row.location,
      flag: row.flag,
      bio: row.bio,
    }));
  }, [cmsTeam, lang, t]);

  const carouselResetKey = `${teamRows.length}-${cmsTeam == null ? "null" : String(cmsTeam.length)}`;

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <StarDecoSVG className="absolute top-12 left-[5%] w-16 h-16 text-muted" />
      <StarDecoSVG className="absolute top-20 right-[8%] w-14 h-14 text-muted" />
      <StarDecoSVG className="absolute bottom-24 left-[10%] w-12 h-12 text-muted" />
      <StarDecoSVG className="absolute bottom-20 right-[6%] w-16 h-16 text-muted" />
      <StarDecoSVG className="absolute top-1/2 left-[2%] w-10 h-10 text-muted" />
      <StarDecoSVG className="absolute top-1/3 right-[3%] w-11 h-11 text-muted" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 200 130" fill="none" style={{ width: 120, height: 110 }}>
              <motion.path
                d="M30 30 L33 22 L36 30 L44 30 L38 35 L40 42 L33 38 L26 42 L28 35 L22 30 Z"
                fill="#FFD43B"
                stroke="#F59E0B"
                strokeWidth="1"
                strokeLinejoin="round"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.path
                d="M12 65 L14 60 L16 65 L21 65 L17 68 L18 73 L14 70 L10 73 L11 68 L7 65 Z"
                fill="#FFD43B"
                stroke="#F59E0B"
                strokeWidth="1"
                strokeLinejoin="round"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              />
              <motion.path
                d="M168 25 L171 17 L174 25 L182 25 L176 30 L178 37 L171 33 L164 37 L166 30 L160 25 Z"
                fill="#FFD43B"
                stroke="#F59E0B"
                strokeWidth="1"
                strokeLinejoin="round"
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
              <motion.path
                d="M185 70 L187 65 L189 70 L194 70 L190 73 L191 78 L187 75 L183 78 L184 73 L180 70 Z"
                fill="#FFD43B"
                stroke="#F59E0B"
                strokeWidth="1"
                strokeLinejoin="round"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <path
                d="M100 2 L118 42 L162 42 L126 66 L140 110 L100 86 L60 110 L74 66 L38 42 L82 42 Z"
                fill="#FFD43B"
                stroke="#F59E0B"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <circle cx="88" cy="58" r="5" fill="#92400E" />
              <circle cx="112" cy="58" r="5" fill="#92400E" />
              <path
                d="M88 72 Q100 82 112 72"
                stroke="#92400E"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="90" cy="56.5" r="2" fill="white" />
              <circle cx="114" cy="56.5" r="2" fill="white" />
              <circle cx="80" cy="68" r="6" fill="#FCA5A5" opacity="0.35" />
              <circle cx="120" cy="68" r="6" fill="#FCA5A5" opacity="0.35" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">{t("starsTitle")}</h2>
          <p className="text-muted text-lg max-w-xl mx-auto">{t("starsSubtitle")}</p>
        </AnimatedSection>

        <MeetOurStarsCarousel key={carouselResetKey} teamRows={teamRows} />
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        [data-card] {
          scroll-snap-align: start;
        }
      `}</style>
    </section>
  );
}
