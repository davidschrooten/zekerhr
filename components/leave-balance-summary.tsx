import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Database } from "@/lib/supabase/database.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type LeaveBalance = Database['public']['Tables']['leave_balances']['Row'];

interface LeaveBalanceSummaryProps {
  balances: LeaveBalance[];
}

export function LeaveBalanceSummary({ balances }: LeaveBalanceSummaryProps) {
  const wettelijkMins = balances
    .filter(b => b.type === "wettelijk")
    .reduce((acc, curr) => acc + curr.balance_minutes, 0);
  
  const bovenwettelijkMins = balances
    .filter(b => b.type === "bovenwettelijk")
    .reduce((acc, curr) => acc + curr.balance_minutes, 0);

  const totalMins = wettelijkMins + bovenwettelijkMins;
  const totalHours = Math.floor(totalMins / 60);
  const totalDays = (totalHours / 8).toFixed(1); // Assuming 8h day

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Beschikbaar Saldo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{totalDays}</span>
          <span className="text-sm text-muted-foreground">dagen</span>
          <span className="ml-2 text-xs text-muted-foreground">({totalHours} uur)</span>
        </div>

        <div className="mt-6 space-y-4">
          {/* Wettelijk */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Wettelijk</span>
              <span className="text-muted-foreground">{Math.floor(wettelijkMins / 60)} uur</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div 
                className="h-full rounded-full bg-blue-600 dark:bg-blue-500" 
                style={{ width: `${totalMins > 0 ? (wettelijkMins / totalMins) * 100 : 0}%` }} 
              />
            </div>
            {balances.filter(b => b.type === 'wettelijk').slice(0, 1).map(b => (
               <p key={b.id} className="text-xs text-muted-foreground">
                 Vervalt: {format(new Date(b.expiration_date), "d MMM yyyy", { locale: nl })}
               </p>
            ))}
          </div>

          {/* Bovenwettelijk */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Bovenwettelijk</span>
              <span className="text-muted-foreground">{Math.floor(bovenwettelijkMins / 60)} uur</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div 
                 className="h-full rounded-full bg-emerald-600 dark:bg-emerald-500"
                 style={{ width: `${totalMins > 0 ? (bovenwettelijkMins / totalMins) * 100 : 0}%` }}
              />
            </div>
             {balances.filter(b => b.type === 'bovenwettelijk').slice(0, 1).map(b => (
               <p key={b.id} className="text-xs text-muted-foreground">
                 Vervalt: {format(new Date(b.expiration_date), "d MMM yyyy", { locale: nl })}
               </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
