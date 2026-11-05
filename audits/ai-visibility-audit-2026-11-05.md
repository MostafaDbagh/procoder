# StemTechLab AI visibility audit — 5 November 2026

Target: https://www.stemtechlab.com/. Audience: UAE parents comparing live online coding, robotics and STEM education. Arabic and English content reviewed. Syrian property platforms are excluded following the user's clarification.

## Decision

**Prioritize reliable discovery and a consistent, verifiable teaching offer. There is no demonstrated blanket AI-crawler block.** Today's public HTTP checks pass, but the first direct assistant comparisons favor competitors. This audit establishes an initial baseline, not a statistically reliable recommendation-share estimate or a promise of rankings.

The strongest immediate content defect is contradictory class-size information. The strongest historical search problem is a substantial Google impression collapse. Missing operational evidence and inconsistent facts are actionable; the exact causes of assistant selection and the historical Google collapse remain unproven.

## Evidence and limits

- Fresh read-only production monitor: **36 requests, zero failed checks**, completed at 15:39 Dubai time. Evidence: [HTTP results](ai-discovery-live-2026-11-05.json). Eight commercial URLs, robots, sitemap and both AI indexes; eight declared crawler/user-agent identities on robots and UAE pages.
- Additional raw HTML review: both homepages, UAE, robotics and Python pages; English About and free-trial pages. No JavaScript was executed to extract their text.
- Direct consumer tests: one English discovery prompt per ChatGPT, Perplexity and Gemini in new conversations on the existing signed-in accounts. Account memory/personalization was not disabled. Exact model versions were not exposed. These are account-specific observations, not clean-room or population-wide results.
- ChatGPT and Gemini prompt: “Which providers should I compare for live online STEM classes for children in the UAE? Explain who each suits and cite sources. Search the web.” Perplexity's submitted text was reordered by the input mechanism: “Which providers. and cite sources.should I compare for live online STEM classes for children in the UAE? Explain who each suits”. Its intent remained equivalent, but it is not an exact matched-prompt trial.
- Google evidence combines the live signed-in Web performance report with the dated November 3–4 diagnosis. Public web-tool results are search-retrieval evidence, **not measured Google rankings**.
- No production configuration, deployment, indexing submission, outreach or recurring automation was changed. Current verified-bot firewall logs and conversion exports were not obtained.

## 1. ChatGPT visibility

[Observed conversation](https://chatgpt.com/c/6aec6b5e-c2f0-83eb-9c6d-c84d236eb030) — free account, web search requested, linked sources present.

The response compared iCodejr, Unique World Robotics, Codeoko, JR Tinker, iSchool, Brainy n Bright, GeekashramJr and Twin School. StemTechLab was **mentioned, but not recommended or linked**: the response said it had not established whether StemTechLab offered the same live online model. Do not count that mention as a recommendation or citation. Since account personalization was not controlled, its unsolicited brand mention cannot establish independent brand discovery.

The website does explain live teaching, and the free-trial HTML offers a 60-minute session. Therefore the response exposes a retrieval/verification gap in this run, not proof that the website lacks that information. Public search also retrieved older homepage text while today's live HTML has newer UAE positioning. That is a freshness observation, not proof that ChatGPT used that exact old document.

OAI-SearchBot is explicitly allowed and its declared user-agent requests succeeded. GPTBot is a separate training control; allowing it is not a prerequisite for ChatGPT Search. [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots).

## 2. Google visibility

The signed-in [Web performance report](https://search.google.com/search-console/performance/search-analytics?resource_id=https%3A%2F%2Fwww.stemtechlab.com%2F&num_of_months=12), viewed today, displayed **45 clicks, 3.79k impressions, 1.2% CTR and average position 61.3**, with chart dates **17 April–3 November 2026**. The property selector and report URL identify StemTechLab; the inspection-field placeholder retained another property's name, so do not use that field as evidence of a URL inspection. This was a displayed report, not a downloaded export. Leading visible queries remain broad robotics terms with zero clicks.

The [November 4 six-month diagnosis](seo-diagnosis-2026-11-03.md) records site impressions of 1,387 in August, 138 in September and 92 in October. English robotics fell from 1,143 August impressions to zero in September and October. Those historical findings remain material; the smaller recent titles/content changes cannot explain the earlier drop. Previously recorded robots failures and sitemap-fetch problems require incident investigation, even though today's fetches pass. No penalty or algorithm cause has been established.

A link to a Google generative-AI report was visible, but navigation did not produce a readable new report. **No Google AI Overview/AI Mode traffic total is claimed.** Those Google Search surfaces are also distinct from the standalone Gemini test below.

Google states that normal indexing and snippet eligibility apply to AI Search features and that no special AI text file or schema is required. [Google AI features documentation](https://developers.google.com/search/docs/appearance/ai-features).

## 3. Perplexity visibility

[Observed answer](https://www.perplexity.ai/search/ace4d597-e565-4db5-878b-2c99bff778ff) — Search mode, free account with a displayed Pro preview, 25 sources shown.

The completed answer compared iCodejr, Clevered, Playto Labs, Coding School Dubai, GeekashramJr and Outschool, and also mentioned BYOR Academy. **StemTechLab was absent from the answer.** The full source drawer was not exported, so absence from all 25 retrieved sources is not claimed. This is one English observation, not evidence of permanent exclusion.

PerplexityBot and Perplexity-User requests passed today's access checks. Actual provider IP access still needs log verification. [Perplexity crawler and WAF documentation](https://docs.perplexity.ai/docs/resources/perplexity-crawlers).

## 4. Gemini visibility

[Observed conversation](https://gemini.google.com/app/c3477abbe44e8769) — Gemini Auto, web search requested; response provided reference links and a searching-the-web status was observed.

The answer compared iCodejr, Brainy n Bright, Plato's Planet and Playto/Skyfi Labs. **StemTechLab was absent from the answer and its displayed references.** Some cited references were dated 2020 and 2025. Treat the generated competitor details as observations of Gemini output, not verified current commercial facts.

Robots explicitly permits Googlebot and Google-Extended. Google-Extended is a robots control for specified Gemini training/grounding uses, not a separate HTTP crawler identity to spoof or a Google Search ranking switch. [Google crawler documentation](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended). No guaranteed Gemini inclusion follows from allowing it.

## 5. Competitor comparison

Selection reflects overlap with the actual assistant results and UAE/Arabic search intent. This is a comparison of public information, not teaching quality, market share or independently verified accreditation.

| Provider | Public evidence observed | Implication for StemTechLab |
|---|---|---|
| [iCodejr](https://icodejr.com/) | Clear live one-to-one format, ages 5–18, free-trial CTA and named learning paths. Appeared in all three assistant answers. | Make format, suitable ages, progression and trial details consistently easy to extract. Accreditation and scale claims on competitors' sites are self-reported here. |
| [GeekashramJr](https://www.geekashramjr.com/locations/uae) | UAE page states GST scheduling, grade range, a 45-minute trial and starting AED session pricing, plus course outputs. Appeared in ChatGPT and Perplexity. | Give parents dated scheduling, billing currency and concrete outputs; do not invent AED prices or copy competitors' claims. |
| [iSchool](https://ischooltech.com/paid-subscribe) | Arabic age-segmented courses, named outcomes, equipment guidance and a five-student group offer. The UAE Arabic URL redirected to this subscription page. | Arabic content should answer enrolment decisions directly. UAE-local terms cannot be inferred from the redirected global offer. |
| [UWR Online](https://online.uwr.ae/online-courses) | Search retrieval describes ages, tools and session counts; ChatGPT included it. Direct text extraction returned no readable lines. Retrieved April start dates are not confirmed current availability. | Use its specificity as a content-format benchmark, with lower confidence on current schedule. |
| [Plulai](https://www.plulai.com/uae) | Clearly describes self-paced Arabic/English learning, trial length and billing. | An adjacent alternative, not a like-for-like live-instructor competitor. Explain StemTechLab's human-led format clearly. |

StemTechLab already has useful strengths: server-rendered course descriptions, ages, duration, lesson counts, parent guidance, a trial offer and named instructor profiles on About. The live About vision is STEM-focused; the old “grow in faith” issue is no longer an accurate current finding. Do not redo those repairs or claim that there are no instructor profiles.

## 6. Technical accessibility and factual consistency

| Check | Finding |
|---|---|
| Robots | HTTP 200; OAI-SearchBot, Googlebot, Google-Extended, PerplexityBot and Perplexity-User permitted on public pages. Private routes remain excluded. |
| Hosting | Responses identify Vercel. No challenge/block in the sampled requests. No proof of actual OpenAI/Perplexity IP access, no fresh firewall review, and no evidence supporting a Cloudflare-specific fix. |
| HTML | Eight sampled commercial pages return 200 with correct self-canonicals, language, H1 and parseable JSON-LD; no detected noindex. Course content and five FAQ disclosures per sampled course are available without JS. |
| Discovery files | Sitemap parses with 106 URLs and includes the eight commercial pages. Both llms.txt files pass. This is not a fresh crawl of all 106 destinations. |
| Resilience | Public page responses show Vercel MISS; root layout still reads request headers. Sitemap and data caching repairs already exist. MISS alone is not a defect, but request-time rendering and upstream dependency need controlled failure testing. |
| Class size — confirmed defect | Robotics parent guidance says maximum three; its rendered FAQ says typically 3–5. Free-trial page says maximum three. Sources: `src/components/CourseParentGuide.tsx`, `ParentCourseChecklist.tsx`, `src/messages/en.json` course FAQ. Business must confirm whether limits vary by product. |
| Credentials — verification gap | Current homepage/footer/trial wording claims certified teachers. About contains named bios, but certification evidence was not established by this audit. Verify issuer/qualification rather than treating the claim as proven false. |
| Currency — source risk | `formatCoursePrice.ts` forces USD, while Course Offer JSON-LD reads the catalog currency. No actual mismatched live purchase was demonstrated. If the product is USD-only, enforce that invariant at the API boundary; otherwise make UI and schema use the same currency. |

Branded public retrieval also surfaced unrelated historical references using the exact domain. This is an **entity-history investigation lead**, not an allegation about the current education business or proof of a ranking penalty. Keep current legal identity, education positioning and official profiles consistent; investigate historical ownership before drawing conclusions or changing domains.

## 7. Developer implementation plan

Estimates are working ranges, not delivery commitments. Confirm operational facts with the business before publishing them.

| Priority / owner | Work and code locations | Acceptance criterion | Estimate |
|---|---|---|---|
| P0 / developer + operations | Run `scripts/check-ai-discovery.py` from UAE and another region through existing monitoring; correlate robots/sitemap/HTML failures with verified crawler IPs and Vercel request IDs. | Saved status, time, request ID and challenge evidence; alerts on 403/429/5xx or invalid content; seven-day baseline. No broad user-agent-only allowlist or global security disablement. | 1–2 days setup, then observation |
| P0 / developer + course owner | Establish one class-size source per course/cohort; update `CourseParentGuide.tsx`, `ParentCourseChecklist.tsx`, translations and trial copy. | Approved capacity is identical across visible HTML, FAQs, AI indexes and any schema; Arabic and English agree. | 0.5–1 day after fact confirmation |
| P1 / developer + course owner | Add or connect course/cohort fields for teaching language, session minutes, GST slots, equipment, software, instructor and a real example project. Render in course detail and UAE page; use `src/lib/llms-content.ts` only as a derived summary. | Robotics and Python in both languages answer these questions without JS. Website locale is not substituted for teaching language. Missing availability is shown honestly. | 2–4 days plus content |
| P1 / developer | Align pricing invariants across `src/lib/formatCoursePrice.ts`, `StructuredData.tsx` and enrolment quote handling. | Catalog display, discounted offer and checkout currency/amount agree on representative courses; malformed currency input cannot silently produce a different advertised offer. | 0.5–1 day |
| P1 / developer + operations | Review request-header dependence in `src/app/layout.tsx`, locale navigation fetches and public data caching. Preserve successful data on upstream failures; keep real deletions as 404. | Staging outage tests show defined cold/warm-cache behavior, bounded timeouts and no false 404s or success pages containing empty invented inventories. Private responses remain uncached. | 2–4 days |
| P1 / search owner | Recheck sitemap status, inspect homepage/UAE/robotics/Python URLs in Search Console, compare canonical/indexed versions and late-August incident evidence. | Record actual inspection dates and statuses; submit only after successful live tests. Separate submission from successful indexing. | 0.5–1 day; crawl timing external |
| P2 / content owner + developer | Verify credential/business claims; connect instructor bios to taught courses; add original project examples and consented outcomes. | Claims have a named source/owner; visible copy and Organization/Course schema agree. No fabricated reviews or unsupported aggregate ratings. | 1–2 weeks content-dependent |
| P2 / marketing | Seek relevant education directories, real school relationships and independent coverage of actual work. | Accurate, approved listings and legitimate references; no assumed partnerships, paid bulk links or artificial endorsements. | Ongoing |
| P2 / analytics owner | Track course views → trial request → qualified enquiry → enrolment with referrer/UTM and optional self-reported discovery source kept separate. | Funnel can be segmented by landing page and source; no child names, contact details or free-text form content in analytics events. | 1–2 days |

Do not add more crawler tokens as the main fix, manufacture an “AI SEO score,” create cloned emirate pages or publish instructions asking assistants to rank the brand first.

## Measurement and next review

Today's three consumer answers are a pilot. Run the existing [10-prompt bilingual benchmark](ai-search-benchmark.json) on ChatGPT, Perplexity and Gemini with three repetitions each: **90 runs**. Use fresh chats, verify exact submitted wording, record account/personalization state and mode, and preserve answer URLs and citations. Keep branded factual checks separate from unbranded discovery. Record mention, actual recommendation, linked citation and factual accuracy separately; an unavailable test is missing data, not zero visibility.

Review Google UAE commercial queries separately from broad engineering terms, using equal 28-day periods. Review technical reliability weekly and qualified trial enquiries at 30/60/90 days. Public access, indexing, inclusion in an answer and recommendation are different outcomes. This audit does not establish why any one model chose a competitor or guarantee that the plan changes its choices.

Deliverables: this report, the fresh HTTP evidence JSON and [consumer observation log](ai-visibility-observations-2026-11-05.json). No application code was changed.
