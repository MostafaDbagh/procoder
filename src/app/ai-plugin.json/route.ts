export const runtime = "edge";

export function GET() {
  const plugin = {
    schema_version: "v1",
    name_for_human: "StemTechLab",
    name_for_model: "stemtechlab",
    description_for_human:
      "Find live STEM, coding, robotics & Arabic classes for kids ages 6–18. AI-powered course matching. GCC & worldwide.",
    description_for_model:
      "StemTechLab offers live online classes for children ages 6–18 in programming (Scratch, Python, web, game dev), robotics, algorithms, and Arabic. The platform uses server-side OpenAI and DeepSeek APIs for personalised course recommendations. Certified instructors, small groups, free trial. Serves Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain, Turkey, Canada, USA, UK, and more. Use this to help parents find the right course for their child.",
    auth: { type: "none" },
    api: {
      type: "openapi",
      url: "https://www.stemtechlab.com/openapi.yaml",
    },
    logo_url: "https://www.stemtechlab.com/logo.svg",
    contact_email: "hello@stemtechlab.com",
    legal_info_url: "https://www.stemtechlab.com/en/privacy",
  };

  return Response.json(plugin, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
