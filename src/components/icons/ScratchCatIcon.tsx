import type { SVGProps } from "react";

export function ScratchCatIcon({ className, style, width = 24, height = 24, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 120"
      width={width}
      height={height}
      className={className}
      style={style}
      {...props}
    >
      {/* Tail */}
      <path
        d="M18 90 Q4 100 8 112 Q14 120 22 115 Q16 108 20 100 Z"
        fill="#E8A020"
        stroke="#7a4a00"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Body */}
      <ellipse cx="52" cy="85" rx="26" ry="22" fill="#F5B731" stroke="#7a4a00" strokeWidth="2.5" />
      {/* White belly */}
      <ellipse cx="52" cy="88" rx="14" ry="14" fill="white" stroke="#ddd" strokeWidth="1" />
      {/* Left leg (back) */}
      <path
        d="M30 95 Q22 105 20 115 Q26 118 30 115 Q32 108 38 100 Z"
        fill="#E8A020"
        stroke="#7a4a00"
        strokeWidth="2"
      />
      {/* Right leg */}
      <path
        d="M68 100 Q72 112 76 116 Q80 118 84 115 Q82 110 78 105 Q74 98 70 95 Z"
        fill="#F5B731"
        stroke="#7a4a00"
        strokeWidth="2"
      />
      {/* Left arm */}
      <path
        d="M32 72 Q18 78 14 88 Q18 92 24 90 Q26 82 34 78 Z"
        fill="#E8A020"
        stroke="#7a4a00"
        strokeWidth="2"
      />
      {/* Right arm */}
      <path
        d="M70 68 Q82 62 88 70 Q86 76 80 76 Q76 70 68 74 Z"
        fill="#F5B731"
        stroke="#7a4a00"
        strokeWidth="2"
      />
      {/* Left ear */}
      <path d="M28 28 L20 8 L40 20 Z" fill="#F5B731" stroke="#7a4a00" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Right ear */}
      <path d="M66 28 L78 8 L62 20 Z" fill="#F5B731" stroke="#7a4a00" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Head */}
      <circle cx="50" cy="38" r="28" fill="#F5B731" stroke="#7a4a00" strokeWidth="2.5" />
      {/* White muzzle */}
      <ellipse cx="50" cy="50" rx="16" ry="12" fill="white" stroke="#e0c080" strokeWidth="1" />
      {/* Left eye */}
      <circle cx="38" cy="34" r="9" fill="white" stroke="#7a4a00" strokeWidth="2" />
      <circle cx="39.5" cy="35.5" r="5" fill="#1a1a1a" />
      <circle cx="37" cy="33" r="1.5" fill="white" />
      {/* Right eye */}
      <circle cx="62" cy="34" r="9" fill="white" stroke="#7a4a00" strokeWidth="2" />
      <circle cx="63.5" cy="35.5" r="5" fill="#1a1a1a" />
      <circle cx="61" cy="33" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="46" rx="2.5" ry="1.8" fill="#7a3a00" />
      {/* Smile */}
      <path d="M40 52 Q50 60 60 52" fill="none" stroke="#7a4a00" strokeWidth="2" strokeLinecap="round" />
      {/* Left whiskers */}
      <line x1="10" y1="44" x2="36" y2="48" stroke="#888" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="10" y1="50" x2="36" y2="51" stroke="#888" strokeWidth="1.2" strokeLinecap="round" />
      {/* Right whiskers */}
      <line x1="90" y1="44" x2="64" y2="48" stroke="#888" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="90" y1="50" x2="64" y2="51" stroke="#888" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
