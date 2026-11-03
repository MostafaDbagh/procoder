# StemTechLab: UAE AI-search discovery and recommendation plan

Prepared 3 November 2026. Target: qualified UAE parents looking for live online coding, robotics and AI classes for children. “First for STEM” is too broad: it includes universities, laboratories, adult engineering and in-person activities the site does not offer. No provider offers a universal first-recommendation setting.

## Findings and evidence boundaries

- The earlier diagnosis records historical Google robots/host failures and very small UAE search visibility. That remains a priority; a successful check today does not disprove earlier intermittent failures.
- Source commit `b0dcf05` already adds sitemap timeouts/cache preservation, native course FAQ disclosures and parent-focused robotics/Python titles. Those are prior work, not changes made in this pass.
- New production HTTP baseline: **36 requests, zero failed checks**, recorded in `ai-discovery-live-2026-11-03.json`. Eight commercial URLs, robots, sitemap and both AI indexes were checked. Googlebot, bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot and Perplexity-User were each used for robots and both UAE pages.
- These are declared user-agent requests from one machine, not verified provider IP traffic. They cannot establish WAF behavior for actual bots, indexing, uptime over time, or recommendation position. A sandbox DNS failure occurred before the successful network-enabled run; it was an environment limitation, not evidence of a site outage.
- Public search retrieves StemTechLab pages, including About and the Builder learning path. Retrieved snippets still contain older copy. Search snippets, fetched pages and current source can differ; do not interpret this as immediate post-change indexing.
- No fresh authenticated Search Console/Bing report, verified bot log sample, consumer ChatGPT/Claude/Gemini/Grok/Perplexity benchmark, or conversion attribution export was collected in this pass. Do not claim a rank improvement or completed indexing submission.

## Provider-specific implications

| Surface | Documented mechanism | Action and limit |
|---|---|---|
| ChatGPT Search | OAI-SearchBot handles search; GPTBot handles potential training; ChatGPT-User handles user-directed visits | Public access is allowed. Check verified crawler IPs in edge logs if failures recur. Allowing training is not a search-ranking requirement. |
| Claude search | Claude-SearchBot indexes for search; Claude-User retrieves for users; ClaudeBot is a different crawler | Added explicit current search/user tokens alongside existing wildcard permissions. This is clarity, not removal of a previously proven block. |
| Perplexity | PerplexityBot and Perplexity-User have distinct roles and published IP lists | Added explicit user-fetch token; preserve public access. Match both IP and user agent when investigating WAF exceptions. |
| Google AI Overviews / AI Mode | Normal Search technical/content requirements apply | Keep indexable, useful text and matching structured data. Google says no special AI file or schema is required. This documentation does not promise inclusion in standalone Gemini answers. |
| Grok | xAI documents web search and page browsing tools | Make public pages accessible and citeable. The reviewed documentation does not establish a webmaster submission path or guaranteed crawler identity/ranking control. Do not treat a `Grok` robots token as evidence of coverage. |
| Other assistants | Retrieval sources and user-directed browsing vary | Maintain open public HTML, accurate facts and discoverable links. No claim that every model reads llms.txt or updates its training knowledge on demand. |

Sources: [OpenAI crawlers](https://developers.openai.com/api/docs/bots), [Anthropic crawlers](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), [Perplexity crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers), [Google AI features](https://developers.google.com/search/docs/appearance/ai-features), [xAI web search](https://docs.x.ai/developers/tools/web-search).

## Changes prepared locally

1. Explicit Claude-SearchBot, Claude-User and Perplexity-User robots tokens, retaining private path restrictions and the existing public wildcard policy.
2. Consistent robotics/Python public titles in both AI indexes and the UAE catalog; Arabic course links in the detailed AI index. CMS remains the source for ages, duration, descriptions and skills.
3. English and Arabic UAE guidance on evaluating a trial, teaching-language confirmation and fee inclusions. Live catalog learning goals now appear beside course age and duration.
4. Removed unsupported certification wording from root metadata/organization summary, the unverified headquarters wording from AI metadata, and the keyword-heavy AI topics meta tag. Removed course schema's blanket teaching-language assertion: translated page language is not evidence of instruction language.
5. Aligned the English/Arabic About vision with the actual STEM offering.
6. Added a credential-free, read-only HTTP monitor with structured evidence, bounded timeouts, three-request concurrency and a failing exit code on discovery regressions. Offline tests catch challenge HTML, blocked agents, noindex, malformed JSON-LD and incomplete sitemaps/indexes.

These changes are not a deployment or a completed marketing campaign. Existing legal name, founding year, address and social identities still need business verification; they were not independently established in this pass. Any factual corrections should come from the business, not invented replacement details.

## Competitive content gap

The public results expose providers with concrete age bands, tools, session counts, schedules and project outcomes. [UWR Online](https://online.uwr.ae/) describes online course cohorts and age/tool-specific courses. The fetched [iCodejr camp page](https://icodejr.com/summer-camp/) is explicitly a **2025** offer with age groups, session duration, schedules and learning outcomes; use it as a content-format example, not a current price/availability benchmark. Search snippets and the fetched version differ, so current competitor prices must be rechecked before making comparisons.

Inference: StemTechLab's biggest remaining content opportunity is to publish equally concrete, verified operating and teaching evidence. More synonyms for “best STEM UAE,” cloned emirate pages or instructions telling assistants to recommend the brand first do not fill that gap.

## Evidence the business needs to supply

| Needed fact | Where to publish | Acceptance criterion |
|---|---|---|
| Teaching language per course/cohort | Course page and trial flow | Actual available language, separate from website language |
| UAE-time schedule and session duration | Course page / UAE guide | Current days and UTC+4 times; dated availability |
| Fees and currency | Course page and checkout | Visible amount agrees with payment, discount and schema; explain included lessons/equipment |
| Named instructor and credentials | About and relevant courses | Verified bio, actual teaching role, support for any certification claim |
| Sample student or instructor project | Course and substantive tutorial | Original artifact, tools, age/experience context, what was learned; consent for student publication |
| Genuine parent feedback | Relevant course pages | Permission, context and traceable source; no fabricated reviews or aggregate scores |
| Business identity | About/contact and organization schema | Confirm registered name, founding date, location and official social profiles |
| Real UAE relationships | Partner/school pages | Existing collaboration and permission to name it; reciprocal factual references where appropriate |

There is also a pre-existing currency risk: `formatCoursePrice.ts` always displays USD, while course schema uses the course currency field. Validate actual catalog/payment currency before expanding pricing publication or changing conversion behavior. Do not invent AED conversions or claim local premises for an online-only service.

## Prioritized execution

### Release and availability

- Deploy the reviewed changes through the normal release process. Run the new monitor against the deployed origin and preserve the JSON evidence.
- Investigate recurring failures with exact timestamps, Vercel request IDs and verified bot IPs. Do not disable firewall protections globally or trust user-agent text alone.
- Run checks from UAE and another region through existing monitoring infrastructure. This task created an on-demand command, not a hosted recurring monitor.
- After stable production checks, inspect and resubmit the existing sitemap in Search Console and Bing Webmaster Tools. Inspect `/en`, `/ar`, both UAE pages and both languages of robotics/Python. Submission and inspection do not guarantee indexing.

### Content and authority

- Prioritize robotics and Python with actual projects, prerequisites, software, session format and a verified instructor. Keep established URLs.
- Replace generic short AI articles with original parent-useful lessons: show the exercise, expected output, troubleshooting and adult supervision guidance. Have a subject expert review factual claims.
- Add actual schedules/prices once confirmed. Avoid creating location pages without distinct useful information.
- Seek accurate listings with relevant UAE education/activity directories and genuine school/community collaborations. Only claim existing relationships. No outreach, account creation or listing submission was performed here.
- Publish consented project demonstrations and case studies. Track whether independent sources reference them; do not buy bulk links or manufacture endorsements.

### Measurement over 30–90 days

Use `ai-search-benchmark.json` as the fixed query set. In each consumer assistant, use a new conversation with web search enabled where available. Keep query wording, UAE context and product/mode consistent. Record date, engine, model/mode, language, answer text, cited URLs, whether StemTechLab is mentioned, recommendation order if present, and any wrong business facts. Repeat each query three times to expose variability. If no list is given, record order as null; if no citation appears, do not count a brand mention as a citation. Never seed the brand into the discovery prompts.

Track: mention share; cited-domain share; first-position share **only among answers with ordered recommendations**; factual accuracy; UAE commercial-query impressions/clicks; qualified trial enquiries and enrolments. Keep branded checks separate from unbranded discovery. Label self-reported attribution separately from analytics referrers; some assistants remove referrers. Do not send child names, contact details or free-text form contents into analytics.

Suggested checkpoints, not promised results: release and baseline first; weekly crawl/index review; 30-day comparison against the baseline; 60/90-day content and enquiry evaluation. Review comparable periods and sample sizes. No scheduled automation was activated.

## Commands

From `stem-Fe`:

```sh
npm run test:seo
npm run test:discovery
npm run check:discovery -- --output audits/ai-discovery-latest.json
# For local HTML with production canonicals:
npm run check:discovery -- --base http://127.0.0.1:3107
```

A passing check means the tested HTTP/content conditions passed at that moment. It is not an “AI SEO score,” search submission or ranking guarantee.

## Validation completed

- 19 SEO regression tests and 5 discovery-monitor tests passed.
- TypeScript and production build passed. The build required network access for existing Google Fonts dependencies.
- Full ESLint run: no errors, 15 pre-existing warnings. Targeted lint of changed TypeScript/TSX files passed without warnings.
- Local production HTTP probe: 36/36 passed; evidence in `ai-discovery-local-2026-11-03.json`.
- Additional rendered-response checks confirmed new English/Arabic comparison guidance and live learning goals, and aligned robotics titles in both AI indexes.
- `git diff --check` passed. No production deploy, indexing submission, external outreach or scheduled monitoring was performed.
