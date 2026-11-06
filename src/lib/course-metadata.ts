/** Prefer a complete opening sentence; never cut a promise mid-clause. */
export function courseDescription(body: string, title: string, suffix: string): string {
 const text = body.replace(/\s+/g, " ").trim();
 const opening = text.match(/^.*?[.!?؟](?:\s|$)/u)?.[0].trim();
 const summary = opening && opening.length <= 180 ? opening : `${title.replace(/[.!?؟]+$/u, "")}.`;
 return summary + suffix;
}
