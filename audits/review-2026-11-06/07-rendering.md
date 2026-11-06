# Auditor 07 — SSR, JavaScript rendering, crawlable content

Date: 6 November 2026. Scope: current source and raw-HTML crawl `../seo-live-2026-11-06.json`; no browser rendering or changes to application code.

## Findings

- **P2, confirmed: homepage answer content requires interaction.** `src/components/ParentQuestions.tsx:57` initializes selection to null; lines 143–144 conditionally mount the response; lines 167–173 contain the selected question and answer. All six main English answer paragraphs were absent from the fresh `/en` raw-HTML text. A crawler rendering the initial page still would not select a button. This limits extraction of useful parent guidance from the homepage; it does not make the entire site uncrawlable. Render these answers in initial HTML (for example native disclosure elements), or link each question to an equivalent crawlable answer. Verify both locale bodies contain the intended answers without clicks.
- **P2, verification gap: request-time rendering resilience needs a controlled failure test.** `src/app/layout.tsx:131` reads request headers; home calls catalog/category fetches before rendering (`src/app/[locale]/page.tsx:80`). Healthy crawl results do not establish behavior during backend failure or cold cache. Existing per-entity API errors are explicitly distinguished from missing entities (`src/lib/server-api.ts:5–17`), which is a positive control. Test a controlled unavailable upstream and inspect HTTP status, body, cached content and recovery before changing rendering strategy. No production outage or SEO damage demonstrated here.

## Positive evidence

- All 106 sitemap URLs returned 200 with nonempty H1s in the raw-HTML crawl. No blanket client-only rendering defect found.
- Blog bodies are prepared on the server using `renderBlogBody` (`src/app/[locale]/blogs/[slug]/page.tsx:81`) and supplied as `bodyHtml`, rendered in `BlogDetailClient.tsx:144`. The `use client` directive alone does not imply content is absent from server HTML.
- Course detail data is fetched server-side and sibling course links are assembled before render (`src/app/[locale]/courses/[id]/page.tsx:141–149`).
- Language/direction are emitted on the root HTML element (`src/app/layout.tsx:131–136`).

## Limits

No hydration console, disabled-JavaScript visual check, Google rendered-HTML inspection, or live outage simulation was performed. Crawl extraction confirms available text, not indexing or ranking.
