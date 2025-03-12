import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Way Go",
    short_name: "WayGo",
    description: "Courez partagez et découvrez de nouveaux endroits",
    start_url: "/",
    display: "standalone",
    background_color: "#3643BA",
    theme_color: "#3643BA",
    icons: [
      {
        src: "/Logo-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/Logo-513x513.png",
        sizes: "513x513",
        type: "image/png",
      },
    ],
  };
}
