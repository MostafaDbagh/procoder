# Auditor 06 — Structured data

Reviewed 6 November 2026: current `StructuredData.tsx`, course renderer, price formatter and fresh 106-page crawl `../seo-live-2026-11-06.json`. No source changes.

## Result

No critical structured-data defect established. All 106 responses have parseable JSON-LD. Top-level coverage: 106 EducationalOrganization, 106 WebSite, 104 BreadcrumbList, 36 Course, 40 BlogPosting and 2 FAQPage blocks. JSON parsing is not full semantic validation or rich-result eligibility.

## Findings

- **P2, conditional currency mismatch risk:** `src/components/StructuredData.tsx:257` takes Offer currency from catalog data, but `src/lib/formatCoursePrice.ts:17–28` ignores that currency and displays USD. Current crawled Course Offers use USD, so no live mismatch demonstrated. Enforce USD at the catalog boundary or share the actual currency between UI and schema. Acceptance: non-USD input is rejected or displayed identically in both outputs.
- **P2, evidence gap in entity assertions:** `src/components/StructuredData.tsx:31–38,53–61` publishes legalName, founding year, Dubai address and official profile relationships globally. This review cannot verify legal registration, founding date or profile ownership. Confirm these assertions against business records; do not assume they are false. Prefer a stable Facebook page URL over the share URL after verifying ownership.
- **P3, duration semantics:** `src/components/StructuredData.tsx:277` maps elapsed course weeks to `timeRequired` (live robotics: P10W). Schema.org describes this as typical time to work through the content. Consider distinguishing curriculum calendar duration from actual learning effort, especially if machine consumers could interpret ten continuous weeks of work. Only publish total workload when known. [Schema.org definition](https://schema.org/timeRequired).

## Positive controls

- Course schema uses the same catalog data and shared discount calculation as the product renderer (`src/app/[locale]/courses/[id]/page.tsx:170–185`; `StructuredData.tsx:247–298`). Course provider has a consistent organization ID; no invented aggregate ratings were found in this builder.
- Breadcrumb positions are sequential and generated from explicit URL/name pairs (`StructuredData.tsx:221–233`).
- FAQ schema is derived from the shared FAQ translation keys (`StructuredData.tsx:71–89`). Both crawled FAQPage pages contain all their schema question strings in rendered text. Course FAQ absence from structured data is not itself a defect.
- Script serialization escapes `<` (`StructuredData.tsx:238–243`).

## Limits

No Google Rich Results Test, Search Console enhancement report, or business-record validation performed. Parseability, valid Schema.org markup, and eligibility for a particular Google presentation are different checks. Do not promise enhanced results or AI citations from these changes.
