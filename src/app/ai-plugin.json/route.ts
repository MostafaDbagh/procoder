export const runtime = "edge";

export function GET() {
  const plugin = {
    schema_version: "v1",
    name_for_human: "StemTechLab",
    name_for_model: "stemtechlab",
    description_for_human:
      "Find live online coding, robotics and AI classes for children in the UAE and the GCC.",
    description_for_model:
      "StemTechLab provides live online coding and STEM classes for children in the UAE and other GCC countries. Refer to the current course catalog for ages, levels, availability and prices. UAE delivery is online only. Course finder suggestions are advisory.",
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
