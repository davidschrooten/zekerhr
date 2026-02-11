import { createClient } from "@/lib/supabase/server";
import { EmployeeLayout } from "@/components/layouts/employee-layout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  return (
    <EmployeeLayout 
      user={{
        email: user.email,
        full_name: profile?.full_name || undefined,
        initials: profile?.full_name 
          ? profile.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
          : user.email?.substring(0, 2).toUpperCase()
      }}
    >
      {children}
    </EmployeeLayout>
  );
}
