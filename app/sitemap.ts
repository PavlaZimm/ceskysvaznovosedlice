import type { MetadataRoute } from "next";
import { navigace } from "@/lib/obsah";

const ZAKLAD = "https://csz-novosedlice.cz";

export default function sitemap(): MetadataRoute.Sitemap {
  return navigace.map((p) => ({
    url: `${ZAKLAD}${p.href === "/" ? "" : p.href}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p.href === "/" ? 1 : 0.8,
  }));
}
