# Auditor 19 — AI discovery files and catalog parity

Reviewed 6 November 2026. Scope: current llms/ai.txt route and formatter source, plus `../ai-discovery-live-2026-11-06.json`. No application changes.

## Findings

1. **P2 — Monitor success does not establish a populated, matching AI catalog.** Both `/llms.txt` and `/llms-full.txt` passed today's HTTP probe, but `scripts/check-ai-discovery.py:86–90` checks text format, unresolved placeholders and UAE links, not course counts, slugs or facts. The catalog fetch deliberately returns null on timeout/error (`src/lib/llms-catalog.ts:11–22`) and renders a valid catalog link fallback (`src/lib/llms-content.ts:49–50,127–128`). Today's durations were 3,225 ms and 3,128 ms; the fetch timeout is 3,000 ms. That timing is consistent with fallback but does not prove it, because response bodies were not retained. Record populated/fallback state and compare course slugs and key facts against the same published catalog snapshot. Alert on sustained degradation rather than treating a deliberate fallback as a broken endpoint.

2. **P2, conditional resilience risk — Catalog item validation is shallow.** `src/lib/llms-catalog.ts:18–19` checks only that the payload is a nonempty array. Formatters assume each item has a usable slug and string-shaped fields (`src/lib/llms-content.ts:52–61,131–151`). A null item or malformed field can throw after the fetch catch has returned, defeating the intended graceful fallback. Validate records before formatting, and cover malformed payloads in a focused test. No malformed live payload or production 500 was observed.

3. **P3 — Arabic discovery is linked, but detailed machine-readable summaries are English only.** The full index links each Arabic course, which is useful, but the selected title, description and skills are exclusively English (`src/lib/llms-content.ts:23–25,143–151`). If this file is maintained for bilingual retrieval use, consider parallel Arabic summaries from the same catalog fields. This is optional editorial coverage, not an indexing prerequisite or a proven cause of low Arabic AI visibility.

## Positive controls

The formatters derive names, ages, duration and lesson counts from the current API instead of a static list, use the shared public-title helper and canonical origin, and link back to authoritative course pages. The full template avoids unsupported prices and tells parents to confirm changing operational details. Fallback links avoid publishing a known stale course inventory. Routes declare plain text and bounded cache freshness (`src/app/llms.txt/route.ts:12–19`; `src/app/llms-full.txt/route.ts:12–19`).

`src/app/ai.txt/route.ts:5–18` is a separate broad AI-use permission declaration. Its presence does not demonstrate that search or assistant providers read it; it is not evidence of recommendation eligibility.

## Limits

Fresh HTTP status/content checks passed; full live slug-by-slug parity was not measured. Web-tool attempts to read the two text files returned cache-miss errors, which are not production outage evidence. No verified provider fetch logs, citation behavior, or ranking impact was established. Google explicitly says special AI text files are not required for its AI Search features: [Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features). Maintain these files as supplementary indexes; prioritize accurate public page content and normal search eligibility.

## Follow-up verification by lead auditor

A subsequent direct public fetch on 6 November saved both bodies as `live-llms.txt` and `live-llms-full.txt`. Both returned 200 and listed all 13 distinct English course-detail slugs from the fresh sitemap crawl, with no extra course slugs. Evidence: `llms-catalog-check.json`. This closes current populated-catalog/slug-coverage uncertainty for that second sample; it does not establish every fact's semantic parity or eliminate the monitor's fallback-detection gap. Do not infer that the initial slower requests actually used fallback.
