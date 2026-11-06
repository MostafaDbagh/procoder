# Auditor 16 — UAE local relevance and parent purchase information

Reviewed 6 November 2026. Evidence: current source and `../seo-live-2026-11-06.json`, focusing on English/Arabic UAE pages, contact, trial, parent guide and FAQs. No application changes.

## Findings

1. **P1 content correction — Conflicting rescheduling notice.** Fresh `/en/courses/python` says missed sessions can be rescheduled free with **24 hours** notice; `/en/faq` and `/en/parents` promise **4 hours**. Source: `src/messages/en.json:1006` versus `:1475,1532`. This changes a parent's enrollment decision and leaves machine summaries without one dependable policy. Operations should confirm whether policies differ by product, then publish one consistent rule or clearly label the exceptions in both languages. Acceptance: course, FAQ, parents and enrollment communications agree. Class-size conflicts are separately covered by other reviewers.

2. **P2 — UAE guide repeatedly defers important purchasing facts to a conversation.** `src/app/[locale]/uae/page.tsx:17,27–31` (Arabic counterparts `:42,52–56`) asks parents to confirm schedule, teaching language, equipment and full costs. Live page confirms this. Its course table gives ages, levels and duration but no actual session availability or language. Publish verified course-specific language, timezone-labelled schedule/booking availability, and included versus additional equipment costs when operations can maintain them. Retain the truthful contact fallback for genuinely variable facts. Do not invent AED prices or fixed timetables; current USD billing can be stated plainly if confirmed.

3. **P3 — Contact hours lack timezone and context.** Live contact page shows “Sun - Fri: 9 AM - 8 PM” beside “Dubai, UAE”; `src/messages/en.json:1326–1327`, Arabic `:1327–1328`, rendered at `ContactContent.tsx:293–305`. Label these as support hours in UAE time (UTC+4) after confirming accuracy, distinguishing them from class schedules. Contact promises up to 24-hour responses while general FAQ says 2–4 business hours; these can coexist, but one clearly explained service target is easier to interpret.

## Positive controls

The UAE pages explicitly describe online delivery from Dubai, Abu Dhabi, Sharjah and elsewhere, avoiding an implied in-person campus. They distinguish website language from teaching language and the free trial from paid enrollment. Localized metadata, canonical/hreflang, crawlable course links and a Service entity with UAE areaServed are implemented (`uae/page.tsx:61–78,90–96`). Contact phone/email are visible. No need for dozens of repetitive city pages is established.

## Limits

No Google Business Profile, map-pack position, local search volume, office registration, phone response, booking availability or actual payment was verified. Dubai locality in organization schema (`StructuredData.tsx:53–56`) is an assertion requiring business confirmation, not proof of a public teaching location. Findings are content/decision-support issues, not demonstrated causes of lost rankings or AI exclusion.
