"use client";

import { useReportWebVitals } from "next/web-vitals";

interface WebVitalsCollectorProps {
  onMetric: (name: string, value: number) => void;
}

export function WebVitalsCollector({ onMetric }: WebVitalsCollectorProps) {
  useReportWebVitals((metric) => {
    onMetric(metric.name, metric.value);
  });

  return null;
}
