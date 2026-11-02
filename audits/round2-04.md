# Round 2 reviewer 04 — Arabic aliases and route boundaries

## P2: Arabic alias redirects swallow unknown descendant paths

- Location: `src/proxy.ts:9,24–26`.
- `ARABIC_COURSE_RE` has no end anchor. `/ar/courses/بايثون/does-not-exist` matches the recognized `بايثون` prefix, then permanently redirects to `/ar/courses/python`, discarding `/does-not-exist`. The same happens with arbitrary deeper descendants and the English locale. These are not course-detail aliases: the application only defines `courses/[id]/page.tsx`, so unknown descendants should remain missing routes.
- Impact: malformed inbound/internal paths are silently collapsed into valid course pages with a permanent redirect; crawlers cannot distinguish these nonexistent resources from deliberately supported aliases. This is separate from the already-fixed unknown-Arabic-slug self-redirect.
- Reproduction: executed the exact regexp in Node against `/ar/courses/بايثون/does-not-exist` and `/en/courses/بايثون/anything/deeper`; both match only the course prefix and produce the canonical Python destination using the implementation's target expression.
- Fix: anchor the matcher to the complete detail path, optionally accepting a trailing slash (`/^\/(en|ar)\/courses\/([^/?#]+)\/?$/`). Let unmatched descendants follow normal routing and return 404.

Read `AGENTS.md` and compared the prior SEO report. No application files changed. HTTP reproduction was unavailable because the sandbox refused the localhost connection; this finding is established by the current source and direct regexp execution, not a claimed live HTTP observation. Unknown aliases now correctly bypass redirect, locale validation rejects unsupported locales, and query parameters are retained for supported aliases. No separate concrete trailing-slash issue found.
