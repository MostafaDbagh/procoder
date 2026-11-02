# Round 2-17 — Arabic/English business-fact consistency

Read-only application audit of `src/messages/ar.json` and `en.json`; no application edits.

## Findings

1. **Medium: learning-path delivery wording remains ambiguous, and Arabic Explorer is untranslated.** `ar.json:574` contains English `Online-first`; Arabic stages at lines 653, 732, 811, 890 say `أونلاين أولًا`. The corresponding English entries at the same lines all say `Online-first`. This implies possible other delivery modes instead of the confirmed online-only service. These rows are rendered by `src/app/[locale]/learning-path/[level]/LevelContent.tsx:287`. Use consistent `Live online only` / `مباشرة عبر الإنترنت فقط` across all five stages.
2. **Low / dormant metadata: Oman positioning is inconsistent with UAE-first SEO messages.** `en.json:1807–1810,1824` and `ar.json:1808–1811,1825` still describe a UAE-leading platform and UAE/GCC targeting; keyword strings at `en.json:1806` and `ar.json:1807` are heavily UAE-oriented. This differs from the Oman-focused hero/about copy. No direct references to `homeDescription`, `coursesDescription`, or `freeTrialDescription` were found outside message files, so do not classify these as proven live metadata defects. Align retained fallback strings with Oman and remove unsupported leading/#1 claims.
3. **Low / dormant options: unsupported formats remain in translation inventory.** `en.json:1413–1415` / `ar.json:1414–1416` retain recorded, in-person and hybrid labels. No consumers were found for these keys. The current enrollment component explicitly renders the online-only notice (`EnrollModal.tsx:684`). Remove unused options or keep them inaccessible; this is maintenance risk, not a confirmed visible contradiction.

## Confirmed consistent

- Max 3: reasons, class FAQ, teacher/group FAQ, free-trial inclusion and trust badge, and SEO description strings agree in both languages; no contrary group maximum found.
- Refund wording agrees in all four locations per locale: general FAQ, Terms section 7, support FAQ and pricing FAQ. Every version specifies the **registered user's bank account**, **maximum 15 days**, without changing this to business days or another payment method.
- Hero/about copy says online service for Oman and GCC; GCC availability is compatible with Oman targeting, so it is not flagged as a contradiction.
