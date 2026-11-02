# Round 2–12: Oman landing page

Source review of `src/app/[locale]/oman/page.tsx`, `src/lib/seo.ts`, shared organization schema, and course routing. No application edits. Live HTTP status and API inventory were not tested.

## Verified finding
- **Low — course-level comparison promised but absent from landing-page rows.** English metadata (line 11) promises “Compare course ages and levels”; the course introduction (line 18) tells parents to use age range and level. The actual rows (line 79) show title, age, lessons, and weeks only. Arabic similarly directs parents to consider level. Display the existing course level with localized labels, or narrow the promise. Course detail links do provide a route for further research, so this is a minor content gap rather than a broken-link defect.

## Checks passed
- English and Arabic explicitly describe online delivery and state there is no physical classroom in Oman. Muscat, Salalah, and Sohar are learner locations, not claimed business addresses.
- Both languages state a maximum of three students; no conflicting group size appears on this page.
- Metadata title, description, H1, Open Graph, Twitter, and Service schema describe the same online coding/STEM offering. Service `areaServed` is Oman; it does not invent an Oman postal address. Shared organization address is Dubai, AE, consistent with an online Oman service.
- Localized canonical and reciprocal English/Arabic alternate URLs use `/en/oman` and `/ar/oman`; `/oman` is included in the shared public sitemap path list.
- Course links are server-rendered localized links using the fetched course slug. The `[id]` course route accepts that slug through `getCourseISR(id)`, so the differently named route parameter is not a defect. There are no hardcoded retired course slugs in the Oman page.
- Catalog, free trial, parent guide, contact, and learning-path links are localized and correspond to repository routes. API failure/empty inventory leaves a catalog link and explicit availability fallback rather than fabricated course entries.
