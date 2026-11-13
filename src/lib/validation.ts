// Lightweight validators for form fields. Locale-aware where it matters.
// Rules are intentionally permissive (accept what real users type) but reject
// obvious garbage like "a@b" or "12345".

const EMAIL_RE = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function isValidEmail(input: string): boolean {
 return EMAIL_RE.test((input ?? "").trim());
}

/** Return a human-readable error message, or "" if valid. */
export function emailError(input: string, locale: "en" | "ar" = "en"): string {
 if (!input?.trim()) return "";
 if (isValidEmail(input)) return "";
 return locale === "ar"
 ? "يرجى إدخال بريد إلكتروني صحيح"
 : "Please enter a valid email address";
}

/** Convert common localized digits without discarding invalid characters. */
export function normalizePhoneInput(input: string): string {
 if (typeof input !== "string") return "";
 return input.normalize("NFKC").trim()
  .replace(/[٠-٩۰-۹०-९০-৯]/g, c => {
   const code = c.charCodeAt(0);
   const zero = [0x660, 0x6f0, 0x966, 0x9e6].find(start => code >= start && code <= start + 9)!;
   return String(code - zero);
  });
}

/** Format validation, not country-specific number assignment verification.
 * Accept 7–15 digits, local leading zeros, +/00 country codes and common separators.
 */
export function isValidPublicPhone(input: string): boolean {
 const value = normalizePhoneInput(input);
 if (!/^[+\d\s().-]+$/.test(value)) return false;
 const compact = value.replace(/[\s().-]/g, "");
 if (compact.startsWith("+")) return /^\+[1-9]\d{6,14}$/.test(compact);
 if (compact.startsWith("00")) return /^00[1-9]\d{6,14}$/.test(compact);
 return /^(?!0+$)\d{7,15}$/.test(compact);
}

export function publicPhoneError(input: string, locale: "en" | "ar" = "en"): string {
 if (!input.trim() || isValidPublicPhone(input)) return "";
 return locale === "ar" ? "أدخل رقم هاتف صحيحاً، ويمكن إضافة رمز الدولة مثل +968 9068 1829" : "Enter a valid phone number, optionally with a country code, e.g. +968 9068 1829";
}
