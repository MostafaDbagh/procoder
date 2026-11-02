# Focused review: Course JSON-LD

Scope: readonly review of Course/CourseInstance fields, price/currency/free claims and current Google requirements. Read AGENTS.md. No application edits. Verified 2026-11-02 by source inspection and executing the actual buildCourseSchema body through the installed TypeScript transpiler.

## Verified bug

### P2 — Discounted courses advertise their undiscounted list price as the current offer

- `src/components/StructuredData.tsx:256` sets `Offer.price` to `course.price`; `CourseListSchemaItem` does not accept `discountPercent`.
- Both callers (`src/app/[locale]/courses/page.tsx:99` and `src/app/[locale]/courses/[id]/page.tsx:177`) pass raw list price only.
- The visible detail page computes `salePrice` from `discountPercent` at `CourseDetailContent.tsx:162` and displays it at lines 367 and 430. The same discount rule is implemented by backend `utils/pricing.js`.
- Reproduction using actual builder: price 200 USD and discountPercent 25 yields `offers.price: "200"`, while the UI pricing helper yields 150. The incorrect offer is duplicated inside `hasCourseInstance`. At 100% discount the builder still emits a positive paid offer.
- Impact: when an administrator enables the supported catalog discount, machine-readable current price disagrees with the displayed price. This is a reproducible supported-input bug, not a claim that a current production course has a discount.
- Fix direction: supply the effective discounted price to the schema builder, with explicit handling for real zero-price offers versus deferred/unknown price.

## Positive checks / rejected false positives

- Course name, description, URL, inline provider name/URL and stable course ID are emitted (`StructuredData.tsx:263–275`). Catalog provides ListItem position and canonical detail URL (`:145–149`). These cover the current Course list required fields and provider guidance in [Google's current Course list documentation](https://developers.google.com/search/docs/appearance/structured-data/course). Minimum three courses is a catalog eligibility condition, not a reason to fabricate entries.
- Missing or zero list price does not create a free-course claim: runtime checks confirm no offers and no isAccessibleForFree on Course or CourseInstance for zero price. A deferred/unknown price therefore is not incorrectly labeled free.
- Positive offers include both price and uppercased currency, default USD (`:256–257`). Current course creation/update forcibly store USD (`../stem-Be/controllers/courseController.js:159,212`), matching the public USD-only price formatter. Legacy non-USD records could differ from visible formatting, but no current affected record was verified, so not reported as another bug.
- CourseInstance has online mode and VirtualLocation; no dates, workload, or schedule are fabricated. [Schema.org's CourseInstance examples](https://schema.org/CourseInstance) allow the basic online/offer representation. Missing schedule/workload must not be reported using old Google Course Info requirements: [Google phased out Course Info](https://developers.google.com/search/blog/2025/06/simplifying-search-results) in 2025. Course list remains separately documented.
- Catalog and detail use the same shared builder, and JSON-LD serialization escapes `<`.

Limit: no production Rich Results Test or live catalog state was exercised in this focused pass.
