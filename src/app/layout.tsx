import type { Metadata } from "next";

import { PageViewTracker } from "@/components/analytics/page-view-tracker";

import { SiteShell } from "@/components/layout/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Manish Jangir",
    template: "%s | Manish Jangir",
  },
  description:
    "Engineering portfolio for Manish Jangir, focused on machine learning, backend engineering, and production systems.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PageViewTracker />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
