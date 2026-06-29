import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return ["/dashboard", "/calendar", "/insights", "/assistant", "/medical-disclaimer", "/privacy"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date("2026-06-28"),
  }));
}
