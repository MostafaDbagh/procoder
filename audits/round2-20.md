# Round 2-20 — Learning-path SEO review

Scope: read-only source review of the index, five level pages, metadata, course mapping, redirects and sitemap inclusion. Read `AGENTS.md`. No application changes or live HTTP claims.

## Verified issues

1. **P2 — Practice curriculum is absent from the initial rendered page.** `src/app/[locale]/learning-path/[level]/LevelContent.tsx:157,195,227-228` initializes the overview tab and mounts `PracticePanel` only after a button click. The habit headings and explanatory bodies (lines 317-350) therefore are absent from both server HTML and the initial hydrated DOM for all ten localized level pages. Only habit names appear separately in JSON-LD (`[level]/page.tsx:96-109`). This makes a substantial portion of each stage's distinct educational copy unavailable without interaction. Render both panels in the document (with accessible visibility controls), or expose the practice text in the initial page. This finding does not claim the whole client component is unindexable.

2. **P2 — Backend failures become successful empty-course pages.** `src/lib/server-api.ts:168-181` returns null for failed course fetches; `[level]/page.tsx:93-94` changes null into an empty array, and the index page likewise does so at `learning-path/page.tsx:65`. `LevelContent.tsx:364-368` then publishes the normal empty-state message (“learning experiences … are being finalised”, `src/messages/en.json:211`) and removes all course links. The pages retain their indexable metadata, so an upstream outage is indistinguishable from an actual empty curriculum to visitors and crawlers. Preserve an unavailable state or propagate the fetch failure instead of claiming courses are not yet ready. Course-count zeroes on the index have the same failure mode.

## Checks without a confirmed defect

- Both locales receive dedicated canonical/hreflang, localized titles/descriptions and OG/Twitter metadata; the index and all five levels are listed in `PUBLIC_STATIC_PATHS`.
- Unknown level keys call `notFound()`; static parameters include the valid five levels in both locales.
- Mapping uses API `stlLevel`, with matching backend enum and a documented assignment script; the public backend list filters `isActive: true`. No currently active retired-slug collision was verified.
- Historical `/explorer` and localized equivalents redirect to the new Explorer page. Retired course redirects are explicitly enumerated in `next.config.ts:21-33,75-86`; course cards use current API slugs. Reactivating a retired slug could conflict with these redirects, but this is not reported as a current defect without runtime course evidence.
