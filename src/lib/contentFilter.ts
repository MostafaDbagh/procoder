/**
 * Client-side content filter for the recommendation chat.
 * Blocks obviously inappropriate/offensive input before it reaches the API.
 * This is NOT a comprehensive filter — the BE should also validate.
 */

// Common offensive words in English and Arabic (kept minimal and hashed for decency)
const BLOCKED_PATTERNS = [
  // English profanity patterns
  /\bf+u+c+k+/i,
  /\bs+h+i+t+/i,
  /\ba+s+s+h+o+l+e/i,
  /\bb+i+t+c+h/i,
  /\bd+a+m+n/i,
  /\bp+o+r+n/i,
  /\bs+e+x+(?:y|ual)?/i,
  /\bn+u+d+e/i,
  /\bk+i+l+l/i,
  /\bh+a+t+e/i,
  /\bv+i+o+l+e+n+c+e/i,
  /\bd+r+u+g+s?/i,
  /\bw+e+a+p+o+n/i,
  /\bg+u+n+s?/i,
  /\bb+o+m+b/i,
  /\bt+e+r+r+o+r/i,
  /\bsuicid/i,
  /\bdie\b/i,
  /\bdead\b/i,
  // Arabic offensive
  /كلب/,
  /حمار/,
  /غبي/,
  /أحمق/,
  /زنا/,
  /عاهر/,
  /لعن/,
  /كفر/,
  /خمر/,
  /مخدر/,
];

// Minimum meaningful content — must have at least some real words
const MIN_MEANINGFUL_CHARS = 3;
const GIBBERISH_PATTERN = /^[^a-zA-Z\u0600-\u06FF]{5,}$/;

export type FilterResult =
  | { ok: true }
  | { ok: false; reason: "inappropriate" | "too_short" | "gibberish" };

export function filterChatInput(text: string): FilterResult {
  const trimmed = text.trim();

  if (trimmed.length < MIN_MEANINGFUL_CHARS) {
    return { ok: false, reason: "too_short" };
  }

  // Check for gibberish (no letters at all, just symbols/numbers)
  if (GIBBERISH_PATTERN.test(trimmed)) {
    return { ok: false, reason: "gibberish" };
  }

  // Check blocked patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { ok: false, reason: "inappropriate" };
    }
  }

  return { ok: true };
}

/**
 * Returns a user-friendly error message for filtered input.
 */
export function getFilterMessage(reason: FilterResult extends { ok: false } ? FilterResult["reason"] : string, isArabic: boolean): string {
  switch (reason) {
    case "inappropriate":
      return isArabic
        ? "يرجى استخدام لغة مناسبة. نحن منصة تعليمية آمنة للأطفال."
        : "Please use appropriate language. This is a safe learning platform for children.";
    case "too_short":
      return isArabic
        ? "يرجى كتابة وصف أطول عن طفلك واهتماماته."
        : "Please write a longer description about your child and their interests.";
    case "gibberish":
      return isArabic
        ? "لم نفهم طلبك. يرجى وصف عمر طفلك واهتماماته."
        : "We couldn't understand your request. Please describe your child's age and interests.";
    default:
      return isArabic
        ? "حدث خطأ. يرجى المحاولة مرة أخرى."
        : "Something went wrong. Please try again.";
  }
}
