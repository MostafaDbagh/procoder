# Auditor 18 — Image SEO and social sharing

Reviewed 6 November 2026. Source inspection plus the 106-page HTML inventory `../seo-live-2026-11-06.json`. No application changes or image-generation work.

## Findings

1. **P2 — Review image-specific alternative text and localization.** Blog covers reuse the article title as alt text (`src/app/[locale]/blogs/[slug]/BlogDetailClient.tsx:124`), and course cards reuse the course title (`src/components/CourseCard.tsx:154`). Those can be appropriate for linked decorative covers, but the content model cannot express what an informative screenshot or project image actually demonstrates. The hero has hardcoded English alt text even on Arabic pages (`src/components/Hero.tsx:65`). Add localized image descriptions when images convey information, keep decorative alternatives empty where appropriate, and avoid duplicating an adjacent link label unnecessarily. This is a content-model/accessibility improvement; no visual mismatch was established because image pixels were not inspected.

2. **P3 — Uploaded blog covers lack complete social image metadata.** Blog OG cover objects provide only the URL (`src/app/[locale]/blogs/[slug]/page.tsx:50`), unlike the generated fallback which supplies dimensions and alt. Add verified intrinsic width/height and useful localized alt metadata to uploaded covers. Do not blindly declare every cover 1200×630. Course uploaded images already have title alternatives but also omit dimensions (`src/app/[locale]/courses/[id]/page.tsx:97–99`). Check representative English/Arabic previews on target platforms before treating this as a rendering defect; no broken preview is demonstrated.

3. **P2 — Arabic generated-preview resilience is untested.** `src/app/og/route.tsx:11–29,59–64` downloads font CSS and font bytes at request time, with no explicit timeout/status validation, then falls back to sans-serif on failure. Test the Arabic `/og` response during font-service failure and use a bundled supported font if it cannot render reliably. The generated graphic also repeats the maximum-three-students promise (`route.tsx:32–33`), so it must be included in the broader class-size factual correction. No current OG endpoint failure is claimed.

## Positive evidence and limits

All 106 crawled pages have zero images missing the alt attribute, although the crawler does not judge text quality. Content images use HTML image elements; the lack of a dedicated image sitemap is not by itself a discovery defect. Course metadata includes page-specific images/fallbacks and Twitter cards; blogs include both OG and Twitter image fields plus BlogPosting image data. Root robots permits large previews (`src/app/layout.tsx:96`).

Google recommends discoverable HTML image sources, contextual alternatives and representative page images; optional image sitemaps can help with images otherwise difficult to discover. [Google image guidance](https://developers.google.com/search/docs/appearance/google-images). No image URL fetch inventory, visual crop review, social-platform debugger, image-search ranking sample, or payload measurement was performed. The separate performance audit covers responsive blog-image delivery.
