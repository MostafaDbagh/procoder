/**
 * Explorer "Start the journey" fit-check — client-side rule engine.
 *
 * A faithful TypeScript port of the approved, rule-based decision logic in the
 * Explorer spec (explorer_main_window_full_approved). It is NOT AI: it is a
 * deterministic educational decision engine. The output is always a
 * *preliminary* automated recommendation — never a human assessment or a
 * diagnosis of the child.
 *
 * The canonical option `value`s below are the single source of truth. The i18n
 * copy (messages/*.json → `explorer.start.questions`) must use these exact
 * values so answers map cleanly to the scoring signals.
 */

/**
 * Level-agnostic outcome of the fit check. The same rule engine now runs for
 * every stage of the journey, so the codes no longer name a specific level —
 * the level is supplied by the caller and rendered into the copy.
 */
export type ExplorerOutcome =
  | "LIKELY_FIT"
  | "WITH_REVIEW"
  | "CHECK_OTHER_STAGE"
  | "PRE_START_REVIEW";

/** One answer per question, keyed by the question id. Q9 (notes) is free text. */
export interface ExplorerAnswers {
  age?: AgeValue;
  story_visual_response?: string;
  new_task_behavior?: string;
  support_after_unsuccessful_attempt?: string;
  expression_support?: string;
  previous_learning_experience?: string;
  online_session_interaction?: string;
  entry_style_new_activity?: string;
  additional_notes?: string;
}

/**
 * The age answer is stored relative to the level being applied to: "below" /
 * "above" the level's band, or the child's age in years as a string. The option
 * list is generated per level, so the same question works for Explorer (5–8)
 * and Pro (13–18) alike.
 */
export type AgeValue = string;

export interface LevelAgeBand {
  ageMin: number;
  ageMax: number;
}

export type AgeBucket = "below" | "in_band" | "above";

/** Classifies the stored age answer against the level's own age band. */
export function ageBucketFor(
  value: AgeValue | undefined,
  band: LevelAgeBand
): AgeBucket | undefined {
  if (!value) return undefined;
  if (value === "below") return "below";
  if (value === "above") return "above";
  const n = Number(value);
  if (!Number.isFinite(n)) return undefined;
  if (n < band.ageMin) return "below";
  if (n > band.ageMax) return "above";
  return "in_band";
}

/** Question ids in display order. Q9 (`additional_notes`) is an optional textarea. */
export const EXPLORER_QUESTION_IDS = [
  "age",
  "story_visual_response",
  "new_task_behavior",
  "support_after_unsuccessful_attempt",
  "expression_support",
  "previous_learning_experience",
  "online_session_interaction",
  "entry_style_new_activity",
  "additional_notes",
] as const;

export type ExplorerQuestionId = (typeof EXPLORER_QUESTION_IDS)[number];

/** The single-select questions that must be answered before scoring runs. */
export const EXPLORER_REQUIRED_QUESTION_IDS: ExplorerQuestionId[] = [
  "age",
  "story_visual_response",
  "new_task_behavior",
  "support_after_unsuccessful_attempt",
  "expression_support",
  "previous_learning_experience",
  "online_session_interaction",
  "entry_style_new_activity",
];

export interface ExplorerResult {
  outcome: ExplorerOutcome;
  privacyFlag: boolean;
  /** Exposed for debugging / analytics; not shown to parents. */
  scores: { explorerFit: number; supportNeed: number; higherReadiness: number };
}

/**
 * Lightweight heuristic: does the free-text note look like it contains
 * sensitive personal information (contact details, ID/medical/diagnostic info)?
 * When true we suppress echoing note details and show a privacy reminder — we
 * never block or penalise the recommendation.
 */
export function notesLookSensitive(raw: string | undefined | null): boolean {
  if (!raw) return false;
  const text = raw.trim();
  if (!text) return false;
  const lower = text.toLowerCase();

  // Email address
  if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(text)) return true;
  // A run of 7+ digits — phone number, ID, passport, etc. (ignore separators)
  if (/(?:\d[\s-]?){7,}/.test(text)) return true;

  // Medical / diagnostic / identity keywords (English + Arabic)
  const SENSITIVE = [
    "diagnos",
    "autis",
    "adhd",
    "add ",
    "disorder",
    "syndrome",
    "therapy",
    "therapist",
    "medication",
    "medicine",
    "allerg",
    "disability",
    "disabled",
    "passport",
    "national id",
    "id number",
    "address",
    "توحد",
    "تشخيص",
    "اضطراب",
    "متلازمة",
    "دواء",
    "علاج نفسي",
    "إعاقة",
    "اعاقة",
    "حساسية",
    "جواز",
    "هوية",
    "العنوان",
    "رقم",
  ];
  return SENSITIVE.some((kw) => lower.includes(kw));
}

/**
 * Run the approved rule-based decision logic and return the outcome code.
 * Mirrors the spec pseudocode exactly — only the listed signals affect scoring;
 * `story_visual_response` and `new_task_behavior` are collected but intentionally
 * do not change the score.
 */
export function runExplorerFit(
  answers: ExplorerAnswers,
  band: LevelAgeBand
): ExplorerResult {
  let explorerFit = 0;
  let supportNeed = 0;
  let higherReadiness = 0;

  const privacyFlag = notesLookSensitive(answers.additional_notes);

  const bucket = ageBucketFor(answers.age, band);

  // A child below the stage's age band always routes to a short human review.
  if (bucket === "below") {
    return {
      outcome: "PRE_START_REVIEW",
      privacyFlag,
      scores: { explorerFit, supportNeed, higherReadiness },
    };
  }

  // Age fit — measured against the band of the level being applied to.
  if (bucket === "in_band") {
    explorerFit += 2;
  }
  if (bucket === "above") {
    higherReadiness += 2;
  }

  // Online session interaction
  if (answers.online_session_interaction === "needs_reminders") {
    supportNeed += 1; // needs extra support to stay engaged
  }
  if (answers.online_session_interaction === "variety_movement") {
    supportNeed += 1; // shorter attention rhythm / movement need
  }

  // Previous learning experience
  if (answers.previous_learning_experience === "organized_course") {
    higherReadiness += 1;
  }

  // Expression support
  if (answers.expression_support === "expresses_easily") {
    higherReadiness += 1; // explains independently
  }

  // Entry style into a new activity
  if (
    answers.entry_style_new_activity === "rapid_start" ||
    answers.entry_style_new_activity === "idea_switching"
  ) {
    explorerFit += 1;
    supportNeed += 1;
  }
  if (answers.entry_style_new_activity === "calm_stepwise") {
    explorerFit += 1;
  }

  // Support after an unsuccessful attempt
  if (answers.support_after_unsuccessful_attempt === "independent_cause") {
    higherReadiness += 1;
  }
  if (
    answers.support_after_unsuccessful_attempt === "encouragement" ||
    answers.support_after_unsuccessful_attempt === "redo_calmly"
  ) {
    explorerFit += 1;
    supportNeed += 1;
  }

  let outcome: ExplorerOutcome;
  if (bucket === "above" && higherReadiness >= 3) {
    outcome = "CHECK_OTHER_STAGE";
  } else if (supportNeed >= 3) {
    outcome = "WITH_REVIEW";
  } else if (explorerFit >= 4) {
    outcome = "LIKELY_FIT";
  } else {
    outcome = "PRE_START_REVIEW";
  }

  return {
    outcome,
    privacyFlag,
    scores: { explorerFit, supportNeed, higherReadiness },
  };
}
