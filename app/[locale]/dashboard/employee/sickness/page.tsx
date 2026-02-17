import { createClient } from "@/lib/supabase/server";
import { SicknessReporter } from "@/components/sickness-reporter";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { AnimatePage } from "@/components/animate-page";
import { getTranslations } from "next-intl/server";

export default async function SicknessPage() {
  const supabase = await createClient();
  const t = await getTranslations("EmployeeDashboard.sickness_page");
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch Sickness History
  const { data: logs } = await supabase
    .from("sickness_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("report_date", { ascending: false });

  // Check active sickness
  const activeSickness = logs?.find(log => !log.recovery_date);

  return (
    <AnimatePage className="mx-auto max-w-screen-2xl px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Reporter */}
        <div className="lg:col-span-1">
             <SicknessReporter userId={user.id} activeSickness={!!activeSickness} />
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-2">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>{t('history_title')}</CardTitle>
                    <CardDescription>{t('history_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    {logs && logs.length > 0 ? (
                        <div className="space-y-4">
                            {logs.map((log) => (
                                <div key={log.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                                    <div>
                                        <div className="font-medium">
                                            {format(new Date(log.report_date), "d MMMM yyyy")}
                                            {log.recovery_date && ` - ${format(new Date(log.recovery_date), "d MMMM yyyy")}`}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {t('status')}: {
                                                log.status === 'recovered' ? t('recovered') :
                                                log.status === 'reported' ? t('reported') :
                                                t('poortwachter')
                                            }
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                         {!log.recovery_date ? (
                                             <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                                                 {t('active')}
                                             </span>
                                         ) : (
                                             <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                                                 {t('recovered')}
                                             </span>
                                         )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">{t('no_sickness')}</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </AnimatePage>
  );
}
