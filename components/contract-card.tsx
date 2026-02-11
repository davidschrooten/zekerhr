import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/lib/supabase/database.types";
import { formatCurrency, formatDate } from "@/lib/utils";

type Contract = Database["public"]["Tables"]["contracts"]["Row"];

export function ContractCard({ contract }: { contract: Contract }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2">
          <span className="text-sm font-medium text-muted-foreground">Start Date</span>
          <span className="text-sm">{formatDate(contract.start_date)}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-sm font-medium text-muted-foreground">End Date</span>
          <span className="text-sm">{contract.end_date ? formatDate(contract.end_date) : "Indefinite"}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-sm font-medium text-muted-foreground">FTE</span>
          <span className="text-sm">{(contract.fte * 100).toFixed(0)}%</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-sm font-medium text-muted-foreground">Monthly Gross Salary</span>
          <span className="text-sm">{formatCurrency(contract.salary_gross_cents)}</span>
        </div>
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-2">Annual Leave Balances</h4>
          <div className="grid grid-cols-2">
            <span className="text-sm font-medium text-muted-foreground">Statutory (Wettelijk)</span>
            <span className="text-sm">{contract.vacation_hours_statutory} hours</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="text-sm font-medium text-muted-foreground">Non-statutory (Bovenwettelijk)</span>
            <span className="text-sm">{contract.vacation_hours_non_statutory} hours</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
