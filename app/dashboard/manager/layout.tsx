import { createClient } from "@/lib/supabase/server";
import { AdminSidebarLayout } from "@/components/layouts/admin-layout";
import { 
  LayoutDashboardIcon, 
  UsersIcon, 
  SettingsIcon
} from "lucide-react";

export default async function ManagerLayout({
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

  const sidebarItems = [
    {
      title: "Overview",
      href: "/dashboard/manager",
      icon: <LayoutDashboardIcon className="h-4 w-4" />,
    },
    {
      title: "Team",
      href: "/dashboard/manager/team",
      icon: <UsersIcon className="h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/manager/settings",
      icon: <SettingsIcon className="h-4 w-4" />,
    },
  ];

  return (
    <AdminSidebarLayout 
      user={{
        email: user.email,
        full_name: profile?.full_name || undefined,
        initials: profile?.full_name 
          ? profile.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
          : user.email?.substring(0, 2).toUpperCase()
      }}
      title="Manager"
      items={sidebarItems}
    >
      {children}
    </AdminSidebarLayout>
  );
}
