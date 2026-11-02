# Reviewer 05 — blog pagination and archive discoverability

## P2 — Articles beyond the newest 50 disappear from the browsable archive

- `src/app/[locale]/blogs/page.tsx:40-46` always calls `getBlogPostsISR()` without pagination; it does not read `searchParams`.
- `src/lib/server-api.ts:272-280` defaults to `limit=50`, with no page parameter. The backend enforces that maximum and returns pagination metadata (`../stem-Be/controllers/blogController.js:15-26`).
- `src/app/[locale]/blogs/BlogListClient.tsx:35-38,83-102` only renders that first response's items, ignores `totalPages`, and has no next-page links or loading mechanism. Visiting `?page=2` therefore still renders page one. Category buttons filter only those same 50 records, so older category articles become inaccessible and a populated category can incorrectly display “No articles in this category.”
- Trigger: publish a 51st article. The oldest article loses its archive link in both languages. The sitemap correctly enumerates subsequent pages (`src/app/sitemap.ts:17-39`), so this is a browsable-archive/internal-discovery defect, not a claim that those posts are absent from the sitemap or necessarily unindexable.
- Fix: implement server-rendered page URLs and ordinary pagination anchors using the response's pagination metadata, with per-page canonical URLs. Apply categories through the API across the whole collection (and preserve category in page links), or load all pages before applying local filters.

Validation: read AGENTS.md and traced frontend/API pagination contract. Application files unchanged; no runtime test performed. No second independent defect found in this scope.
