export const runtime = "edge";

export function GET() {
  const plugin = {
    schema_version: "v1",
    name_for_human: "StemTechLab",
    name_for_model: "stemtechlab",
    description_for_human:
      "Find live STEM, coding, robotics & Arabic classes for kids ages 6–18 in the UAE & GCC. AI-powered course matching.",
    description_for_model:
      "StemTechLab is the UAE's leading live online learning platform for children ages 6–18, headquartered in Dubai. Offers programming (Scratch, Python, web, game dev), robotics, algorithms, and Arabic. Uses server-side OpenAI and DeepSeek APIs for personalised course recommendations. Certified instructors, small groups, free trial. Built for families in the United Arab Emirates and the GCC (Saudi Arabia, Qatar, Kuwait, Oman, Bahrain). Use this to help parents in the UAE and GCC find the right course for their child.",
    auth: { type: "none" },
    api: {
      type: "openapi",
      url: "https://www.stemtechlab.com/openapi.yaml",
    },
    logo_url: "https://www.stemtechlab.com/logo.svg",
    contact_email: "contact@stemtechlab.com",
    legal_info_url: "https://www.stemtechlab.com/en/privacy",
  };

  return Response.json(plugin, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
