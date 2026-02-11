import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";

export async function LeaveBalanceSummary() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: balances } = await supabase
    .from("leave_balances")
    .select("*")
    .eq("user_id", user.id)
    .gt("balance_minutes", 0)
    .order("expiration_date", { ascending: true });

  const wettelijk = balances?.filter(b => b.type === "wettelijk").reduce((acc, curr) => acc + curr.balance_minutes, 0) || 0;
  const bovenwettelijk = balances?.filter(b => b.type === "bovenwettelijk").reduce((acc, curr) => acc + curr.balance_minutes, 0) || 0;

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-medium">Leave Balances</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 p-4 rounded-md">
          <span className="text-sm font-medium text-muted-foreground block mb-1">Total Available</span>
          <span className="text-2xl font-bold">{Math.floor((wettelijk + bovenwettelijk) / 60)} hours</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Statutory (Wettelijk)</span>
            <span>{Math.floor(wettelijk / 60)}h</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Non-statutory (Bovenwettelijk)</span>
            <span>{Math.floor(bovenwettelijk / 60)}h</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-medium mb-2">Expiring Soon</h4>
        {balances?.slice(0, 3).map((balance) => (
          <div key={balance.id} className="text-xs text-muted-foreground flex justify-between py-1">
            <span>{balance.type === "wettelijk" ? "Wettelijk" : "Bovenwettelijk"} ({Math.floor(balance.balance_minutes / 60)}h)</span>
            <span>Expires: {formatDate(balance.expiration_date)}</span>
          </div>
        ))}
        {(!balances || balances.length === 0) && (
          <p className="text-xs text-muted-foreground">No expiring balances.</p>
        )}
      </div>
    </div>
  );
}
