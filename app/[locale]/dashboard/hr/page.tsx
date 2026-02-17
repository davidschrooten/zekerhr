import { getWKRStatus } from "@/app/actions/wkr";
import { WKRDashboard } from "@/components/hr/wkr-dashboard";
import { AddExpenseForm } from "@/components/hr/add-expense-form";
import { PayrollExportCard } from "@/components/hr/payroll-export-card";
import { createClient } from "@/lib/supabase/server";

export default async function HRPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const wkrStatus = await getWKRStatus();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">HR Dashboard</h1>
        <p className="mt-4 text-muted-foreground">Compliance, Contracts, and WKR Management.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <WKRDashboard status={wkrStatus} />
        <AddExpenseForm />
        <div className="md:col-span-2">
            <PayrollExportCard />
        </div>
      </div>
    </div>
  );
}