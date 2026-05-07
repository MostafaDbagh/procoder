"use client";

import { motion } from "framer-motion";

type Pose = "wave" | "happy" | "thinking";

type Props = {
  pose?: Pose;
  size?: number;
  className?: string;
};

export function Mascot({ pose = "wave", size = 160, className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 200 240"
      width={size}
      height={size * 1.2}
      className={className}
      role="img"
      aria-label="Bobo — the StemTechLab mascot"
    >
      {/* ground shadow */}
      <ellipse cx="100" cy="228" rx="58" ry="6" fill="#A78BFA" opacity="0.18" />

      {/* antenna */}
      <line x1="100" y1="38" x2="100" y2="22" stroke="#8B7BC8" strokeWidth="3" strokeLinecap="round" />
      <motion.circle
        cx="100"
        cy="14"
        r="7"
        fill="#FBBF24"
        animate={{ scale: [1, 1.3, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="98" cy="11" r="2" fill="#FEF3C7" />

      {/* head */}
      <rect x="48" y="38" width="104" height="94" rx="34" fill="#A78BFA" />
      <rect x="48" y="38" width="104" height="94" rx="34" fill="none" stroke="#8B7BC8" strokeWidth="3" />

      {/* face plate */}
      <rect x="62" y="58" width="76" height="58" rx="22" fill="#F5F3FF" />
      <rect x="62" y="58" width="76" height="58" rx="22" fill="none" stroke="#C4B5FD" strokeWidth="2" />

      {/* eyes — blink loop */}
      <motion.g
        animate={{ scaleY: [1, 1, 0.1, 1] }}
        transition={{
          duration: 4,
          times: [0, 0.92, 0.96, 1],
          repeat: Infinity,
        }}
        style={{ transformOrigin: "100px 88px" }}
      >
        <circle cx="83" cy="88" r="8" fill="#2D3748" />
        <circle cx="117" cy="88" r="8" fill="#2D3748" />
        <circle cx="86" cy="85" r="2.4" fill="#FFFFFF" />
        <circle cx="120" cy="85" r="2.4" fill="#FFFFFF" />
      </motion.g>

      {/* smile */}
      <path
        d="M82 102 Q100 114 118 102"
        stroke="#2D3748"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* cheeks */}
      <circle cx="70" cy="103" r="4" fill="#FBA3C0" opacity="0.65" />
      <circle cx="130" cy="103" r="4" fill="#FBA3C0" opacity="0.65" />

      {/* neck */}
      <rect x="92" y="132" width="16" height="10" fill="#8B7BC8" />

      {/* body */}
      <rect x="52" y="142" width="96" height="68" rx="22" fill="#A78BFA" />
      <rect x="52" y="142" width="96" height="68" rx="22" fill="none" stroke="#8B7BC8" strokeWidth="3" />

      {/* chest light */}
      <circle cx="100" cy="174" r="11" fill="#FBBF24" />
      <circle cx="100" cy="174" r="6" fill="#FDE68A" />
      <circle cx="97" cy="171" r="2" fill="#FFFFFF" opacity="0.9" />

      {/* left arm — at rest */}
      <rect x="34" y="152" width="20" height="42" rx="10" fill="#A78BFA" />
      <rect x="34" y="152" width="20" height="42" rx="10" fill="none" stroke="#8B7BC8" strokeWidth="3" />
      <circle cx="44" cy="200" r="9" fill="#A78BFA" stroke="#8B7BC8" strokeWidth="3" />

      {/* right arm — waving */}
      <motion.g
        animate={
          pose === "wave"
            ? { rotate: [0, -22, 8, -22, 0] }
            : pose === "happy"
            ? { rotate: [0, -8, 0] }
            : { rotate: 0 }
        }
        transition={{
          duration: pose === "wave" ? 1.6 : 2,
          repeat: Infinity,
          repeatDelay: pose === "wave" ? 1 : 0,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "156px 156px" }}
      >
        <rect x="146" y="118" width="20" height="42" rx="10" fill="#A78BFA" />
        <rect x="146" y="118" width="20" height="42" rx="10" fill="none" stroke="#8B7BC8" strokeWidth="3" />
        <circle cx="156" cy="113" r="11" fill="#A78BFA" stroke="#8B7BC8" strokeWidth="3" />
      </motion.g>
    </svg>
  );
}
