import { LeaveRequestForm } from "@/components/leave-request-form";
import { LeaveBalanceSummary } from "@/components/leave-balance-summary";
import { AnimatePage } from "@/components/animate-page";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function LeavePage() {
  const supabase = await createClient();
  const t = await getTranslations("EmployeeDashboard.leave_page");
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
    <AnimatePage className="mx-auto max-w-screen-2xl px-8 py-12 space-y-12">
      <div>
        <h1 className="text-4xl font-medium tracking-tight text-espresso">{t('title')}</h1>
        <p className="text-lg text-taupe mt-2 font-normal">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Balances & Request Form */}
        <div className="lg:col-span-1 space-y-8">
            <LeaveBalanceSummary balances={balances || []} />
            
            <Card className="border-none shadow-organic rounded-organic bg-white">
                <CardHeader className="px-8 pt-8">
                    <CardTitle className="text-xl font-medium text-espresso">{t('request_leave')}</CardTitle>
                    <CardDescription className="text-taupe font-normal">{t('new_request_desc')}</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <LeaveRequestForm />
                </CardContent>
            </Card>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-2">
            <Card className="h-full border-none shadow-organic rounded-organic bg-white">
                <CardHeader className="px-8 pt-8">
                    <CardTitle className="text-xl font-medium text-espresso">{t('history')}</CardTitle>
                    <CardDescription className="text-taupe font-normal">{t('history_desc')}</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    {requests && requests.length > 0 ? (
                        <div className="space-y-2">
                            {requests.map((req) => (
                                <div key={req.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-beige-light transition-colors duration-300">
                                    <div>
                                        <div className="font-medium text-espresso">
                                            {new Date(req.start_date).toLocaleDateString("nl-NL")} - {new Date(req.end_date).toLocaleDateString("nl-NL")}
                                        </div>
                                        <div className="text-sm text-taupe font-normal mt-1">
                                            {(req.minutes_requested / 60).toFixed(1)} {t('hours')}
                                            {req.reason && ` • ${req.reason}`}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                                            req.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                                            req.status === 'denied' ? 'bg-red-50 text-red-700' :
                                            'bg-amber-50 text-amber-700'
                                        }`}>
                                            {req.status === 'approved' ? t('approved') : req.status === 'denied' ? t('denied') : t('pending')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-taupe text-sm py-8 text-center">{t('no_requests')}</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </AnimatePage>
  );
}
