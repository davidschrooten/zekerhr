import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const locale = await getLocale();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/auth/login", locale });
    return null;
  }

  return (
    <>
      {children}
    </>
  );
}