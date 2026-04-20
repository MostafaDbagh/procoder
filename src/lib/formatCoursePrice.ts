/**
 * List price after optional catalog discount (same rules as stem-Be `utils/pricing`).
 */
export function priceAfterCourseDiscount(
 listPrice: number,
 discountPercent: number
): number {
 const p = Math.max(0, Number(listPrice) || 0);
 const d = Math.min(100, Math.max(0, Number(discountPercent) || 0));
 return Math.round(p * (1 - d / 100) * 100) / 100;
}

/**
 * Format a catalog price for public course UI (list + detail).
 * Product is USD-only; amounts always display as $ (never SAR/AED/etc.).
 */
export function formatCoursePrice(
 amount: number,
 _currency: string,
 locale: string
): string {
 try {
 // Always use en-US for currency — Arabic locale renders "$US 200" instead of "$200"
 return new Intl.NumberFormat("en-US", {
 style: "currency",
 currency: "USD",
 maximumFractionDigits: 2,
 }).format(amount);
 } catch {
 return `$${amount.toFixed(2)}`;
 }
}
