# Auditor 04 — hreflang and localization

Date: 6 November 2026. Scope: current frontend source and fresh `audits/seo-live-2026-11-06.json` (106 sitemap URLs). Read-only; no implementation changes.

## Result

No current hreflang blocker found in the crawled set. All 106 pages have language and hreflang metadata. Comparing each declared English/Arabic destination against the crawled target found **zero reciprocal-link or HTML-language mismatches**. Arabic page titles all contain Arabic text. These checks do not establish indexing or translation quality.

## Findings

- **P2 / preventive publishing gap:** Blog alternates assume every article has both translations. `src/app/[locale]/blogs/[slug]/page.tsx:37` always emits both locales, while line 81 renders an absent localized body as an empty string. `src/app/sitemap.ts:125–136` likewise emits both URLs without checking translation availability. This is a source-level risk, not evidence of a currently empty article. Require nonempty localized title, excerpt and body before publication, or omit unavailable locale URLs and alternates consistently.
- **P3 / editorial QA:** Arabic metadata is present, but this crawl cannot certify idiomatic Arabic, course terminology, or equivalence of factual claims. Add a bilingual editorial review of commercial claims and each new article; avoid treating a populated translation field as approval.

## Positive controls

- `src/lib/seo.ts:130–139` centralizes self-canonicals plus `en`, `ar`, and English `x-default` alternates.
- `src/i18n/routing.ts:4–9` uses explicit locale prefixes, disables locale detection and disables duplicate middleware alternates.
- `src/app/layout.tsx:129–136` emits language and direction server-side; Arabic does not rely exclusively on client JavaScript for language identification.
- `src/app/[locale]/blogs/[slug]/page.tsx:25–26` selects localized metadata explicitly.

## Limits

No Search Console language/coverage export, browser RTL inspection, or native-speaker proofreading was performed. The raw-HTML audit parser records one value per hreflang key, so duplicate declarations would require separate raw markup inspection. Findings apply to the crawled sitemap set; query variants and unlisted routes were not exhaustively checked.
