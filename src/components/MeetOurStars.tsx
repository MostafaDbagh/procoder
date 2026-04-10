"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "./AnimatedSection";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Briefcase, Code2, MapPin } from "lucide-react";

const team = [
  {
    key: "1",
    avatar: "M",
    headerColor: "bg-amber-400",
    rating: 5.0,
    reviews: 842,
    experience: 5,
    skills: ["Python", "JavaScript", "React", "Node.js"],
    location: "Saudi Arabia",
    flag: "🇸🇦",
    bio: "A passionate educator and tech entrepreneur who founded ProCoder to make STEM education accessible and fun for every child in the region.",
    bioAr: "معلم شغوف ورائد أعمال تقني أسس بروكودر لجعل تعليم العلوم والتكنولوجيا متاحاً وممتعاً لكل طفل.",
  },
  {
    key: "2",
    avatar: "S",
    headerColor: "bg-purple",
    rating: 4.9,
    reviews: 1567,
    experience: 7,
    skills: ["Curriculum Design", "Pedagogy", "Scratch", "Python"],
    location: "UAE",
    flag: "🇦🇪",
    bio: "A curriculum specialist with 7 years of experience designing engaging learning paths for children. Expert in making complex concepts simple and fun.",
    bioAr: "متخصصة في المناهج مع 7 سنوات من الخبرة في تصميم مسارات تعليمية جذابة للأطفال.",
  },
  {
    key: "3",
    avatar: "A",
    headerColor: "bg-blue-500",
    rating: 4.9,
    reviews: 1203,
    experience: 6,
    skills: ["Full-Stack", "TypeScript", "Next.js", "MongoDB"],
    location: "Turkey",
    flag: "🇹🇷",
    bio: "A full-stack developer who builds the ProCoder platform. Passionate about creating interactive coding environments that make learning intuitive.",
    bioAr: "مطور متكامل يبني منصة بروكودر. شغوف بإنشاء بيئات برمجة تفاعلية تجعل التعلم بديهياً.",
  },
  {
    key: "4",
    avatar: "L",
    headerColor: "bg-rose-400",
    rating: 4.8,
    reviews: 956,
    experience: 4,
    skills: ["UI/UX", "Figma", "Design Systems", "Accessibility"],
    location: "Canada",
    flag: "🇨🇦",
    bio: "A UX designer specializing in child-friendly interfaces. Creates beautiful, accessible designs that kids love to interact with.",
    bioAr: "مصممة تجربة مستخدم متخصصة في واجهات صديقة للأطفال. تصمم واجهات جميلة يحب الأطفال التفاعل معها.",
  },
  {
    key: "5",
    avatar: "K",
    headerColor: "bg-emerald-500",
    rating: 5.0,
    reviews: 731,
    experience: 8,
    skills: ["Arduino", "Raspberry Pi", "3D Printing", "IoT"],
    location: "Kuwait",
    flag: "🇰🇼",
    bio: "A robotics engineer with 8 years of experience teaching kids to build and program real robots. Competition coach and STEM advocate.",
    bioAr: "مهندس روبوتات بخبرة 8 سنوات في تعليم الأطفال بناء وبرمجة الروبوتات الحقيقية.",
  },
  {
    key: "6",
    avatar: "N",
    headerColor: "bg-teal-500",
    rating: 5.0,
    reviews: 1890,
    experience: 10,
    skills: ["Tajweed", "Hifz", "Arabic Grammar", "Islamic Studies"],
    location: "Syria",
    flag: "🇸🇾",
    bio: "A certified Quran and Arabic teacher with 10 years of experience. Combines traditional teaching methods with modern interactive techniques.",
    bioAr: "معلم قرآن ولغة عربية معتمد بخبرة 10 سنوات. يجمع بين أساليب التدريس التقليدية والتقنيات التفاعلية الحديثة.",
  },
];

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

function StarfishSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20 mx-auto mb-4">
      <motion.g
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "40px 40px" }}
      >
        <path d="M40 8 Q44 25 40 30 Q36 25 40 8Z" fill="#8B7BC8" />
        <path d="M62 22 Q50 30 44 34 Q48 28 62 22Z" fill="#8B7BC8" />
        <path d="M68 48 Q52 42 46 38 Q52 36 68 48Z" fill="#8B7BC8" />
        <path d="M22 62 Q30 48 34 44 Q36 50 22 62Z" fill="#8B7BC8" />
        <path d="M12 32 Q28 34 34 38 Q28 40 12 32Z" fill="#8B7BC8" />
        <circle cx="40" cy="36" r="10" fill="#7A6AB5" />
        <circle cx="40" cy="16" r="1.5" fill="white" opacity="0.7" />
        <circle cx="55" cy="27" r="1.5" fill="white" opacity="0.7" />
        <circle cx="58" cy="44" r="1.5" fill="white" opacity="0.7" />
        <circle cx="27" cy="55" r="1.5" fill="white" opacity="0.7" />
        <circle cx="18" cy="35" r="1.5" fill="white" opacity="0.7" />
        <circle cx="37" cy="34" r="1.5" fill="white" opacity="0.6" />
        <circle cx="43" cy="34" r="1.5" fill="white" opacity="0.6" />
        <circle cx="40" cy="39" r="1.5" fill="white" opacity="0.6" />
      </motion.g>
      <motion.circle cx="52" cy="10" r="3" fill="#8B7BC8" opacity="0.3"
        animate={{ y: [0, -4, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle cx="48" cy="6" r="1.5" fill="#8B7BC8" opacity="0.25"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />
    </svg>
  );
}

// Spiral decoration like in the screenshot pagination
function SpiralSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path
        d="M12 2 C16 2 20 6 20 10 C20 14 16 16 14 16 C12 16 10 14 10 12 C10 10 12 9 13 9"
        stroke="#D4A46A"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MeetOurStars() {
  const t = useTranslations("about");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedBio, setExpandedBio] = useState<string | null>(null);
  const totalPages = Math.ceil(team.length / 3);

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
      // Fade out → jump → fade in (no jarring reverse scroll)
      setFading(true);
      setTimeout(() => {
        el.scrollTo({ left: target, behavior: "instant" });
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
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Floating star decorations */}
      <StarDecoSVG className="absolute top-12 left-[5%] w-16 h-16 text-muted" />
      <StarDecoSVG className="absolute top-20 right-[8%] w-14 h-14 text-muted" />
      <StarDecoSVG className="absolute bottom-24 left-[10%] w-12 h-12 text-muted" />
      <StarDecoSVG className="absolute bottom-20 right-[6%] w-16 h-16 text-muted" />
      <StarDecoSVG className="absolute top-1/2 left-[2%] w-10 h-10 text-muted" />
      <StarDecoSVG className="absolute top-1/3 right-[3%] w-11 h-11 text-muted" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 200 130" fill="none" style={{ width: 120, height: 110 }}>
              {/* Small star 1 — top left */}
              <motion.path
                d="M30 30 L33 22 L36 30 L44 30 L38 35 L40 42 L33 38 L26 42 L28 35 L22 30 Z"
                fill="#FFD43B" stroke="#F59E0B" strokeWidth="1" strokeLinejoin="round"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Small star 2 — far left */}
              <motion.path
                d="M12 65 L14 60 L16 65 L21 65 L17 68 L18 73 L14 70 L10 73 L11 68 L7 65 Z"
                fill="#FFD43B" stroke="#F59E0B" strokeWidth="1" strokeLinejoin="round"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              />
              {/* Small star 3 — top right */}
              <motion.path
                d="M168 25 L171 17 L174 25 L182 25 L176 30 L178 37 L171 33 L164 37 L166 30 L160 25 Z"
                fill="#FFD43B" stroke="#F59E0B" strokeWidth="1" strokeLinejoin="round"
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
              {/* Small star 4 — far right */}
              <motion.path
                d="M185 70 L187 65 L189 70 L194 70 L190 73 L191 78 L187 75 L183 78 L184 73 L180 70 Z"
                fill="#FFD43B" stroke="#F59E0B" strokeWidth="1" strokeLinejoin="round"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              {/* Main cartoon star */}
              <path d="M100 2 L118 42 L162 42 L126 66 L140 110 L100 86 L60 110 L74 66 L38 42 L82 42 Z"
                fill="#FFD43B" stroke="#F59E0B" strokeWidth="3" strokeLinejoin="round" />
              {/* Happy face */}
              <circle cx="88" cy="58" r="5" fill="#92400E" />
              <circle cx="112" cy="58" r="5" fill="#92400E" />
              <path d="M88 72 Q100 82 112 72" stroke="#92400E" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* Sparkle eyes */}
              <circle cx="90" cy="56.5" r="2" fill="white" />
              <circle cx="114" cy="56.5" r="2" fill="white" />
              {/* Blush */}
              <circle cx="80" cy="68" r="6" fill="#FCA5A5" opacity="0.35" />
              <circle cx="120" cy="68" r="6" fill="#FCA5A5" opacity="0.35" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Meet Our Stars
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Learn from the best educators who make learning fun and engaging
          </p>
        </AnimatedSection>

        {/* Cards slider */}
        <div
          ref={scrollRef}
          className={`flex items-start gap-5 overflow-x-auto pb-6 snap-x snap-mandatory transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {team.map((member, i) => {
            const isExpanded = expandedBio === member.key;
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
                <div className="bg-surface rounded-2xl border border-border overflow-hidden" style={{ height: isExpanded ? "auto" : 460 }}>
                  {/* Colored header — hover only on this expands it */}
                  <div className={`group ${member.headerColor} transition-all duration-500 ease-in-out h-36 hover:h-[370px] cursor-pointer`} />

                  {/* Name + Rating — always visible at top of content */}
                  <div className="px-6 pt-5 pb-3">
                    <h3 className="text-xl font-bold mb-1">
                      {t(`member${member.key}Name`)}
                    </h3>
                    <div className="flex items-center gap-1.5 mb-3">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-sm">{member.rating}</span>
                      <span className="text-muted text-xs">({member.reviews} ratings)</span>
                    </div>
                    <div style={{ width: 240, maxWidth: "100%" }}>
                      <div className="h-px bg-border" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="px-6 pb-5">
                    <div className="flex items-center gap-2 text-sm text-muted mb-3">
                      <Briefcase className="w-4 h-4 shrink-0" />
                      <span>
                        Experience of <strong className="text-foreground">{member.experience} years</strong>
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-muted mb-3">
                      <Code2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="uppercase text-xs font-medium tracking-wide">
                        {member.skills.join(", ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm mb-4">
                      <span className="text-lg">{member.flag}</span>
                      <span className="text-muted text-xs">
                        Located in <strong className="text-foreground">{member.location}</strong>
                      </span>
                    </div>

                    <p className="text-sm text-muted leading-relaxed">
                      {isExpanded
                        ? member.bio
                        : `${member.bio.slice(0, 90)}...... `}
                      <button
                        onClick={() =>
                          setExpandedBio(isExpanded ? null : member.key)
                        }
                        className="font-semibold text-foreground hover:text-primary transition-colors inline"
                      >
                        {isExpanded ? "show less ↑" : "read more ↓"}
                      </button>
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Pagination — arrows + dots + spiral */}
        <div className="flex items-center justify-center gap-6 mt-12">
          <button
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
            onClick={() => scroll("right")}
            className="rounded-full bg-muted/10 flex items-center justify-center text-muted hover:bg-muted/20 transition-colors"
            style={{ width: 37, height: 37 }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        [data-card] { scroll-snap-align: start; }
      `}</style>
    </section>
  );
}
