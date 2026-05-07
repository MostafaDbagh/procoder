type IconProps = { className?: string };

export function ProgrammingThumb({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* laptop lid */}
      <rect x="10" y="14" width="44" height="30" rx="3" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="2.5" />
      <rect x="13" y="17" width="38" height="24" rx="2" fill="#DBEAFE" stroke="#1E40AF" strokeWidth="1.5" />
      {/* code */}
      <text x="32" y="32" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="700" fill="#1E3A8A">{"</>"}</text>
      {/* base */}
      <rect x="6" y="44" width="52" height="6" rx="2" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="2" />
      {/* sparkle */}
      <path d="M52 8 L54 12 L58 12 L54 14 L53 18 L51 14 L47 12 L51 12 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
    </svg>
  );
}

export function RoboticsThumb({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* antenna */}
      <line x1="32" y1="14" x2="32" y2="6" stroke="#065F46" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="4" r="3" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
      {/* head */}
      <rect x="14" y="14" width="36" height="30" rx="9" fill="#10B981" stroke="#065F46" strokeWidth="2.5" />
      <rect x="20" y="20" width="24" height="16" rx="5" fill="#ECFDF5" stroke="#065F46" strokeWidth="1.5" />
      {/* eyes */}
      <circle cx="27" cy="28" r="2.5" fill="#065F46" />
      <circle cx="37" cy="28" r="2.5" fill="#065F46" />
      <circle cx="28" cy="27" r="0.8" fill="#FFFFFF" />
      <circle cx="38" cy="27" r="0.8" fill="#FFFFFF" />
      {/* smile */}
      <path d="M27 32 Q32 35 37 32" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* body */}
      <rect x="22" y="46" width="20" height="10" rx="3" fill="#10B981" stroke="#065F46" strokeWidth="2" />
      <circle cx="32" cy="51" r="2" fill="#FBBF24" />
    </svg>
  );
}

export function AlgorithmsThumb({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* connections */}
      <line x1="32" y1="16" x2="18" y2="34" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="16" x2="46" y2="34" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="18" y1="34" x2="14" y2="50" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="18" y1="34" x2="30" y2="50" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="46" y1="34" x2="50" y2="50" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
      {/* nodes */}
      <circle cx="32" cy="14" r="6" fill="#A78BFA" stroke="#4C1D95" strokeWidth="2.5" />
      <circle cx="18" cy="34" r="5" fill="#A78BFA" stroke="#4C1D95" strokeWidth="2.5" />
      <circle cx="46" cy="34" r="5" fill="#A78BFA" stroke="#4C1D95" strokeWidth="2.5" />
      <circle cx="14" cy="52" r="4" fill="#FBBF24" stroke="#92400E" strokeWidth="2" />
      <circle cx="30" cy="52" r="4" fill="#FBBF24" stroke="#92400E" strokeWidth="2" />
      <circle cx="50" cy="52" r="4" fill="#FBBF24" stroke="#92400E" strokeWidth="2" />
    </svg>
  );
}

export function ArabicThumb({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* book backdrop */}
      <rect x="10" y="12" width="44" height="40" rx="4" fill="#FECDD3" stroke="#9F1239" strokeWidth="2.5" />
      <line x1="32" y1="12" x2="32" y2="52" stroke="#9F1239" strokeWidth="1.5" />
      {/* arabic letter ك (kaf-like swoosh) */}
      <path
        d="M40 22 Q44 22 44 28 Q44 36 36 36 L20 36 Q18 36 18 32 L18 26"
        stroke="#9F1239"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="40" cy="22" r="2" fill="#BE185D" />
      {/* dots beneath letter */}
      <circle cx="26" cy="44" r="1.5" fill="#9F1239" />
      <circle cx="32" cy="44" r="1.5" fill="#9F1239" />
      <circle cx="38" cy="44" r="1.5" fill="#9F1239" />
      {/* star sparkle */}
      <path d="M52 6 L54 10 L58 10 L54 12 L53 16 L51 12 L47 10 L51 10 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
    </svg>
  );
}

export function GameDevThumb({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* controller body */}
      <path
        d="M14 26 Q14 18 22 18 L42 18 Q50 18 50 26 L52 40 Q52 48 44 48 Q40 48 38 44 L26 44 Q24 48 20 48 Q12 48 12 40 Z"
        fill="#FBBF24"
        stroke="#92400E"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* d-pad */}
      <rect x="20" y="28" width="10" height="3" rx="1" fill="#451A03" />
      <rect x="23.5" y="24.5" width="3" height="10" rx="1" fill="#451A03" />
      {/* buttons */}
      <circle cx="40" cy="28" r="2" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1.5" />
      <circle cx="44" cy="32" r="2" fill="#10B981" stroke="#065F46" strokeWidth="1.5" />
      {/* sparkles */}
      <path d="M52 10 L54 14 L58 14 L54 16 L53 20 L51 16 L47 14 L51 14 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
      <circle cx="10" cy="12" r="2" fill="#A78BFA" />
    </svg>
  );
}

export function MobileAppThumb({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* phone */}
      <rect x="18" y="6" width="28" height="52" rx="5" fill="#F472B6" stroke="#9F1239" strokeWidth="2.5" />
      <rect x="22" y="14" width="20" height="34" rx="2" fill="#FFFFFF" stroke="#9F1239" strokeWidth="1.5" />
      {/* notch */}
      <rect x="28" y="9" width="8" height="2" rx="1" fill="#9F1239" />
      {/* home button */}
      <circle cx="32" cy="53" r="2" fill="#9F1239" />
      {/* app icons */}
      <rect x="24" y="17" width="6" height="6" rx="1.5" fill="#3B82F6" />
      <rect x="32" y="17" width="6" height="6" rx="1.5" fill="#10B981" />
      <rect x="24" y="25" width="6" height="6" rx="1.5" fill="#FBBF24" />
      <rect x="32" y="25" width="6" height="6" rx="1.5" fill="#EF4444" />
      <rect x="24" y="33" width="6" height="6" rx="1.5" fill="#A78BFA" />
      <rect x="32" y="33" width="6" height="6" rx="1.5" fill="#06B6D4" />
      {/* sparkle */}
      <path d="M52 12 L54 16 L58 16 L54 18 L53 22 L51 18 L47 16 L51 16 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
    </svg>
  );
}

export function WebDevThumb({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* browser */}
      <rect x="6" y="12" width="52" height="40" rx="4" fill="#FFFFFF" stroke="#0E7490" strokeWidth="2.5" />
      {/* top bar */}
      <rect x="6" y="12" width="52" height="9" rx="4" fill="#67E8F9" stroke="#0E7490" strokeWidth="2.5" />
      <circle cx="12" cy="16.5" r="1.5" fill="#EF4444" />
      <circle cx="17" cy="16.5" r="1.5" fill="#FBBF24" />
      <circle cx="22" cy="16.5" r="1.5" fill="#10B981" />
      {/* content blocks */}
      <rect x="10" y="25" width="20" height="4" rx="1" fill="#A78BFA" />
      <rect x="10" y="32" width="44" height="3" rx="1" fill="#CBD5E1" />
      <rect x="10" y="38" width="44" height="3" rx="1" fill="#CBD5E1" />
      <rect x="10" y="44" width="28" height="4" rx="1" fill="#FBBF24" />
      {/* sparkle */}
      <path d="M52 4 L54 8 L58 8 L54 10 L53 14 L51 10 L47 8 L51 8 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
    </svg>
  );
}
