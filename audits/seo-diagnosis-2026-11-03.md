# StemTechLab SEO diagnosis — 3 November 2026

## Conclusion

There is no evidence of a permanent Google-wide block or manual penalty. There IS direct Google evidence of intermittent crawl failures, including robots.txt fetch failures late in October, plus weak commercial-search visibility and a large indexing backlog. Historical impression loss is concentrated in the English robotics page. These are separate problems and should not be collapsed into one speculative explanation.

This is a read-only investigation of Search Console, Vercel, Render, the deployed public site, and the current source. No production settings, content, sitemap submissions, indexing requests or application code were changed. The new files are this report and the current crawl evidence JSON. Earlier reports describe older code and Oman positioning; this report reflects the current UAE focus.

## Evidence and dates

- Search Console property: https://www.stemtechlab.com/ (URL-prefix scope, not every possible hostname).
- Performance: three months ending October 31, 2026; comparison May–July versus August–October. The rolling 28-day comparison is as displayed by Search Console on November 3.
- Page indexing report displays last update October 23; some example crawl dates are October 24. Preserve Google's displayed dates rather than assuming a live index census.
- Crawl/host-status report: last updated October 31. Its “last week” warning refers to that report period, not a claim of a live outage on November 3.
- Robots report: successful fetch November 2 at 12:25, as displayed by Google; timezone not independently established.
- Live crawl on November 3: 106 sitemap URLs. All returned 200; evidence in `seo-live-2026-11-03.json`.
- Vercel shows production deployment c20c404 ready on November 2, 22:58 Dubai time. UAE update 808a347 deployed November 2, 22:31. These changes cannot have caused a decline measured through October 31.

## Performance: what actually fell

| Metric | Latest 28 days | Previous 28 days |
|---|---:|---:|
| Impressions | 60 | 152 |
| Clicks | 3 | 12 |
| CTR | 5% | 7.9% |
| Average position | 15.9 | 14.2 |

Impressions fell 60.5%, clicks 75%. Absolute volumes are very small: nine fewer clicks. Aggregate average position changes with the query mix and is not proof that the same keywords lost only 1.7 positions.

Recent page examples:

| Page | Previous impressions → latest | Previous clicks → latest |
|---|---:|---:|
| English homepage | 22 → 14 | 5 → 0 |
| Arabic homepage | 31 → 6 | 1 → 0 |
| Arabic coding-competitions article | 26 → 6 | 1 → 0 |
| English coding-competitions article | 13 → 15 | 0 → 1 |

Over three months, total impressions are approximately 2.04k → 1.62k, while clicks rise 14 → 16 and average position improves 64.5 → 61.3. It is therefore inaccurate to say all search performance collapsed in every period.

The English robotics page drops 1,860 → 1,143 page impressions, with zero clicks in both periods. Python grows 19 → 148, with one click in the recent period. The robotics loss is larger than the approximate site-level net decline, although page and property aggregation should not be treated as a perfect accounting identity. The visible query list includes robotics engineering (255 impressions), robotic engineering (124), robot engineering (67), robotics learning (54), and robotics engineering subjects (28).

Inference: much historical exposure is broad engineering interest, weakly aligned with a beginner online course for children aged 7–10. The live title “Introduction to Robotics Engineering | Online Course for Ages 7-10” reinforces that broad framing. This supports a targeting problem; it does not prove the exact ranking mechanism behind every lost impression.

UAE: 47 → 32 impressions and 7 → 1 clicks in the three-month comparison. Current three-month US impressions are 461 and India 283. UAE visibility is not yet an established acquisition channel. Prioritize qualified UAE parent queries and trial enquiries rather than restoring irrelevant engineering impressions.

## Priority 0: intermittent robots/host availability

Google's Host status explicitly says “Host had problems last week.” Details:

- robots.txt fetch: **High fail rate last week**.
- DNS resolution: acceptable fail rate.
- Server connectivity: acceptable recently, high in the past.
- Robots-failure chart shows a spike around late September and a high plateau at the end of October. Exact daily values were not exported; do not infer precise counts from the chart.

Across 1,784 reported crawl requests: 84% 200, 7% 404, 5% 5xx, 2% temporary redirects and 2% permanent redirects (rounded report values). Discovery is 3%, refresh 97%. Average response time is 251 ms across mixed resources; this is not a page-speed score or a guarantee of HTML availability.

Why this matters: Google documents that a 5xx when fetching robots.txt can initially stop crawling for 12 hours, followed by retry/cache behavior. The observed host warning does not identify the exact HTTP code or infrastructure cause of each robots failure. [Google robots error handling](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec), [Crawl Stats semantics](https://support.google.com/webmasters/answer/9679690).

Current counter-evidence: Google's robots report fetched it successfully November 2; our November 3 fetch succeeds and permits Googlebot on public pages. Its only displayed syntax warning is the `Host:` directive, ignored by Googlebot. That warning is NOT a disallow or indexing block.

Vercel's past-day firewall report shows 784 denied and 148 challenged requests under system DDoS mitigation, zero custom rules and inactive Bot Protection. Top mitigated paths include probes for PHP/environment files. Google LLC network ownership appears in the traffic report, but that does NOT establish these requests were Googlebot; cloud customers can originate there. No verified Googlebot false positive was established. Do not disable protections or broadly allow Google Cloud IPs based on this report.

Next action: correlate Google failure times with Vercel edge/runtime logs for `/robots.txt`, `/sitemap.xml`, and affected HTML routes. Retained logs may not reach the historical incident. Monitor these endpoints continuously from multiple regions and record status, timing and deployment ID. Keep robots serving independently of backend/database availability. Current robots code has no backend fetch, so blaming Render for that endpoint would be unsupported.

## Priority 1: sitemap retrieval and important-page failures

Search Console's submitted `/sitemap.xml` still says **Couldn't fetch**, submitted August 27, last read September 23, 104 discovered pages. The live sitemap is currently valid and contains 106 URLs. A successful current request does not erase historical failure; a failed sitemap also does not automatically remove previously indexed pages.

Nine 5xx examples include `/ar/about` and `/en/contact` (October 24), `/en/courses` (October 19), `/en/` (October 10), `/llms.txt` (October 5), `/en/about` (October 3), and older blog URLs. Important commercial/information pages were affected, not just discarded URLs.

Code risks still present:

- `src/app/layout.tsx` reads `headers()`, making page rendering dynamic. Live homepage returns private/no-store cache headers and Vercel MISS. Fetch-level revalidation does not guarantee a cached full HTML page during a backend incident.
- The locale layout fetches courses for navigation on public pages. Course and blog content depend on the backend; requests generally time out after eight seconds. Previously there were unbounded fetches and failures treated as missing content; November 2 changes improved this but do not eliminate upstream dependency.
- `src/app/sitemap.ts` depends on the course API and paginated blog API. Its blog fetch lacks an explicit timeout. A failed generation can still fail when no valid cached sitemap exists. Preserve a last-good sitemap on failures; never silently publish empty data as a successful inventory.
- Render application logs on November 2 show `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR` after three starts, including the latest one. `stem-Be/createApp.js` enables proxy trust only for `TRUST_PROXY=1`, and uses a global anonymous limit of 300 requests/15 minutes. Misidentifying client IPs can group traffic into shared limits. This is a confirmed configuration warning; actual historical 429 counts and causation of Google's 5xx were not established.
- Even with correct proxy trust, frontend server-to-server requests may share egress IPs. Design public read caching and rate limits for that architecture. Verify ingress topology before changing proxy trust; do not just remove limits.
- Render also logs missing CLIENT_URL/ALLOWED_ORIGINS. This affects direct cross-origin browser API requests; server-to-server calls without Origin are permitted. It is not proven to block Google crawling.

Next actions: repair verified proxy configuration, instrument upstream status/timing, improve public-page and sitemap resilience, and then resubmit the existing sitemap and validate affected URLs. Avoid blind validation before checking deployment and availability.

## Priority 1: indexing backlog and stale recrawls

Google reports 44 indexed, 105 not indexed:

| Reason | Count | Interpretation |
|---|---:|---|
| Discovered, not indexed | 48 | Known URLs not yet crawled/indexed; visible examples include many Arabic articles |
| Crawled, not indexed | 27 | Mixed set; includes commercial pages, legal pages, image endpoints and old unlocalized URLs |
| Redirect | 10 | Often expected |
| Server errors | 9 | Investigate urgently |
| Not found | 8 | Map only URLs with a genuine replacement |
| Alternate with canonical | 2 | Often expected |
| Duplicate without selected canonical | 1 | Inspect individual URL |

Do not treat all 105 as defects or divide 44 by today's 106 sitemap URLs: the report includes historical and non-sitemap URLs. Crawled/not-indexed examples include Arabic robotics, parents, contact, privacy/terms, `/og` images and unlocalized paths.

URL inspection for `/en/courses/robotics` confirms indexed, crawl/index allowed, successful fetch, and Google-selected canonical matches the inspected URL. Last recorded crawl is **July 4, 2026**. It is indexed but may not reflect recent improvements. Current HTTP success alone cannot force indexing or freshness.

## Priority 2: content usefulness, targeting and trust

- Robotics needs an explicit parent-focused title and genuinely detailed course content: online delivery, ages 7–10, simulator/tools, concrete example projects, session structure, prerequisites, instructor, and what the child produces. Do not change its slug merely to change the title.
- Several articles are short generic promotional summaries. For example `/en/blogs/ai-for-kids-safe-and-fun` displays a one-minute article, broad claims about every job touching AI by 2030, generic AI safety assurance and little concrete teaching evidence. Replace unsupported predictions with useful, sourced, age-specific parent guidance and demonstrated lessons. There is no magic required word count.
- Homepage and `/uae` target similar queries. This is a monitoring risk, not confirmed cannibalization. Give the homepage the brand/general offer and the UAE page practical local enrolment/scheduling detail; avoid cloned city pages.
- The UAE page tells parents to confirm schedules, teaching language and price. Publishing actual approved operating details would answer intent more directly. Do not invent availability, credentials, accreditation or outcomes.
- About page still includes Arabic-specialist teacher profiles and a “grow in faith” vision despite the current coding/STEM focus. These are live-content inconsistencies to review with the business, not a proven ranking penalty.
- Course FAQ answers are conditionally mounted only after a click (`CourseDetailContent.tsx`), while questions appear in server HTML. Render answers in native details/summary or equivalent present HTML so their information is available without interaction. This is a discoverability improvement, not the explanation for robots failures.
- Links report displays zero/no data for both external and internal links. The live crawl DOES find internal links to every sitemap URL. Treat Search Console's links report as incomplete evidence; it cannot establish that the site has literally no backlinks. Build legitimate references through real school partnerships, relevant directories and useful original teaching resources; no bulk purchased links.

## What passed and what is unproven

November 3 live sitemap crawl: 106/106 HTTP 200, descriptions/title/H1 present, self-canonicals correct, self-language alternates correct, no noindex on these public pages, no duplicate titles, no parse errors in JSON-LD, no sitemap URL orphaned from the crawled internal-link graph. Schema syntax is not proof of rich-result eligibility.

Google manual actions and security issues both show **No issues detected**. Core Web Vitals has insufficient usage data for both mobile and desktop; no field pass/fail can be claimed. HTML is server-rendered; this is not a blanket JavaScript-only website. Broader browser rendering, full resource failures and measured lab performance were not exhaustively retested in this investigation.

There is no demonstrated Google algorithm penalty, verified Googlebot firewall block, quantified conversion loss, or proven seasonality explanation. Historical edge/runtime traces are needed to identify the precise incident cause. No backlink-provider dataset or competitor ranking tracker was connected.

## Recommended order

1. **Availability first:** investigate robots/edge failures, correct confirmed backend proxy configuration, add endpoint/upstream monitoring, and reduce fragile rendering dependencies. Record actual 429/5xx before and after.
2. **Discovery recovery:** after stable checks, resubmit sitemap and request inspection/recrawl of the homepage, UAE page, robotics and Python pages in each language. Validate the server-error group only after checking its URLs. Keep valid redirects; retired unrelated offerings can remain 404.
3. **Search relevance:** improve robotics and Python course pages and the highest-value parent articles with actual teaching evidence. Maintain UAE positioning consistently.
4. **Measurement:** compare equal periods; segment UAE, Arabic/English, commercial course queries and broad engineering queries. Track qualified organic trial submissions where analytics is already authorized. Check crawl health daily initially and indexing weekly. Do not judge yesterday's deployment by a report ending October 31.

## Source links

- [Search Console performance](https://search.google.com/search-console/performance/search-analytics?resource_id=https%3A%2F%2Fwww.stemtechlab.com%2F)
- [Host status](https://search.google.com/search-console/settings/crawl-stats/host-status?resource_id=https%3A%2F%2Fwww.stemtechlab.com%2F)
- [Sitemap report](https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fwww.stemtechlab.com%2F)
- [Page indexing](https://search.google.com/search-console/index?resource_id=https%3A%2F%2Fwww.stemtechlab.com%2F)
- [Google traffic-drop diagnosis](https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops)
- [Vercel firewall](https://vercel.com/mostafadbaghs-projects/procoder/firewall)
- [Render logs](https://dashboard.render.com/web/srv-d7cmu89o3t8c73941rvg/logs)
