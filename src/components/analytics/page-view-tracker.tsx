"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/client";

export function PageViewTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    trackEvent({ name: "page_view", path: pathname });
  }, [pathname]);

  return null;
}
