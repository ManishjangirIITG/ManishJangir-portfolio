import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { CurrentEmploymentField } from "@/components/admin/current-employment-field";
import { Field, FormShell, Status, TextArea } from "@/components/admin/content-form";
import { getEntity, getRevisions } from "@/lib/admin/content";
import { requireAdminSession } from "@/lib/auth/session";
import { deleteContent, saveExperience } from "../../actions";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const item = await getEntity("experience", id);

  if (!item || !("organization" in item)) notFound();

  const revs = await getRevisions("experience", id);

  return (
    <AdminShell title={`Edit ${item.role}`} description={`${revs.length} saved revisions`}>
      <form action={saveExperience}>
        <input type="hidden" name="id" value={id} />
        <FormShell>
          <Field
            label="Organization"
            name="organization"
            defaultValue={item.organization}
            required
          />
          <Field label="Role" name="role" defaultValue={item.role} required />
          <Field label="Location" name="location" defaultValue={item.location} />
          <Field label="Employment type" name="employmentType" defaultValue={item.employmentType} />
          <TextArea label="Summary" name="summary" defaultValue={item.summary} required />
          <Field
            label="Start date"
            name="startDate"
            type="date"
            defaultValue={item.startDate}
            required
          />
          <CurrentEmploymentField defaultEndDate={item.endDate} defaultIsCurrent={item.isCurrent} />

          <Status value={item.status} />
        </FormShell>
      </form>

      <form action={deleteContent} className="mt-8">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="type" value="experience" />
        <button className="text-sm text-red-300">Delete experience</button>
      </form>
    </AdminShell>
  );
}
