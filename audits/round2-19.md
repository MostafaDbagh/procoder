# Round 2–19: Navbar/Footer and LocalizedLink

Scope: source-only review; read AGENTS.md; no application edits or live HTTP verification.

## Confirmed low-priority finding
- **About and Careers lack public internal anchor discovery.** Both routes exist and advertise canonical/alternate metadata (`src/app/[locale]/about/page.tsx:36`, `src/app/[locale]/careers/page.tsx:33`), but neither Navbar's route arrays (`src/components/Navbar.tsx:57–66`) nor Footer quick links (`src/components/Footer.tsx:95–101`) include them. Repository-wide search for hrefs targeting either route found none. Add About to the footer (and Careers if intended for public discovery). This is an internal linking opportunity, not evidence of a 404 or complete search-engine undiscoverability.

## Cleared / no actionable defect found
- All fixed Navbar/Footer internal destinations have corresponding app routes, including `/oman`, `/learning-path`, `/parents`, `/challenge`, `/blogs`, `/faq`, `/privacy`, `/terms`, parent/instructor login and unlocalized `/admin/login`.
- Footer's six category parameters (`Footer.tsx:112–117`) exactly match supported filter values (`src/app/[locale]/courses/CoursesClient.tsx:28–51`).
- `hrefWithLocale` blindly prepends locale (`src/components/LocalizedLink.tsx:9–11`) and would corrupt absolute external or already-prefixed paths. **No actual misuse found** among current LocalizedLink callsites. Literal inputs are unprefixed internal paths; variable inputs resolve to unprefixed route arrays, category query URLs, course/learning-stage routes, `/recommend?q=…`, or `/courses` BackLink fallbacks. Do not report a production malformed-href bug based solely on this helper's lack of defensive guards.
- Footer social, tel and mailto URLs use native anchors (`Footer.tsx:59–84`, `157–175`). Admin uses ordinary Next Link (`209–218`). Navbar locale switch uses native anchors and an explicitly prefixed URL (`Navbar.tsx:68–73`, `351–365`, `397–400`); no double-localization.
- Desktop course dropdown stays mounted when closed, preserving anchor discoverability (`Navbar.tsx:133–179`). Course data comes from the server layout (`src/app/[locale]/layout.tsx:52–58`), not a client-only request. Mobile's conditional rendering therefore does not imply absent crawlable course navigation.

Limit: API-provided course slug validity and live response status were not independently verified in this focused pass.
