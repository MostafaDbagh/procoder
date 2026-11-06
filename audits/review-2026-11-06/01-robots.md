# Auditor 01 — Robots and crawler access

Scope: current source inspected 6 November 2026; no application changes. No fresh production fetch or verified-provider network test performed by this auditor.

## Findings

- **P2, conditional deindexing risk:** `src/lib/seo.ts:71–94` disallows admin, dashboard, instructor and login URLs, while `next.config.ts:171–224` and `src/lib/seo.ts:30–34` also apply noindex. A crawler obeying the disallow cannot retrieve the noindex directive. This matters if those URLs are already indexed; their current indexing state was not established. Check Search Console for affected URLs. Keep private content authenticated; use crawlable noindex for public login shells when removal from search is necessary. Do not broadly remove private-route protection. Google documents that robots blocking alone does not prevent URL indexing: https://developers.google.com/search/docs/crawling-indexing/robots/intro.
- **P2, validation gap rather than demonstrated access failure:** `scripts/check-ai-discovery.py:4–5` correctly limits its claims to declared user agents from the test host. Its agent/page samples (`:19–22`) and robots checks (`:63–73`) cannot establish access from verified Google/OpenAI/Perplexity IPs. Retain the monitor, correlate real crawler requests with hosting logs, and check both locale blog URLs alongside commercial pages. Do not interpret a passing agent-string probe as actual indexing or recommendation visibility.

## Positive controls

- `src/app/robots.ts:7` forces a static robots response, independent of API health.
- `src/app/robots.ts:63–68` applies the same allow/disallow rules to all named agents and the wildcard; there is no source-level blanket block on public commercial or blog routes.
- `src/proxy.ts:40` excludes paths containing dots, so `/robots.txt` is not routed through locale middleware.
- `src/lib/seo.ts:71–94` does not block public `/_next/` assets required to render pages.
- Canonical sitemap origin is centralized (`src/lib/seo.ts:37–43`, `src/app/robots.ts:68`).

## Conclusion and acceptance checks

No P0/P1 crawler-block defect identified in source. Verify deployed robots is 200 text/plain with the canonical sitemap, verify public English/Arabic blog and course pages remain allowed, inspect real crawler logs, and verify any already-indexed private/login URLs have an appropriate removal path. No ranking or AI inclusion guarantee follows from these controls.
