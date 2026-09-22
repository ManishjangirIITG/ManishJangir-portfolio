"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/client";

export function ProjectViewTracker({ slug }: { slug: string }) {
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackEvent({ name: "project_view", path: `/projects/${slug}`, projectSlug: slug });
  }, [slug]);
  return null;
}
