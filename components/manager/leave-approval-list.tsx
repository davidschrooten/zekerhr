"use client";

import { useTransition } from "react";
import { approveLeaveRequest } from "@/app/actions/leave";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Database } from "@/lib/supabase/database.types";

type LeaveRequestWithProfile = Database["public"]["Tables"]["leave_requests"]["Row"] & {
  profiles: { full_name: string | null, email: string } | null
};

interface LeaveApprovalListProps {
  requests: LeaveRequestWithProfile[];
  managerId: string;
}

export function LeaveApprovalList({ requests, managerId }: LeaveApprovalListProps) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = (requestId: string) => {
    startTransition(async () => {
      try {
        await approveLeaveRequest(requestId, managerId);
      } catch (error) {
        console.error("Failed to approve leave request", error);
        alert("Failed to approve: " + (error as Error).message);
      }
    });
  };

  if (!requests || requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No pending requests.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Leave Requests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
            <div>
              <p className="font-medium">{req.profiles?.full_name || req.profiles?.email}</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(req.start_date)} - {formatDate(req.end_date)}
              </p>
              {req.reason && <p className="text-xs text-muted-foreground mt-1">Reason: {req.reason}</p>}
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => handleApprove(req.id)} 
                disabled={isPending}
              >
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                disabled={isPending}
                // Deny not implemented yet fully (needs action)
                onClick={() => alert("Deny logic not implemented yet")}
              >
                Deny
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
