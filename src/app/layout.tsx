import type { Metadata } from "next";

import { PageViewTracker } from "@/components/analytics/page-view-tracker";

import { SiteShell } from "@/components/layout/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://manishjangir-portfolio.vercel.app/"),

  alternates: {
    canonical: "/",
  },
  title: {
    default: "Manish Jangir | IIT Guwahati | ML & Backend Engineer",
    template: "%s | Manish Jangir",
  },
  description:
    "Manish Jangir is an IIT Guwahati engineer working across machine learning, backend engineering, and production systems. Explore his projects, experience, research, and engineering work.",
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
