# Reviewer 03 — sitemap pagination/dates and robots coverage

## P2 — Blog views change sitemap lastmod without an editorial update

- `src/app/sitemap.ts:36` selects `post.updatedAt` before `publishedAt` for each blog entry.
- `../stem-Be/models/BlogPost.js:46` enables Mongoose timestamps. `../stem-Be/controllers/blogController.js:45` increments viewCount using `updateOne` without disabling timestamps, which also advances updatedAt.
- `src/app/[locale]/blogs/[slug]/BlogDetailClient.tsx:34` sends that increment on a normal article visit.
- Therefore an unchanged article receives a new sitemap lastmod after readership alone, making modification dates unreliable for crawling. Disable timestamps on the analytics-only update, or publish a separate editorial modification timestamp.

## P2 — Offset pagination has no deterministic tie-breaker

- Sitemap fetches independent 50-item pages (`src/app/sitemap.ts:24-39`). The supporting endpoint sorts only by publishedAt (`../stem-Be/controllers/blogController.js:20`).
- PublishedAt is neither unique nor required in the model. With over 50 published articles and equal publication dates spanning a page boundary, MongoDB is free to reorder tied records across independent queries; sitemap can duplicate some articles and omit others. The sitemap does not deduplicate, but deduplication alone would not recover omitted records.
- Add a unique secondary sort key (e.g. `_id`) to the endpoint. A cursor/snapshot approach would additionally address catalog mutations during pagination.

Robots coverage: all currently declared private dashboard, instructor, parent-login, admin and API route trees are covered by PRIVATE_CRAWL_PATHS. No additional concrete private-route omission found. Existing totalPages/limit response shape matches the sitemap pagination loop.

Review was static against current working files; no source changes or live API calls made.
