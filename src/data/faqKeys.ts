/**
 * Single source of truth for FAQ question ids in the `faq` translation
 * namespace (`<id>_q` / `<id>_a`). Used by both the visible FAQ accordion
 * and the FAQPage JSON-LD so the schema can never drift from on-page content.
 */
export const FAQ_KEYS_BY_TAB: Record<string, readonly string[]> = {
  classExperience: ["ce1", "ce2", "ce3", "ce4", "ce5", "ce6", "ce7", "ce8", "ce9", "ce10", "ce11", "ce12"],
  customerSupport: ["cs1", "cs2", "cs3", "cs4", "cs5"],
  teacherQueries: ["tq1", "tq2", "tq3", "tq4"],
};

export const ALL_FAQ_KEYS: readonly string[] = Object.values(FAQ_KEYS_BY_TAB).flat();
