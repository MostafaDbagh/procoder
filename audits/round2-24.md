# Round 2 / 24 — Free trial and contact

Scope: read-only source audit of `/[locale]/free-trial` and `/[locale]/contact`, EN/AR content, metadata, forms, and crawlability. Read `AGENTS.md` and installed Next.js `use-search-params` documentation. No app changes or live submissions; production HTML not fetched.

## Verified findings

1. **High — Failed requests show success and discard the form UI.** `src/app/[locale]/free-trial/FreeTrialContent.tsx:67-68` and `contact/ContactContent.tsx:69-70` call `setSent(true)` inside `catch`. `src/lib/api.ts` throws for non-2xx, malformed responses, and network failures. Thus failed organic leads see booked/sent confirmation with no retry. Only set success on acceptance; retain values and show a localized retry error on failure.

2. **Medium — GCC positioning conflicts with UAE-only phone validation.** Contact metadata explicitly targets UAE/GCC (`contact/page.tsx:15-20`), while both forms reject nonempty numbers failing `isValidUAEPhone` (`free-trial/FreeTrialContent.tsx:48`, `contact/ContactContent.tsx:58`; validator in `src/lib/validation.ts:18-30`). A valid Oman/Saudi international number blocks submission. Support target-country international numbers or accurately explain the geographic restriction. Phone is optional, but users are not told to remove their valid number to proceed.

3. **Medium — Free-trial promise and collected data diverge.** `src/messages/en.json:1726` asks for age, but the rendered form uses `homeCta.formChildLabel` (“Child's Name”, line 1795), collecting no age or course category. Success text promises WhatsApp/call within two hours (`en.json:1758`; equivalent AR) even though phone is optional. The request is a contact message with no chosen slot (`FreeTrialContent.tsx:57-64`), yet success says “You're booked!”. Align fields with age/course fit and describe confirmation as a received request, with email fallback when no phone is supplied.

4. **Medium — Visible field labels are not programmatically associated.** All visible labels in both forms are sibling labels without `htmlFor`, and their inputs lack matching IDs (`FreeTrialContent.tsx:141-211`, `ContactContent.tsx:144-231`). Errors are not connected through `aria-describedby`; success lacks a live-status announcement. Connect labels/errors and announce results to reduce assistive-technology conversion friction. This is an accessibility/conversion issue, not a claimed direct ranking factor.

## Crawlability risk requiring production verification

`ContactContent.tsx:26` calls `useSearchParams` at the top of the entire contact screen; `contact/page.tsx:69` wraps that entire screen in an empty-fallback Suspense boundary. Installed Next.js docs state that on prerendered routes this makes the subtree client-rendered. Locale layout exports `generateStaticParams`; verify built initial HTML before asserting the deployed page lacks content. If prerendered, isolate query-prefill behavior to a small form child so the H1, contact information and FAQ link remain in initial HTML. Do not infer this problem merely from `"use client"`; free trial has no corresponding search-param hook.

## Checks that passed in source

- Both routes define localized absolute titles/descriptions, canonical/hreflang via `buildAlternates`, Open Graph and Twitter metadata, and localized breadcrumb schema.
- Both routes are present in `PUBLIC_STATIC_PATHS` used for sitemap generation; robots does not disallow them.
- Each screen has one H1 and descriptive H2s. Contact renders real `mailto:`, `tel:`, WhatsApp and localized FAQ links.

Recommended order: correct false success, fix target-market validation, align trial confirmation/content, then form semantics and production HTML verification. No broad redesign needed.
