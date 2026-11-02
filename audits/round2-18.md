# Round 2, task 18 — IndexNow submission

Scope: `src/app/api/indexnow/route.ts` only (plus this audit).

Read `AGENTS.md` and installed Next.js route-handler guide. Confirmed backend blog pagination maximum is 50 (`controllers/blogController.js`, `utils/pagination.js`).

## Findings and changes

- `limit=500` was silently capped at 50 and missing subsequent articles. Traverse explicit 50-item pages; reject invalid, truncated, or changing pagination instead of sending an incomplete list.
- Course helper previously hid unavailable catalog behind an empty array. Use the nullable catalog loader and return 502 on failure. Blog errors likewise prevent any submission.
- Explicit 503 when CRON_SECRET is missing/blank; incorrect credentials remain 401.
- Invalid JSON and explicit malformed/empty URL arrays return 400 rather than accidentally submitting the entire site.
- Validate every custom URL against the configured origin, allowing HTTP(S) only and rejecting credentials/fragments. Normalize and deduplicate. Enforce 10,000 URL input/payload maximum without truncation.
- Encode catalog path segments. IndexNow network exceptions produce a controlled 502.

## Verification

- `npx eslint src/app/api/indexnow/route.ts` — passed.
- `/tmp/round2-18-test.cjs` transpiles and invokes POST with fully mocked fetch, environment, response, SEO data, and catalog: passed 16 scenarios covering absent/bad secret, malformed input, foreign origins/ports, oversize input, deduplication, 51 articles across two pages, course/blog failure, and IndexNow network failure.
- No actual IndexNow submission or external network request performed.
