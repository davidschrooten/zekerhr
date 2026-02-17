import { createClient } from "@/lib/supabase/server";
import { PayslipList } from "@/components/payslip-list";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { AnimatePage } from "@/components/animate-page";

export default async function PayslipsPage() {
  const supabase = await createClient();
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
        Er is een fout opgetreden bij het laden van je loonstroken.
      </div>
    );
  }

  return (
    <AnimatePage className="mx-auto max-w-screen-2xl px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Loonstroken</h1>
        <p className="text-muted-foreground mt-2">
          Bekijk en download je maandelijkse salarisspecificaties.
        </p>
      </div>

      <Alert className="flex items-start gap-4">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <div className="grid gap-1">
          <AlertTitle className="col-start-auto">Informatie</AlertTitle>
          <AlertDescription className="col-start-auto">
            Loonstroken worden elke maand rond de 25e toegevoegd. Jaaropgaven zijn hier ook te vinden.
          </AlertDescription>
        </div>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Overzicht Loonstroken</CardTitle>
          <CardDescription>
            Recente documenten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PayslipList documents={documents || []} />
        </CardContent>
      </Card>
    </AnimatePage>
  );
}
