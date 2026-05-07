type IconProps = { className?: string };

export function ChatHeartIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <path
        d="M10 18 C10 12, 14 10, 18 10 L46 10 C50 10, 54 12, 54 18 L54 36 C54 42, 50 44, 46 44 L26 44 L18 52 L20 44 L18 44 C14 44, 10 42, 10 36 Z"
        fill="#FBA3C0"
        stroke="#BE185D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M32 32 C28 28, 22 24, 22 20 C22 17, 24 15, 27 15 C30 15, 32 17, 32 20 C32 17, 34 15, 37 15 C40 15, 42 17, 42 20 C42 24, 36 28, 32 32 Z"
        fill="#EF4444"
        stroke="#7F1D1D"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LiveClassIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* monitor */}
      <rect x="6" y="12" width="52" height="36" rx="5" fill="#FDE68A" stroke="#92400E" strokeWidth="2.5" />
      <rect x="11" y="17" width="42" height="26" rx="3" fill="#ECFEFF" stroke="#0E7490" strokeWidth="2" />
      {/* face on screen */}
      <circle cx="26" cy="28" r="3" fill="#0E7490" />
      <circle cx="38" cy="28" r="3" fill="#0E7490" />
      <path d="M24 35 Q32 40 40 35" stroke="#0E7490" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* stand */}
      <rect x="28" y="48" width="8" height="6" fill="#FDE68A" stroke="#92400E" strokeWidth="2" />
      <rect x="20" y="54" width="24" height="4" rx="2" fill="#FDE68A" stroke="#92400E" strokeWidth="2" />
      {/* live dot */}
      <circle cx="50" cy="20" r="3" fill="#EF4444" />
    </svg>
  );
}

export function GuideChatIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* person body */}
      <rect x="14" y="36" width="20" height="22" rx="6" fill="#67E8F9" stroke="#0E7490" strokeWidth="2.5" />
      {/* head */}
      <circle cx="24" cy="28" r="9" fill="#FDE68A" stroke="#92400E" strokeWidth="2.5" />
      <circle cx="21" cy="27" r="1.5" fill="#0E7490" />
      <circle cx="27" cy="27" r="1.5" fill="#0E7490" />
      <path d="M21 31 Q24 33 27 31" stroke="#0E7490" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* speech bubble */}
      <path
        d="M38 14 C38 10, 42 8, 46 8 L56 8 C60 8, 62 10, 62 14 L62 22 C62 26, 60 28, 56 28 L46 28 L40 32 L42 28 C40 28, 38 26, 38 22 Z"
        fill="#A78BFA"
        stroke="#4C1D95"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="46" cy="18" r="1.5" fill="#FFFFFF" />
      <circle cx="51" cy="18" r="1.5" fill="#FFFFFF" />
      <circle cx="56" cy="18" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

export function BlossomStarIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* flower petals */}
      <circle cx="32" cy="14" r="9" fill="#FBA3C0" stroke="#BE185D" strokeWidth="2" />
      <circle cx="50" cy="32" r="9" fill="#FBA3C0" stroke="#BE185D" strokeWidth="2" />
      <circle cx="32" cy="50" r="9" fill="#FBA3C0" stroke="#BE185D" strokeWidth="2" />
      <circle cx="14" cy="32" r="9" fill="#FBA3C0" stroke="#BE185D" strokeWidth="2" />
      {/* center */}
      <circle cx="32" cy="32" r="8" fill="#FBBF24" stroke="#92400E" strokeWidth="2.5" />
      <circle cx="30" cy="30" r="1.5" fill="#FFFFFF" opacity="0.85" />
      {/* sparkles */}
      <path d="M52 8 L54 12 L58 12 L54 14 L53 18 L51 14 L47 12 L51 12 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
      <circle cx="8" cy="54" r="2" fill="#A78BFA" />
    </svg>
  );
}

export function ThinkBrainIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* left lobe */}
      <path
        d="M30 12 C22 10 14 16 14 24 C10 26 8 32 12 36 C10 42 16 48 22 46 C24 52 32 52 32 46 L32 14 C32 12 31 12 30 12 Z"
        fill="#C4B5FD"
        stroke="#7C5BC8"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* right lobe */}
      <path
        d="M34 12 C42 10 50 16 50 24 C54 26 56 32 52 36 C54 42 48 48 42 46 C40 52 32 52 32 46 L32 14 C32 12 33 12 34 12 Z"
        fill="#A78BFA"
        stroke="#7C5BC8"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* center groove */}
      <path d="M32 14 L32 46" stroke="#7C5BC8" strokeWidth="2" strokeLinecap="round" />
      {/* idea spark */}
      <path
        d="M32 22 L34 27 L39 28 L34 30 L33 36 L31 30 L26 28 L30 27 Z"
        fill="#FBBF24"
        stroke="#D97706"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* small thought dots */}
      <circle cx="48" cy="52" r="2" fill="#A78BFA" />
      <circle cx="54" cy="56" r="1.5" fill="#A78BFA" opacity="0.7" />
    </svg>
  );
}

export function AIBotIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* antenna */}
      <line x1="32" y1="14" x2="32" y2="6" stroke="#0891B2" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="4" r="3" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
      {/* head */}
      <rect x="12" y="14" width="40" height="34" rx="10" fill="#67E8F9" stroke="#0E7490" strokeWidth="2.5" />
      {/* face plate */}
      <rect x="18" y="20" width="28" height="20" rx="6" fill="#ECFEFF" stroke="#0891B2" strokeWidth="1.5" />
      {/* eyes */}
      <circle cx="26" cy="30" r="3" fill="#0E7490" />
      <circle cx="38" cy="30" r="3" fill="#0E7490" />
      <circle cx="27" cy="29" r="1" fill="#FFFFFF" />
      <circle cx="39" cy="29" r="1" fill="#FFFFFF" />
      {/* smile */}
      <path d="M26 35 Q32 39 38 35" stroke="#0E7490" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* ears */}
      <rect x="8" y="24" width="6" height="14" rx="2" fill="#0891B2" />
      <rect x="50" y="24" width="6" height="14" rx="2" fill="#0891B2" />
      {/* chest indicator */}
      <rect x="22" y="50" width="20" height="10" rx="3" fill="#67E8F9" stroke="#0E7490" strokeWidth="2" />
      <circle cx="32" cy="55" r="2.5" fill="#FBBF24" />
    </svg>
  );
}

export function IdeaLightIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* glow rays */}
      <g stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" opacity="0.7">
        <line x1="32" y1="4" x2="32" y2="10" />
        <line x1="14" y1="14" x2="18" y2="18" />
        <line x1="50" y1="14" x2="46" y2="18" />
        <line x1="6" y1="30" x2="12" y2="30" />
        <line x1="58" y1="30" x2="52" y2="30" />
      </g>
      {/* bulb */}
      <path
        d="M22 28 A10 10 0 1 1 42 28 C42 35, 38 38, 36 42 L28 42 C26 38, 22 35, 22 28 Z"
        fill="#FBBF24"
        stroke="#92400E"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* shine */}
      <path d="M28 22 Q30 19 34 19" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85" />
      {/* base */}
      <rect x="26" y="42" width="12" height="5" rx="1.5" fill="#94A3B8" stroke="#334155" strokeWidth="1.5" />
      <rect x="27" y="47" width="10" height="4" rx="1.5" fill="#94A3B8" stroke="#334155" strokeWidth="1.5" />
      {/* filament */}
      <path d="M30 32 Q32 28 34 32 Q32 36 30 32" stroke="#92400E" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function CreativePaletteIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* palette */}
      <path
        d="M32 8 C18 8, 8 18, 8 32 C8 44, 18 52, 28 52 C30 52, 30 50, 30 48 C30 44, 32 42, 36 42 L46 42 C52 42, 56 38, 56 32 C56 18, 46 8, 32 8 Z"
        fill="#FBA3C0"
        stroke="#BE185D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* paint blobs */}
      <circle cx="20" cy="22" r="4" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1.5" />
      <circle cx="34" cy="18" r="4" fill="#FBBF24" stroke="#92400E" strokeWidth="1.5" />
      <circle cx="46" cy="24" r="4" fill="#10B981" stroke="#064E3B" strokeWidth="1.5" />
      <circle cx="46" cy="36" r="4" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="1.5" />
      <circle cx="18" cy="36" r="4" fill="#A78BFA" stroke="#4C1D95" strokeWidth="1.5" />
      {/* thumb hole */}
      <circle cx="38" cy="32" r="3" fill="#FFFFFF" stroke="#BE185D" strokeWidth="1.5" />
    </svg>
  );
}

export function RocketLaunchIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* flames */}
      <path
        d="M26 50 Q24 56 28 60 Q30 56 32 60 Q34 56 36 60 Q40 56 38 50 Z"
        fill="#FBBF24"
        stroke="#D97706"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M30 52 L32 58 L34 52" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1" />
      {/* fins */}
      <path d="M22 42 L18 50 L26 48 Z" fill="#A78BFA" stroke="#4C1D95" strokeWidth="2" strokeLinejoin="round" />
      <path d="M42 42 L46 50 L38 48 Z" fill="#A78BFA" stroke="#4C1D95" strokeWidth="2" strokeLinejoin="round" />
      {/* body */}
      <path
        d="M22 38 C22 22, 32 8, 32 8 C32 8, 42 22, 42 38 L42 50 L22 50 Z"
        fill="#F1F5F9"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* nose */}
      <path d="M28 16 Q32 10 36 16" fill="#EF4444" stroke="#7F1D1D" strokeWidth="2" strokeLinejoin="round" />
      {/* window */}
      <circle cx="32" cy="30" r="6" fill="#67E8F9" stroke="#0E7490" strokeWidth="2.5" />
      <circle cx="30" cy="28" r="2" fill="#FFFFFF" opacity="0.85" />
      {/* sparkles */}
      <circle cx="10" cy="12" r="1.5" fill="#FBBF24" />
      <circle cx="54" cy="14" r="1.5" fill="#A78BFA" />
    </svg>
  );
}

export function BuildToolsIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* hammer */}
      <g transform="rotate(-30 32 32)">
        {/* handle */}
        <rect x="30" y="22" width="4" height="32" rx="2" fill="#92400E" stroke="#451A03" strokeWidth="1.5" />
        {/* head */}
        <rect x="22" y="14" width="20" height="12" rx="3" fill="#F59E0B" stroke="#92400E" strokeWidth="2" />
        <rect x="38" y="16" width="6" height="8" rx="1.5" fill="#FBBF24" stroke="#92400E" strokeWidth="1.5" />
      </g>
      {/* wrench */}
      <g transform="rotate(45 32 32)">
        <rect x="30" y="20" width="4" height="28" rx="2" fill="#94A3B8" stroke="#334155" strokeWidth="1.5" />
        <path
          d="M28 12 A6 6 0 1 1 32 22 L32 28 L28 28 Z"
          fill="#94A3B8"
          stroke="#334155"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="30" cy="14" r="2" fill="#475569" />
      </g>
      {/* sparkle */}
      <path
        d="M50 12 L52 16 L56 16 L52 18 L51 22 L49 18 L45 16 L49 16 Z"
        fill="#FBBF24"
        stroke="#D97706"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
