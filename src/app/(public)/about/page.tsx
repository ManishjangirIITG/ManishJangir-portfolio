import { SectionHeading } from "@/components/ui/section-heading";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Foundation"
        title="About"
        description="This route is intentionally minimal in Phase 1. Content will be backed by the portfolio domain and CMS in later phases."
      />
    </div>
  );
}
