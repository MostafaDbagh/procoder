# Round 2-06 — Course client fallback and stale data

Read-only application audit. Read `AGENTS.md`. No application files changed. Verified React Query semantics against the installed `@tanstack/query-core` with a short Node QueryObserver reproduction; no production service calls were made.

## 1. P1 — Failed background fetch removes previously available CMS content

Locations: `src/app/[locale]/courses/CoursesClient.tsx:115-118`; `src/app/[locale]/courses/[id]/CourseDetailContent.tsx:140-146,170-207`.

Both clients require `!isError` before using query data. React Query retains its last successful data when a background request fails. Nevertheless, the catalog switches entirely to bundled static courses, dropping all CMS-only links; detail pages switch to obsolete static details or display the localized “not found” body for a CMS-only slug. The route was successfully server-rendered, so this client state does not change its HTTP status to 404. Server-generated metadata and Course JSON-LD remain for the real course while the visible content disappears or changes. This is a rendered-content consistency/availability risk, conditional on a refetch (e.g. stale remount/reconnect), rather than a claim that all initial crawler visits fail.

Reproduction with installed library: seed `{slug:'cms-only',title:'Published course'}`, refetch with a rejected 503 promise. Result: `isError:true`, `data:{slug:'cms-only',title:'Published course'}`; current `fromApi` becomes false despite intact data. The shared provider retries once (`src/components/QueryProvider.tsx:14`), after which this branch is reached.

Recommendation: prefer existing successful data regardless of background error. Distinguish initial absence, transient refetch failure, and confirmed deletion. Keep last good title/body/links on transient errors; never render a not-found message solely because an update failed.

## 2. P2 — A valid empty catalog silently republishes bundled courses

Locations: `src/app/[locale]/courses/CoursesClient.tsx:115-118`; related server schema branch `src/app/[locale]/courses/page.tsx:92-120`.

The `apiData.length > 0` condition treats a successful `[]` exactly like missing data. Removing/unpublishing every course in the CMS therefore renders the entire bundled catalog, including links and descriptions, rather than the existing empty-results UI. This happens even on initial server rendering with `initialCourses=[]`; the schema separately repeats the same fallback. It can keep withdrawn offerings in crawlable content indefinitely, rather than merely during a cache window.

Recommendation: treat an array, including an empty array, as authoritative successful data. Reserve any explicitly supported static catalog mode for a separate configuration/decision; keep JSON-LD consistent with the authoritative empty state.

## 3. P2 — Fresh server props cannot replace an already populated client query

Location: `src/hooks/useCourses.ts:4-20`; persistence/defaults: `src/components/QueryProvider.tsx:6-18`, `src/app/[locale]/layout.tsx:62`; server refresh windows: `src/lib/server-api.ts:169` and `src/app/[locale]/courses/[id]/page.tsx:14`.

The hooks pass server results only as `initialData`, under persistent keys `["courses"]` / `["course", slug]`. This initializes an empty query but does not update an existing query. During same-session navigation or route refresh, newly fetched server props can therefore be ignored while older courses/prices/descriptions remain on screen. Both hooks mark that cache fresh for five minutes; the provider disables focus refetch. `staleTime` itself does not schedule a periodic refresh, so a continuously mounted page can remain unchanged beyond five minutes. Server catalog fetch and detail route use 60-second revalidation, so the “matches ISR revalidate” comment is misleading. Without an initial fetch timestamp, server cache age also resets to “now” when seeded.

Installed-library reproduction: initialize `["courses"]` with `[{slug:'old'}]`, then construct an observer with the same key and `initialData:[{slug:'new'}]`; it still returns `[{slug:'old'}]`. On a detail route, server-generated JSON-LD can consequently describe updated server props while client visible details continue to reflect the old query cache.

Recommendation: reconcile newer server snapshots into the query cache using real freshness timestamps (or make the server snapshot the rendering authority); align the intended refresh policy with the server cache policy. Do not assume `initialData` synchronizes incoming props or that a stale timeout fetches by itself.

## Scope limits

These findings concern concrete client branch/cache behavior and its effect on indexable content consistency. No ranking impact or production incidence is asserted. The server catalog already throws on API unavailability (`CoursesContent.tsx:7`), so a first-load server outage does not currently exercise the client's static error fallback; finding 1 concerns subsequent client fetch failure after successful server data.
