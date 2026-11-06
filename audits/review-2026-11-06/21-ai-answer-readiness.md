# Auditor 21 — AI answer and citation readiness

6 November 2026. Read-only review of current source and fresh `../seo-live-2026-11-06.json`, focusing on UAE, Python, robotics, homepage and sampled blog content. No consumer-assistant trial or citation-share measurement performed.

## Findings

1. **P1 — Resolve conflicting facts before encouraging machine summaries.** The live Python course says groups are typically 3–5, while the UAE guide says maximum three (`src/messages/en.json:1014`; `src/app/[locale]/uae/page.tsx:17`). Those statements are individually extractable but cannot produce a dependable answer together. Have operations confirm the rule per product and use a shared factual source for course, trial, parent and locale copy. This is the same underlying issue identified in the course-content audit, not an additional independent defect.

2. **P2 — Answer blocks are useful but essential purchasing facts remain unspecified.** UAE FAQ answers distinguish online delivery and website language from teaching language, which is valuable. However, language, timetable, software and included costs are repeatedly deferred to contacting the team (`uae/page.tsx:17,27–31`). Publish a maintained, course-specific facts section wherever operations can verify those facts; mark genuinely variable availability clearly. An assistant cannot cite a precise teaching-language or equipment answer that the page does not supply. Do not invent fixed schedules or prices to fill this gap.

3. **P2 — Make useful parent explanations available without clicks.** `src/components/ParentQuestions.tsx:57,144` initializes no selected answer and conditionally mounts the answer. The initial homepage offers questions without their detailed responses. Put the useful answers in initial HTML, for example native disclosure elements, or link to equivalent complete answers. This is an extraction limitation for these blocks, not a claim that the whole site needs JavaScript to read.

4. **P2 — Extend concrete teaching evidence and correct unsupported citations.** Python's live parent guide supplies an actual loop example with expected output; robotics offers a clearly labelled optional activity. These are strong models for specific, verifiable explanations. The guide component currently supports only those two subjects (`src/components/CourseParentGuide.tsx:50–51`). Extend relevant, instructor-reviewed examples to other priority courses and selected blogs. Conversely, the live article `/en/blogs/why-every-child-should-learn-coding` attributes an age-specific reasoning benefit to MIT Media Lab without a study link or identifying details. Verify and cite the primary study accurately or remove/qualify the attribution. Do not replace missing evidence with invented classroom results or testimonials.

## Guidance and limits

Google's [AI features documentation](https://developers.google.com/search/docs/appearance/ai-features) says standard SEO remains relevant, pages need indexing and snippet eligibility, and no special AI file or schema is required. Inclusion is not guaranteed. Content completeness and factual consistency are practical editorial recommendations here, not measured causal explanations for assistant selection.

The fresh crawl establishes readable HTML, not actual engine indexing, recommendations or citations. No numerical AI-readiness score, guaranteed visibility gain, or blanket AI exclusion is claimed. Existing source-backed course facts, localized pages, explicit online delivery and practical examples should be preserved.
