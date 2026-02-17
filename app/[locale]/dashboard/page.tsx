import { createClient } from "@/lib/supabase/server";
import { Link, redirect } from "@/i18n/routing";
import { User, Briefcase, ChevronRight, Users, ShieldCheck } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function RoleSelectionPage() {
  const supabase = await createClient();
  const t = await getTranslations("RoleSelection");
  const locale = await getLocale();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/auth/login", locale });
    return null; // Ensure TS knows execution stops or user is not null later
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Edge case: User exists but profile doesn't? Redirect to error or handle.
    redirect({ href: "/auth/login", locale });
    return null;
  }

  // If role is strictly 'employee', redirect directly to their dashboard.
  if (profile.role === 'employee') {
    redirect({ href: "/dashboard/employee", locale });
  }

  // Determine the specialized dashboard link and title based on role
  let specializedLink = "/dashboard/manager";
  let specializedTitle = t("management_dashboard");
  let specializedDescription = t("management_description");
  let specializedIcon = Briefcase;

  if (profile.role === 'hr_admin') {
    specializedLink = "/dashboard/hr";
    specializedTitle = t("hr_dashboard");
    specializedDescription = t("hr_description");
    specializedIcon = Users;
  } else if (profile.role === 'super_admin') {
    specializedLink = "/dashboard/admin";
    specializedTitle = t("admin_dashboard");
    specializedDescription = t("admin_description");
    specializedIcon = ShieldCheck;
  }
// ...

  const SpecializedIconComponent = specializedIcon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-foreground mb-3 tracking-tight">
            {t('welcome')}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t('select_continue')}
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Employee Portal Card */}
          <Link 
            href="/dashboard/employee"
            className="group block"
          >
            <div className="relative h-full bg-card border border-border rounded-lg p-8 transition-all duration-200 hover:border-foreground cursor-pointer">
              <div className="flex flex-col h-full">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center transition-colors duration-200 group-hover:bg-foreground">
                    <User className="w-7 h-7 text-foreground transition-colors duration-200 group-hover:text-background" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-foreground mb-3 tracking-tight">
                    {t('employee_portal')}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('employee_description')}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="mt-6 flex items-center text-sm font-medium text-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <span>{t('continue')}</span>
                  <ChevronRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>

          {/* Specialized Dashboard Card */}
          <Link 
            href={specializedLink}
            className="group block"
          >
            <div className="relative h-full bg-card border border-border rounded-lg p-8 transition-all duration-200 hover:border-foreground cursor-pointer">
              <div className="flex flex-col h-full">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center transition-colors duration-200 group-hover:bg-foreground">
                    <SpecializedIconComponent className="w-7 h-7 text-foreground transition-colors duration-200 group-hover:text-background" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-foreground mb-3 tracking-tight">
                    {specializedTitle}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {specializedDescription}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="mt-6 flex items-center text-sm font-medium text-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <span>{t('continue')}</span>
                  <ChevronRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            {t('need_help')} <span className="text-foreground font-medium">support@zekerhr.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
