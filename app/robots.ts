import type { MetadataRoute } from "next";
import { urlWebu } from "@/lib/obsah";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/sprava" },
    sitemap: `${urlWebu}/sitemap.xml`,
  };
}
