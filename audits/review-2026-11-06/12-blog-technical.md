# Auditor 12 — Blog technical SEO

Reviewed 6 November 2026. Source inspection plus `../seo-live-2026-11-06.json`: all 40 localized article URLs returned 200 with parseable JSON-LD. No application changes. No P0/P1 blog technical defect established.

## Findings

- **P2, conditional — Empty category archives remain indexable.** `src/app/[locale]/blogs/page.tsx:23–34` rejects invalid category names and out-of-range pages, but page 1 with zero items is valid; metadata at lines 58–64 remains self-canonical and indexable. `BlogListClient.tsx:98–104` renders only an empty-state message for that inventory. Set a deliberate empty-category policy (hide links until populated and noindex genuinely empty archives, or publish useful editorial category content). No empty live category was demonstrated by the sitemap crawl; query archives were outside it.
- **P3, preventive — Blog payload validation is incomplete for required rendering fields.** `src/lib/server-api.ts:271–274,317` validates container presence but not localized title/body types, `author.name`, `tags`, or `relatedCourses`. Consumers call string/array methods directly (`src/app/[locale]/blogs/[slug]/page.tsx:30,77,97`; `BlogListClient.tsx:176–193`), so malformed published data can turn an otherwise existing article/archive into an error. Validate public payloads or enforce a publish-time schema covering these fields. The current 40 articles loaded successfully; no live malformed record is established.

## Positive controls

- Archive pagination and category navigation use real links (`BlogListClient.tsx:71–83,106–111`). Metadata retains the page/category query in self-canonicals and uses distinct title suffixes (`blogs/page.tsx:30–33,52–61`). Pages are not all canonicalized to page 1.
- Missing posts are distinguished from upstream failures: only API 404 returns null (`server-api.ts:303–318`), and the page calls `notFound()` only for null (`blogs/[slug]/page.tsx:71`). Other failures propagate rather than intentionally presenting a deletion.
- Body Markdown is rendered server-side (`blogs/[slug]/page.tsx:79–80`); JSON-LD escapes `<` (line 104). Metadata has localized descriptions, canonical/hreflang, article dates and social image fallback (lines 25–56).
- Article schema uses Organization for the team byline and Person otherwise, with publication/modification dates and canonical page identity (lines 94–103).

## Limits

No fault injection, invalid-slug live request, or multi-page production archive test performed. Twenty articles per locale fit within the current 50-item archive page size, so successful current crawling does not exercise future page-2 behavior. These are source-supported edge cases, not evidence of a present indexing penalty.
