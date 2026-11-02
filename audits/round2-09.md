# Round 2 / 09 — Blog archive pagination

Scope: `src/app/[locale]/blogs/page.tsx` and `BlogListClient.tsx`.

The archive previously fetched only the first 50 posts and applied category filters to that subset in client state, leaving older posts without archive navigation. It also emitted the base canonical for every query and hid the initial content behind entrance animations.

Implemented server parsing of promised search parameters, backend category filtering before pagination, crawlable category and previous/next links, and matching canonical/hreflang/Open Graph URLs for each archive page. Page 1 and category `all` normalize to the clean canonical. Invalid, repeated, unsafe, non-positive and out-of-range page inputs return `notFound`; invalid categories do likewise. Backend failures still throw instead of producing an empty successful archive. Added General as a category option. Intro copy no longer promotes Arabic education; existing article categories remain accessible. All archive motion wrappers use `initial={false}`.

Validation:
- Scoped ESLint passed.
- `npx tsc --noEmit` passed.
- Executed transpiled server module with mocked API: verified page/category forwarding, page-2 canonical and Arabic alternate, first-page canonical normalization, and nine invalid/out-of-range query cases.
- Source inspection confirms native link output through next-intl Link, previous/next relations, category reset to page 1, and preserved category on pagination.
- No live backend/browser validation performed; server behavior checked against the typed existing API contract (totalPages/items/page/limit).

Read repository AGENTS.md and installed Next 16.2.3 page/searchParams and generateMetadata documentation before implementation. Reference docs: https://nextjs.org/docs/app/api-reference/file-conventions/page and https://nextjs.org/docs/app/api-reference/functions/generate-metadata.
