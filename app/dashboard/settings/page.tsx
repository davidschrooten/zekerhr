import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "employee";

  // Redirect to role-specific settings
  if (role === "super_admin") {
     redirect("/dashboard/admin/settings");
  } else if (role === "hr_admin") {
     redirect("/dashboard/hr/settings");
  } else if (role === "manager") {
     redirect("/dashboard/manager/settings");
  } else {
     redirect("/dashboard/employee/settings");
  }
}
