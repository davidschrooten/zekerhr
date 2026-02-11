import { getAllUsers, getComplianceAlerts } from "@/app/actions/admin";
import { UserList } from "@/components/admin/user-list";
import { ComplianceAlerts } from "@/components/admin/compliance-alerts";
import { InviteUserForm } from "@/components/admin/invite-user-form";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const users = await getAllUsers();
  // TODO: Fix the compliance alert fetching type mismatch if needed.
  // The 'getComplianceAlerts' function returns 'any[]' in the current implementation because type is loosely defined.
  // We can trust it for now or add proper typing.
  const alerts: any[] = await getComplianceAlerts() || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-4 text-muted-foreground">Manage system settings and user roles.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
            <InviteUserForm />
        </div>
        <ComplianceAlerts alerts={alerts} />
        <UserList users={users} />
      </div>
    </div>
  );
}
