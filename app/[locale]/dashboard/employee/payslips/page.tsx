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
    <AnimatePage className="mx-auto max-w-screen-2xl px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('subtitle')}
        </p>
      </div>

      <Alert className="flex items-start gap-4">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <div className="grid gap-1">
          <AlertTitle className="col-start-auto">{t('alert_title')}</AlertTitle>
          <AlertDescription className="col-start-auto">
            {t('alert_desc')}
          </AlertDescription>
        </div>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>{t('overview_title')}</CardTitle>
          <CardDescription>
            {t('overview_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PayslipList documents={documents || []} />
        </CardContent>
      </Card>
    </AnimatePage>
  );
}
