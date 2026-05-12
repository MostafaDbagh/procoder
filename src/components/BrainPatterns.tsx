"use client";

import { Brain, Puzzle, Lightbulb } from "lucide-react";

type Variant = "rubik" | "lego" | "brain" | "legoStack" | "tips" | "question";

const STROKE = "#0F172A";

// Per-cell colors for a "scrambled" look on each face.
const TOP_CELLS = [
 ["#F8FAFC", "#10B981", "#FCD34D"],
 ["#FCD34D", "#F8FAFC", "#3B82F6"],
 ["#F8FAFC", "#FCD34D", "#F8FAFC"],
];
const FRONT_CELLS = [
 ["#FCD34D", "#FCD34D", "#10B981"],
 ["#3B82F6", "#FCD34D", "#FCD34D"],
 ["#FCD34D", "#FCD34D", "#F97316"],
];
const RIGHT_CELLS = [
 ["#EF4444", "#EF4444", "#FCD34D"],
 ["#10B981", "#EF4444", "#EF4444"],
 ["#EF4444", "#3B82F6", "#EF4444"],
];

type Pt = [number, number];

// Build 9 cell polygons for a parallelogram face given:
// - origin: the corner cell (i=0, j=0) starts from
// - uVec: vector from origin along the i axis (full edge length)
// - vVec: vector from origin along the j axis (full edge length)
// - cells[j][i] = fill color for cell (i, j)
function faceCells(origin: Pt, uVec: Pt, vVec: Pt, cells: string[][]) {
 const u: Pt = [uVec[0] / 3, uVec[1] / 3];
 const v: Pt = [vVec[0] / 3, vVec[1] / 3];
 const polys: { points: string; fill: string }[] = [];
 for (let i = 0; i < 3; i++) {
 for (let j = 0; j < 3; j++) {
 const c = (a: number, b: number): Pt => [origin[0] + u[0] * a + v[0] * b, origin[1] + u[1] * a + v[1] * b];
 const p00 = c(i, j);
 const p10 = c(i + 1, j);
 const p11 = c(i + 1, j + 1);
 const p01 = c(i, j + 1);
 const points = [p00, p10, p11, p01].map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");
 polys.push({ points, fill: cells[j]?.[i] ?? "#E5E7EB" });
 }
 }
 return polys;
}

function RubikCube({ size = 160, opacity = 0.22 }: { size?: number; opacity?: number }) {
 // Isometric cube in viewBox 0 0 200 200.
 // Vertices:
 const TL: Pt = [20, 60]; // top-left of top face / top-left of front face
 const TM: Pt = [100, 20]; // back-top of top face
 const TR: Pt = [180, 60]; // top-right of top face / top-right of right face
 const FM: Pt = [100, 100]; // front-top middle (3-face meet)
 const FB: Pt = [100, 180]; // bottom-front
 const RB: Pt = [180, 140]; // bottom-right
 const LB: Pt = [20, 140]; // bottom-left

 const topU: Pt = [TM[0] - TL[0], TM[1] - TL[1]];
 const topV: Pt = [FM[0] - TL[0], FM[1] - TL[1]];
 const frontU: Pt = [FM[0] - TL[0], FM[1] - TL[1]];
 const frontV: Pt = [LB[0] - TL[0], LB[1] - TL[1]];
 const rightU: Pt = [TR[0] - FM[0], TR[1] - FM[1]];
 const rightV: Pt = [FB[0] - FM[0], FB[1] - FM[1]];

 const top = faceCells(TL, topU, topV, TOP_CELLS);
 const front = faceCells(TL, frontU, frontV, FRONT_CELLS);
 const right = faceCells(FM, rightU, rightV, RIGHT_CELLS);

 return (
 <svg width={size} height={size} viewBox="0 0 200 200" style={{ opacity }}>
 {/* Soft drop shadow under cube */}
 <ellipse cx="100" cy="190" rx="80" ry="6" fill="#0F172A" opacity="0.15" />

 {/* TOP face cells */}
 {top.map((p, i) => (
 <polygon key={`t-${i}`} points={p.points} fill={p.fill} stroke={STROKE} strokeWidth={2} strokeLinejoin="round" />
 ))}
 {/* FRONT face cells */}
 {front.map((p, i) => (
 <polygon key={`f-${i}`} points={p.points} fill={p.fill} stroke={STROKE} strokeWidth={2} strokeLinejoin="round" />
 ))}
 {/* RIGHT face cells */}
 {right.map((p, i) => (
 <polygon key={`r-${i}`} points={p.points} fill={p.fill} stroke={STROKE} strokeWidth={2} strokeLinejoin="round" />
 ))}

 {/* Bold outer outline of the cube */}
 <polygon
 points={`${TM[0]},${TM[1]} ${TR[0]},${TR[1]} ${RB[0]},${RB[1]} ${FB[0]},${FB[1]} ${LB[0]},${LB[1]} ${TL[0]},${TL[1]}`}
 fill="none"
 stroke={STROKE}
 strokeWidth={3.2}
 strokeLinejoin="round"
 />
 {/* Inner spine lines (3-face meeting edges) */}
 <line x1={TL[0]} y1={TL[1]} x2={FM[0]} y2={FM[1]} stroke={STROKE} strokeWidth={3.2} />
 <line x1={TR[0]} y1={TR[1]} x2={FM[0]} y2={FM[1]} stroke={STROKE} strokeWidth={3.2} />
 <line x1={FB[0]} y1={FB[1]} x2={FM[0]} y2={FM[1]} stroke={STROKE} strokeWidth={3.2} />
 </svg>
 );
}

function LegoBrick({ width = 140, studs = 4, opacity = 0.08, color = "#EF4444", rotate = 0 }: { width?: number; studs?: number; opacity?: number; color?: string; rotate?: number }) {
 const studSize = width / (studs + 1.2);
 const height = width * 0.42;
 return (
 <svg width={width} height={height + studSize * 0.6} viewBox={`0 0 ${width} ${height + studSize * 0.6}`} style={{ opacity, transform: `rotate(${rotate}deg)` }}>
 {Array.from({ length: studs }).map((_, i) => {
 const cx = studSize * 0.6 + i * (studSize * 1.05) + studSize / 2;
 return (
 <g key={i}>
 <ellipse cx={cx} cy={studSize * 0.55} rx={studSize * 0.42} ry={studSize * 0.18} fill={color} />
 <rect x={cx - studSize * 0.42} y={studSize * 0.2} width={studSize * 0.84} height={studSize * 0.4} fill={color} />
 <ellipse cx={cx} cy={studSize * 0.2} rx={studSize * 0.42} ry={studSize * 0.18} fill={color} stroke="currentColor" strokeWidth={1} />
 </g>
 );
 })}
 <rect x={2} y={studSize * 0.55} width={width - 4} height={height} rx={6} fill={color} stroke="currentColor" strokeWidth={1.4} />
 </svg>
 );
}

// 4-step growing tower — mirrors the 4-step Journey Begins flow.
// Step 1 (bottom) = 1 stud · Step 2 = 2 studs · Step 3 = 3 studs · Step 4 (top) = 4 studs.
function LegoTower({ height = 240, opacity = 0.13 }: { height?: number; opacity?: number }) {
 // Order = bottom → top (step 1 → step 4)
 const steps = [
 { studs: 1, color: "#EC4899" }, // step 1 — pink, smallest
 { studs: 2, color: "#F59E0B" }, // step 2 — amber
 { studs: 3, color: "#3B82F6" }, // step 3 — blue
 { studs: 4, color: "#10B981" }, // step 4 — emerald, biggest
 ];
 const unit = 28; // each stud occupies ~unit horizontal space
 const maxStuds = 4;
 const maxWidth = unit * maxStuds + 20;
 const brickH = height / steps.length;

 return (
 <svg width={maxWidth + 30} height={height} viewBox={`0 0 ${maxWidth + 30} ${height}`} style={{ opacity }}>
 {steps.map((s, i) => {
 const yIndex = steps.length - 1 - i; // step 1 sits at the bottom
 const y = yIndex * brickH;
 const w = unit * s.studs + 16;
 const x = (maxWidth - w) / 2 + 4; // center the stack
 const studSize = unit * 0.85;
 const bodyTop = y + studSize * 0.55;
 const bodyH = brickH - studSize * 0.55 - 6;
 return (
 <g key={i}>
 {Array.from({ length: s.studs }).map((_, k) => {
 const cx = x + 8 + k * unit + unit / 2;
 return (
 <g key={k}>
 <ellipse cx={cx} cy={y + studSize * 0.55} rx={studSize * 0.42} ry={studSize * 0.18} fill={s.color} />
 <rect x={cx - studSize * 0.42} y={y + studSize * 0.2} width={studSize * 0.84} height={studSize * 0.4} fill={s.color} />
 <ellipse cx={cx} cy={y + studSize * 0.2} rx={studSize * 0.42} ry={studSize * 0.18} fill={s.color} stroke={STROKE} strokeWidth={1.2} />
 </g>
 );
 })}
 <rect x={x} y={bodyTop} width={w} height={bodyH} rx={7} fill={s.color} stroke={STROKE} strokeWidth={1.6} />
 {/* step number badge on the brick */}
 <text x={x + w / 2} y={bodyTop + bodyH / 2 + 5} textAnchor="middle" fontSize={Math.min(bodyH * 0.55, 18)} fontWeight="800" fill="#FFFFFF" stroke={STROKE} strokeWidth={0.4} fontFamily="ui-sans-serif, system-ui, sans-serif">
 {i + 1}
 </text>
 </g>
 );
 })}
 {/* Upward arrow alongside reinforces "step → step → step → step" */}
 <g opacity="0.7">
 <line x1={maxWidth + 18} y1={height - 12} x2={maxWidth + 18} y2={20} stroke={STROKE} strokeWidth={2} strokeDasharray="5 5" />
 <polyline points={`${maxWidth + 12},28 ${maxWidth + 18},16 ${maxWidth + 24},28`} fill="none" stroke={STROKE} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
 </g>
 </svg>
 );
}

export function BrainPattern({ variant, className = "" }: { variant: Variant; className?: string }) {
 if (variant === "rubik") {
 // Single cube at the top — clean, no clutter at the bottom of the section.
 return (
 <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
 <div className="absolute top-6 right-[6%] hidden sm:block" style={{ transform: "rotate(18deg)" }}>
 <RubikCube size={200} opacity={0.14} />
 </div>
 </div>
 );
 }

 if (variant === "lego") {
 return (
 <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden text-foreground/30 ${className}`}>
 <div className="absolute top-8 left-[8%] hidden sm:block">
 <LegoBrick width={210} studs={4} color="#EF4444" rotate={-18} opacity={0.10} />
 </div>
 <div className="absolute bottom-10 right-[8%] hidden md:block">
 <LegoBrick width={170} studs={3} color="#3B82F6" rotate={14} opacity={0.09} />
 </div>
 </div>
 );
 }

 if (variant === "legoStack") {
 // Single tower anchored at the bottom — the journey "grows up" from a small piece.
 return (
 <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden text-foreground/30 ${className}`}>
 <div className="absolute bottom-6 left-[6%] hidden sm:block" style={{ transform: "rotate(-4deg)" }}>
 <LegoTower height={280} opacity={0.13} />
 </div>
 </div>
 );
 }

 if (variant === "question") {
 // Floating "?" marks — fits the "why us / parent questions" theme.
 const QMark = ({ size, color }: { size: number; color: string }) => (
 <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
 <text
 x="50"
 y="78"
 textAnchor="middle"
 fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
 fontWeight={900}
 fontSize={96}
 fill={color}
 >
 ?
 </text>
 </svg>
 );
 return (
 <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
 <div className="absolute top-6 right-[6%] hidden sm:block" style={{ transform: "rotate(14deg)", opacity: 0.14 }}>
 <QMark size={180} color="#8B6CFF" />
 </div>
 <div className="absolute bottom-10 left-[6%] hidden md:block" style={{ transform: "rotate(-18deg)", opacity: 0.12 }}>
 <QMark size={140} color="#F59E0B" />
 </div>
 <div className="absolute top-[40%] left-[42%] hidden lg:block" style={{ transform: "rotate(8deg)", opacity: 0.08 }}>
 <QMark size={100} color="#10B981" />
 </div>
 </div>
 );
 }

 if (variant === "tips") {
 // CTA theme — only the lightbulb (ideas). Paper-airplane removed.
 return (
 <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
 <div className="absolute bottom-10 right-[3%] text-amber-400/35 dark:text-amber-300/25 hidden lg:block" style={{ transform: "rotate(14deg)" }}>
 <Lightbulb className="w-28 h-28 xl:w-36 xl:h-36" strokeWidth={1.3} />
 </div>
 </div>
 );
 }

 // brain — both shapes sit inside the section, away from the edges.
 return (
 <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
 <div className="absolute top-6 left-[8%] text-violet-400/30 dark:text-violet-300/20 hidden sm:block" style={{ transform: "rotate(-12deg)" }}>
 <Brain className="w-52 h-52 sm:w-64 sm:h-64" strokeWidth={1.2} />
 </div>
 <div className="absolute top-[45%] right-[8%] text-amber-400/30 dark:text-amber-300/25 hidden md:block" style={{ transform: "rotate(20deg)" }}>
 <Puzzle className="w-44 h-44 sm:w-52 sm:h-52" strokeWidth={1.2} />
 </div>
 </div>
 );
}
