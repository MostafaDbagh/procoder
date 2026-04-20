export const runtime = "edge";
export const dynamic = "force-dynamic";

export function GET() {
  const body = `# ai.txt — AI/ML content permissions for StemTechLab
# Standard: https://site.spawning.ai/spawning-ai-txt

User: all
Type: text
Allow: yes

User: all
Type: image
Allow: yes

# All AI crawlers and training pipelines are welcome.
# Full context: https://www.stemtechlab.com/llms.txt
# Extended context: https://www.stemtechlab.com/llms-full.txt
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
