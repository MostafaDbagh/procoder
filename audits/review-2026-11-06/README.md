# StemTechLab SEO review — 6 November 2026

## Decision

Prioritize consistent, verifiable product facts and stronger editorial evidence. Today's crawl did not reveal a blanket technical indexing blocker. This does not explain away the previously documented search-traffic decline or establish that all pages are indexed.

The requested review uses 25 distinct AI auditor agents with separate specialties, run in batches. These are AI reviews, not paid human hires or 25 independent measurement datasets. Their shared crawl and overlapping findings are consolidated below. No application code, CMS content, deployment, search submission, or external account was changed.

## Fresh evidence

- **106/106 sitemap URLs returned HTTP 200**, without redirects or canonical mismatches. All have a title, description and H1; no exact duplicate titles/descriptions, detected noindex, malformed JSON-LD or missing image-alt attributes. Attribute presence does not establish quality or rich-result eligibility.
- **36/36 discovery requests passed**, including robots, sitemap, AI indexes and declared crawler user-agent requests. These are one-machine HTTP checks, not requests from verified provider IPs.
- Reciprocal language alternates passed across the 106 URLs. All sitemap destinations are linked and reachable within two clicks from the appropriate homepage in the captured link graph.
- Forty localized article pages represent 20 English/Arabic article pairs. Technical fields were checked across the inventory; editorial and translation close-reading used samples described in each review.
- A follow-up direct fetch confirmed both AI text indexes list exactly the 13 published English course slugs; bodies and slug lists are saved alongside this report. This checks coverage, not every course fact.
- Public search retrieved both language versions but still surfaced older homepage positioning. This is retrieval freshness evidence, not a measured Google ranking or index timestamp.

Raw evidence: [full crawl](../seo-live-2026-11-06.json), [discovery probes](../ai-discovery-live-2026-11-06.json), [crawl summary](crawl-summary.json), [class-size excerpts](class-size-evidence.json), [search observations](search-retrieval-notes.md). The initial sandbox DNS attempt failed locally; the authorized network rerun succeeded and produced the final discovery evidence. It is not a site outage finding.

## Consolidated priorities

P1 means a purchase-relevant factual correction or editorial claim requiring prompt verification. P2 means a substantive improvement or investigation. P3 means refinement. No P0 production outage or universal indexing block was established. These priorities do not quantify lost traffic.

| Priority | Finding | Owner and action | Acceptance |
|---|---|---|---|
| P1 | **Class sizes conflict on 26 localized course pages:** the shared FAQ says 3–5, while home/UAE/trial and robotics guidance promise maximum three. | Operations establishes actual limits by product; content/developer updates shared facts, both locales and generated OG copy. Sources: `src/messages/en.json:1014`, `ar.json:1014`, `CourseParentGuide.tsx:12`; reviews 13–15, 18. | Every surface agrees for each product, or explicitly labels valid exceptions. |
| P1 | **Rescheduling policy conflicts:** course FAQ says 24 hours; parent page/general FAQ say four. | Operations confirms policy; content owner aligns both languages and enrollment messages. `src/messages/en.json:1006,1475,1532`; review 16. | One unambiguous policy or clearly scoped product exceptions. |
| P1 | **Research attribution and service promises lack checkable support.** Coding article cites MIT without a study; Minecraft and Arabic-language articles lack corresponding verified catalog offers. | Editorial/instructors verify study and offers; link primary evidence and current products or qualify/remove unsupported wording. Reviews 10–11. Arabic teachers do exist; missing catalog evidence does not establish nonexistent staff/services. | Readers can verify the precise research claim and the advertised available offer. |
| P1 investigation | **Previously documented impression decline remains unexplained.** Historical August–October counts are not a fresh export, and later robots incidents do not alone explain the earlier breakpoint. | SEO/analytics obtains dated query/page exports and correlates deployment and verified crawler logs; review 23. | Identify supported causes or explicitly retain an unresolved diagnosis; distinguish broad exposure from qualified leads. |
| P2 | **Useful answers and full instructor bios require clicks.** | Frontend renders approved complete content in initial HTML using disclosures or stable linked pages. `ParentQuestions.tsx`, `MeetOurStars.tsx`; reviews 07, 17. | Both locales expose intended answers and bios without interaction. |
| P2 | **Blog guides lack distinctive practical evidence and editorial accountability.** | Instructors/editorial add tested projects, course prerequisites, comparison criteria, truthful reviewer links, and sources for factual claims. Reviews 10–11. | Priority guides answer the actual decision, show original evidence and identify review responsibility. No arbitrary word-count target. |
| P2 | **Articles have weak contextual links.** | Content owner adds useful course-to-guide and guide-to-guide links. Review 09. | Relevant guides gain links from related course/body sections, without sitewide keyword-stuffed link blocks. |
| P2 | **Product clarity varies:** age 5–18 versus 6–18, Advanced Programming marked Beginner, teaching-language guarantees versus availability caveats, missing exact equipment requirements. | Curriculum/operations approves one maintained fact set; editorial aligns pages. Reviews 13–16. | Course-specific readiness, language, equipment and eligibility are clear and consistent. |
| P2 | **Metadata needs editorial improvement.** Course descriptions cut sentences; Arabic blog summaries omit useful distinctions. | Content/developer supplies complete localized summaries; review 05. | Specific, accurate summaries with no unfinished clause; preserve existing valid canonical/hreflang setup. |
| P2 | **Trust assertions need substantiation.** Certifications, vetting, founding/legal identity and official profiles require owner verification. | Operations verifies and publishes appropriate evidence; reviews 06, 17. | Accurate claims and stable verified identity links, without invented credentials or personal disclosures. |
| P2 | **Resilience and performance remain unmeasured.** Font/image delivery and upstream failure behavior are investigation candidates. | Engineering obtains field CWV and controlled cold-cache/failure traces; reviews 07–08, 18. | Measured bottlenecks and correct failure/recovery behavior. Do not label Vercel MISS or source complexity a CWV failure. |
| P3 | Arabic taxonomy/plurals, support timezone, repeated title wording and uploaded social-image metadata need refinement. | Arabic editor/frontend; reviews 05, 15–16, 18. | Natural localized wording and accurate, tested metadata. |

## AI search interpretation

Accessibility is necessary evidence, not proof of recommendation or citation. The November 5 audit contains historical consumer ChatGPT, Perplexity and Gemini observations; they were not rerun today and must not be presented as fresh scores. Today's search retrieval and HTTP probes are different measurements.

Google says normal SEO foundations and indexing/snippet eligibility apply to its AI features; no special AI file or schema is required. Prioritize accurate visible facts, discoverable useful pages and evidence over adding speculative AI tags. [Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features).

Editorial recommendations follow Google's emphasis on original information, clear sourcing and demonstrable expertise, without implying guaranteed ranking or citation gains. [People-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

## Measurement work

Reviews [22](22-ai-measurement.md) and [23](23-search-measurement.md) define the follow-up datasets. Keep mention, recommendation and actual citation separate. A proposed three-engine bilingual benchmark with ten prompts and three repeats is 90 runs; five engines would be 150. No such benchmark was executed today. Review [19](19-llms-files.md) also identifies monitor gaps: successful AI-file responses can represent deliberate fallback, and malformed catalog records need validation. Review [24](24-resilience.md) specifies controlled cache/failure verification; ordinary unit tests do not establish runtime cache resilience.

## Suggested delivery order

1. **First:** resolve product-policy contradictions and substantiate/correct research and offer claims. Operations must supply the true facts; auditors cannot invent them.
2. **Next:** expose complete approved answers/bios, improve priority comparison articles and metadata, and add relevant contextual links.
3. **Then:** use fresh Search Console query/page exports, verified crawler logs, field performance data and repeatable assistant tests to diagnose discovery and measure changes. Historical impression declines are a lead, not a proven penalty or technical root cause.

## Verification

The final independent reviewer reran the existing suites: **22/22 SEO regression tests and 5/5 discovery tests passed**. These validate implemented contracts, not indexing, ranking, field performance or real cache behavior. It independently checked crawl counts, metadata, class-size evidence and link depth. See [validation review](25-validation.md).

## Limits

No new Search Console export, verified-bot firewall log, backlink database, field CWV report, exhaustive plagiarism scan, legal-record validation, full browser rendering audit or fresh consumer-assistant experiment was obtained. Source-level risks are labeled conditional. The crawl is a dated snapshot of sitemap URLs, not every possible URL/query variant. No numeric SEO score or projected revenue lift is assigned.

## Auditor reports

- [Auditor 01 — Robots and crawler access](01-robots.md)
- [Auditor 02 — Sitemap coverage and modification dates](02-sitemap.md)
- [Auditor 03 — Canonicals, redirects and URL normalization](03-canonicals.md)
- [Auditor 04 — hreflang and localization](04-hreflang.md)
- [Auditor 05 — Titles and meta descriptions](05-metadata.md)
- [Auditor 06 — Structured data](06-schema.md)
- [Auditor 07 — SSR, JavaScript rendering, crawlable content](07-rendering.md)
- [Auditor 08 — Performance and Core Web Vitals](08-performance.md)
- [Auditor 09 — Internal links, orphan pages and crawl depth](09-internal-links.md)
- [Auditor 10 — Blog content quality and originality](10-blog-quality.md)
- [Auditor 11 — Blog editorial trust](11-editorial-trust.md)
- [Auditor 12 — Blog technical SEO](12-blog-technical.md)
- [Auditor 13 — Search intent and topic coverage](13-search-intent.md)
- [Auditor 14 — Course/product content consistency](14-course-content.md)
- [Auditor 15 — Arabic content and semantic parity](15-arabic-content.md)
- [Auditor 16 — UAE local relevance and parent purchase information](16-uae-local.md)
- [Auditor 17 — Brand, entity and trust evidence](17-entity-trust.md)
- [Auditor 18 — Image SEO and social sharing](18-images-social.md)
- [Auditor 19 — AI discovery files and catalog parity](19-llms-files.md)
- [Auditor 20 — AI crawler access and provider distinctions](20-ai-crawlers.md)
- [Auditor 21 — AI answer and citation readiness](21-ai-answer-readiness.md)
- [Auditor 22 — AI visibility measurement validity](22-ai-measurement.md)
- [Auditor 23 — Search measurement and indexing diagnosis](23-search-measurement.md)
- [Auditor 24 — Server reliability, cache and error behavior](24-resilience.md)
- [Auditor 25 — Independent consolidation and regression validation](25-validation.md)
