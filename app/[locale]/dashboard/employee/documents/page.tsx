import { createClient } from "@/lib/supabase/server";
import { DocumentList } from "@/components/document-list";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AnimatePage } from "@/components/animate-page";

export default async function DocumentsPage() {
  const supabase = await createClient();
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
    <AnimatePage className="mx-auto max-w-screen-2xl px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Documenten</h1>
        <p className="text-muted-foreground mt-2">
          Bekijk je contracten en overige documenten.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mijn Documenten</CardTitle>
          <CardDescription>
            Overzicht van je documenten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentList documents={documents || []} />
        </CardContent>
      </Card>
    </AnimatePage>
  );
}
