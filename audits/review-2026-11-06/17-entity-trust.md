# Auditor 17 — Brand, entity and trust evidence

6 November 2026. Reviewed current source and fresh HTML for About, Contact, Terms and Privacy in `../seo-live-2026-11-06.json`. No application changes or business-record verification.

## Findings

1. **P2 — Certification and vetting promises lack checkable detail in the inspected public evidence.** Homepage wording says every instructor is certified (`src/messages/en.json:115–116`); FAQ says certified educators, background checks and ongoing training (`:1495`). About does have eight named instructors, experience figures and bios; do not report that teachers are absent. However, the sampled HTML does not identify certification issuers, qualifications or what the vetting claim means. Have operations verify the exact claim, then provide truthful qualification/review details with instructor consent. This is an evidence gap, not an assertion that credentials are false.

2. **P2 — Most instructor biographies are hidden from initial HTML beyond 120 characters.** `src/components/MeetOurStars.tsx:152–156,258–261` conditionally substitutes a truncated bio until the user expands it. Today's About HTML confirms abbreviated bios ending in “read more.” Render the full biography in initial HTML inside an accessible disclosure, or provide a stable detailed profile link. Preserve privacy and avoid inventing CV details. Acceptance: approved qualification and experience text is available without clicking, in each supported language.

3. **P2 — Legal/entity assertions need a visible, verified reference.** Global schema declares legalName StemTechLab, founding year 2024, Dubai address and three social identities (`src/components/StructuredData.tsx:31–61`). Contact has a working-looking UAE phone/email and Dubai location in HTML, but the inspected About/Terms text does not establish the operator's registered identity or substantiate the founding year. Confirm against the business's records; publish the appropriate operator identity and official profile links consistently. This is a trust/identity recommendation, not legal advice or a compliance finding. Replace the Facebook share URL with a stable official profile URL after verifying ownership.

4. **P3 — Instructor experience copy is internally ambiguous.** The live About page presents Dalal Faraosi with “12 years of experience” while her excerpt says “7+ years.” These statements are mathematically compatible but can look stale or differently scoped. Confirm the distinction (for example total teaching versus a specific specialty), use consistent verified data, and review bios periodically without artificially refreshing dates.

## Positive evidence and limits

Contact information, legal-policy links, named staff and a clear live STEM teaching mission are publicly extractable. Arabic teachers are present in About; the missing Arabic-language course offer found by another reviewer must not be described as proof the business has no Arabic teachers. The privacy page distinguishes human teaching from advisory AI matching. No fabricated testimonial, fake credential, domain penalty, ownership-history conclusion, or external reputation score is established. Social profile ownership, registration, instructor credentials and third-party reviews were not independently verified. These improvements do not guarantee search rankings or AI recommendations.
