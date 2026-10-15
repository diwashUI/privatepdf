import type { MetadataRoute } from "next";

const ROUTES = ["", "/merge", "/split", "/compress", "/images-to-pdf", "/pdf-to-images", "/rotate", "/pricing"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://privatepdf.app";
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${base}${r}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.8,
  }));
}
