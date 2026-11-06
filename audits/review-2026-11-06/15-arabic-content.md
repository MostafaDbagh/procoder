# Auditor 15 — Arabic content and semantic parity

Reviewed 6 November 2026. Scope: fresh raw HTML for Arabic UAE, Python, free-trial and three paired blog articles, plus Arabic translation and blog rendering source. No application changes.

## Findings

1. **P2 — Arabic repeats the contradictory class-size promise.** `/ar/uae` says “٣ طلاب كحد أقصى”, while the shared course FAQ says “عادةً من 3 إلى 5 طلاب” (`src/messages/ar.json:1014`). The same conflict exists in English, so correcting English alone is insufficient. Confirm the product-specific limit and update both locale sources and every shared FAQ. Acceptance: course, trial and parent guidance agree or explicitly distinguish product formats.

2. **P2 — The Arabic Scratch/Python comparison omits decision-support details retained in English.** On paired `/blogs/scratch-vs-python-which-is-right-for-your-child` pages, English includes a distinct benefit for each tool: learning logic without syntax errors, and skills that can progress into industry uses. Arabic omits both benefit statements. This is a narrower explanation of the choice, not evidence of a translation indexing defect. Restore equivalent useful reasoning in natural Arabic and review other comparison articles for omitted prerequisites, caveats and outcomes; literal word-for-word translation is unnecessary.

3. **P3 — Blog interface exposes untranslated taxonomy and a mismatched availability label.** Arabic article headers show `robotics`, `parents-guide`, `StemTechLab Team`; the regions box displays “المناطق المستهدفة: Saudi Arabia, UAE, GCC”. English labels the same box “Available in”, which makes a service-availability claim, while Arabic describes marketing targeting. Source: `src/app/[locale]/blogs/[slug]/BlogDetailClient.tsx:72,83,108–111,151–152`. Localize user-facing categories/tags, use an appropriate localized organization byline, and replace the region box with a clear verified availability sentence only when relevant. Do not treat taxonomy codes as parent-facing copy.

4. **P3 — Arabic number agreement and terminology need an editorial pass.** Current UAE/course cards show “22 دروس” and “12 أسابيع”; one-minute articles show “1 دقائق قراءة”. The latter is hardcoded at `BlogDetailClient.tsx:93`; lesson labels include `src/messages/ar.json:961`. Correct Arabic plural forms through locale-aware messages (e.g. “٢٢ درساً”, “١٢ أسبوعاً”, “دقيقة قراءة”). Catalog navigation also mixes “الذكاء الإصطناعي” and “الذكاء الصنعي”; adopt a consistent editorial term and correct spelling without changing actual course identity. These are clarity/professionalism issues, not proven ranking factors.

## Positive evidence and limits

The Arabic UAE page gives clear practical guidance in natural Arabic: UAE time, equipment, payment currency and confirming the actual class language. The sampled comparison article about robotics versus coding conveys essentially the same core decision criteria in both languages. Arabic H1s and main article text are present in initial HTML. No blanket untranslated-site problem found.

Evidence: `../seo-live-2026-11-06.json`; this is a sample-based language review, not a full sentence-by-sentence audit of all 53 Arabic URLs. No rankings, CTR change or conversion impact measured. No unverified assumption that the website language guarantees the teaching language.
