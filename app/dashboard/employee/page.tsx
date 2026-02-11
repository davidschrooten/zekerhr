import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileCard } from "@/components/profile-card";
import { ContractCard } from "@/components/contract-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { SicknessReporter } from "@/components/sickness-reporter";

export default async function EmployeePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch active contract
  const { data: contract } = await supabase
    .from("contracts")
    .select("*")
    .eq("user_id", user.id)
    .order("start_date", { ascending: false })
    .limit(1)
    .single();

  // Check for active sickness
  const { data: activeSickness } = await supabase
    .from("sickness_logs")
    .select("id")
    .eq("user_id", user.id)
    .is("recovery_date", null)
    .single();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {profile?.full_name || user.email}</p>
      </div>

      <SicknessReporter userId={user.id} activeSickness={!!activeSickness} />

      {!profile && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Profile Setup Required</AlertTitle>
          <AlertDescription>
            Your profile information has not been completed. Please contact HR.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {profile && <ProfileCard profile={profile} />}
        {contract && <ContractCard contract={contract} />}
      </div>

      {!contract && profile && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>No Active Contract</AlertTitle>
          <AlertDescription>
            We couldn't find an active employment contract in the system.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}