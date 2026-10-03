import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdminUser } from "@/lib/auth/admin";

export default async function InsightsAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminUser();

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <AdminNav email={user.email} />
      {children}
    </div>
  );
}
