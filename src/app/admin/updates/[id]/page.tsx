import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Field, FormShell, Status, TextArea } from "@/components/admin/content-form";
import { getEntity, getRevisions } from "@/lib/admin/content";
import { requireAdminSession } from "@/lib/auth/session";
import { deleteContent, saveUpdate } from "../../actions";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const item = await getEntity("update", id);
  if (!item || !("excerpt" in item)) notFound();
  const revs = await getRevisions("update", id);
  return (
    <AdminShell title={`Edit ${item.title}`} description={`${revs.length} saved revisions`}>
      <form action={saveUpdate}>
        <input type="hidden" name="id" value={id} />
        <FormShell>
          <Field label="Title" name="title" defaultValue={item.title} required />
          <Field label="Slug" name="slug" defaultValue={item.slug} required />
          <TextArea label="Excerpt" name="excerpt" defaultValue={item.excerpt} required />
          <TextArea label="Body" name="body" rows={14} defaultValue={item.body} required />
          <Status value={item.status} />
        </FormShell>
      </form>
      <form action={deleteContent} className="mt-8">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="type" value="update" />
        <button className="text-sm text-red-300">Delete update</button>
      </form>
    </AdminShell>
  );
}
