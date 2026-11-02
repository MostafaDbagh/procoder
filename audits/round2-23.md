# Round 2–23: AI crawler and discovery-file consistency

Read-only source review, 2026-11-02. Read `AGENTS.md`. No application edits. Scope: `robots.ts`, shared private-path rules, `ai.txt`, both LLM routes/formatters, plugin manifest, and related rewrites/headers.

No new confirmed blocking defect found in this scope.

- `robots.ts` gives the wildcard and named search/AI agents the same public allowance and private-path exclusions. There is no conflicting named-agent block. This is an intentional permissive policy for both search and training bots; it does not distinguish the two purposes.
- `ai.txt` explicitly welcomes AI training and permits text/image use. That is consistent with the permissive public crawler policy. Treat this as a content-use choice, not an SEO requirement. Its claimed Spawning syntax could not be independently validated: the cited primary page was accessible to the web reader but returned no readable specification. Do not describe syntax compliance as verified.
- Short/full LLM documents and the plugin description consistently describe online-only Oman delivery, advisory course recommendations, and parent confirmation of schedule/pricing. Both LLM documents use the same live catalog fetch; a failed fetch produces catalog links rather than a stale course list.
- Root and `.well-known` LLM endpoints have explicit rewrites and CORS configuration. Although GET constructs headers separately from HEAD/OPTIONS, `next.config.ts` supplies the missing GET CORS headers; this is not a demonstrated production CORS defect.
- The current LLM routes advertise 60-second browser / 300-second shared freshness and 60-second stale-while-revalidate. The older one-day/seven-day cache observation in `round2-11.md` does not describe the currently inspected routes.

Do not prioritize additional AI files as a ranking fix. [Google's current primary guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says Google Search does not use these special AI text files and they are unnecessary for inclusion in its generative features. These files may serve optional consumers; their existence is not evidence of ranking or citation benefits. [Spawning's own generator page](https://site.spawning.ai/spawning-ai-txt) describes content permissions for AI training, a different purpose from search visibility.

Limit: this pass checked source configuration, not live deployed HTTP responses or third-party crawler compliance.
