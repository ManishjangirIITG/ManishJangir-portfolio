import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Field, FormShell, Status, TextArea } from "@/components/admin/content-form";
import { getEntity, getRevisions } from "@/lib/admin/content";
import { requireAdminSession } from "@/lib/auth/session";
import { deleteContent, saveProject } from "../../actions";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const item = await getEntity("project", id);
  if (!item || !("slug" in item) || !("featured" in item)) notFound();
  const revs = await getRevisions("project", id);
  return (
    <AdminShell
      title={`Edit ${item.title}`}
      description={`${revs.length} saved revision${revs.length === 1 ? "" : "s"}`}
    >
      <form action={saveProject}>
        <input type="hidden" name="id" value={id} />
        <FormShell>
          <Field label="Title" name="title" defaultValue={item.title} required />
          <Field label="Slug" name="slug" defaultValue={item.slug} required />
          <TextArea label="Summary" name="summary" defaultValue={item.summary} required />
          <Status value={item.status} />
          <Field label="Demo URL" name="demoUrl" type="url" defaultValue={item.demoUrl} />
          <Field label="Repository URL" name="repoUrl" type="url" defaultValue={item.repoUrl} />
          <label className="text-sm">
            <input
              type="checkbox"
              name="featured"
              className="mr-2"
              defaultChecked={item.featured}
            />
            Featured
          </label>
        </FormShell>
      </form>
      <form action={deleteContent} className="mt-8 border-t border-white/10 pt-6">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="type" value="project" />
        <button className="text-sm text-red-300" type="submit">
          Delete project
        </button>
      </form>
    </AdminShell>
  );
}
