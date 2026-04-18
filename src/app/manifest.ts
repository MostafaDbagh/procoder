import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StemTechLab — Kids Learning Platform",
    short_name: "StemTechLab",
    description:
      "Fun, interactive courses in Programming, Robotics, Algorithms, Arabic & Quran for ages 6–18",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6C5CE7",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
