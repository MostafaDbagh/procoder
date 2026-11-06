# Auditor 20 — AI crawler access and provider distinctions

Reviewed 6 November 2026. Source: `src/app/robots.ts`, `next.config.ts`, `src/proxy.ts`, probe implementation and fresh `../ai-discovery-live-2026-11-06.json`. Official provider documentation checked. No application changes.

## Result and finding

No public AI-crawler block demonstrated. Robots explicitly permits the relevant search and user-request identities (`robots.ts:9–29,63–65`); private-route headers are scoped to admin/member surfaces (`next.config.ts:172–223`). The locale proxy does not branch on user-agent. All 36 fresh declared-user-agent probes passed at 06:31 UTC (10:31 Dubai time).

**P2 — Verified crawler access remains unmeasured.** The script substitutes short agent names in requests originating from one machine (`scripts/check-ai-discovery.py:19–20,120,168`). This establishes responses to those declared identities, not access from provider IPs, full production user-agent strings, or all regions. Review hosting request/firewall logs for actual crawler requests and validate source addresses using each provider's published verification guidance. Record status, URL, timestamp and request ID; investigate real failures before changing firewall rules. Current code and successful probes do not justify a blanket firewall bypass or a claim that AI indexing is complete.

## Controls that must remain distinct

| Surface | Correct interpretation |
|---|---|
| ChatGPT search | OAI-SearchBot governs automatic search crawling. GPTBot controls potential model-training use independently; allowing training is not required for search inclusion. ChatGPT-User handles certain user-triggered actions and is not the search eligibility control. [Official OpenAI crawler documentation](https://developers.openai.com/api/docs/bots). |
| Google Search versus Gemini | Googlebot serves Google Search. Google-Extended controls specified Gemini training/grounding uses, has no separate HTTP user-agent, and is not a Google Search ranking signal. Do not add a spoofed Google-Extended HTTP probe and count it as Gemini verification. [Google crawler documentation](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended). |
| Perplexity | PerplexityBot supports search discovery; Perplexity-User supports user-requested retrieval. Their documentation supplies IP ranges for infrastructure checks; a successful name-only probe does not verify those ranges. [Perplexity crawler documentation](https://docs.perplexity.ai/docs/resources/perplexity-crawlers). |

The current broad allow policy is not itself an SEO defect. Training permission is a publisher choice and must not be sold as a prerequisite for citations. Keep separate records for crawl permission, observed verified fetches, indexed retrieval and actual assistant citations.

## Limits

No hosting-console configuration, verified crawler logs, Bing Webmaster data, provider index status or fresh consumer-assistant recommendation was inspected. No ranking, inclusion guarantee or provider-wide access conclusion follows from these probes. Claude identities are present and sampled successfully, but this review did not independently verify Anthropic's current provider documentation.
