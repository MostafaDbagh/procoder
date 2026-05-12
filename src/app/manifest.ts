import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
 return {
 name: "StemTechLab — Kids Coding, STEM & Arabic | منصة ستم تك لاب",
 short_name: "StemTechLab",
 description:
 "Live online classes for kids 6–18 in coding, robotics, algorithms & Arabic. حصص مباشرة للأطفال في البرمجة والروبوتات والعربية.",
 lang: "en",
 dir: "ltr",
 scope: "/",
 start_url: "/",
 display: "standalone",
 orientation: "portrait",
 categories: ["education", "kids"],
 background_color: "#ffffff",
 theme_color: "#6C5CE7",
 icons: [
 {
 src: "/favicon.ico",
 sizes: "any",
 type: "image/x-icon",
 },
 {
 src: "/logo.svg",
 sizes: "any",
 type: "image/svg+xml",
 purpose: "any",
 },
 {
 src: "/logo.svg",
 sizes: "512x512",
 type: "image/svg+xml",
 purpose: "maskable",
 },
 ],
 };
}
