import { createClient } from "@/lib/supabase/server";
import { PayslipList } from "@/components/payslip-list";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { AnimatePage } from "@/components/animate-page";
import { getTranslations } from "next-intl/server";

export default async function PayslipsPage() {
  const supabase = await createClient();
  const t = await getTranslations("EmployeeDashboard.payslips_page");
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch Documents of type 'payslip'
  const { data: documents, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .eq("type", "payslip")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching payslips:", error);
    return (
      <div className="p-6 text-red-500">
        {t('error_loading')}
      </div>
    );
  }

  return (
    <AnimatePage className="mx-auto max-w-screen-2xl px-8 py-12 space-y-12">
      <div>
        <h1 className="text-4xl font-medium tracking-tight text-espresso">{t('title')}</h1>
        <p className="text-lg text-taupe mt-2 font-normal">
          {t('subtitle')}
        </p>
      </div>

      <Alert className="flex items-start gap-4 border-none bg-wheat/50 text-espresso rounded-2xl shadow-sm">
        <Info className="h-5 w-5 mt-0.5 shrink-0 text-cedar" />
        <div className="grid gap-1">
          <AlertTitle className="col-start-auto font-medium text-espresso">{t('alert_title')}</AlertTitle>
          <AlertDescription className="col-start-auto text-taupe">
            {t('alert_desc')}
          </AlertDescription>
        </div>
      </Alert>

      <Card className="border-none shadow-organic rounded-organic bg-white">
        <CardHeader className="px-8 pt-8">
          <CardTitle className="text-xl font-medium text-espresso">{t('overview_title')}</CardTitle>
          <CardDescription className="text-taupe font-normal">
            {t('overview_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <PayslipList documents={documents || []} />
        </CardContent>
      </Card>
    </AnimatePage>
  );
}
