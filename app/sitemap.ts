import type { MetadataRoute } from "next";
import { navigace, urlWebu } from "@/lib/obsah";

export default function sitemap(): MetadataRoute.Sitemap {
  return navigace.map((p) => ({
    url: `${urlWebu}${p.href === "/" ? "" : p.href}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p.href === "/" ? 1 : 0.8,
  }));
}
