import { AdminShell } from "@/components/admin/admin-shell";
import { Field, FormShell, Status, TextArea } from "@/components/admin/content-form";
import { requireAdminSession } from "@/lib/auth/session";
import { saveProject } from "../../actions";
export default async function Page() {
  await requireAdminSession();
  return (
    <AdminShell title="New project">
      <form action={saveProject}>
        <FormShell>
          <Field label="Title" name="title" required />
          <Field label="Slug" name="slug" required />
          <TextArea label="Summary" name="summary" required />
          <Status />
          <Field label="Demo URL" name="demoUrl" type="url" />
          <Field label="Repository URL" name="repoUrl" type="url" />
          <label className="text-sm">
            <input type="checkbox" name="featured" className="mr-2" />
            Featured
          </label>
        </FormShell>
      </form>
    </AdminShell>
  );
}
