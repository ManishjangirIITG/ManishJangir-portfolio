import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers, auditLogs } from "@/db/schema";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/auth/session";
export default async function Page() {
  await requireAdminSession();
  const rows = await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      type: auditLogs.entityType,
      entityId: auditLogs.entityId,
      createdAt: auditLogs.createdAt,
      email: adminUsers.email,
    })
    .from(auditLogs)
    .leftJoin(adminUsers, eq(auditLogs.actorId, adminUsers.id))
    .orderBy(desc(auditLogs.createdAt))
    .limit(100);
  return (
    <AdminShell title="Audit log" description="Latest 100 content mutations.">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-[var(--color-muted)]">
            <tr>
              <th className="py-2">Time</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Entity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id} className="border-t border-white/10">
                <td className="py-3">{x.createdAt.toISOString()}</td>
                <td>{x.email ?? "deleted admin"}</td>
                <td>{x.action}</td>
                <td>
                  {x.type} · {x.entityId.slice(0, 8)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
