# Round 2 review 28 — SEO regression tests, API, media, schema

No remaining serious regression confirmed in this focused review.

Read `AGENTS.md`; reviewed the current changes in `scripts/seo-regression.test.mjs`, `src/lib/server-api.ts`, `src/lib/mediaUrls.ts`, and `src/components/StructuredData.tsx`, plus image configuration and course schema call sites.

Validation: `npm run test:seo` passes all 12 tests. Detail helpers preserve upstream 404 versus failure behavior; optional helpers contain JSON parse failures; uploaded course images remain public paths; schema uses the same discount helper as the UI and escapes script-breaking text. Course listing and detail call sites pass discount and normalized image values.

Coverage limitation: the suite transpiles isolated modules with mocked fetch and does not prove deployed upload rewrites, actual optimizer responses, or rendered HTTP status codes. No live deployment verification was performed. These are verification limits, not confirmed serious defects.

No application files changed.
