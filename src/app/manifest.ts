import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GitStory — Your Code in Cinema",
    short_name: "GitStory",
    description:
      "Every commit tells a story. Transform your GitHub journey into a cinematic masterpiece.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/logo.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    categories: ["developer tools", "productivity", "social"],
    screenshots: [],
    shortcuts: [
      {
        name: "Create Story",
        short_name: "Create",
        description: "Generate your GitHub story",
        url: "/",
      },
    ],
  };
}

