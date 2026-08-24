/**
 * The five stages of the StemTechLab learning journey:
 * Explore → Build → Create → Innovate → Specialize.
 *
 * This file holds only structural facts (order, age band, presentation). All
 * parent-facing copy lives in the `journey.levels.<key>` i18n namespace so both
 * locales stay in sync, and the course list for each level comes from the API
 * (`Course.stlLevel`) rather than being hardcoded here.
 */

export const JOURNEY_LEVELS = [
  "explorer",
  "builder",
  "creator",
  "innovator",
  "pro",
] as const;

export type JourneyLevel = (typeof JOURNEY_LEVELS)[number];

export function isJourneyLevel(value: string): value is JourneyLevel {
  return (JOURNEY_LEVELS as readonly string[]).includes(value);
}

export interface JourneyLevelMeta {
  key: JourneyLevel;
  /** 1-based position in the journey, shown as the step number. */
  step: number;
  ageMin: number;
  ageMax: number;
  /** lucide-react icon name, resolved in the UI layer. */
  iconName: "Compass" | "Blocks" | "Palette" | "Lightbulb" | "Rocket";
  /** Tailwind gradient for the level's hero and card accents. */
  gradient: string;
  /** Solid accent used for badges and rings. */
  accent: string;
  /**
   * Complete literal Tailwind classes — Tailwind's scanner cannot see
   * interpolated class names, so these are never composed at runtime.
   * 600/700 in light is deliberate: sky-500 and amber-500 fail AA as small text.
   */
  accentText: string;
  /** Literal Tailwind classes for the stone's coloured drop shadow. */
  accentShadow: string;
  /** Raw hex for SVG gradient stops and the mobile rail connector. */
  accentHex: string;
}

export const JOURNEY_LEVEL_META: Record<JourneyLevel, JourneyLevelMeta> = {
  explorer: {
    key: "explorer",
    step: 1,
    // Kept at 5–8 to match the existing approved Explorer copy and fit check;
    // the curriculum framework quotes 6–8 as guidance, not eligibility.
    ageMin: 5,
    ageMax: 8,
    iconName: "Compass",
    gradient: "from-violet-500 to-purple-600",
    accent: "violet",
    accentText: "text-violet-600 dark:text-violet-300",
    accentShadow: "shadow-violet-500/30 dark:shadow-violet-500/20",
    accentHex: "#8b5cf6",
  },
  builder: {
    key: "builder",
    step: 2,
    ageMin: 8,
    ageMax: 10,
    iconName: "Blocks",
    gradient: "from-sky-500 to-blue-600",
    accent: "sky",
    accentText: "text-sky-700 dark:text-sky-300",
    accentShadow: "shadow-sky-500/30 dark:shadow-sky-500/20",
    accentHex: "#0ea5e9",
  },
  creator: {
    key: "creator",
    step: 3,
    ageMin: 9,
    ageMax: 12,
    iconName: "Palette",
    gradient: "from-emerald-500 to-teal-600",
    accent: "emerald",
    accentText: "text-emerald-700 dark:text-emerald-300",
    accentShadow: "shadow-emerald-500/30 dark:shadow-emerald-500/20",
    accentHex: "#10b981",
  },
  innovator: {
    key: "innovator",
    step: 4,
    ageMin: 11,
    ageMax: 14,
    iconName: "Lightbulb",
    gradient: "from-amber-500 to-orange-600",
    accent: "amber",
    accentText: "text-amber-700 dark:text-amber-300",
    accentShadow: "shadow-amber-500/30 dark:shadow-amber-500/20",
    accentHex: "#f59e0b",
  },
  pro: {
    key: "pro",
    step: 5,
    ageMin: 13,
    ageMax: 18,
    iconName: "Rocket",
    gradient: "from-rose-500 to-pink-600",
    accent: "rose",
    accentText: "text-rose-600 dark:text-rose-300",
    accentShadow: "shadow-rose-500/30 dark:shadow-rose-500/20",
    accentHex: "#f43f5e",
  },
};

export const JOURNEY_LEVEL_LIST: JourneyLevelMeta[] = JOURNEY_LEVELS.map(
  (k) => JOURNEY_LEVEL_META[k]
);

/** The level after `key`, or null at the end of the journey. */
export function nextLevel(key: JourneyLevel): JourneyLevel | null {
  const i = JOURNEY_LEVELS.indexOf(key);
  return i >= 0 && i < JOURNEY_LEVELS.length - 1 ? JOURNEY_LEVELS[i + 1] : null;
}
