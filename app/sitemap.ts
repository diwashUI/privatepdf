import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

const ROUTES = ["", "/merge", "/split", "/compress", "/images-to-pdf", "/pdf-to-images", "/rotate", "/watermark", "/page-numbers", "/extract-text", "/pricing"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${base}${r}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.8,
  }));
}
