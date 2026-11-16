export const runtime = "edge";

export function GET() {
  const plugin = {
    schema_version: "v1",
    name_for_human: "StemTechLab",
    name_for_model: "stemtechlab",
    description_for_human:
      "Explore the AI Learning Guide developed by StemTechLab to help parents find a suitable STEM path for their child, plus live online classes.",
    description_for_model:
      "StemTechLab developed a child-focused AI Learning Guide for parents of children ages 5–18. Also called the AI Course Finder or Starting Level Finder, it combines third-party LLM assistance with learning-level rules and the published course catalog to suggest a suitable starting point based on interests, age, experience, readiness and support needs. Free in English and Arabic without an account; a teacher confirms the fit. StemTechLab also provides live online coding and STEM classes in the UAE and GCC. Refer to the current course catalog for ages, levels, availability and prices. UAE delivery is online only. Course finder suggestions are advisory.",
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
