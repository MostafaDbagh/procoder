# Auditor 02 — Sitemap coverage and modification dates

Date: 6 November 2026. Scope: current frontend and backend source; targeted local regression tests. No production changes.

## Verdict

No critical sitemap defect demonstrated. Static public routes, five learning levels, live courses, and published blog posts are represented in both languages. Strong safeguards already reject incomplete or duplicate blog pagination; do not report those previous problems as unfixed.

## Findings

1. **Low — lastmod reflects database edits, not a dedicated editorial timestamp (confirmed implementation; impact conditional).** `src/app/sitemap.ts:51–54,73–76,108,129` uses model `updatedAt`; `../stem-Be/controllers/blogController.js:110–124` accepts admin updates through timestamped `findOneAndUpdate`. Thus an administrative change with no significant public-content change can advance lastmod. View increments explicitly disable timestamps at `blogController.js:43–46`, which is correct and already fixed. Recommendation: use a content-modified timestamp advanced only when public content, meaningful links, or schema change, or audit current admin fields before changing anything. Google requires lastmod to reflect significant page updates: [Google sitemap documentation](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

2. **Low — no future-date guard (confirmed validation gap, no bad production date established).** `src/app/sitemap.ts:12–15` accepts every parseable date, including future dates. Recommendation: reject impossible future modification dates at the CMS boundary and omit invalid lastmod values. Do not fabricate replacement dates.

3. **Low — static sitemap inventory requires manual synchronization (maintenance risk).** `src/lib/seo.ts:48–69` manually enumerates public pages and learning levels. Current inspected route coverage is consistent; a future level added to `JOURNEY_LEVELS` can be omitted unless this list is also updated. Recommendation: derive level paths from the shared level inventory and retain route coverage verification. Blog category and pagination URLs are intentionally absent; that alone is not a defect because article URLs are included and archive navigation exists.

4. **Informational — scale ceiling should be explicit before substantial growth.** `src/app/sitemap.ts:24,28,39,125–128` permits up to 1,000 pages of 50 blog posts and then emits each in two locales. That theoretical inventory exceeds a single sitemap's 50,000-URL limit; the 20-second complete traversal deadline would also become restrictive. No current size problem is established. Recommendation: introduce sitemap partitioning only when growth warrants it, plus count/size alerting. [Google limits](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Verified strengths

- Normalized absolute canonical origin: `src/lib/seo.ts:36–43,100–102`.
- Public-only static inventory excludes app/login areas; unknown static modification dates are omitted.
- Blog API returns published records only: `../stem-Be/controllers/blogController.js:7–26`.
- Complete pagination, stable page count and duplicate validation: `src/app/sitemap.ts:18–57`.
- Reciprocal en/ar and x-default alternate URLs: `src/app/sitemap.ts:92–98,111–117,132–138`.
- Complete snapshots are cached; CMS invalidation includes sitemap: `src/app/sitemap.ts:147–154`, `src/app/api/revalidate/route.ts:61–66`.
- Priority/changefreq are emitted but should not receive optimization effort; Google ignores them, per its documentation linked above.

## Validation and limits

Ran `node --test --test-name-pattern=sitemap scripts/seo-regression.test.mjs`: **3 passed, 0 failed, 19 unrelated tests skipped**. Reviewed AGENTS.md. No live sitemap crawl or Search Console inspection in this specialist pass; cached-production behavior and indexed coverage are not established by source tests. Existing November 5 evidence must retain its original date.
