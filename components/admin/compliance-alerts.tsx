"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangleIcon, AlertCircleIcon, BellIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate } from "@/lib/utils";

interface ComplianceAlert {
  id: string;
  type: string;
  user: string;
  dueDate: string;
}

interface ComplianceAlertsProps {
  alerts: ComplianceAlert[];
}

export function ComplianceAlerts({ alerts }: ComplianceAlertsProps) {
  if (!alerts || alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compliance Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No pending compliance alerts.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <Alert key={alert.id} variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>{alert.type}</AlertTitle>
            <AlertDescription>
              Employee: {alert.user}. Due: {formatDate(alert.dueDate)}.
            </AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}
