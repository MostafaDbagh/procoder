import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/**
 * Dev-only CSP relaxations. React's development build calls eval() for
 * debugging features, Turbopack HMR opens a websocket, and the browser talks
 * to stem-Be on :5000 directly (admin previews, direct NEXT_PUBLIC_API_URL).
 * None of this is allowed in production — that policy stays strict.
 */
const isDev = process.env.NODE_ENV !== "production";
const devOrigins = "http://127.0.0.1:5000 http://localhost:5000";

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
      // /explorer became the Explorer stage of the five-level journey.
      // 301 so the old URL's ranking transfers to the new one.
      {
        source: "/explorer",
        destination: "/en/learning-path/explorer",
        permanent: true,
      },
      {
        source: "/:locale(en|ar)/explorer",
        destination: "/:locale/learning-path/explorer",
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
      // /admin is mounted outside [locale] — never locale-prefixed.
      source: "/admin",
      headers: [
        { key: "X-Robots-Tag", value: "noindex, nofollow, noai" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    },
    {
      // (wildcard for /admin/login, /admin/dashboard, ...)
      source: "/admin/:path*",
      headers: [
        { key: "X-Robots-Tag", value: "noindex, nofollow, noai" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    },
    {
      // Locale-prefixed: /en/dashboard, /ar/dashboard.
      source: "/:locale(en|ar)/dashboard",
      headers: [
        { key: "X-Robots-Tag", value: "noindex, nofollow, noai" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    },
    {
      // (wildcard for /en/dashboard/courses, /ar/dashboard/settings, ...)
      source: "/:locale(en|ar)/dashboard/:path*",
      headers: [
        { key: "X-Robots-Tag", value: "noindex, nofollow, noai" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    },
    {
      // Locale-prefixed: /en/instructor, /ar/instructor.
      source: "/:locale(en|ar)/instructor",
      headers: [
        { key: "X-Robots-Tag", value: "noindex, nofollow, noai" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    },
    {
      // (wildcard for /en/instructor/courses, /ar/instructor/students, ...)
      source: "/:locale(en|ar)/instructor/:path*",
      headers: [
        { key: "X-Robots-Tag", value: "noindex, nofollow, noai" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    },
    {
      // Parent portal login is private too.
      source: "/:locale(en|ar)/parent/:path*",
      headers: [
        { key: "X-Robots-Tag", value: "noindex, nofollow, noai" },
        { key: "X-Content-Type-Options", value: "nosniff" },
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
            `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            `img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com${isDev ? ` ${devOrigins}` : ""}`,
            `connect-src 'self' https://res.cloudinary.com https://vitals.vercel-insights.com https://va.vercel-scripts.com${isDev ? ` ${devOrigins} ws://localhost:* ws://127.0.0.1:*` : ""}`,
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
