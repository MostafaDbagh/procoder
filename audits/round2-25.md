# Round 2–25: course metadata generation

Read-only application review; read root `AGENTS.md`. Reviewed current course metadata and reproduced its string operations with Node. Existing `seo-live.json` is historical context, not verification of the current deployment.

## Findings

- **Medium — truncation fails for long text without a space within the budget.** `src/app/[locale]/courses/[id]/page.tsx:55–56`: `lastIndexOf(" ", max)` returns `-1`, which is truthy, so `|| max` never applies. `slice(0, -1)` retains nearly the entire input. Reproduction: a 150-character unbroken description plus the standard ages 10–13/beginner/12 lessons/6 weeks suffix yields 207 characters, despite the intended 120-character total. Use an explicit nonnegative boundary check and reserve the ellipsis in the budget.

- **Low — first-line extraction discards substantive descriptions and can create identical metadata.** `src/app/[locale]/courses/[id]/page.tsx:66` (also static branch `:77`) selects the first line before trimming or checking emptiness. `"\nLearn Python by building games."` produces only `" For ages 10–13. Beginner level, 12 lessons over 6 weeks."`. Two courses with blank first lines and equal stats therefore get identical descriptions even when their actual bodies differ. This is a reproduced input edge case, not a confirmed current catalog occurrence. Normalize whitespace or select the first nonempty line; use a localized course-name fallback when the body is empty.

- **Low — aggressive fixed body budget removes the subject of real course copy.** `src/app/[locale]/courses/[id]/page.tsx:66`: reserving the stats suffix within a total of only 120 characters typically leaves about 55–65 characters for the actual description. The existing captured output for `web-intermediate` is `Your child is ready for the next challenge. In this… For ages 11–14. Intermediate level, 16 lessons over 10 weeks.`; it never identifies web design. A course-specific concise summary or inclusion of the course name would preserve the distinguishing subject. This is a content-quality issue, not an assertion that search engines enforce a particular character limit.

## Age/title and duplicate checks

Current title generation (`:83–88`) uses the same numeric age bounds as the description and sets `title.absolute` (`:96`), preventing layout-template double branding. There is no automatic title truncation. The unconditional appended age phrase will repeat an age phrase already present in a CMS title, but this review did not establish such a title in current API data; do not treat that possibility as a confirmed defect. Missing localized title/description values are not normalized by `getCourseISR` (`src/lib/server-api.ts:195` checks only enclosing objects), so malformed API data remains a conditional robustness concern rather than a verified catalog issue.

No application edits or network checks were performed.
