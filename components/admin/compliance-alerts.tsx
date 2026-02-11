"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangleIcon, AlertCircleIcon, BellIcon, CheckCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { markNotificationAsRead } from "@/app/actions/admin"; // We will implement this next
import { useRouter } from "next/navigation";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical';
  is_read: boolean;
  created_at: string;
  action_url?: string;
}

interface ComplianceAlertsProps {
  alerts: Notification[];
}

export function ComplianceAlerts({ alerts }: ComplianceAlertsProps) {
  const router = useRouter();

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    router.refresh();
  };

  if (!alerts || alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No new notifications.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <Alert key={alert.id} variant={alert.type === 'critical' ? 'destructive' : 'default'} className="flex flex-col gap-2 relative pr-10">
            <div className="flex items-start gap-2">
              {alert.type === 'critical' ? (
                <AlertCircleIcon className="h-4 w-4 mt-1" />
              ) : alert.type === 'warning' ? (
                <AlertTriangleIcon className="h-4 w-4 mt-1" />
              ) : (
                <BellIcon className="h-4 w-4 mt-1" />
              )}
              <div className="flex-1">
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>
                  {alert.message}
                  <div className="mt-1 text-xs opacity-70">
                    {formatDate(alert.created_at)}
                  </div>
                </AlertDescription>
              </div>
            </div>
            
            <div className="absolute top-2 right-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 hover:bg-transparent"
                onClick={() => handleMarkAsRead(alert.id)}
                title="Mark as read"
              >
                <CheckCircleIcon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </Button>
            </div>

            {alert.action_url && (
               <Button 
                 variant="link" 
                 className="p-0 h-auto self-start text-xs" 
                 onClick={() => router.push(alert.action_url!)}
               >
                 View Details →
               </Button>
            )}
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}
