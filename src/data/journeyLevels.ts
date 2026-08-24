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
  },
  builder: {
    key: "builder",
    step: 2,
    ageMin: 8,
    ageMax: 10,
    iconName: "Blocks",
    gradient: "from-sky-500 to-blue-600",
    accent: "sky",
  },
  creator: {
    key: "creator",
    step: 3,
    ageMin: 9,
    ageMax: 12,
    iconName: "Palette",
    gradient: "from-emerald-500 to-teal-600",
    accent: "emerald",
  },
  innovator: {
    key: "innovator",
    step: 4,
    ageMin: 11,
    ageMax: 14,
    iconName: "Lightbulb",
    gradient: "from-amber-500 to-orange-600",
    accent: "amber",
  },
  pro: {
    key: "pro",
    step: 5,
    ageMin: 13,
    ageMax: 18,
    iconName: "Rocket",
    gradient: "from-rose-500 to-pink-600",
    accent: "rose",
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
