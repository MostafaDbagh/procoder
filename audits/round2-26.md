# Round 2 / 26 — Review new blog pagination and safe body rendering

Read `AGENTS.md`. Readonly review of application changes; only this report was written.

No blocking regression found in archive pagination or HTML escaping.

## P3 — Link tokenization breaks existing bold spans

`src/lib/blogBody.ts:7–17`: splitting the source into link/non-link segments before applying bold means existing emphasis spanning a link no longer renders. Reproduced with the actual transpiled renderer:

- `**Read [Python](/en/courses/python) now**` becomes `<p>**Read <a href="/en/courses/python">Python</a> now**</p>`.
- `[**Python**](/en/courses/python)` becomes `<p><a href="/en/courses/python">**Python**</a></p>`.

The previous renderer supported the enclosing `**...**` span (while leaving the link literal). This is a small editorial formatting regression, not a security failure. Parse inline emphasis and links as compatible tokens, retaining the current escaping and URL policy. No prevalence claim about published content.

## Verification

- Focused existing `blog blocks` regression test passes (1 passed, 11 unrelated skipped).
- Executed the actual transpiled archive module with a mocked API: page/category forwarding and page-2 canonical pass; eight invalid or out-of-range query cases return notFound; API unavailability throws.
- Source trace confirms category links reset page to 1, previous/next preserve category, and backend filters categories before pagination. Backend now sorts by publishedAt and _id, and its maximum page size matches 50.
- Renderer probes confirm raw HTML and quoted href values are escaped, while javascript and protocol-relative links are rejected. No exploitable HTML injection identified in reviewed changes.
- Did not perform browser/live backend validation or a full build in this focused review.
