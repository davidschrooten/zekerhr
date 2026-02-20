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
    <AnimatePage className="mx-auto max-w-screen-2xl px-8 py-12 space-y-12">
      <div>
        <h1 className="text-4xl font-medium tracking-tight text-espresso">{t('title')}</h1>
        <p className="text-lg text-taupe mt-2 font-normal">
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
            <Card className="h-full border-none shadow-organic rounded-organic bg-white">
                <CardHeader className="px-8 pt-8">
                    <CardTitle className="text-xl font-medium text-espresso">{t('history_title')}</CardTitle>
                    <CardDescription className="text-taupe font-normal">{t('history_desc')}</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    {logs && logs.length > 0 ? (
                        <div className="space-y-2">
                            {logs.map((log) => (
                                <div key={log.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-beige-light transition-colors duration-300">
                                    <div>
                                        <div className="font-medium text-espresso">
                                            {format(new Date(log.report_date), "d MMMM yyyy", { locale: nl })}
                                            {log.recovery_date && ` - ${format(new Date(log.recovery_date), "d MMMM yyyy", { locale: nl })}`}
                                        </div>
                                        <div className="text-sm text-taupe font-normal mt-1">
                                            {t('status')}: {
                                                log.status === 'recovered' ? t('recovered') :
                                                log.status === 'reported' ? t('reported') :
                                                t('poortwachter')
                                            }
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                         {!log.recovery_date ? (
                                             <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 shadow-sm">
                                                 {t('active')}
                                             </span>
                                         ) : (
                                             <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 shadow-sm">
                                                 {t('recovered')}
                                             </span>
                                         )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-taupe text-sm py-8 text-center">{t('no_sickness')}</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </AnimatePage>
  );
}
