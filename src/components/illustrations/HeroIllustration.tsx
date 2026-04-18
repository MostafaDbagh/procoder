"use client";

import { motion } from "framer-motion";

const floatAnim = (delay: number, duration = 3) => ({
 animate: { y: [0, -10, 0] },
 transition: { delay, duration, repeat: Infinity, ease: "easeInOut" as const },
});

const pulseAnim = (delay: number) => ({
 animate: { scale: [1, 1.1, 1], opacity: [0.75, 1, 0.75] },
 transition: { delay, duration: 2.5, repeat: Infinity, ease: "easeInOut" as const },
});

export function HeroIllustration() {
 return (
 <svg
 viewBox="0 0 560 500"
 fill="none"
 xmlns="http://www.w3.org/2000/svg"
 className="w-full h-auto"
 >
 <defs>
 <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
 <stop offset="0%" stopColor="#5B7FD6" stopOpacity="0.12" />
 <stop offset="50%" stopColor="#8B7BC8" stopOpacity="0.08" />
 <stop offset="100%" stopColor="#5CC4A0" stopOpacity="0.12" />
 </linearGradient>
 <linearGradient id="skinBoy" x1="0%" y1="0%" x2="0%" y2="100%">
 <stop offset="0%" stopColor="#F2C9A3" />
 <stop offset="100%" stopColor="#E8B78E" />
 </linearGradient>
 <linearGradient id="skinGirl" x1="0%" y1="0%" x2="0%" y2="100%">
 <stop offset="0%" stopColor="#D4956B" />
 <stop offset="100%" stopColor="#C48560" />
 </linearGradient>
 <linearGradient id="shirtBoy" x1="0%" y1="0%" x2="0%" y2="100%">
 <stop offset="0%" stopColor="#5B7FD6" />
 <stop offset="100%" stopColor="#4A6BBF" />
 </linearGradient>
 <linearGradient id="shirtGirl" x1="0%" y1="0%" x2="0%" y2="100%">
 <stop offset="0%" stopColor="#8B7BC8" />
 <stop offset="100%" stopColor="#7A6AB5" />
 </linearGradient>
 <linearGradient id="laptopBody" x1="0%" y1="0%" x2="0%" y2="100%">
 <stop offset="0%" stopColor="#3A3F55" />
 <stop offset="100%" stopColor="#2C3044" />
 </linearGradient>
 <linearGradient id="screen" x1="0%" y1="0%" x2="100%" y2="100%">
 <stop offset="0%" stopColor="#1E2235" />
 <stop offset="100%" stopColor="#252A3E" />
 </linearGradient>
 </defs>

 {/* ── Background ── */}
 <motion.ellipse
 cx="280" cy="260" rx="250" ry="210"
 fill="url(#bgGrad)"
 initial={{ scale: 0.92 }}
 animate={{ scale: [0.92, 1, 0.92] }}
 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
 />

 {/* ═══════════ DESK ═══════════ */}
 <rect x="80" y="370" width="400" height="12" rx="6" fill="#C4A47A" opacity="0.7" />
 <rect x="110" y="382" width="8" height="50" rx="3" fill="#B89468" opacity="0.5" />
 <rect x="442" y="382" width="8" height="50" rx="3" fill="#B89468" opacity="0.5" />

 {/* ═══════════ LAPTOP ═══════════ */}
 <motion.g initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
 {/* lid */}
 <rect x="155" y="215" width="250" height="155" rx="10" fill="url(#laptopBody)" />
 {/* screen */}
 <rect x="165" y="225" width="230" height="130" rx="6" fill="url(#screen)" />
 {/* camera */}
 <circle cx="280" cy="220" r="2" fill="#4A5060" />

 {/* sidebar */}
 <rect x="165" y="225" width="40" height="130" rx="6" fill="#1A1E2E" />
 <rect x="172" y="238" width="24" height="3" rx="1.5" fill="#5B7FD6" opacity="0.5" />
 <rect x="172" y="248" width="18" height="3" rx="1.5" fill="#555E78" opacity="0.4" />
 <rect x="172" y="258" width="22" height="3" rx="1.5" fill="#555E78" opacity="0.4" />
 <rect x="172" y="268" width="16" height="3" rx="1.5" fill="#555E78" opacity="0.4" />
 <rect x="172" y="278" width="20" height="3" rx="1.5" fill="#555E78" opacity="0.4" />

 {/* tab bar */}
 <rect x="205" y="225" width="190" height="18" fill="#1A1E2E" />
 <rect x="212" y="228" width="50" height="12" rx="3" fill="#252A3E" />
 <rect x="220" y="233" width="28" height="3" rx="1.5" fill="#5B7FD6" opacity="0.6" />

 {/* code lines — typing */}
 <motion.rect x="215" y="252" initial={{ width: 0 }} animate={{ width: 60 }} height="3.5" rx="1.5" fill="#8B7BC8" opacity="0.7" transition={{ delay: 0.8, duration: 0.5 }} />
 <motion.rect x="215" y="262" initial={{ width: 0 }} animate={{ width: 100 }} height="3.5" rx="1.5" fill="#5CC4A0" opacity="0.65" transition={{ delay: 1.0, duration: 0.5 }} />
 <motion.rect x="228" y="272" initial={{ width: 0 }} animate={{ width: 70 }} height="3.5" rx="1.5" fill="#5B7FD6" opacity="0.55" transition={{ delay: 1.2, duration: 0.5 }} />
 <motion.rect x="228" y="282" initial={{ width: 0 }} animate={{ width: 50 }} height="3.5" rx="1.5" fill="#D4A46A" opacity="0.6" transition={{ delay: 1.4, duration: 0.5 }} />
 <motion.rect x="215" y="292" initial={{ width: 0 }} animate={{ width: 85 }} height="3.5" rx="1.5" fill="#8B7BC8" opacity="0.5" transition={{ delay: 1.6, duration: 0.5 }} />
 <motion.rect x="228" y="302" initial={{ width: 0 }} animate={{ width: 55 }} height="3.5" rx="1.5" fill="#5CC4A0" opacity="0.5" transition={{ delay: 1.8, duration: 0.5 }} />
 <motion.rect x="215" y="312" initial={{ width: 0 }} animate={{ width: 95 }} height="3.5" rx="1.5" fill="#5B7FD6" opacity="0.45" transition={{ delay: 2.0, duration: 0.5 }} />
 <motion.rect x="215" y="322" initial={{ width: 0 }} animate={{ width: 40 }} height="3.5" rx="1.5" fill="#D4A46A" opacity="0.5" transition={{ delay: 2.2, duration: 0.5 }} />

 {/* blinking cursor */}
 <motion.rect x="255" y="322" width="2" height="10" rx="1" fill="#5B7FD6"
 animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}
 />

 {/* line numbers */}
 {[252, 262, 272, 282, 292, 302, 312, 322].map((y, i) => (
 <text key={i} x="208" y={y + 3.5} fontSize="5.5" fill="#555E78" fontFamily="monospace">{i + 1}</text>
 ))}

 {/* keyboard base */}
 <path d="M130 370 L155 370 L405 370 L430 370 L438 380 Q440 385 435 385 L125 385 Q120 385 122 380 Z" fill="#3A3F55" opacity="0.8" />
 {/* keyboard lines */}
 <rect x="160" y="374" width="240" height="1.5" rx="0.75" fill="#4A5060" opacity="0.5" />
 <rect x="160" y="378" width="240" height="1.5" rx="0.75" fill="#4A5060" opacity="0.35" />
 {/* trackpad */}
 <rect x="245" y="373" width="70" height="10" rx="3" fill="#4A5060" opacity="0.3" />
 </motion.g>

 {/* ═══════════ BOY — left side ═══════════ */}
 <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.7 }}>
 {/* shadow under */}
 <ellipse cx="155" cy="372" rx="30" ry="4" fill="#000" opacity="0.06" />

 {/* body / shirt */}
 <path d="M132 370 L132 325 Q132 305 152 305 L160 305 Q178 305 178 325 L178 370 Z" fill="url(#shirtBoy)" />
 {/* collar detail */}
 <path d="M145 305 L155 315 L165 305" stroke="#4A6BBF" strokeWidth="2" fill="none" />

 {/* neck */}
 <rect x="148" y="293" width="14" height="14" rx="5" fill="url(#skinBoy)" />

 {/* head */}
 <circle cx="155" cy="272" r="24" fill="url(#skinBoy)" />

 {/* hair — neat and full */}
 <path d="M131 268 Q131 244 155 240 Q179 244 179 268" fill="#3D2B1F" />
 <path d="M131 268 L131 258 Q131 244 155 240 Q179 244 179 258 L179 268" fill="#4A3425" />

 {/* ears */}
 <ellipse cx="132" cy="274" rx="5" ry="7" fill="url(#skinBoy)" />
 <ellipse cx="178" cy="274" rx="5" ry="7" fill="url(#skinBoy)" />

 {/* eyebrows */}
 <path d="M143 264 Q147 261 151 264" stroke="#3D2B1F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
 <path d="M159 264 Q163 261 167 264" stroke="#3D2B1F" strokeWidth="1.5" fill="none" strokeLinecap="round" />

 {/* eyes */}
 <ellipse cx="147" cy="274" rx="3" ry="3.5" fill="#2C2C2C" />
 <ellipse cx="163" cy="274" rx="3" ry="3.5" fill="#2C2C2C" />
 <circle cx="148.2" cy="273" r="1.2" fill="#fff" />
 <circle cx="164.2" cy="273" r="1.2" fill="#fff" />

 {/* nose */}
 <path d="M155 276 Q156 280 155 280" stroke="#D9A880" strokeWidth="1.2" fill="none" strokeLinecap="round" />

 {/* smile */}
 <path d="M148 283 Q155 290 162 283" stroke="#C4856A" strokeWidth="2" fill="none" strokeLinecap="round" />

 {/* left arm */}
 <path d="M132 320 Q115 342 120 365" stroke="url(#skinBoy)" strokeWidth="10" fill="none" strokeLinecap="round" />
 {/* right arm reaching to laptop */}
 <path d="M178 320 Q195 345 200 365" stroke="url(#skinBoy)" strokeWidth="10" fill="none" strokeLinecap="round" />
 {/* hands */}
 <circle cx="120" cy="365" r="6" fill="url(#skinBoy)" />
 <circle cx="200" cy="365" r="6" fill="url(#skinBoy)" />
 </motion.g>

 {/* ═══════════ GIRL — right side ═══════════ */}
 <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.7 }}>
 {/* shadow under */}
 <ellipse cx="405" cy="372" rx="30" ry="4" fill="#000" opacity="0.06" />

 {/* body / top */}
 <path d="M382 370 L382 325 Q382 305 402 305 L410 305 Q428 305 428 325 L428 370 Z" fill="url(#shirtGirl)" />
 {/* collar V */}
 <path d="M395 305 L405 318 L415 305" stroke="#7A6AB5" strokeWidth="2" fill="none" />

 {/* neck */}
 <rect x="398" y="293" width="14" height="14" rx="5" fill="url(#skinGirl)" />

 {/* head */}
 <circle cx="405" cy="272" r="24" fill="url(#skinGirl)" />

 {/* hair — long flowing */}
 <path d="M381 268 Q381 242 405 236 Q429 242 429 268" fill="#1A1A2E" />
 <path d="M381 268 L381 256 Q381 242 405 236 Q429 242 429 256 L429 268" fill="#252540" />
 {/* hair flowing down sides */}
 <path d="M381 268 Q377 296 380 320" stroke="#252540" strokeWidth="10" fill="none" strokeLinecap="round" />
 <path d="M429 268 Q433 296 430 320" stroke="#252540" strokeWidth="10" fill="none" strokeLinecap="round" />

 {/* headband */}
 <path d="M383 258 Q405 250 427 258" stroke="#D4A46A" strokeWidth="3" fill="none" strokeLinecap="round" />

 {/* ears */}
 <ellipse cx="382" cy="274" rx="4.5" ry="6.5" fill="url(#skinGirl)" />
 <ellipse cx="428" cy="274" rx="4.5" ry="6.5" fill="url(#skinGirl)" />
 {/* earring */}
 <circle cx="382" cy="282" r="2" fill="#D4A46A" />
 <circle cx="428" cy="282" r="2" fill="#D4A46A" />

 {/* eyebrows */}
 <path d="M393 264 Q397 261 401 264" stroke="#1A1A2E" strokeWidth="1.3" fill="none" strokeLinecap="round" />
 <path d="M409 264 Q413 261 417 264" stroke="#1A1A2E" strokeWidth="1.3" fill="none" strokeLinecap="round" />

 {/* eyes */}
 <ellipse cx="397" cy="274" rx="3" ry="3.5" fill="#2C2C2C" />
 <ellipse cx="413" cy="274" rx="3" ry="3.5" fill="#2C2C2C" />
 <circle cx="398.2" cy="273" r="1.2" fill="#fff" />
 <circle cx="414.2" cy="273" r="1.2" fill="#fff" />

 {/* eyelashes */}
 <line x1="394" y1="270" x2="392" y2="268" stroke="#1A1A2E" strokeWidth="1.3" strokeLinecap="round" />
 <line x1="416" y1="270" x2="418" y2="268" stroke="#1A1A2E" strokeWidth="1.3" strokeLinecap="round" />

 {/* nose */}
 <path d="M405 276 Q406 280 405 280" stroke="#B5754E" strokeWidth="1.2" fill="none" strokeLinecap="round" />

 {/* smile */}
 <path d="M398 283 Q405 290 412 283" stroke="#A06B50" strokeWidth="2" fill="none" strokeLinecap="round" />

 {/* left arm */}
 <path d="M382 320 Q365 345 360 365" stroke="url(#skinGirl)" strokeWidth="10" fill="none" strokeLinecap="round" />
 {/* right arm */}
 <path d="M428 320 Q445 342 440 365" stroke="url(#skinGirl)" strokeWidth="10" fill="none" strokeLinecap="round" />
 {/* hands */}
 <circle cx="360" cy="365" r="6" fill="url(#skinGirl)" />
 <circle cx="440" cy="365" r="6" fill="url(#skinGirl)" />
 </motion.g>

 {/* ═══════════ FLOATING CARD — terminal ═══════════ */}
 <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, duration: 0.5 }}>
 <motion.g {...floatAnim(0.2, 4)}>
 <rect x="395" y="120" width="135" height="75" rx="10" fill="#1E2235" />
 <rect x="395" y="120" width="135" height="75" rx="10" stroke="#3A3F55" strokeWidth="1.2" fill="none" />
 {/* dots */}
 <circle cx="409" cy="133" r="3.5" fill="#E06C60" opacity="0.8" />
 <circle cx="421" cy="133" r="3.5" fill="#E0C040" opacity="0.8" />
 <circle cx="433" cy="133" r="3.5" fill="#60C060" opacity="0.8" />
 {/* terminal lines */}
 <rect x="409" y="148" width="55" height="3.5" rx="1.5" fill="#5CC4A0" opacity="0.4" />
 <rect x="409" y="158" width="75" height="3.5" rx="1.5" fill="#888FA8" opacity="0.25" />
 <motion.rect x="409" y="168" width="45" height="3.5" rx="1.5" fill="#5B7FD6" opacity="0.35"
 animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1.5, repeat: Infinity }}
 />
 </motion.g>
 </motion.g>

 {/* ═══════════ FLOATING CARD — achievement ═══════════ */}
 <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1, duration: 0.5 }}>
 <motion.g {...floatAnim(1.5, 3.6)}>
 <rect x="30" y="280" width="105" height="52" rx="10" fill="#1E2235" />
 <rect x="30" y="280" width="105" height="52" rx="10" stroke="#3A3F55" strokeWidth="1.2" fill="none" />
 <circle cx="55" cy="306" r="13" fill="#D4A46A" opacity="0.15" />
 <text x="55" y="311" textAnchor="middle" fontSize="14">🏆</text>
 <rect x="76" y="298" width="46" height="4" rx="2" fill="#888FA8" opacity="0.5" />
 <rect x="76" y="308" width="32" height="4" rx="2" fill="#5B7FD6" opacity="0.5" />
 <rect x="76" y="318" width="50" height="3" rx="1.5" fill="#555E78" opacity="0.35" />
 </motion.g>
 </motion.g>

 {/* ═══════════ FLOATING TECH WORDS ═══════════ */}

 {/* Python */}
 <motion.g {...floatAnim(0, 3.5)}>
 <motion.g {...pulseAnim(0.2)}>
 <rect x="55" y="120" width="76" height="30" rx="15" fill="#5B7FD6" opacity="0.15" />
 <rect x="55" y="120" width="76" height="30" rx="15" stroke="#5B7FD6" strokeWidth="1" opacity="0.3" fill="none" />
 <text x="93" y="140" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif" fill="#5B7FD6" opacity="0.85">
 Python
 </text>
 </motion.g>
 </motion.g>

 {/* AI */}
 <motion.g {...floatAnim(0.5, 2.8)}>
 <motion.g {...pulseAnim(0.8)}>
 <rect x="450" y="80" width="52" height="30" rx="15" fill="#8B7BC8" opacity="0.15" />
 <rect x="450" y="80" width="52" height="30" rx="15" stroke="#8B7BC8" strokeWidth="1" opacity="0.3" fill="none" />
 <text x="476" y="100" textAnchor="middle" fontSize="15" fontWeight="800" fontFamily="system-ui, sans-serif" fill="#8B7BC8" opacity="0.9">
 AI
 </text>
 </motion.g>
 </motion.g>

 {/* Arabic */}
 <motion.g {...floatAnim(1, 3.2)}>
 <motion.g {...pulseAnim(0.4)}>
 <rect x="25" y="195" width="68" height="28" rx="14" fill="#D4A46A" opacity="0.12" />
 <rect x="25" y="195" width="68" height="28" rx="14" stroke="#D4A46A" strokeWidth="1" opacity="0.3" fill="none" />
 <text x="59" y="214" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif" fill="#D4A46A" opacity="0.85">
 Arabic
 </text>
 </motion.g>
 </motion.g>

 {/* JS */}
 <g>
 <rect x="475" y="200" width="48" height="28" rx="14" fill="#D4A46A" opacity="0.12" />
 <rect x="475" y="200" width="48" height="28" rx="14" stroke="#D4A46A" strokeWidth="1" opacity="0.3" fill="none" />
 <text x="499" y="219" textAnchor="middle" fontSize="14" fontWeight="800" fontFamily="system-ui, sans-serif" fill="#D4A46A" opacity="0.9">
 JS
 </text>
 </g>

 {/* Robotics */}
 <motion.g {...floatAnim(0.8, 3)}>
 <motion.g {...pulseAnim(1.5)}>
 <rect x="474" y="280" width="82" height="28" rx="14" fill="#10B981" opacity="0.12" />
 <rect x="474" y="280" width="82" height="28" rx="14" stroke="#10B981" strokeWidth="1" opacity="0.3" fill="none" />
 <text x="515" y="299" textAnchor="middle" fontSize="12" fontWeight="700" fontFamily="system-ui, sans-serif" fill="#10B981" opacity="0.85">
 Robotics
 </text>
 </motion.g>
 </motion.g>

 {/* Web Development */}
 <motion.g {...floatAnim(2, 3.3)}>
 <motion.g {...pulseAnim(0.6)}>
 <rect x="215" y="420" width="130" height="28" rx="14" fill="#5CC4A0" opacity="0.12" />
 <rect x="215" y="420" width="130" height="28" rx="14" stroke="#5CC4A0" strokeWidth="1" opacity="0.3" fill="none" />
 <text x="280" y="439" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif" fill="#5CC4A0" opacity="0.85">
 Web Development
 </text>
 </motion.g>
 </motion.g>

 {/* ═══════════ FLOATING DECORATIONS ═══════════ */}

 {/* Lightbulb */}
 <motion.g animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }} transition={{ delay: 0.3, duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
 <circle cx="280" cy="100" r="16" fill="#D4A46A" opacity="0.2" />
 <rect x="276" y="116" width="8" height="5" rx="2" fill="#D4A46A" opacity="0.3" />
 <line x1="280" y1="80" x2="280" y2="74" stroke="#D4A46A" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
 <line x1="296" y1="88" x2="300" y2="84" stroke="#D4A46A" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
 <line x1="264" y1="88" x2="260" y2="84" stroke="#D4A46A" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
 </motion.g>

 {/* Gear (spinning) */}
 <motion.g
 animate={{ rotate: 360 }}
 transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
 style={{ transformOrigin: "510px 155px" }}
 >
 <circle cx="510" cy="155" r="15" stroke="#5CC4A0" strokeWidth="3" fill="none" opacity="0.35" />
 <circle cx="510" cy="155" r="5.5" fill="#5CC4A0" opacity="0.25" />
 <line x1="510" y1="137" x2="510" y2="141" stroke="#5CC4A0" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
 <line x1="510" y1="169" x2="510" y2="173" stroke="#5CC4A0" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
 <line x1="492" y1="155" x2="496" y2="155" stroke="#5CC4A0" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
 <line x1="524" y1="155" x2="528" y2="155" stroke="#5CC4A0" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
 </motion.g>

 {/* Stars */}
 <motion.g animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.15, 0.9] }} transition={{ duration: 2, repeat: Infinity }} style={{ transformOrigin: "155px 148px" }}>
 <polygon points="155,138 158,146 167,146 160,151 162,160 155,155 148,160 150,151 143,146 152,146" fill="#D4A46A" opacity="0.35" />
 </motion.g>
 <motion.g animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }} transition={{ duration: 2.8, repeat: Infinity, delay: 1 }} style={{ transformOrigin: "435px 58px" }}>
 <polygon points="435,49 437,55 443,55 438,59 440,65 435,61 430,65 432,59 427,55 433,55" fill="#5B7FD6" opacity="0.35" />
 </motion.g>

 {/* Floating dots */}
 <motion.circle cx="130" cy="395" r="4" fill="#8B7BC8" opacity="0.25" animate={{ opacity: [0.15, 0.4, 0.15] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
 <motion.circle cx="470" cy="390" r="3.5" fill="#5B7FD6" opacity="0.25" animate={{ opacity: [0.2, 0.45, 0.2] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }} />
 <motion.circle cx="530" cy="340" r="3" fill="#D4A46A" opacity="0.2" animate={{ opacity: [0.15, 0.35, 0.15] }} transition={{ duration: 3, repeat: Infinity }} />
 <motion.circle cx="50" cy="160" r="3.5" fill="#5CC4A0" opacity="0.2" animate={{ opacity: [0.1, 0.35, 0.1] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.8 }} />
 </svg>
 );
}
