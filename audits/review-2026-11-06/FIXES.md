# SEO fixes — 6 November 2026

## Implemented

The user confirmed a maximum of **three students per class** and **free rescheduling with at least four hours' notice**. Both locale course FAQs now match these rules. Homepage lead copy also avoids implying that every class is private or every course admits five-year-olds; teaching-language wording directs families to confirm course availability. Support hours explicitly use UAE time.

- All 12 homepage answers and complete instructor bios are present in initial HTML using native keyboard-operable disclosures. The existing page colors and layout conventions are retained.
- Course metadata uses complete sentences rather than truncated clauses, and avoids repeating “Online”. Arabic reading-time and course-count plural forms are corrected on the affected cards/detail/UAE surfaces.
- Courses link to relevant guides, and guides link to related articles based on actual stored course relationships. Blog team bylines link to About; BlogPosting uses the same identity URL. Arabic category labels are localized. Raw tags and ambiguous “Available in” marketing labels no longer appear as service promises.
- Article covers use responsive Next Image delivery. Social cover metadata includes localized alternatives. Decorative hero art has empty alt text. Arabic OG font fetches have timeout and response checks; a reliable offline font fallback still needs visual verification.
- AI catalogs reject malformed/duplicate records safely; GET headers expose populated/fallback state and count, and the monitor records fallback warnings. Future sitemap dates are omitted. Invalid bilingual article payloads fail explicitly rather than publishing an empty body. Empty blog filters are noindexed. Homepage catalog failure retains an explicit catalog link and truthful unavailable state.
- Backend course schema enforces the existing USD-only product invariant; controllers already enforce USD on writes.

## Applied content corrections

Eight published article records were updated in the configured database using `stem-Be/scripts/fix-seo-editorial.js --apply`. The script previews by default, compares each field against the audited original, preserves unrelated fields/slugs/publication dates, and saves a rollback record before writing. A second preview found no pending changes. The public API was checked against the patch values, and the public Minecraft and coding-benefits pages were observed serving the corrected copy after cache refresh.

Changes remove an unsupported age-specific MIT research attribution; qualify Minecraft and Arabic-language course availability; distinguish competitions from practice activities; remove unsupported admissions/age guarantees; distinguish physical from simulated robotics; restore missing Arabic comparison benefits; and improve selected Arabic descriptions. New practical examples are labelled illustrative, not represented as real student outcomes or promised curriculum. Official Minecraft Education, Python and FIRST sources are linked where relevant. Legacy seed data applies matching corrections without replacing newer prose.

Rollback record: `stem-Be/scripts/seo-editorial-backup-1793947929096.json`. The migration does not delete or reseed posts. Backend/frontend application code has **not been deployed or committed**.

## Verification

- SEO regression suite: **26 passed** (including four new behavioral regressions).
- Discovery tests: **5 passed**.
- TypeScript: passed. Production Next build: passed; 131 static pages generated.
- ESLint: zero errors, 14 warnings. No claim that all existing warnings were repaired.
- Backend currency validation: USD default and rejection of non-USD values verified without database writes.
- Local HTTP checks: English/Arabic home, About, Python and Minecraft article pages returned 200; home contains 13 native disclosures, About contains eight; course/blog pages expose related guides. AI index reports 13 populated course entries. See `local-fix-verification.json`.
- An initial local run lacked the backend; checks were rerun with the site's public API. A transient dev compilation JSON error on English About cleared on retry. These are not production outage findings.
- The full backend test suite could not pass in the restricted sandbox: HTTP listeners and MongoDB DNS were blocked. It was not rerun with unrestricted production-database access; the changed model received isolated validation instead.
- Browser host was unavailable, so no screenshot, keyboard walkthrough, field CWV or mobile visual result is claimed.

## Remaining evidence-dependent work

- Deployment is required for code/template/policy changes to appear on the live site. The eight database article corrections are already applied.
- Confirm actual certification issuers, vetting, legal identity, founding year, instructor experience, course-specific equipment/language/schedules and the Advanced Programming readiness label before changing factual claims or inventing detail. Eligibility for five-year-olds must be clarified by curriculum owners.
- Fresh Search Console exports, verified crawler logs, historical incident correlation, field CWV and repeated consumer-assistant measurements are still required. Passing HTTP/tests is not a ranking, indexing or citation guarantee.
- Full production cache-failure/recovery testing, font/network optimization based on traces, and complete Arabic/editorial review remain follow-up work. The audit's conditional risks are not all confirmed bugs requiring code changes.
