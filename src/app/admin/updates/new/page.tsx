import { AdminShell } from "@/components/admin/admin-shell";
import { Field, FormShell, Status, TextArea } from "@/components/admin/content-form";
import { requireAdminSession } from "@/lib/auth/session";
import { saveUpdate } from "../../actions";
export default async function Page() {
  await requireAdminSession();
  return (
    <AdminShell title="New update">
      <form action={saveUpdate}>
        <FormShell>
          <Field label="Title" name="title" required />
          <Field label="Slug" name="slug" required />
          <TextArea label="Excerpt" name="excerpt" required />
          <TextArea label="Body" name="body" rows={14} required />
          <Status />
        </FormShell>
      </form>
    </AdminShell>
  );
}
