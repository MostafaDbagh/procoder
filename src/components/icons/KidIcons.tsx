type IconProps = { className?: string };

export function KidArrowRightIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="5" y1="12" x2="18" y2="12" />
      <path d="M13 6 L19 12 L13 18" />
    </svg>
  );
}

export function KidSendIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M3 12 L21 4 L17 21 L13 13 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M13 13 L21 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function VideoCameraIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* body */}
      <rect x="8" y="20" width="36" height="24" rx="4" fill="#10B981" stroke="#065F46" strokeWidth="2.5" />
      {/* lens */}
      <path d="M44 26 L56 18 L56 46 L44 38 Z" fill="#10B981" stroke="#065F46" strokeWidth="2.5" strokeLinejoin="round" />
      {/* lens inner */}
      <circle cx="22" cy="32" r="6" fill="#ECFDF5" stroke="#065F46" strokeWidth="2" />
      <circle cx="22" cy="32" r="3" fill="#065F46" />
      <circle cx="20.5" cy="30.5" r="1" fill="#FFFFFF" />
      {/* record dot */}
      <circle cx="36" cy="26" r="2.5" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1" />
      {/* sparkle */}
      <path d="M52 8 L54 12 L58 12 L54 14 L53 18 L51 14 L47 12 L51 12 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
    </svg>
  );
}

export function GiftBoxIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* box */}
      <rect x="10" y="26" width="44" height="30" rx="3" fill="#F59E0B" stroke="#7C2D12" strokeWidth="2.5" />
      {/* lid */}
      <rect x="6" y="22" width="52" height="8" rx="2" fill="#FBBF24" stroke="#7C2D12" strokeWidth="2.5" />
      {/* vertical ribbon */}
      <rect x="28" y="22" width="8" height="34" fill="#EF4444" stroke="#7F1D1D" strokeWidth="2" />
      {/* bow */}
      <path
        d="M22 14 Q26 10 30 14 Q32 18 32 22 Q32 18 34 14 Q38 10 42 14 Q46 18 42 22 L32 22 L22 22 Q18 18 22 14 Z"
        fill="#EF4444"
        stroke="#7F1D1D"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="22" r="2.5" fill="#FBBF24" stroke="#7F1D1D" strokeWidth="1.5" />
      {/* sparkles */}
      <circle cx="10" cy="14" r="2" fill="#A78BFA" />
      <circle cx="56" cy="48" r="2" fill="#10B981" />
    </svg>
  );
}

export function ChipBrainIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* pins */}
      <g stroke="#0E7490" strokeWidth="2" strokeLinecap="round">
        <line x1="14" y1="10" x2="14" y2="16" />
        <line x1="22" y1="10" x2="22" y2="16" />
        <line x1="32" y1="10" x2="32" y2="16" />
        <line x1="42" y1="10" x2="42" y2="16" />
        <line x1="50" y1="10" x2="50" y2="16" />
        <line x1="14" y1="48" x2="14" y2="54" />
        <line x1="22" y1="48" x2="22" y2="54" />
        <line x1="32" y1="48" x2="32" y2="54" />
        <line x1="42" y1="48" x2="42" y2="54" />
        <line x1="50" y1="48" x2="50" y2="54" />
        <line x1="10" y1="22" x2="16" y2="22" />
        <line x1="10" y1="32" x2="16" y2="32" />
        <line x1="10" y1="42" x2="16" y2="42" />
        <line x1="48" y1="22" x2="54" y2="22" />
        <line x1="48" y1="32" x2="54" y2="32" />
        <line x1="48" y1="42" x2="54" y2="42" />
      </g>
      {/* chip body */}
      <rect x="14" y="16" width="36" height="32" rx="4" fill="#67E8F9" stroke="#0E7490" strokeWidth="2.5" />
      {/* inner brain pattern */}
      <rect x="20" y="22" width="24" height="20" rx="3" fill="#ECFEFF" stroke="#0891B2" strokeWidth="1.5" />
      {/* mini brain */}
      <path
        d="M26 28 C24 28, 24 32, 26 32 C24 32, 24 36, 28 36 L28 28 Z"
        fill="#A78BFA"
        stroke="#4C1D95"
        strokeWidth="1.5"
      />
      <path
        d="M38 28 C40 28, 40 32, 38 32 C40 32, 40 36, 36 36 L36 28 Z"
        fill="#A78BFA"
        stroke="#4C1D95"
        strokeWidth="1.5"
      />
      <line x1="32" y1="28" x2="32" y2="36" stroke="#4C1D95" strokeWidth="1.5" />
      {/* sparkle */}
      <path d="M32 10 L33 12 L36 13 L33 14 L32 17 L31 14 L28 13 L31 12 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
    </svg>
  );
}

export function QuestionLightIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* speech bubble */}
      <path
        d="M10 14 C10 8, 14 6, 18 6 L46 6 C50 6, 54 8, 54 14 L54 38 C54 44, 50 46, 46 46 L28 46 L18 56 L20 46 L18 46 C14 46, 10 44, 10 38 Z"
        fill="#A78BFA"
        stroke="#4C1D95"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* big question mark */}
      <path
        d="M26 18 C26 14, 30 12, 32 12 C36 12, 40 14, 40 18 C40 22, 32 24, 32 28 L32 30"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="32" cy="36" r="2.5" fill="#FFFFFF" />
      {/* sparkles around */}
      <circle cx="58" cy="52" r="2" fill="#FBBF24" />
      <circle cx="6" cy="50" r="1.5" fill="#FBA3C0" />
    </svg>
  );
}

export function MailEnvelopeIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <rect x="6" y="14" width="52" height="36" rx="4" fill="#67E8F9" stroke="#0E7490" strokeWidth="2.5" />
      <path d="M6 16 L32 36 L58 16" stroke="#0E7490" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      {/* heart */}
      <path
        d="M32 30 C28 26, 24 24, 24 21 C24 19, 26 18, 28 18 C30 18, 32 19, 32 21 C32 19, 34 18, 36 18 C38 18, 40 19, 40 21 C40 24, 36 26, 32 30 Z"
        fill="#EF4444"
        stroke="#7F1D1D"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneCallIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* phone */}
      <path
        d="M14 14 C14 10, 18 8, 22 12 L26 18 C28 22, 26 24, 22 26 C24 32, 30 38, 36 40 C38 36, 40 34, 44 36 L50 40 C54 44, 52 48, 48 50 C36 52, 12 28, 14 14 Z"
        fill="#10B981"
        stroke="#065F46"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* sound waves */}
      <path d="M44 20 Q48 16 48 12" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M50 22 Q56 18 56 10" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="40" cy="20" r="2" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
    </svg>
  );
}

export function MapPinIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <path
        d="M32 8 C22 8, 14 16, 14 26 C14 38, 32 56, 32 56 C32 56, 50 38, 50 26 C50 16, 42 8, 32 8 Z"
        fill="#A78BFA"
        stroke="#4C1D95"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="26" r="7" fill="#FBBF24" stroke="#92400E" strokeWidth="2" />
      <path d="M32 22 L33 25 L36 25 L33.5 27 L34.5 30 L32 28 L29.5 30 L30.5 27 L28 25 L31 25 Z" fill="#FFFFFF" stroke="#92400E" strokeWidth="0.8" />
    </svg>
  );
}

export function ClockTimeIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <circle cx="32" cy="34" r="22" fill="#FED7AA" stroke="#9A3412" strokeWidth="2.5" />
      <circle cx="32" cy="34" r="18" fill="#FFFBEB" stroke="#C2410C" strokeWidth="1.5" />
      {/* hands */}
      <line x1="32" y1="34" x2="32" y2="22" stroke="#9A3412" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="34" x2="42" y2="38" stroke="#9A3412" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="34" r="2" fill="#9A3412" />
      {/* tick marks */}
      <circle cx="32" cy="20" r="1.5" fill="#9A3412" />
      <circle cx="46" cy="34" r="1.5" fill="#9A3412" />
      <circle cx="32" cy="48" r="1.5" fill="#9A3412" />
      <circle cx="18" cy="34" r="1.5" fill="#9A3412" />
      {/* sparkle */}
      <path d="M52 6 L54 10 L58 10 L54 12 L53 16 L51 12 L47 10 L51 10 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
    </svg>
  );
}

export function BarChartIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* base */}
      <line x1="10" y1="50" x2="56" y2="50" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" />
      {/* bars */}
      <rect x="14" y="34" width="8" height="16" rx="2" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="2" />
      <rect x="26" y="22" width="8" height="28" rx="2" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="2" />
      <rect x="38" y="14" width="8" height="36" rx="2" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="2" />
      {/* arrow up */}
      <path d="M14 30 L26 18 L38 10 L46 10 L42 14" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M50 6 L46 10 L46 14" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* sparkle */}
      <circle cx="56" cy="22" r="2" fill="#FBBF24" />
    </svg>
  );
}

export function BellNotifyIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* bell body */}
      <path
        d="M32 10 C42 10, 46 18, 46 28 C46 36, 50 42, 52 44 L12 44 C14 42, 18 36, 18 28 C18 18, 22 10, 32 10 Z"
        fill="#FBBF24"
        stroke="#92400E"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* clapper */}
      <circle cx="32" cy="50" r="4" fill="#FBBF24" stroke="#92400E" strokeWidth="2" />
      {/* top */}
      <rect x="29" y="6" width="6" height="6" rx="2" fill="#92400E" />
      {/* notification dot */}
      <circle cx="46" cy="14" r="5" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1.5" />
      <text x="46" y="17" textAnchor="middle" fontSize="7" fontWeight="700" fill="#FFFFFF">!</text>
    </svg>
  );
}

export function ReportIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* clipboard */}
      <rect x="10" y="12" width="44" height="46" rx="4" fill="#A78BFA" stroke="#4C1D95" strokeWidth="2.5" />
      <rect x="14" y="16" width="36" height="38" rx="2" fill="#FFFFFF" stroke="#4C1D95" strokeWidth="1.5" />
      {/* clip */}
      <rect x="24" y="6" width="16" height="10" rx="2" fill="#7C3AED" stroke="#4C1D95" strokeWidth="2" />
      {/* lines */}
      <line x1="20" y1="26" x2="44" y2="26" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="32" x2="44" y2="32" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="38" x2="36" y2="38" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
      {/* check */}
      <path d="M22 46 L26 50 L34 42" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function ShieldSafeIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <path
        d="M32 6 L52 14 L52 32 C52 44, 42 54, 32 58 C22 54, 12 44, 12 32 L12 14 Z"
        fill="#10B981"
        stroke="#065F46"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M32 12 L46 18 L46 32 C46 40, 38 48, 32 50 C26 48, 18 40, 18 32 L18 18 Z"
        fill="#34D399"
        stroke="#065F46"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* check */}
      <path d="M24 32 L30 38 L42 26" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function SmileIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* chunky happy star */}
      <path
        d="M32 6 L40 22 L58 24 L44 36 L48 54 L32 45 L16 54 L20 36 L6 24 L24 22 Z"
        fill="#FBBF24"
        stroke="#92400E"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      {/* eyes */}
      <circle cx="26" cy="28" r="2.6" fill="#1F2937" />
      <circle cx="38" cy="28" r="2.6" fill="#1F2937" />
      <circle cx="27" cy="27" r="0.9" fill="#FFFFFF" />
      <circle cx="39" cy="27" r="0.9" fill="#FFFFFF" />
      {/* smile */}
      <path d="M25 35 Q32 41 39 35" stroke="#1F2937" strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function BuildBlocksIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* base block — emerald */}
      <rect x="8" y="42" width="48" height="14" rx="3" fill="#10B981" stroke="#065F46" strokeWidth="2.5" />
      <circle cx="18" cy="40" r="2.5" fill="#10B981" stroke="#065F46" strokeWidth="2" />
      <circle cx="32" cy="40" r="2.5" fill="#10B981" stroke="#065F46" strokeWidth="2" />
      <circle cx="46" cy="40" r="2.5" fill="#10B981" stroke="#065F46" strokeWidth="2" />
      {/* middle block — amber */}
      <rect x="14" y="26" width="36" height="14" rx="3" fill="#FBBF24" stroke="#92400E" strokeWidth="2.5" />
      <circle cx="22" cy="24" r="2.5" fill="#FBBF24" stroke="#92400E" strokeWidth="2" />
      <circle cx="32" cy="24" r="2.5" fill="#FBBF24" stroke="#92400E" strokeWidth="2" />
      <circle cx="42" cy="24" r="2.5" fill="#FBBF24" stroke="#92400E" strokeWidth="2" />
      {/* top block — purple */}
      <rect x="22" y="10" width="20" height="14" rx="3" fill="#A78BFA" stroke="#4C1D95" strokeWidth="2.5" />
      <circle cx="28" cy="8" r="2.5" fill="#A78BFA" stroke="#4C1D95" strokeWidth="2" />
      <circle cx="36" cy="8" r="2.5" fill="#A78BFA" stroke="#4C1D95" strokeWidth="2" />
      {/* sparkle */}
      <path d="M52 12 L54 16 L58 16 L54 18 L53 22 L51 18 L47 16 L51 16 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
    </svg>
  );
}

export function CalendarIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {/* body */}
      <rect x="8" y="14" width="48" height="42" rx="5" fill="#FBA3C0" stroke="#9F1239" strokeWidth="2.5" />
      <rect x="8" y="14" width="48" height="10" rx="5" fill="#EF4444" stroke="#9F1239" strokeWidth="2.5" />
      {/* hooks */}
      <rect x="18" y="8" width="4" height="12" rx="1.5" fill="#9F1239" />
      <rect x="42" y="8" width="4" height="12" rx="1.5" fill="#9F1239" />
      {/* dots */}
      <rect x="14" y="30" width="6" height="6" rx="1" fill="#FFFFFF" />
      <rect x="24" y="30" width="6" height="6" rx="1" fill="#FFFFFF" />
      <rect x="34" y="30" width="6" height="6" rx="1" fill="#FBBF24" stroke="#92400E" strokeWidth="1" />
      <rect x="44" y="30" width="6" height="6" rx="1" fill="#FFFFFF" />
      <rect x="14" y="40" width="6" height="6" rx="1" fill="#FFFFFF" />
      <rect x="24" y="40" width="6" height="6" rx="1" fill="#FFFFFF" />
      <rect x="34" y="40" width="6" height="6" rx="1" fill="#FFFFFF" />
      <rect x="44" y="40" width="6" height="6" rx="1" fill="#FFFFFF" />
    </svg>
  );
}
