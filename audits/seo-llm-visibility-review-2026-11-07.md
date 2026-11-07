# SEO, LLM discovery and AI visibility review

Date: 7 November 2026. Three independent, read-only audit agents reviewed technical SEO, LLM discovery and AI visibility. This report separates findings from the parent-page implementation made alongside the audit.

## Scope and evidence

The live technical crawl covered 106 sitemap URLs plus four edge-case probes. Every sitemap URL returned HTTP 200, one H1, a self-canonical, three language alternatives, the correct HTML language, unique title and description, and indexable robots directives. Invalid course/blog URLs returned 404. Category-filter URLs correctly use noindex and the base catalog canonical. Evidence: `technical-seo-live-2026-11-07.json`.

Live robots.txt, llms.txt, llms-full.txt and openapi.yaml returned 200. Both LLM indexes contained 13 courses. No critical crawl blocker was detected. These checks do not establish Google/Bing inclusion, ranking, AI citations, Core Web Vitals or rich-result eligibility.

## Findings remaining open

| Priority | Finding and evidence | Recommended action |
| --- | --- | --- |
| High | `src/messages/en.json` and `ar.json`, `faq.ce3_a`, promise every live session is recorded and available within 24 hours. Trial copy makes recording availability conditional. `src/components/StructuredData.tsx` also emits the FAQ answer as JSON-LD. | Confirm the actual recording policy and reconcile both languages, visible answers and schema. Remove universal guarantees unless verified. |
| Medium | `public/openapi.yaml:4–13` is malformed YAML: the description block is incorrectly indented. Local YAML parsing fails; the live document has the same problem. `src/app/ai-plugin.json/route.ts` advertises it. | Correct and validate the artifact, or retire the legacy manifest deliberately if no API is offered. Its `paths` is empty. This is not proof that search indexing is blocked. |
| Medium | `public/openapi.yaml:8` and `src/components/StructuredData.tsx:34` still describe the older AI-powered course matching flow. | Describe the current provisional five-level assessment accurately; AI assistance does not determine the final placement. |
| Medium | `src/lib/llms-full-template.ts:58–65` describes Python game, mobile-app and certification sequences not shown by the current learning-path page. Confirmed in live llms-full.txt. | Derive the summary from current visible content or replace the outdated sequence descriptions. |
| Medium | `src/components/StructuredData.tsx`, `buildCourseSchema`, assigns `Course.inLanguage` from the website locale without verified teaching-language data. | Keep UI language on WebPage; use verified course/session language or omit the course assertion. This is semantic ambiguity, not a proven schema syntax error. |
| Medium | `src/app/[locale]/courses/page.tsx:19` still claims “Certified teachers” in English metadata, also live. | Verify credentials or use factual wording such as live instruction. |
| Medium | `src/lib/seo.ts:71–94` disallows public login routes that are linked sitewide. Their noindex directives cannot be read by blocked crawlers. | Allow crawling of public sign-in pages while retaining noindex and authentication for private content. No indexed login leak was established. |
| Medium | `faq.ce8_a` and llms-full policy copy promise free rescheduling up to four hours before class; FAQ also promises pausing anytime. | Verify and link an actual policy, then align all surfaces. Do not invent contractual terms. |
| Medium | `src/components/MeetOurStars.tsx` still starts important content at opacity zero until animation runs. | Make initial content visible and verify with JavaScript disabled. Text may remain extractable, so this is rendering resilience rather than proof of crawler exclusion. |
| Medium | `scripts/check-ai-discovery.py` omits the parent, recommendation and learning-path pages in both languages, and does not parse the advertised OpenAPI artifact. | Add these important pages and validate retained discovery artifacts. |
| Low | `src/lib/llms-content.ts`, `formatSubjectList(null)`, labels hardcoded subjects as live catalog subjects when catalog fetching fails. | State that current subjects and availability must be checked in the catalog. No current catalog outage was detected. |
| Low | Parent sign-in pages emit hreflang despite noindex. | Remove language alternates from private/noindex surfaces. |
| Low | Non-team blog authors have a name but no linked biography or visible expertise information. | Add genuine author/reviewer profiles where available; do not fabricate credentials. |

## Parent page changes completed locally

- Replaced the large image-based decision map and repeated grids with a compact hero, three next steps, a short learning explanation, five native expandable answers and a dashboard link for enrolled families.
- Kept English and Arabic content aligned, with a primary level-finder action and teacher confirmation wording.
- Retained existing section anchors, including `choosing-a-course`, for incoming links.
- Removed client-side animation and the client component requirement from the parent content. Essential copy and answers render in HTML; native disclosures work without JavaScript.
- Updated the parent descriptions in both LLM discovery indexes to match this page.
- The remaining audit findings above were not silently treated as fixed.

## References and limits

Google says AI features rely on ordinary SEO fundamentals and do not require special AI files or schema: https://developers.google.com/search/docs/appearance/ai-features

Robots blocking prevents crawlers from reading page-level noindex: https://developers.google.com/search/docs/crawling-indexing/block-indexing

Language property semantics: https://schema.org/inLanguage

These findings improve factual consistency and discoverability; no audit can guarantee AI mentions or recommendations. Live observations describe the deployed version at audit time, not the uncommitted parent-page revision.

## Validation of the local parent-page revision

- Lint and TypeScript passed (13 existing lint warnings).
- All 26 SEO regression tests passed.
- Production build passed after granting network access for Google Fonts.
- Production preview: English and Arabic parent pages returned HTTP 200; each has one H1, five native disclosures with all answer text in HTML, working localized link targets in markup, retained section IDs, and the expected self-canonical.
- Visual/responsive browser inspection could not be completed because the browser access host is unavailable. No screenshot-based approval is claimed.
- Changes are local; no deployment or indexing submission is included in this task.
