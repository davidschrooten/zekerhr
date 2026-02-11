import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch profile for name/initials (optional, but nice for avatar)
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const userInitials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
    : user.email?.substring(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="font-bold text-xl mr-8">ZekerHR</div>
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav user={{ 
              email: user.email, 
              full_name: profile?.full_name || undefined, 
              initials: userInitials 
            }} />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        {children}
      </div>
    </div>
  );
}