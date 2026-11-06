# Auditor 09 — Internal links, orphan pages and crawl depth

Reviewed 6 November 2026. Read-only source review and graph analysis of `audits/seo-live-2026-11-06.json` (106 live sitemap pages). URLs resolved against their source page; query strings/fragments removed; unique source pages counted. No application changes.

## Result

No critical discovery defect found within the sitemap inventory. All 106 pages are reachable through HTML anchors from the English/Arabic homepages: 2 roots, 56 pages at one click, 48 at two clicks. Zero sitemap pages have no incoming links. All 106 returned 200 in the shared crawl. These are combined bilingual graph results, not external crawler/indexation measurements.

## P2 — Blog articles have limited contextual inbound links

All 40 localized articles have exactly two incoming source pages in this crawl: their language's blog index and the corresponding translated article (language switch). No other crawled commercial page or sibling article links to them. Example: `/en/blogs/robotics-vs-coding-which-first` is linked only by `/en/blogs` and its Arabic counterpart. Thus same-language discovery depends on the listing, despite generally healthy depth.

The article template renders body HTML at `src/app/[locale]/blogs/[slug]/BlogDetailClient.tsx:131–145`, then a trial CTA and related **courses**, with no related-article module (`:157–181`). Course recommendations similarly point to other courses (`src/app/[locale]/courses/[id]/CourseDetailContent.tsx:521–531`).

Recommendation: add genuinely relevant parent-guide links from robotics/Python/course decision sections and contextual links among related articles. Prioritize robotics-vs-coding, Scratch-vs-Python and starting-age guides. Use descriptive localized anchor text. Do not add indiscriminate sitewide links or assume this guarantees rankings.

Acceptance: priority guides receive at least one relevant same-language non-index inbound link, visible in raw HTML; repeat graph audit to verify destinations and anchor text.

## Positive controls and limits

Article-to-course links already exist (`src/app/[locale]/blogs/[slug]/page.tsx:77–78`, `BlogDetailClient.tsx:174–203`). Home/global navigation gives commercial pages shallow discovery. There is no justification for a broad navigation rewrite based on this crawl.

This inventory cannot discover pages omitted from both sitemap and crawled links. It does not establish complete sitewide orphan status, authenticated routes, external backlinks, JavaScript-only links, or ranking effects. Normalizing query strings makes this a canonical-content discovery analysis, not a parameter URL audit. No additional live requests were issued by this auditor.
