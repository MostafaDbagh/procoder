/**
 * Convert our limited blog Markdown into safe HTML — server-side.
 *
 * Why not DOMPurify: it needs a browser DOM, so calling it during SSR of the
 * blog page threw ("sanitize is not a function") and 500'd every post. Instead
 * we (1) HTML-escape the raw source so any authored `<script>`/tags become inert
 * text, then (2) emit only a fixed, safe tag set (h2/h3/strong/ul/li/p) from the
 * Markdown markers. The result is inherently safe with no DOM dependency, and is
 * identical on server and client (no hydration mismatch).
 */
export function renderBlogBody(markdown: string): string {
  const escaped = (markdown || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n- (.*)/g, "\n<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>")
    .replace(/<p><h/g, "<h")
    .replace(/<\/h([23])><\/p>/g, "</h$1>")
    .replace(/<p><ul>/g, "<ul>")
    .replace(/<\/ul><\/p>/g, "</ul>")
    .replace(/<p>\s*<\/p>/g, "");
}
