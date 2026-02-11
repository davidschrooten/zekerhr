"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Database } from "@/lib/supabase/database.types";
import { InfoIcon } from "lucide-react";

type SicknessLogWithProfile = Database["public"]["Tables"]["sickness_logs"]["Row"] & {
  profiles: { full_name: string | null, email: string } | null
};

interface SicknessOverviewProps {
  logs: SicknessLogWithProfile[];
}

export function SicknessOverview({ logs }: SicknessOverviewProps) {
  if (!logs || logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Sickness Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No active sickness reports.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sickness Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
            <div>
              <p className="font-medium">{log.profiles?.full_name || log.profiles?.email}</p>
              <p className="text-sm text-muted-foreground">
                Reported: {formatDate(log.report_date)}
              </p>
              <p className="text-xs text-muted-foreground mt-1 capitalize">
                Status: {log.status.replace("_", " ")}
              </p>
            </div>
            <div className="flex items-center text-destructive">
              <InfoIcon className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Active</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
