# Auditor 05 — Titles and meta descriptions

Reviewed 6 November 2026. Scope: current metadata implementation and all 106 sitemap destinations in `../seo-live-2026-11-06.json`. No application changes.

## Result

All 106 crawled pages have nonempty, unique titles and descriptions. No exact duplicate titles/descriptions or titles over 75 characters were found. The latter is only a diagnostic, not a Google character limit. Blog titles correctly avoid duplicated branding (`src/app/[locale]/blogs/[slug]/page.tsx:25–36`), and homepage metadata is localized (`src/app/[locale]/page.tsx:16–43`). No P0/P1 metadata defect established.

## Findings

1. **P2 — Course descriptions cut the useful promise in mid-sentence.** `src/app/[locale]/courses/[id]/page.tsx:54–71` reserves space for age/level/lesson statistics by truncating the raw sales description. Live `/en/courses/python` ends its body with “students start with the…” and `/en/courses/web-beginner` with “They’ll learn how to…”, before the statistics. These are readable tags but weak summaries. Give course editors a dedicated localized search description, or generate a complete outcome sentence before the factual suffix. Acceptance: each description communicates a specific project/tool/outcome without unfinished clauses; retain age and live format where useful.

2. **P2 — Several Arabic blog descriptions are too generic to explain their particular value.** Live `/ar/blogs/scratch-vs-python-which-is-right-for-your-child` only says “قارن بين سكراتش وبايثون للأطفال.” while the English description promises selection by age and experience. `/ar/blogs/game-development-for-kids-complete-guide` says only “دليل شامل لتعليم تطوير الألعاب للأطفال.” The rendering uses stored locale metadata directly (`src/app/[locale]/blogs/[slug]/page.tsx:25–26,36`), so improve the CMS content rather than adding arbitrary padding. Include the comparison criteria or tools actually explained by the article. Acceptance: every localized description communicates the article's concrete decision or takeaway.

3. **P3 — Homepage and UAE landing page target almost identical title intent.** Live `/en` is “Online Coding Classes for Kids in the UAE | StemTechLab”; `/en/uae` is “Online Coding & STEM Classes for Kids in the UAE | StemTechLab”. These are not duplicate tags and do not prove cannibalization. Assign the homepage a broad brand/course-discovery role and the UAE page a more specific local decision role (verified scheduling/support/availability), then inspect query-to-page performance before changing titles. Avoid an unproven consolidation.

4. **P3 — Repeated title wording on priority courses.** Live Python/robotics titles use “Online … | Online Course for Ages … | StemTechLab”, produced by `src/app/[locale]/courses/[id]/page.tsx:85–94`. Drop the second “Online” and preserve the distinctive topic and age. This is an editorial refinement, not an indexing failure.

## Guidance and limits

Google recommends concise, descriptive page titles and may select its own title; display truncation depends on width, not a universal character count. [Google title documentation](https://developers.google.com/search/docs/appearance/title-link). Descriptions should accurately summarize a page; Google may instead generate query-dependent snippets from its text. [Google snippet documentation](https://developers.google.com/search/docs/appearance/snippet).

The crawl is a one-time HTML snapshot, not a Google SERP sample. No CTR effect, ranking penalty, keyword volume, or query cannibalization has been measured. Query variants outside the sitemap are outside this count.
