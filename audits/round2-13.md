# Round 2–13: BlogPosting author, dates, and image fidelity

Read-only source review plus the existing `audits/seo-live.json` capture (40 localized BlogPosting pages). No fresh production crawl or image fetch was performed. Read AGENTS.md. No application changes.

## Verified findings

- **Medium — collective author incorrectly typed as a person.** `src/app/[locale]/blogs/[slug]/page.tsx:97` unconditionally emits `author.@type = Person`. All 40 captured posts name `StemTechLab Team`; the visible byline matches that name, but it represents a collective organizational author, not an identified person. Support an author type and emit Organization for the editorial team, retaining Person for actual individual authors. An identifying author/about URL would also improve disambiguation.
- **Low — modification date is invisible to readers.** `page.tsx:99` emits `updatedAt` as `dateModified`, while `BlogDetailClient.tsx:37–44,85–90` displays only publication date and never renders an updated date. Captured `/en/blogs/minecraft-coding-for-kids` declares publication `2026-05-12` and modification `2026-09-10`, but its captured visible text displays only May 12, 2026. Render a clearly labeled updated date when editorial changes warrant it. This is a transparency/alignment improvement, not proof that the timestamp is false or that markup is invalid.

## Checks passed and limits

- Schema headline and visible H1 use the identical localized `post.title[lang]`; schema author name and byline share `post.author.name`.
- Publication schema and displayed date derive from the same `publishedAt`. Schema preserves the timestamp; the displayed date is localized. No invented publication date is supplied when missing.
- Schema image and visible cover both use `safeCoverImage(post.coverImage)` (`page.tsx:102`, `BlogDetailClient.tsx:120–126`). Rejected/missing covers are omitted from both. Two captured pages lack schema images, so this is consistent omission rather than a claim about an invisible image. Article properties are recommended, not universally required.
- Open Graph's generic fallback image is not reused as a falsely article-specific schema image.
- Current backend view counting explicitly uses `{ timestamps: false }` (`../stem-Be/controllers/blogController.js:46`), so a page view does **not** currently advance modification time. Do not report that previously plausible issue as present.
- `dateModified` still uses the database update timestamp; editorial versus administrative update semantics were not validated against production history. Image crawlability, dimensions, and visual relevance were not verified by this review.

Reference: [Google Article structured-data documentation](https://developers.google.com/search/docs/appearance/structured-data/article) supports Person or Organization authors and recommends author identification, applicable dates, and representative article images; it does not specify required Article properties.
