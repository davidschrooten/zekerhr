"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, AlertTriangleIcon } from "lucide-react";
import { reportSickness, reportRecovery } from "@/app/actions/sickness";

interface SicknessReporterProps {
  userId: string;
  activeSickness: boolean;
}

export function SicknessReporter({ userId, activeSickness }: SicknessReporterProps) {
  const [isPending, startTransition] = useTransition();

  const handleReportSickness = () => {
    startTransition(async () => {
      try {
        await reportSickness(userId);
      } catch (error) {
        console.error("Failed to report sickness", error);
      }
    });
  };

  const handleReportRecovery = () => {
    startTransition(async () => {
      try {
        await reportRecovery(userId);
      } catch (error) {
        console.error("Failed to report recovery", error);
      }
    });
  };

  if (activeSickness) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Active Sickness Report</AlertTitle>
          <AlertDescription>
            You are currently reported as sick. Please report your recovery when you return.
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          onClick={handleReportRecovery} 
          disabled={isPending}
        >
          {isPending ? "Updating..." : "I am Recovered"}
        </Button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-medium">Report Absence</h3>
      <p className="text-sm text-muted-foreground">
        If you are unable to work due to illness, please report it immediately.
      </p>
      <Button 
        variant="destructive" 
        onClick={handleReportSickness} 
        disabled={isPending}
      >
        {isPending ? "Reporting..." : "I am Sick"}
      </Button>
    </div>
  );
}
