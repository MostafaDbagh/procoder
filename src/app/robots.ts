import type { MetadataRoute } from "next";

const SITE_URL = process.env.SITE_URL || "https://procoder.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard"],
      },
      // OpenAI / ChatGPT
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      // Google AI
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      // Anthropic / Claude
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      // Microsoft / Bing / Copilot
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "MicrosoftPreview", allow: "/" },
      // Apple
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      // DeepSeek
      { userAgent: "DeepSeekBot", allow: "/" },
      // Perplexity
      { userAgent: "PerplexityBot", allow: "/" },
      // ByteDance / TikTok
      { userAgent: "Bytespider", allow: "/" },
      // Meta
      { userAgent: "FacebookBot", allow: "/" },
      { userAgent: "meta-externalagent", allow: "/" },
      // Cohere
      { userAgent: "cohere-ai", allow: "/" },
      // You.com
      { userAgent: "YouBot", allow: "/" },
      // Common Crawl (used by many LLMs for training)
      { userAgent: "CCBot", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
