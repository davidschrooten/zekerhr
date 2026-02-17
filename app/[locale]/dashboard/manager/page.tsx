import { getTeamLeaveRequests, getTeamSickness } from "@/app/actions/manager";
import { LeaveApprovalList } from "@/components/manager/leave-approval-list";
import { SicknessOverview } from "@/components/manager/sickness-overview";
import { createClient } from "@/lib/supabase/server";

export default async function ManagerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const leaveRequests = await getTeamLeaveRequests();
  const sicknessLogs = await getTeamSickness();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        <p className="mt-4 text-muted-foreground">Team management, approvals, and sickness reports.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <SicknessOverview logs={sicknessLogs} />
        <LeaveApprovalList requests={leaveRequests} managerId={user.id} />
      </div>
    </div>
  );
}
