# Auditor 13 — Search intent and topic coverage

6 November 2026. Reviewed current source and all English titles/descriptions in the fresh 106-URL crawl; inspected UAE, parents, selected course and blog bodies. No application changes.

## Findings

1. **P2 — Broad UAE commercial intent needs clearer page roles, not automatic consolidation.** `/en` and `/en/uae` both target online coding classes for UAE children; `/en/parents` also targets choosing these classes. There is legitimate differentiation: home discovers the brand, UAE explains local logistics, parents assesses fit. Make those roles explicit and strengthen the UAE page with verified current scheduling, equipment and availability details. Today much of its decision content tells the reader to ask the team (`src/app/[locale]/uae/page.tsx:11–31`). Validate query-to-page overlap in Search Console before changing URLs or merging pages. Similar titles alone do not demonstrate cannibalization.

2. **P2 — Course positioning can send conflicting readiness signals.** Live `/en/courses/programming2` is titled “Advanced Programming” while its level is “Beginner”; the body describes progression from earlier work and “Level 2.” The same contradictory combination appears on the UAE catalog. Clarify whether advanced means the second introductory course or genuinely advanced prerequisites. Publish the actual prerequisites and an example of required prior ability, then align the title/level and course-finder rules. `src/lib/course-positioning.ts:2–5` only overrides Python and robotics names; other names come from catalog data. Do not relabel without curriculum-owner confirmation.

3. **P2 — Useful commercial comparison questions remain underanswered.** Current topical coverage spans coding age, Scratch versus Python, robotics versus coding, and online versus in-person learning. That is a good foundation. The UAE landing page still delegates lesson language, schedule, fees and hardware confirmation to contact. Add a maintained decision table for actual courses (age/readiness, output, teaching language, equipment, lesson structure, current pricing link), with last verified date and explicit uncertainty where availability changes. Improve existing pages first; new city pages or keyword variants are not justified by this review.

4. **P2 — Readiness guidance should distinguish general advice from actual enrollment criteria.** `/en/blogs/best-age-to-start-coding` gives an absolute “best age” of six and places Python at ages 9–12; the linked Python course accepts 8–13. These can coexist as a heuristic and a product range, but the article does not explain that distinction. Use readiness criteria and link to the definitive course requirements, making the age guidance conditional. This improves the answer to “is this right for my child?” without manufacturing keyword demand.

## Cross-review factual inconsistency

**P1 — Class-size promise conflicts at the enrollment decision.** The fresh crawl has “typically 3 to 5 students” on all 13 English course-detail pages, while the UAE page promises a maximum of three (`src/app/[locale]/uae/page.tsx:17`). This is a confirmed text contradiction; whether offerings legitimately differ needs business confirmation. Establish the actual rule by product and publish it consistently before expanding comparison content.

## Positive evidence and limits

The inventory covers informational, comparison and enrollment intents with real links to relevant courses. No exact title duplication was found in the parent crawl summary. Topics should be improved for reader usefulness and demonstrable expertise, consistent with [Google's people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

No query-level Search Console export, keyword-volume tool, paid SEO index, ranking sample or competitor demand dataset was obtained. These are content/intent findings, not measured lost traffic, keyword difficulty or proven cannibalization. English bodies were sampled; no separate exhaustive Arabic intent review is claimed.
