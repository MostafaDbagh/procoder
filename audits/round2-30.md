# Round 2 — Reviewer 30

Scope: new `/api/revalidate` and IndexNow changes; source review only. No external submissions or application edits. Read AGENTS.md and installed Next `after` / `revalidatePath` documentation.

## Findings

- **P2 — Automatic course notifications still omit changed detail URLs (existing integration gap).** `src/app/api/revalidate/route.ts:75` submits only provided paths when nonempty. `AdminDashboard.tsx:766` always supplies homepage/listing defaults for course saves (`:981`, `:1009`), so neither the changed course nor the full-catalog branch is submitted. Broad locale invalidation fixes cache coverage but does not fix notification coverage. Pass changed/new and old localized course URLs from the mutation, or explicitly request a full submission.
- **P3 — IndexNow upstream work has no timeout.** `src/app/api/indexnow/route.ts:23` fetches every blog page sequentially without a signal, and `:117` submits externally without one. A stalled upstream can consume the entire hosting deadline instead of returning the controlled 502; `/api/revalidate` stops waiting after ten seconds but does not cancel the separate handler's work. Add bounded upstream deadlines, with a total budget for catalog pagination. This is a reliability concern, not evidence of a current submission failure.

## Checks passed

- Dynamic locale layout invalidation supplies the required `layout` type and covers nested pages; sitemap invalidation is explicit.
- `after` is supported in Route Handlers in the installed Next documentation.
- Missing/blank cron configuration fails closed; malformed explicit URL arrays do not silently turn into full submissions.
- URL validation rejects foreign origins, credentials, and fragments; generated slugs are encoded; URL count is bounded.
- Blog pagination matches the backend's 50-item public limit and `totalPages >= 1` empty-catalog convention; catalog failures prevent partial submissions.

No new high-severity defect found. Runtime behavior and external IndexNow acceptance were not exercised.
