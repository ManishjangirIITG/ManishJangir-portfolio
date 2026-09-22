import { AdminShell } from "@/components/admin/admin-shell";
import { CurrentEmploymentField } from "@/components/admin/current-employment-field";
import { Field, FormShell, Status, TextArea } from "@/components/admin/content-form";
import { requireAdminSession } from "@/lib/auth/session";
import { saveExperience } from "../../actions";

export default async function Page() {
  await requireAdminSession();

  return (
    <AdminShell title="New experience">
      <form action={saveExperience}>
        <FormShell>
          <Field label="Organization" name="organization" required />
          <Field label="Role" name="role" required />
          <Field label="Location" name="location" />
          <Field label="Employment type" name="employmentType" />
          <TextArea label="Summary" name="summary" required />
          <Field label="Start date" name="startDate" type="date" required />
          <CurrentEmploymentField />

          <Status />
        </FormShell>
      </form>
    </AdminShell>
  );
}
