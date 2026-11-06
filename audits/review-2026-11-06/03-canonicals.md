# Auditor 03 — Canonicals, redirects and URL normalization

Date: 6 November 2026. Scope: current frontend source; no production changes. No critical canonical defect established.

## Findings

1. **Medium — Retired courses without a successor redirect to a generic catalog.** `next.config.ts:27–32,78–87` sends gamedev and discontinued Arabic-language course URLs to `/courses`, despite explicitly recording no replacement. This is an intent mismatch and a potential soft-404 classification risk, not a proven production soft 404. Review indexed/backlinked retired URLs individually; keep relevant successor redirects, and use a helpful 404/410 when no equivalent exists. The `/oman` → `/en/uae` mapping (`next.config.ts:56–57`) also needs business/editorial confirmation that the UAE page satisfies the former regional intent.
2. **Low — Filter consolidation combines canonical and noindex.** `src/app/[locale]/courses/page.tsx:37–56` and `src/lib/seo.ts:106–123` declare the clean page canonical while excluding variants from indexing. This is intentional but mixes consolidation with exclusion. For true duplicate UI states, prefer canonical-only if signal consolidation is the goal; retain noindex only where deliberate exclusion is the policy. Google explicitly discourages noindex as a canonical-selection mechanism. This is not proof that the clean catalog is noindexed. [Google canonicalization guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
3. **Low — Permanent path migration fallback uses a temporary redirect.** Arabic aliases have correct 308 handling in `src/proxy.ts:14–26`; the duplicate page-level fallback uses `redirect()` in `src/app/[locale]/courses/[id]/page.tsx:132–136`, which is temporary. Main middleware path is covered by tests, so this is fallback hardening, not an observed live failure. Align the fallback with permanent migration semantics if it remains necessary. [Google redirect guidance](https://developers.google.com/search/docs/crawling-indexing/301-redirects).

## Working controls

- Shared origin normalizer forces HTTPS/www for the production domain (`src/lib/seo.ts:36–43`); non-www host redirect exists (`next.config.ts:48–54`).
- Canonical/hreflang helper uses the same origin and self-canonical (`src/lib/seo.ts:101–139`).
- Blog pagination preserves page/category identity while removing non-content query parameters (`src/app/[locale]/blogs/page.tsx:19–34,61`). Invalid and out-of-range page inputs call `notFound()`.
- Arabic alias redirect preserves query parameters and avoids consuming additional path segments (`src/proxy.ts:9,25–26`).
- Locale detection is disabled and locale-prefixed URLs are deterministic (`src/i18n/routing.ts:4–7`).

## Verification and limits

Ran `node --test scripts/seo-regression.test.mjs`: **22/22 passed**, including canonical origin, reciprocal language URLs and Arabic alias redirect tests. These are source/unit regressions, not a live redirect crawl. HTTP→HTTPS, trailing slash, mixed-case URLs, actual Google-selected canonicals, and deployment host behavior require production HTTP checks/Search Console. No ranking loss is attributed to these findings.
