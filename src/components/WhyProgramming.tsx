"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedCard } from "./AnimatedSection";
import { motion } from "framer-motion";
import { Lightbulb, Palette, Brain, Rocket } from "lucide-react";

const points = [
 { key: "point1", icon: Lightbulb, color: "bg-amber-400" },
 { key: "point2", icon: Palette, color: "bg-rose-400" },
 { key: "point3", icon: Brain, color: "bg-violet-400" },
 { key: "point4", icon: Rocket, color: "bg-emerald-400" },
];

function LaptopCodeIcon() {
 return (
 <svg viewBox="0 0 140 110" fill="none" className="w-36 h-28 mx-auto mb-5">
 {/* Shadow under laptop */}
 <ellipse cx="70" cy="95" rx="50" ry="5" fill="currentColor" className="text-foreground/5" />

 {/* Laptop lid */}
 <rect x="22" y="12" width="96" height="62" rx="8" fill="#2D3748" />
 <rect x="22" y="12" width="96" height="62" rx="8" stroke="#4A5568" strokeWidth="1.5" fill="none" />

 {/* Screen */}
 <rect x="28" y="18" width="84" height="50" rx="4" fill="#1A202C" />

 {/* Screen glow */}
 <rect x="28" y="18" width="84" height="50" rx="4" fill="url(#screenGlow)" opacity="0.15" />

 {/* Line numbers gutter */}
 <rect x="28" y="18" width="14" height="50" rx="4" fill="#151B28" />
 {[24, 32, 40, 48, 56].map((y, i) => (
 <text key={i} x="34" y={y} textAnchor="middle" fontSize="5" fill="#4A5568" fontFamily="monospace">{i + 1}</text>
 ))}

 {/* Code lines — clear and readable */}
 <motion.rect x="46" y="22" height="4" rx="2" fill="#7C9EFF" opacity="0.9"
 initial={{ width: 0 }} animate={{ width: 28 }} transition={{ delay: 0.2, duration: 0.5 }} />
 <motion.rect x="46" y="30" height="4" rx="2" fill="#6EE7B7" opacity="0.85"
 initial={{ width: 0 }} animate={{ width: 48 }} transition={{ delay: 0.4, duration: 0.5 }} />
 <motion.rect x="54" y="38" height="4" rx="2" fill="#C4B5FD" opacity="0.8"
 initial={{ width: 0 }} animate={{ width: 32 }} transition={{ delay: 0.6, duration: 0.5 }} />
 <motion.rect x="54" y="46" height="4" rx="2" fill="#FDBA74" opacity="0.8"
 initial={{ width: 0 }} animate={{ width: 40 }} transition={{ delay: 0.8, duration: 0.5 }} />
 <motion.rect x="46" y="54" height="4" rx="2" fill="#7C9EFF" opacity="0.7"
 initial={{ width: 0 }} animate={{ width: 36 }} transition={{ delay: 1.0, duration: 0.5 }} />

 {/* Blinking cursor */}
 <motion.rect x="82" y="53" width="2" height="7" rx="1" fill="#7C9EFF"
 animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />

 {/* Camera dot */}
 <circle cx="70" cy="15" r="1.5" fill="#4A5568" />

 {/* Laptop base / keyboard */}
 <path d="M14 74 L22 74 L118 74 L126 74 L130 82 Q131 86 128 86 L12 86 Q9 86 10 82 Z" fill="#2D3748" />
 <path d="M14 74 L126 74" stroke="#4A5568" strokeWidth="1" />
 {/* Keyboard keys hint */}
 <rect x="30" y="77" width="80" height="2" rx="1" fill="#4A5568" opacity="0.4" />
 <rect x="30" y="81" width="80" height="2" rx="1" fill="#4A5568" opacity="0.3" />
 {/* Trackpad */}
 <rect x="52" y="77" width="36" height="7" rx="2" fill="#4A5568" opacity="0.2" />

 {/* Floating code badge — left */}
 <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
 <rect x="0" y="22" width="18" height="18" rx="6" fill="#7C9EFF" opacity="0.15" />
 <text x="9" y="35" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill="#7C9EFF" opacity="0.8">&lt;/&gt;</text>
 </motion.g>

 {/* Floating code badge — right */}
 <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}>
 <rect x="122" y="18" width="16" height="16" rx="5" fill="#6EE7B7" opacity="0.15" />
 <text x="130" y="30" textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#6EE7B7" opacity="0.8">{"{ }"}</text>
 </motion.g>

 {/* Floating gear — bottom right */}
 <motion.g
 animate={{ rotate: 360 }}
 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
 style={{ transformOrigin: "128px 55px" }}
 >
 <circle cx="128" cy="55" r="7" stroke="#C4B5FD" strokeWidth="1.5" fill="none" opacity="0.4" />
 <circle cx="128" cy="55" r="2.5" fill="#C4B5FD" opacity="0.3" />
 </motion.g>

 {/* Lightbulb — top center */}
 <motion.g animate={{ y: [0, -3, 0], opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }}>
 <circle cx="70" cy="2" r="6" fill="#FDBA74" opacity="0.25" />
 <rect x="68" y="8" width="4" height="3" rx="1" fill="#FDBA74" opacity="0.3" />
 <line x1="70" y1="-7" x2="70" y2="-4" stroke="#FDBA74" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
 <line x1="78" y1="-3" x2="80" y2="-5" stroke="#FDBA74" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
 <line x1="62" y1="-3" x2="60" y2="-5" stroke="#FDBA74" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
 </motion.g>

 {/* Stars */}
 <motion.circle cx="8" cy="58" r="2" fill="#FDBA74" opacity="0.3"
 animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.9, 1.2, 0.9] }}
 transition={{ duration: 2, repeat: Infinity }} />
 <motion.circle cx="134" cy="40" r="1.5" fill="#7C9EFF" opacity="0.3"
 animate={{ opacity: [0.2, 0.5, 0.2] }}
 transition={{ duration: 2.5, repeat: Infinity, delay: 1 }} />

 <defs>
 <linearGradient id="screenGlow" x1="0%" y1="0%" x2="100%" y2="100%">
 <stop offset="0%" stopColor="#7C9EFF" />
 <stop offset="50%" stopColor="#6EE7B7" />
 <stop offset="100%" stopColor="#C4B5FD" />
 </linearGradient>
 </defs>
 </svg>
 );
}

export function WhyProgramming() {
 const t = useTranslations("whyProgramming");

 return (
 <section className="py-20 sm:py-28 bg-surface/50">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <AnimatedSection className="text-center mb-8">
 <LaptopCodeIcon />
 <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")}</h2>
 <p className="text-muted text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
 </AnimatedSection>

 <AnimatedSection delay={0.1} className="max-w-3xl mx-auto mb-12">
 <p className="text-muted text-base sm:text-lg leading-relaxed text-center">
 {t("intro")}
 </p>
 </AnimatedSection>

 <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
 {points.map((p, i) => {
 const Icon = p.icon;
 return (
 <AnimatedCard key={p.key} delay={i * 0.1}>
 <article className="bg-surface rounded-2xl border border-border p-7 h-full">
 <div className={`w-12 h-12 rounded-2xl ${p.color} flex items-center justify-center mb-5`}>
 <Icon className="w-6 h-6 text-white" />
 </div>
 <h3 className="text-lg font-semibold mb-2">
 {t(`${p.key}Title`)}
 </h3>
 <p className="text-muted text-sm leading-relaxed">
 {t(`${p.key}Desc`)}
 </p>
 </article>
 </AnimatedCard>
 );
 })}
 </div>
 </div>
 </section>
 );
}
