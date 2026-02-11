"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface WKRStatus {
  wageBill: number;
  budget: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
}

interface WKRDashboardProps {
  status: WKRStatus;
}

export function WKRDashboard({ status }: WKRDashboardProps) {
  const percentage = Math.min(status.percentageUsed, 100);
  const isDanger = status.remaining < 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>WKR 2026 Budget (Vrije Ruimte)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Estimated Wage Bill</span>
            <p className="text-2xl font-bold">{formatCurrency(status.wageBill * 100)}</p>
          </div>
          <div className="space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Total Budget</span>
            <p className="text-2xl font-bold">{formatCurrency(status.budget * 100)}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Spent (Taxable)</span>
            <span>{formatCurrency(status.spent * 100)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span>Remaining</span>
            <span className={isDanger ? "text-destructive" : ""}>
              {formatCurrency(status.remaining * 100)}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full ${isDanger ? 'bg-destructive' : 'bg-primary'} transition-all`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
