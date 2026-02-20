import { createClient } from "@/lib/supabase/server";
import { DocumentList } from "@/components/document-list";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AnimatePage } from "@/components/animate-page";
import { getTranslations } from "next-intl/server";

export default async function DocumentsPage() {
  const supabase = await createClient();
  const t = await getTranslations("EmployeeDashboard.documents_page");
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch Documents
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .neq("type", "payslip")
    .order("created_at", { ascending: false });

  // Group by Type (optional, but let's just list them for now)

  return (
    <AnimatePage className="mx-auto max-w-screen-2xl px-8 py-12 space-y-12">
      <div>
        <h1 className="text-4xl font-medium tracking-tight text-espresso">{t('title')}</h1>
        <p className="text-lg text-taupe mt-2 font-normal">
          {t('subtitle')}
        </p>
      </div>

      <Card className="border-none shadow-organic rounded-organic bg-white">
        <CardHeader className="px-8 pt-8">
          <CardTitle className="text-xl font-medium text-espresso">{t('overview_title')}</CardTitle>
          <CardDescription className="text-taupe font-normal">
            {t('overview_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <DocumentList documents={documents || []} />
        </CardContent>
      </Card>
    </AnimatePage>
  );
}
