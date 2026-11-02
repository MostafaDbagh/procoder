# Round 2 reviewer 01 — server API error handling

## P2: JSON body errors bypass the challenge fallback

- Location: `src/lib/server-api.ts:370` (`getChallengePublicLatestISR`); same pattern at lines 265, 282 and 357 in blog-list/pricing helpers.
- The helper returns `res.json()` without awaiting it inside its `try`. A successful HTTP response with malformed/truncated JSON, or a stream failure after headers arrive, rejects asynchronously after the `try` has exited. Its `catch { return null; }` never runs.
- Concrete affected callers: `src/app/[locale]/challenge/page.tsx:32,74` await the helper without catching. This prevents both the existing static metadata and built-in challenge fallback from rendering when JSON decoding fails. Unlike a transport failure or HTTP 500 (which correctly return null here), a broken body can fail the public challenge page/metadata generation.
- Reproduction: Node `async function current(){try{return new Response("{").json()}catch{return null}}` rejects with `SyntaxError`; changing the return to `return await ...` fulfills with `null`. Confirmed with `Promise.allSettled`.
- Fix: await JSON parsing inside the existing guarded region for the fallback helpers. Preserve the intentionally throwing behavior of single-course/single-post helpers.
- This is a code-path finding, not evidence of a current production malformed response. It is distinct from the prior report's backend outage/404 and empty-catalog concerns.

Read `AGENTS.md`; application files were not modified. Compared against `audits/seo-audit-2026-11-02.md`.
