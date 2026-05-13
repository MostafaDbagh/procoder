// Lightweight validators for form fields. Locale-aware where it matters.
// Rules are intentionally permissive (accept what real users type) but reject
// obvious garbage like "a@b" or "12345".

const EMAIL_RE = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function isValidEmail(input: string): boolean {
 return EMAIL_RE.test((input ?? "").trim());
}

/**
 * Validate a UAE phone number. Accepts the formats UAE parents actually type:
 * - 050 224 9596 (10 digits starting with 0)
 * - 502249596 (9 digits, no leading 0)
 * - +971 50 224 9596 (international with +)
 * - 00971 50 224 9596 (international with 00)
 * Mobile prefixes after stripping: 50, 52, 54, 55, 56, 58. Landlines start 2/3/4/6/7/9.
 */
export function isValidUAEPhone(input: string): boolean {
 const digits = (input ?? "").replace(/\D/g, "");
 if (!digits) return false;

 let local = digits;
 if (local.startsWith("00971")) local = local.slice(5);
 else if (local.startsWith("971")) local = local.slice(3);
 else if (local.startsWith("0")) local = local.slice(1);

 // After normalising, a real UAE number is 9 digits and starts with 2–9.
 return /^[2-9]\d{8}$/.test(local);
}

/** Return a human-readable error message, or "" if valid. */
export function emailError(input: string, locale: "en" | "ar" = "en"): string {
 if (!input?.trim()) return "";
 if (isValidEmail(input)) return "";
 return locale === "ar"
 ? "يرجى إدخال بريد إلكتروني صحيح"
 : "Please enter a valid email address";
}

export function phoneError(input: string, locale: "en" | "ar" = "en"): string {
 if (!input?.trim()) return "";
 if (isValidUAEPhone(input)) return "";
 return locale === "ar"
 ? "يرجى إدخال رقم إماراتي صحيح (مثال: 050 224 9596)"
 : "Please enter a valid UAE number (e.g. 050 224 9596)";
}
