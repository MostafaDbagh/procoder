# Auditor 14 — Course/product content consistency

6 November 2026. Reviewed current translation/component source and the fresh 106-page raw-HTML crawl in `../seo-live-2026-11-06.json`. No application edits.

## Findings

1. **P1 — Confirmed conflicting class-size promises.** All 13 English course-detail pages contain “typically 3 to 5 students”. Robotics simultaneously says maximum three in its parent guidance. Sources: `src/messages/en.json:1014`, `src/messages/ar.json:1014`, `src/components/CourseParentGuide.tsx:12`, `src/components/ParentCourseChecklist.tsx:18`. The Arabic FAQ also explicitly says 3–5. This is a purchase-relevant factual conflict, not merely wording. Confirm whether group limits differ by product; publish one shared factual definition or clearly label the differing offers. Acceptance: course FAQ, homepage, trial, parent guide and both locales agree for each offer. Do not guess the operational limit.

2. **P2 — Minimum age is not consistently explained.** The live homepage hero and catalog positioning say 6–18, while its lead form promises 5–18 and the Explorer landing page explicitly targets 5–8. Sources: `src/messages/en.json:35–36,139–140,1461,1776`; live `/en`, `/en/courses`, `/en/learning-path/explorer`. This may reflect a legitimate stage-specific exception, but parents and extractors are not given that explanation. Confirm the youngest enrolment age and clarify eligibility by course/stage; distinguish general discovery pathways from available classes for five-year-olds.

3. **P2 — Teaching-language promise exceeds the qualification elsewhere.** Homepage benefits say children can switch Arabic/English any time with the same teachers (`src/messages/en.json:119–120`), whereas course guidance asks parents to confirm teaching language and availability (`CourseParentGuide.tsx:12,34`). Not proven false, but the unconditional global promise is stronger than product-level evidence. Confirm actual course/teacher language availability and use those facts consistently. Separate website translation from the language of instruction.

4. **P2 — Course-specific practical details remain difficult to verify.** Live robotics guidance appropriately describes virtual simulations and asks parents to confirm the simulator/equipment, while the shared FAQ assures them that no special software purchases are required. The actual simulator, platform compatibility, setup and included licenses are not established in the reviewed page. Add verified prerequisites and included/excluded materials per course so parents can assess fit before contacting the team. This is a decision-support gap, not evidence that hardware is required or the offer is misleading.

## Positive controls and limits

Course pages provide age ranges, lesson counts, duration, price and subject outcomes in initial HTML. Robotics guidance explicitly distinguishes children's learning from a professional engineering qualification and labels its home activity as optional, avoiding an invented promised assignment. Group/private formats can legitimately coexist; their coexistence alone is not a contradiction.

No operational documents, enrolment records or instructor availability were inspected. No ranking or AI-citation effect is measured. These findings prioritize factual consistency and purchase clarity rather than keyword repetition.
