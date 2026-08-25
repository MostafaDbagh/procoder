"use client";

import { useCallback, useRef, useState, type ElementType, type KeyboardEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { LocalizedLink } from "@/components/LocalizedLink";
import { JOURNEY_LEVEL_LIST, type JourneyLevel } from "@/data/journeyLevels";
import {
  Compass,
  Blocks,
  Palette,
  Lightbulb,
  Rocket,
  Flag,
  ArrowRight,
} from "lucide-react";

const LEVEL_ICONS: Record<JourneyLevel, ElementType> = {
  explorer: Compass,
  builder: Blocks,
  creator: Palette,
  innovator: Lightbulb,
  pro: Rocket,
};

/* ── Geometry ───────────────────────────────────────────────────────────────
   The map is a FIXED 960x700 CSS-px box, never an aspect ratio: viewBox
   "0 0 960 700" means one SVG user unit equals one CSS pixel at every viewport,
   so the stone coordinates and the HTML columns can never drift apart.

   Do NOT convert this to aspect-[960/700] with percentage-positioned stops.
   That is what makes card-vs-stone overlap viewport-dependent.

   Two limits bound the card width, and this geometry sits where they meet:
     - neighbour stone:  CARD_W/2 <= pitch(226) - stone radius(36) = 190
     - page gutter:      CARD_W/2 - margin(156) <= 32, the max safe overhang
   At CARD_W 368 both hold with room to spare, so no card can ever cover a stone
   and the outer cards never push past the viewport. Widening past 376 breaks
   one or the other. The layout gate is 1280px (globals.css) = max-w-7xl, whose
   gutter leaves exactly this 1216px box.                                    */
const FRAME_W = 1216;
const STOPS: ReadonlyArray<readonly [number, number]> = [
  [156, 400],
  [382, 330],
  [608, 260],
  [834, 190],
  [1060, 120],
];
const COLUMN_W = 280;
/** Frame height AND svg viewBox height. Changing one without the other makes
 *  the SVG letterbox and breaks the 1-unit = 1-px rule. Extra room below the
 *  last stop is apron for the open cards. */
const BOX_H = 910;
/* Card width (368px) and its centring offset live in globals.css under
   `.jm-card`, because the CSS-only reveal needs them there. Keep the two in
   sync — the invariant above is what bounds that number. Cards are centred on
   their stone and never clamped to the frame edge: clamping slides the outer
   cards sideways onto their neighbour's stone. */
const STONE_R = 36;

/** Horizontal cubic handles at half the pitch keep the tangent level at every
 *  stone and the whole curve G1-continuous. Generated so a sixth stop is a
 *  one-line change rather than a hand-edited path string. */
const HANDLE = 113;
function segmentsFrom(stops: ReadonlyArray<readonly [number, number]>): string[] {
  const segs = [`M 52 ${stops[0][1]} L ${stops[0][0]} ${stops[0][1]}`];
  for (let i = 0; i < stops.length - 1; i++) {
    const [x1, y1] = stops[i];
    const [x2, y2] = stops[i + 1];
    segs.push(`M ${x1} ${y1} C ${x1 + HANDLE} ${y1}, ${x2 - HANDLE} ${y2}, ${x2} ${y2}`);
  }
  const [lx, ly] = stops[stops.length - 1];
  segs.push(`M ${lx} ${ly} C 1130 ${ly}, 1150 ${ly - 8}, 1178 ${ly - 24}`);
  return segs;
}
const TRAIL_SEGMENTS = segmentsFrom(STOPS);
const TRAIL_D = TRAIL_SEGMENTS.map((d, i) => (i ? d.replace(/^M [\d.]+ [\d.]+ /, "") : d)).join(" ");

/** The t=0.5 point of each interior cubic — guaranteed to sit on the curve. */
const LILY_PADS = STOPS.slice(0, -1).map(([x1, y1], i) => {
  const [x2, y2] = STOPS[i + 1];
  return [(x1 + x2) / 2, (y1 + y2) / 2] as const;
});

const STARS: ReadonlyArray<readonly [number, number, number]> = [
  [1112, 62, 1.4],
  [1148, 38, 0.9],
  [1174, 80, 1.1],
  [1126, 106, 0.7],
  [1160, 122, 1.0],
];
const STAR_D = "M0 -7 Q1 -1 7 0 Q1 1 0 7 Q-1 1 -7 0 Q-1 -1 0 -7 Z";

export default function JourneyStoneTrail({
  courseCounts,
}: {
  courseCounts: Record<JourneyLevel, number>;
}) {
  const t = useTranslations("journey.index");
  const tLevels = useTranslations("journey.levels");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const isRtl = locale === "ar";

  /** Drives the progress glow only. If JS never runs, only the glow is missing. */
  const [active, setActive] = useState<number | null>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const litCount = active === null ? 0 : active === STOPS.length - 1 ? TRAIL_SEGMENTS.length : active + 1;

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLAnchorElement>, i: number) => {
      const last = JOURNEY_LEVEL_LIST.length - 1;
      const fwd = isRtl ? "ArrowLeft" : "ArrowRight";
      const back = isRtl ? "ArrowRight" : "ArrowLeft";
      let next: number | null = null;
      if (e.key === fwd || e.key === "ArrowDown") next = Math.min(i + 1, last);
      else if (e.key === back || e.key === "ArrowUp") next = Math.max(i - 1, 0);
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = last;
      else if (e.key === "Escape") {
        setActive(null);
        return;
      }
      if (next === null) return;
      e.preventDefault();
      linkRefs.current[next]?.focus();
    },
    [isRtl]
  );

  const inView = { once: true, margin: "-80px" } as const;

  return (
    <>
      <p className="mt-2 hidden text-[13px] text-muted map:block">{t("mapHint")}</p>

      {/* Fixed 960x700 box in map mode. Never overflow-hidden — cards spill
          below y=690 by design and map:pb-16 on the section is their clearance. */}
      <div
        className="jm-frame relative mt-6 px-1 py-8 sm:py-10 map:mx-auto map:mt-8 map:h-[910px] map:w-[1216px] map:px-0 map:py-0"
        data-active={active ?? undefined}
      >
        {/* Rail-mode atmosphere: warm ground at the top, deep sky at the bottom,
            so scrolling down still reads as climbing. One class, no SVG. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-amber-50/70 via-transparent to-indigo-100/70 dark:from-amber-950/20 dark:via-transparent dark:to-indigo-950/40 map:bg-none"
        />

        <GrowthWatermark />

        {/* Decorative only. NEVER put a <text> node in here — the RTL mirror on
            the svg below would render it backwards.
            The mirror is an inline style, not an rtl: utility: the utility does
            not compile here, and without the flip the trail climbs one way while
            the HTML columns mirror, leaving every stone off the path. */}
        <svg
          viewBox={"0 0 " + FRAME_W + " " + BOX_H}
          fill="none"
          aria-hidden="true"
          focusable="false"
          role="presentation"
          className="pointer-events-none absolute inset-0 hidden h-full w-full map:block"
          style={isRtl ? { transform: "scaleX(-1)" } : undefined}
        >
          <defs>
            {/* userSpaceOnUse along the ascent axis, so each stone sits exactly
                on its own colour stop and the gradient cannot drift. */}
            <linearGradient id="jmTrail" gradientUnits="userSpaceOnUse" x1="156" y1="400" x2="1060" y2="120">
              <stop offset="0" stopColor="#8b5cf6" />
              <stop offset="0.25" stopColor="#0ea5e9" />
              <stop offset="0.5" stopColor="#10b981" />
              <stop offset="0.75" stopColor="#f59e0b" />
              <stop offset="1" stopColor="#f43f5e" />
            </linearGradient>
            {/* A width wipe, not pathLength: framer-motion implements pathLength
                by writing stroke-dasharray, which would destroy the dash pattern. */}
            <mask id="jmWipe" maskUnits="userSpaceOnUse" x="0" y="0" width={FRAME_W} height={BOX_H}>
              {reduce ? (
                <rect x="0" y="0" width={FRAME_W} height={BOX_H} fill="#fff" />
              ) : (
                <motion.rect
                  x="0"
                  y="0"
                  height={BOX_H}
                  fill="#fff"
                  initial={{ width: 0 }}
                  whileInView={{ width: FRAME_W }}
                  viewport={inView}
                  transition={{ duration: 1.15, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </mask>
          </defs>

          <g mask="url(#jmWipe)">
            {/* Bed under the dashes — matters more in dark, where bare dashes
                float and stop reading as one continuous line. */}
            <path d={TRAIL_D} stroke="var(--jm-bed)" strokeWidth={20} strokeLinecap="round" fill="none" />
            <path
              d={TRAIL_D}
              stroke="url(#jmTrail)"
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray="16 20"
              fill="none"
              className="jm-march opacity-90 dark:opacity-100"
            />

            {/* Progress glow — lights the trail from the flag up to the active stop. */}
            {TRAIL_SEGMENTS.map((d, k) => (
              <g
                key={k}
                className="jm-lit"
                data-lit={k < litCount}
                style={{ ["--d" as string]: `${k * 50}ms` }}
              >
                <path d={d} stroke="url(#jmTrail)" strokeWidth={16} strokeLinecap="round" fill="none" opacity={0.18} />
                <path d={d} stroke="url(#jmTrail)" strokeWidth={9} strokeLinecap="round" strokeDasharray="16 20" fill="none" />
              </g>
            ))}
          </g>

          {/* Lily pads */}
          {LILY_PADS.map(([x, y], k) =>
            reduce ? (
              <circle key={k} cx={x} cy={y} r={7} fill="var(--jm-dot)" />
            ) : (
              <motion.circle
                key={k}
                cx={x}
                cy={y}
                r={7}
                fill="var(--jm-dot)"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1, y: [0, -2, 0] }}
                viewport={inView}
                style={{ originX: `${x}px`, originY: `${y}px` }}
                transition={{
                  scale: { duration: 0.3, delay: 0.25 + k * 0.14 },
                  opacity: { duration: 0.3, delay: 0.25 + k * 0.14 },
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: k * 0.4 },
                }}
              />
            )
          )}

          {/* Summit stars — the arrival. Brighten when Pro is active. */}
          <g className={`transition-opacity duration-300 ${active === 4 ? "opacity-[0.55]" : "opacity-[0.28]"}`}>
            {STARS.map(([x, y, sc], n) =>
              reduce ? (
                <path key={n} d={STAR_D} fill="var(--jm-star)" transform={`translate(${x} ${y}) scale(${sc})`} />
              ) : (
                <motion.path
                  key={n}
                  d={STAR_D}
                  fill="var(--jm-star)"
                  transform={`translate(${x} ${y}) scale(${sc})`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={inView}
                  transition={{ duration: 0.32, delay: 0.9 + n * 0.06 }}
                />
              )
            )}
          </g>
        </svg>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.3, delay: 0.12 }}
          className="jm-start mb-5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[12px] font-bold text-primary map:absolute map:top-[326px] map:start-[18px] map:mb-0"
        >
          <Flag className="h-3.5 w-3.5" aria-hidden />
          {t("startHere")}
        </motion.p>

        <ol className="jm-stops relative flex flex-col gap-8 sm:gap-10 map:block map:h-full map:gap-0" aria-label={t("mapLabel")}>
          {JOURNEY_LEVEL_LIST.map((lvl, i) => {
            const Icon = LEVEL_ICONS[lvl.key];
            const [x, y] = STOPS[i];
            const count = courseCounts[lvl.key] ?? 0;
            const next = JOURNEY_LEVEL_LIST[i + 1];
            const stoneDelay = 0.18 + i * 0.14;

            return (
              <motion.li
                key={lvl.key}
                className="jm-stop relative grid grid-cols-[56px_1fr] items-start gap-x-3.5 map:block map:w-[280px]"
                onPointerEnter={(e) => {
                  if (e.pointerType !== "touch") setActive(i);
                }}
                onPointerLeave={() => setActive(null)}
                style={{
                  ["--jm-x" as string]: `${x - COLUMN_W / 2}px`,
                  ["--jm-y" as string]: `${y - STONE_R}px`,
                }}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                {/* Mobile rail connector: no SVG, so it auto-sizes to any copy
                    length in any locale and mirrors for free. Colour-graded
                    toward the next level. */}
                {next && (
                  <span
                    aria-hidden
                    className="absolute top-[60px] -bottom-8 w-[3px] rounded-full sm:-bottom-10 map:hidden"
                    style={{
                      insetInlineStart: "26.5px",
                      color: next.accentHex,
                      backgroundImage:
                        "repeating-linear-gradient(to bottom, currentColor 0 9px, transparent 9px 20px)",
                    }}
                  />
                )}

                <LocalizedLink
                  href={`/learning-path/${lvl.key}`}
                  ref={(el: HTMLAnchorElement | null) => {
                    linkRefs.current[i] = el;
                  }}
                  aria-describedby={`jm-desc-${lvl.key}`}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className="jm-link group relative z-20 col-span-2 grid grid-cols-[56px_1fr] items-center gap-x-3.5 rounded-2xl outline-none focus:outline-none focus-visible:outline-none after:absolute after:inset-0 after:content-[''] map:after:content-none map:mx-auto map:flex map:w-fit map:flex-col map:items-center map:gap-2"
                >
                  {/* Stone. The focus ring is drawn here, not by the global
                      *:focus-visible rule, which forces border-radius:4px and
                      would put a rounded square around a circle. */}
                  <motion.span
                    initial={reduce ? false : { scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={inView}
                    transition={
                      reduce
                        ? undefined
                        : { type: "spring", stiffness: 420, damping: 20, delay: stoneDelay }
                    }
                    className={`jm-stone relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br ${lvl.gradient} shadow-lg ${lvl.accentShadow} ring-4 ring-background transition-transform duration-200 ease-[cubic-bezier(.34,1.4,.5,1)] group-focus-visible:ring-4 group-focus-visible:ring-primary group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background motion-reduce:transition-none map:h-[72px] map:w-[72px] map:group-hover:scale-[1.12] map:group-focus-visible:scale-[1.12]`}
                  >
                    <Icon
                      aria-hidden
                      className="h-6 w-6 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,.35)] transition-transform duration-200 map:h-7 map:w-7 map:group-hover:-rotate-6"
                    />
                    <span
                      aria-hidden
                      className={`jm-num absolute -top-1.5 -end-1.5 grid h-6 w-6 place-items-center rounded-full bg-surface font-kid text-[13px] font-black leading-none ring-[3px] ring-current shadow-sm ${lvl.accentText} map:h-7 map:w-7 map:text-[15px] ${
                        i % 2 ? "rotate-6" : "-rotate-6"
                      } transition-transform duration-200 map:group-hover:rotate-0 map:group-hover:scale-110`}
                    >
                      {lvl.step}
                    </span>
                  </motion.span>

                  <motion.span
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={inView}
                    transition={{ duration: 0.28, delay: stoneDelay + 0.08 }}
                    className={`jm-label block text-start map:h-[46px] map:w-[140px] map:text-center ${
                      i % 2 ? "map:rotate-2" : "map:-rotate-2"
                    }`}
                  >
                    <span className="sr-only">{t("stepLabel", { n: lvl.step })}: </span>
                    <span className="block text-[15px] font-extrabold leading-tight">
                      <bdi>{tLevels(`${lvl.key}.meta.name`)}</bdi>
                    </span>
                    <span className="block text-[12px] font-semibold text-muted">
                      <bdi>{tLevels(`${lvl.key}.meta.ages`)}</bdi>
                    </span>
                  </motion.span>
                </LocalizedLink>

                {/* z-30 puts the open card above neighbouring links (z-20) —
                    a 328px card overlaps its neighbours' columns, and without
                    this their stone labels draw straight through it. It never
                    covers its own stone, which sits 14px above the card top.

                    Card is a SIBLING of the link, never a descendant: keeps the
                    accessible name to "Stage 2: Builder, Ages 8-10" instead of
                    absorbing the whole description, which aria-describedby
                    already announces exactly once. */}
                <div className="jm-card relative col-start-2 mt-2 rounded-2xl border border-transparent p-0 text-start map:absolute map:mt-0 map:top-[calc(100%+14px)] map:z-30 map:border map:p-5">
                  {/* Accent cap ties the card back to its stone's colour. */}
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 top-0 hidden h-1.5 rounded-t-2xl bg-gradient-to-r ${lvl.gradient} map:block`}
                  />
                  <p
                    aria-hidden="true"
                    className={`text-[13px] font-bold map:text-[14px] ${lvl.accentText}`}
                  >
                    {tLevels(`${lvl.key}.meta.tagline`)}
                  </p>
                  <p
                    id={`jm-desc-${lvl.key}`}
                    className="mt-2 text-[13px] leading-[1.55] text-muted map:line-clamp-3 map:text-[14px] map:leading-[1.6]"
                  >
                    {tLevels(`${lvl.key}.meta.desc`)}
                  </p>
                  {/* What the child practises here — the most useful extra
                      detail we hold per level, and it fills the card honestly. */}
                  <div aria-hidden="true" className="mt-3 hidden border-t border-border pt-3 map:block">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                      {tLevels(`${lvl.key}.practice.sectionLabel`)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(tLevels.raw(`${lvl.key}.practice.habits`) as { name: string }[])
                        .slice(0, 4)
                        .map((h) => (
                          <span
                            key={h.name}
                            className={`rounded-full bg-surface-hover px-2 py-0.5 text-[11px] font-semibold ${lvl.accentText}`}
                          >
                            {h.name}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div aria-hidden="true" className="mt-3 border-t border-border pt-3">
                    {count > 0 && (
                      <span
                        className={`inline-flex rounded-full bg-surface-hover px-2.5 py-1 text-[12px] font-semibold ${lvl.accentText}`}
                      >
                        {t("coursesCount", { count })}
                      </span>
                    )}
                    <LocalizedLink
                      href={`/learning-path/${lvl.key}`}
                      tabIndex={-1}
                      className={`mt-2 inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-bold hover:underline map:text-[14px] ${lvl.accentText}`}
                    >
                      {t("viewLevel")}
                      <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                    </LocalizedLink>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </>
  );
}

/**
 * A quiet growth chart behind the trail: one rounded bar per stage, each in that
 * stage's own colour and each taller than the last. It says "your child gets
 * further at every level" without needing a caption, and stays faint enough to
 * sit under the map rather than compete with it.
 *
 * Its own svg, so the trail svg's RTL mirror does not apply twice; mirrored here
 * independently, which is safe because it contains no text.
 */
function GrowthWatermark() {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const BAR_W = 58;
  const GAP = 26;
  const HEIGHTS = [78, 116, 154, 198, 248];
  const BASE = 248;
  const W = HEIGHTS.length * BAR_W + (HEIGHTS.length - 1) * GAP;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="presentation"
      viewBox={`0 0 ${W} ${BASE}`}
      width={W}
      height={BASE}
      fill="none"
      className="pointer-events-none absolute bottom-10 start-2 -z-10 hidden select-none map:block"
      style={isRtl ? { transform: "scaleX(-1)" } : undefined}
    >
      {JOURNEY_LEVEL_LIST.map((lvl, i) => (
        <rect
          key={lvl.key}
          x={i * (BAR_W + GAP)}
          y={BASE - HEIGHTS[i]}
          width={BAR_W}
          height={HEIGHTS[i]}
          rx={BAR_W / 2}
          fill={lvl.accentHex}
          className="opacity-[0.11] dark:opacity-[0.17]"
        />
      ))}
    </svg>
  );
}
