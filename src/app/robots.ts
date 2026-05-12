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

type RobotRule = {
 userAgent: string;
 allow: string[];
 disallow: string[];
};

function publicCrawlerRule(userAgent: string): RobotRule {
 return {
 userAgent,
 allow: [
 "/",
 "/llms.txt",
 "/llms-full.txt",
 "/ai.txt",
 "/ai-plugin.json",
 "/.well-known/llms.txt",
 "/.well-known/llms-full.txt",
 "/.well-known/ai-plugin.json",
 ],
 disallow: [...PRIVATE_CRAWL_PATHS],
 };
}

export default function robots(): MetadataRoute.Robots {
 return {
 rules: [
 publicCrawlerRule("*"),
 ...AI_AND_SEARCH_BOTS.map((bot) => publicCrawlerRule(bot)),
 ],
 sitemap: `${SITE_URL}/sitemap.xml`,
 host: SITE_URL,
 };
}
