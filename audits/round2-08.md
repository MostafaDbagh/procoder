# Round 2-08 — blog body renderer

Read `AGENTS.md`. Application code unchanged. Inspected renderer, blog page/client, admin authoring form, and backend seed posts; executed the actual renderer through Node after removing its TypeScript annotation. No production content inventory was obtained.

## Findings

1. **P2: Authored Markdown links never become links.** `src/lib/blogBody.ts:17–30` has no anchor conversion; escaping raw HTML also prevents HTML anchors as a workaround. Admin explicitly advertises “supports markdown” (`src/app/admin/dashboard/AdminDashboard.tsx:5686`). Actual reproduction: `Read [Python course](/en/courses/python) and [MIT](https://www.media.mit.edu/).` returns the identical literal Markdown inside `<p>`, with zero `<a>` elements. The blog page passes this result directly to `dangerouslySetInnerHTML` (`page.tsx:80`, `BlogDetailClient.tsx` body). Editorial course links and source citations therefore cannot function or contribute normal anchor-based navigation/discovery. Existing standalone CTA/related-course links still work. Backend seed files inspected do not contain Markdown links, so current published-post prevalence is unverified. Fix with a server-compatible Markdown parser and safe URL/tag policy; retain the existing escaping/security protection.

2. **P2: List handling corrupts otherwise ordinary block structure.** `src/lib/blogBody.ts:21–29` requires a preceding newline for bullets and consumes a newline when wrapping lists, before paragraph splitting. Actual outputs:
   - `- First\n- Second` → `<p>- First\n<ul><li>Second</li></ul>` (first item lost as a list item; unclosed paragraph).
   - `Intro\n\n- One\n- Two\n\nNext` → `<p>Intro</p><ul><li>One</li>\n<li>Two</li>\n</ul>\nNext</p>` (following text loses its opening paragraph).
   - `## Heading\nText` → `<h2>Heading</h2>\nText</p>` (same paragraph loss).
   Backend seed posts use bullet blocks followed by further headings/prose, e.g. `../stem-Be/scripts/seed-blogs.js:93–107`; this is relevant to actual authored content. Browser error recovery can retain readable words, but paragraph semantics/styles and list structure are incorrect. Parse blocks before inline markup rather than patching serialized HTML with regexes.

## Scope / positives

- Main article text is server-rendered and client wrapper uses `initial={false}`; no renderer-induced empty SEO body identified.
- H2/H3 and bold text are supported; raw source tags are escaped rather than executed.
- Ordered lists, images, tables, emphasis, code, and other Markdown features are unsupported. Treat these as format limitations until production content demonstrates use; do not claim proven loss of published images/content.
- Suggested focused verification after a fix: safe internal/external anchors (reject unsafe URL schemes), leading bullet lists, prose after lists, heading followed by a single newline, and hostile raw HTML.
