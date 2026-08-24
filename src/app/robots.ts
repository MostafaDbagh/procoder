import type { MetadataRoute } from "next";
import { PRIVATE_CRAWL_PATHS } from "@/lib/seo";

const SITE_URL = process.env.SITE_URL || "https://www.stemtechlab.com";

const AI_AND_SEARCH_BOTS = [
 "GPTBot",
 "ChatGPT-User",
 "OAI-SearchBot",
 "Google-Extended",
 "Googlebot",
 "Googlebot-Image",
 "GoogleOther",
 "Google-CloudVertexBot",
 "Bingbot",
 "MicrosoftPreview",
 "Applebot",
 "Applebot-Extended",
 "anthropic-ai",
 "ClaudeBot",
 "Claude-Web",
 "DeepSeekBot",
 "PerplexityBot",
 "Bytespider",
 "FacebookBot",
 "meta-externalagent",
 "cohere-ai",
 "YouBot",
 "CCBot",
 "Grok",
 "MistralBot",
 "Diffbot",
 "DuckDuckBot",
 "BraveBot",
 "Screaming Frog SEO Spider",
] as const;

const PUBLIC_CRAWL_ALLOW = [
 "/",
 "/llms.txt",
 "/llms-full.txt",
 "/ai.txt",
 "/ai-plugin.json",
 "/.well-known/llms.txt",
 "/.well-known/llms-full.txt",
 "/.well-known/ai-plugin.json",
];

export default function robots(): MetadataRoute.Robots {
 // One rule block listing every user-agent, instead of repeating a byte-identical
 // 30-line block per bot. The old form emitted ~22.7KB of which only 63 lines
 // were unique. Crawlers apply the most specific matching group, and since every
 // group carried the same rules the expansion bought nothing.
 return {
 rules: [
 {
 userAgent: ["*", ...AI_AND_SEARCH_BOTS],
 allow: PUBLIC_CRAWL_ALLOW,
 disallow: [...PRIVATE_CRAWL_PATHS],
 },
 ],
 sitemap: `${SITE_URL}/sitemap.xml`,
 host: SITE_URL,
 };
}
