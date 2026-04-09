"use client";

export function CodingIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <rect width="64" height="64" rx="16" fill="currentColor" className="text-primary/10" />
      <path d="M24 22L16 32L24 42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary/60" />
      <path d="M40 22L48 32L40 42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary/60" />
      <line x1="35" y1="18" x2="29" y2="46" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary/40" />
    </svg>
  );
}

export function RobotIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <rect width="64" height="64" rx="16" fill="currentColor" className="text-mint/10" />
      <rect x="18" y="24" width="28" height="22" rx="4" fill="currentColor" className="text-mint/20" />
      <rect x="22" y="16" width="20" height="14" rx="4" fill="currentColor" className="text-mint/25" />
      <circle cx="28" cy="23" r="2.5" fill="currentColor" className="text-foreground/30" />
      <circle cx="36" cy="23" r="2.5" fill="currentColor" className="text-foreground/30" />
      <line x1="32" y1="12" x2="32" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-mint/40" />
      <circle cx="32" cy="6" r="2" fill="currentColor" className="text-mint/40" />
      <rect x="12" y="30" width="6" height="10" rx="2" fill="currentColor" className="text-mint/15" />
      <rect x="46" y="30" width="6" height="10" rx="2" fill="currentColor" className="text-mint/15" />
      <rect x="24" y="46" width="6" height="8" rx="2" fill="currentColor" className="text-mint/15" />
      <rect x="34" y="46" width="6" height="8" rx="2" fill="currentColor" className="text-mint/15" />
    </svg>
  );
}

export function QuranIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <rect width="64" height="64" rx="16" fill="currentColor" className="text-mint/8" />
      <rect x="16" y="12" width="32" height="40" rx="4" fill="currentColor" className="text-mint/18" />
      <line x1="32" y1="12" x2="32" y2="52" stroke="currentColor" strokeWidth="2" className="text-mint/30" />
      <rect x="21" y="20" width="8" height="2" rx="1" fill="currentColor" className="text-mint/30" />
      <rect x="21" y="26" width="6" height="2" rx="1" fill="currentColor" className="text-mint/30" />
      <rect x="35" y="20" width="8" height="2" rx="1" fill="currentColor" className="text-mint/30" />
      <rect x="35" y="26" width="6" height="2" rx="1" fill="currentColor" className="text-mint/30" />
      <circle cx="32" cy="38" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-mint/30" />
      <circle cx="32" cy="38" r="2" fill="currentColor" className="text-mint/25" />
    </svg>
  );
}

export function ArabicIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <rect width="64" height="64" rx="16" fill="currentColor" className="text-pink/8" />
      <path d="M20 38 C20 28, 28 22, 36 26 C44 30, 44 38, 36 42 C28 46, 24 40, 28 36" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" className="text-pink/35" />
      <circle cx="38" cy="28" r="2" fill="currentColor" className="text-pink/35" />
      <circle cx="26" cy="44" r="2" fill="currentColor" className="text-pink/35" />
      <path d="M18 48 L46 48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-pink/20" />
    </svg>
  );
}

export function AlgorithmIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <rect width="64" height="64" rx="16" fill="currentColor" className="text-purple/8" />
      <circle cx="32" cy="18" r="6" fill="currentColor" className="text-purple/20" />
      <circle cx="20" cy="40" r="6" fill="currentColor" className="text-purple/20" />
      <circle cx="44" cy="40" r="6" fill="currentColor" className="text-purple/20" />
      <line x1="28" y1="23" x2="22" y2="35" stroke="currentColor" strokeWidth="2" className="text-purple/25" />
      <line x1="36" y1="23" x2="42" y2="35" stroke="currentColor" strokeWidth="2" className="text-purple/25" />
      <line x1="26" y1="40" x2="38" y2="40" stroke="currentColor" strokeWidth="2" className="text-purple/25" />
      <circle cx="32" cy="18" r="2.5" fill="currentColor" className="text-purple/35" />
      <circle cx="20" cy="40" r="2.5" fill="currentColor" className="text-purple/35" />
      <circle cx="44" cy="40" r="2.5" fill="currentColor" className="text-purple/35" />
    </svg>
  );
}

export function ChildLearningIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className}>
      {/* Child */}
      <circle cx="40" cy="24" r="12" fill="currentColor" className="text-orange/15" />
      <circle cx="36" cy="23" r="1.5" fill="currentColor" className="text-foreground/30" />
      <circle cx="44" cy="23" r="1.5" fill="currentColor" className="text-foreground/30" />
      <path d="M37 28 Q40 31 43 28" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" className="text-foreground/25" />
      {/* Body */}
      <ellipse cx="40" cy="48" rx="14" ry="12" fill="currentColor" className="text-primary/10" />
      {/* Book in hands */}
      <rect x="30" y="52" width="20" height="14" rx="2" fill="currentColor" className="text-primary/15" />
      <line x1="40" y1="52" x2="40" y2="66" stroke="currentColor" strokeWidth="1" className="text-primary/25" />
      <rect x="33" y="56" width="5" height="1.5" rx="0.75" fill="currentColor" className="text-primary/25" />
      <rect x="42" y="56" width="5" height="1.5" rx="0.75" fill="currentColor" className="text-primary/25" />
      {/* Sparkle */}
      <circle cx="58" cy="16" r="3" fill="currentColor" className="text-orange/20" />
      <circle cx="22" cy="18" r="2" fill="currentColor" className="text-primary/20" />
    </svg>
  );
}
