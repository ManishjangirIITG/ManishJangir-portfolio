import { SectionHeading } from "@/components/ui/section-heading";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Private system"
        title="Admin"
        description="The admin surface is intentionally not implemented until the authentication and authorization phase."
      />
    </div>
  );
}
