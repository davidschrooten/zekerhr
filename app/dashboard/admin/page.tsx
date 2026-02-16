import { getAllUsers, getAdminNotifications } from "@/app/actions/admin";
import { UserList } from "@/components/admin/user-list";
import { ComplianceAlerts, Notification } from "@/components/admin/compliance-alerts";
import { InviteUserForm } from "@/components/admin/invite-user-form";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const users = await getAllUsers();
  const notifications = await getAdminNotifications() as unknown as Notification[];

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
        <ComplianceAlerts alerts={notifications} />
        <UserList users={users} />
      </div>
    </div>
  );
}
