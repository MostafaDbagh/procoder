import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  /** Common typo: crawlers and humans expect singular "llm". */
  async redirects() {
    return [
      // Canonicalize to www — prevents Google from treating non-www and www as separate URLs
      {
        source: "/:path*",
        has: [{ type: "host", value: "stemtechlab.com" }],
        destination: "https://www.stemtechlab.com/:path*",
        permanent: true,
      },
      { source: "/llm.txt", destination: "/llms.txt", permanent: true },
      { source: "/llm-full.txt", destination: "/llms-full.txt", permanent: true },
    ];
  },
  /** LLM crawlers often look under RFC 8615-style paths; mirror without duplicating files. */
  async rewrites() {
    const backendUrl = (process.env.BACKEND_URL || "http://127.0.0.1:5000").replace(/\/+$/, "");
    return [
      { source: "/.well-known/llms.txt", destination: "/llms.txt" },
      { source: "/.well-known/llms-full.txt", destination: "/llms-full.txt" },
      { source: "/.well-known/ai-plugin.json", destination: "/ai-plugin.json" },
      { source: "/.well-known/security.txt", destination: "/security.txt" },
      { source: "/.well-known/ai.txt", destination: "/ai.txt" },
      { source: "/.well-known/humans.txt", destination: "/humans.txt" },
      // Proxy uploaded assets (course/team images) to the Express backend
      { source: "/uploads/:path*", destination: `${backendUrl}/uploads/:path*` },
    ];
  },
  /**
   * Do NOT add a catch-all rewrite `/api/:path* → Express`.
   * It runs before App Router API routes, so POST /api/recommend would bypass
   * `src/app/api/recommend/route.ts` and hit Express directly (HTML errors if that route fails).
   * The recommend Route Handler proxies to stem-Be; set BACKEND_URL on deploy.
   */
  headers: async () => [
    {
      source: "/llms.txt",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "GET, HEAD, OPTIONS" },
        { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
      ],
    },
    {
      source: "/llms-full.txt",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "GET, HEAD, OPTIONS" },
        { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
      ],
    },
    {
      source: "/.well-known/llms.txt",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "GET, HEAD, OPTIONS" },
        { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
      ],
    },
    {
      source: "/.well-known/llms-full.txt",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "GET, HEAD, OPTIONS" },
        { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
      ],
    },
    {
      source: "/.well-known/ai-plugin.json",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "GET, HEAD, OPTIONS" },
        { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
      ],
    },
    {
      source: "/ai-plugin.json",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "GET, HEAD, OPTIONS" },
        { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
      ],
    },
    {
      source: "/ai.txt",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "GET, HEAD, OPTIONS" },
        { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
      ],
    },
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        {
          key: "X-DNS-Prefetch-Control",
          value: "on",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com",
            "connect-src 'self' https://res.cloudinary.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join("; "),
        },
      ],
    },
  ],
};

export default withNextIntl(nextConfig);
