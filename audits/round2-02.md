# Round 2 reviewer 02 — backend proxy and public API stability

Read-only source audit; no production code or configuration changed. Read `stem-Fe/AGENTS.md`. Deployment topology was not available, so topology-dependent failures below are conditional, not claims of a live outage.

## High: server-rendered and proxied public requests share one anonymous rate bucket

Evidence: `stem-Be/createApp.js:99-113` applies an IP-keyed global limiter before every route, with a production anonymous ceiling of 300 requests per 15 minutes. `stem-Fe/src/lib/api-proxy.ts:33-43` forwards only content-type and authorization; it supplies no independently verified visitor identity. `stem-Fe/src/lib/server-api.ts:19-24,137-169,264` makes backend requests from the frontend server, including uncached course/blog requests. With these requests originating from the same frontend instance or egress IP, backend IP limiting groups unrelated visitors and crawler-triggered renders together. `TRUST_PROXY=1` alone cannot recover identity that the frontend never forwards, and server rendering inherently originates at the server. Result: public page data can return 429 during ordinary aggregate traffic. Health checks also consume this same bucket (`createApp.js:141`).

Safe improvement: first measure the real ingress chain and request volume; retain bounded protection on every public endpoint. Give a narrowly authenticated internal read path its own bounded budget, or serve explicitly public reads through controlled caching with a separately bounded limiter. Do not exempt all GET requests, trust arbitrary X-Forwarded-For, identify bots by user-agent, or simply remove the anonymous limit. Add integration coverage for independent client identities, shared SSR traffic, 429 recovery, and spoofed forwarding headers before changing deployment trust settings.

## Medium: proxy strips public caching and retry information

Evidence: `stem-Fe/src/lib/api-proxy.ts:63-69` copies only content-type from upstream responses. Explicit public Cache-Control emitted by `stem-Be/controllers/courseController.js:48`, `categoryController.js:20`, and `blogController.js:25,36` therefore disappears through the same-origin proxy. Retry-After and rate-limit response headers likewise cannot reach callers. This removes actionable retry guidance and public browser/CDN caching policy, adding load to the shared budget above.

Safe improvement: explicitly forward Retry-After and the configured rate-limit headers. Forward Cache-Control only for an allowlist of unauthenticated public read routes; do not propagate public caching to authenticated/admin responses. Verify both a public 200 response and a 429 response through the proxy.

## Medium: purported authenticated rate budget requires no authentication

Evidence: `stem-Be/createApp.js:105-108` chooses the 2000-request production ceiling solely from presence of Authorization, before route authentication executes. `stem-Be/test/rateLimit.integration.test.js:63-89` explicitly exercises this using `Bearer test.placeholder.token`. Any anonymous requester can claim the larger ceiling. The limiter remains finite, but the comment describing authenticated requests is inaccurate and the anonymous budget is not an enforceable security boundary.

Safe improvement: keep the stricter pre-auth IP cap and add bounded post-verification principal limits, or verify credentials before assigning extra headroom. Do not turn this into an unlimited authenticated exemption. Change regression tests so malformed/invalid credentials cannot raise the anonymous ceiling; test the actual upper bound rather than only observing headers.

## Medium, deployment-dependent: raw protocol header controls HTTPS redirect

Evidence: `stem-Be/createApp.js:85-96` requires literal `x-forwarded-proto === "https"`, independently of the configured trust-proxy policy at lines 37-39. The frontend's direct backend fetches do not send this header. A private HTTP BACKEND_URL in production therefore redirects to HTTPS on the backend Host, which may have no TLS listener. Conversely an untrusted direct caller can supply the header. No deployed topology was inspected.

Safe improvement: enforce HTTPS at the actual public ingress, restrict backend access, and configure Express trust only for verified proxy addresses/hops; use that established trust model to evaluate secure transport. Test the supported public TLS and internal SSR paths, multi-proxy headers, and spoofed headers. Do not solve internal fetch failures by globally trusting forwarded headers or disabling HTTPS without a verified ingress boundary.

Validation: inspected application middleware order, frontend proxy/header handling, public controller response policies, server fetch helpers, environment example, and existing limiter tests. No network requests, database mutations, or runtime application tests were performed.
