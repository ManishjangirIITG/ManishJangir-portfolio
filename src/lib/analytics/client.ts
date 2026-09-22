"use client";

import type { AnalyticsEventInput } from "@/lib/analytics/events";

type PrivacyNavigator = Navigator & { globalPrivacyControl?: boolean };

export function analyticsAllowed(): boolean {
  if (typeof navigator === "undefined") return false;
  const privacyNavigator = navigator as PrivacyNavigator;
  return privacyNavigator.globalPrivacyControl !== true && navigator.doNotTrack !== "1";
}

export function trackEvent(event: AnalyticsEventInput): void {
  if (!analyticsAllowed()) return;

  const body = JSON.stringify(event);
  if (typeof navigator.sendBeacon === "function") {
    const queued = navigator.sendBeacon(
      "/api/analytics/events",
      new Blob([body], { type: "application/json" }),
    );
    if (queued) return;
  }

  void fetch("/api/analytics/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    credentials: "same-origin",
  }).catch(() => undefined);
}
