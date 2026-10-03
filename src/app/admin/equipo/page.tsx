import { AdminNav } from "@/components/admin/AdminNav";
import { TeamAdmin } from "@/components/admin/TeamAdmin";
import { requireAdminUser } from "@/lib/auth/admin";
import { getTeamRows } from "@/lib/team/public";

export default async function TeamAdminPage() {
  const user = await requireAdminUser();
  const members = (await getTeamRows()) ?? [];
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <AdminNav email={user.email} />
      <TeamAdmin members={members} />
    </div>
  );
}
