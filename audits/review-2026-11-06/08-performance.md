# Auditor 08 — Performance and Core Web Vitals

Date: 6 November 2026. Scope: source inspection only; no Lighthouse, browser trace, CrUX, or Search Console CWV measurements. These are optimization candidates, not demonstrated CWV failures or ranking causes. No application changes made.

| Priority | Evidence | Finding and action |
|---|---|---|
| P2 — investigate | `src/app/layout.tsx:10–41,136` | Five font families (Sora, Inter, Geist, Nunito, Cairo), multiple weights and both scripts are configured in the root layout and applied across routes. Inspect the production font waterfall and actual font usage per locale; remove unused families/weights and scope specialist fonts where appropriate. Actual transferred bytes were not measured. `display: swap` already mitigates invisible text for four families. |
| P2 — investigate | `src/app/[locale]/blogs/[slug]/BlogDetailClient.tsx:118–127` | Blog covers use a raw eager `<img>` without `srcset` or `sizes`, so browsers cannot choose a smaller responsive source from this markup. Generate responsive CMS image variants or use the image optimizer when compatible with approved origins. The existing `aspect-video` reserves layout space; missing HTML dimensions alone do not prove CLS here. No live image payload measurements were taken. |
| P3 — optimize if observed | `src/components/Hero.tsx:61–69` | Hero image has `priority` but its wrapper is hidden below `sm`. Inspect mobile network activity to ensure invisible art does not consume early bandwidth; use a media-aware loading strategy if it does. Local original is only about 30 KB, so this is a minor candidate, not an urgent bottleneck. |
| P2 — measurement gap | `src/app/layout.tsx:166`; repository search for `SpeedInsights`, `useReportWebVitals`, `web-vitals`, `PerformanceObserver` found no matches in `src` | Vercel Analytics is present, but source inspection found no explicit CWV collection. Obtain field LCP/INP/CLS by mobile/desktop and English/Arabic from available hosting or Search Console reports; instrument only if those sources are insufficient. External hosting instrumentation may exist and was not inspected. |

## Positive controls and next verification

Hero/course imagery uses Next Image with sizing; blog cover reserves aspect ratio. Server API calls have caching and timeouts. Root layout reads request headers (`src/app/layout.tsx:131`), and homepage awaits cached catalog data (`src/app/[locale]/page.tsx:70–73`): assess cold-cache and upstream latency in a controlled environment before changing rendering. A Vercel MISS header or an HTTP probe duration is not a CWV measurement.

Capture one production mobile trace each for home, course and blog in both locales. Record font/image bytes, LCP element, long tasks and layout shifts, then prioritize measured costs. Do not spend effort removing all animation or fonts without attribution.
