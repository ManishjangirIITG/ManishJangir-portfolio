import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getPublishedProjects, getPublishedUpdates } from "@/lib/public/content";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const [projects, updates] = await Promise.all([getPublishedProjects(), getPublishedUpdates()]);
  const staticRoutes = [
    "",
    "/about",
    "/experience",
    "/projects",
    "/resume",
    "/contact",
    "/updates",
  ];
  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...updates.map((u) => ({
      url: `${base}/updates/${u.slug}`,
      lastModified: u.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
