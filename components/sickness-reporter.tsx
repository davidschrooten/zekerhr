"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { AlertTriangleIcon, CheckCircle2 } from "lucide-react";
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
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/10">
        <CardHeader>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
            <AlertTriangleIcon className="h-5 w-5" />
            <CardTitle>Ziek Gemeld</CardTitle>
          </div>
          <CardDescription className="text-amber-700 dark:text-amber-400">
             Je staat momenteel ziek gemeld. Geef je herstel door zodra je weer aan het werk gaat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" 
            onClick={handleReportRecovery} 
            disabled={isPending}
          >
            {isPending ? "Bezig..." : "Ik ben weer beter"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ziek Melden</CardTitle>
        <CardDescription>
          Meld je ziek als je niet in staat bent om te werken.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={handleReportSickness} 
          disabled={isPending}
        >
          {isPending ? "Bezig..." : "Ik ben ziek"}
        </Button>
      </CardContent>
    </Card>
  );
}
