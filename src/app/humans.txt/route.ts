export const runtime = "edge";

export function GET() {
  const body = `/* TEAM */
Name: StemTechLab
Site: https://www.stemtechlab.com
Location: Dubai, United Arab Emirates
Language: English, Arabic

/* THANKS */
All the families, kids, and educators who trust StemTechLab.

/* SITE */
Last update: 2026
Standards: HTML5, CSS3, TypeScript
Components: Next.js 15, React, Tailwind CSS, Framer Motion
AI: OpenAI API, DeepSeek API (course recommendation engine)
Hosting: Vercel
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
