# Round 2 — generated Open Graph card audit

Scope: `src/app/og/route.tsx` only.

## Findings and fixes

- Both default taglines advertised retired Arabic language classes. Replaced them with localized online coding/STEM positioning for children in Oman.
- Both default category lists advertised Arabic as a subject. Removed that category while preserving Arabic localization and font support.
- Added the confirmed maximum of three students per class to both localized taglines. The previous card did not state a conflicting class size.
- Removed the age range from the tagline rather than adding unsupported audience specifics.

## Verification

- Read repository `AGENTS.md` and the installed Next.js `ImageResponse` documentation before editing.
- `npx eslint src/app/og/route.tsx` passed.
- Reviewed both localized strings and category arrays. Image generation structure, dimensions, fonts, and cache behavior are unchanged.
- No visual rendering was performed. Per-page title/category overrides still reflect caller-supplied course metadata; callers must avoid passing retired course content.
