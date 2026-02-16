import { LeaveRequestForm } from "@/components/leave-request-form";
import { LeaveBalanceSummary } from "@/components/leave-balance-summary";
import { AnimatePage } from "@/components/animate-page";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default async function LeavePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch Balances Details
  const { data: balances } = await supabase
    .from("leave_balances")
    .select("*")
    .eq("user_id", user.id)
    .gt("balance_minutes", 0)
    .order("expiration_date", { ascending: true });

  // Fetch Leave History
  const { data: requests } = await supabase
    .from("leave_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <AnimatePage className="mx-auto max-w-screen-2xl px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Verlof</h1>
        <p className="text-muted-foreground mt-2">
          Bekijk je saldo en vraag verlof aan.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Balances & Request Form */}
        <div className="lg:col-span-1 space-y-8">
            <LeaveBalanceSummary balances={balances || []} />
            
            <Card>
                <CardHeader>
                    <CardTitle>Verlof aanvragen</CardTitle>
                    <CardDescription>Dien een nieuwe aanvraag in.</CardDescription>
                </CardHeader>
                <CardContent>
                    <LeaveRequestForm />
                </CardContent>
            </Card>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-2">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Geschiedenis</CardTitle>
                    <CardDescription>Overzicht van je verlofaanvragen.</CardDescription>
                </CardHeader>
                <CardContent>
                    {requests && requests.length > 0 ? (
                        <div className="space-y-4">
                            {requests.map((req) => (
                                <div key={req.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                                    <div>
                                        <div className="font-medium">
                                            {new Date(req.start_date).toLocaleDateString("nl-NL")} - {new Date(req.end_date).toLocaleDateString("nl-NL")}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {(req.minutes_requested / 60).toFixed(1)} uur
                                            {req.reason && ` • ${req.reason}`}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            req.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' :
                                            req.status === 'denied' ? 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400' :
                                            'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                                        }`}>
                                            {req.status === 'approved' ? 'Goedgekeurd' : req.status === 'denied' ? 'Geweigerd' : 'In behandeling'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">Nog geen aanvragen.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </AnimatePage>
  );
}
