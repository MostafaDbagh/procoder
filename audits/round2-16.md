# Round 2–16: private-route crawl coverage

Scope: read-only source audit of actual App Router page routes against robots exclusions, page metadata, and response-header configuration. Read repository `AGENTS.md`. No application files changed.

## Findings

No concrete missed private page routes found.

| Actual route family | Noindex coverage | robots.txt exclusion |
| --- | --- | --- |
| `/admin`, `/admin/login`, `/admin/dashboard` | `src/app/admin/layout.tsx` supplies inherited `PRIVATE_APP_ROBOTS`; admin HTTP header rules also apply | `/admin` prefix |
| `/{en,ar}/dashboard`, `/{en,ar}/dashboard/courses/create` | Each page supplies `PRIVATE_APP_ROBOTS`; dashboard HTTP header rules also apply | Localized dashboard prefixes |
| `/{en,ar}/instructor`, `/{en,ar}/instructor/login` | Each page supplies `PRIVATE_APP_ROBOTS`; instructor HTTP header rules also apply | Localized instructor prefixes |
| `/{en,ar}/parent/login` | Page supplies `PRIVATE_APP_ROBOTS`; localized parent HTTP header rule also applies | Explicit localized parent/login prefixes |

`PRIVATE_APP_ROBOTS` in `src/lib/seo.ts` sets both general and Googlebot `index: false, follow: false`. `src/app/robots.ts` uses the shared `PRIVATE_CRAWL_PATHS` for its combined user-agent group. Unlocalized dashboard, instructor, and parent-login entry paths are also excluded; `/api/` covers all actual API handlers. Routing supports only `en` and `ar`.

The public `/parents`, `/recommend`, `/challenge`, and `/free-trial` pages are marketing or public conversion flows, not missed private routes. No additional account, reset-password, checkout, or profile page routes exist in the inspected source inventory.

Verification limitation: source/configuration inspection only; deployed HTTP behavior was not tested for this focused audit.
